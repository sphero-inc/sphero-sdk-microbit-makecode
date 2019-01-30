// Add your code here

namespace parser {
    interface Parser {
        readonly fwApiVersion: number;

        // queueByte(byte: number): void;
        queueBytes(bytes: Array<number>): void;
    }

    enum ApiParserState {
        WaitingForStartOfPacket = 0,
        WaitingForEndOfPacket = 1
    }


    export class ApiParser implements Parser {
        private _apiCommandProcessors: Array<command_processor.ApiCommandProcessor>;
        private _state: ApiParserState;
        private _isEscaped: boolean;
        private _hasSkippedData: boolean;
        private _runningChecksum: number;
        private _activeDataBuffer: Array<number>;

        public get fwApiVersion(): number {
            return 2.1;
        }

        private get minimumPacketLength(): number {
            return 7;
        }
        private get startOfPacket(): number {
            return 0x8D;
        }
        private get endOfPacket(): number {
            return 0xD8;
        }
        private get escape(): number {
            return 0xAB;
        }
        private get slipEscapeMask(): number {
            return 0x88;
        }

        private get escapedEscape(): number {
            return this.slipEncode(this.escape);            // 0x23
        }
        private get escapedStartOfPacket(): number {
            return this.slipEncode(this.startOfPacket);     // 0x05
        }
        private get escapedEndOfPacket(): number {
            return this.slipEncode(this.endOfPacket);       // 0x50
        }

        constructor() {
            this._state = ApiParserState.WaitingForStartOfPacket;
        }

        public registerApiCommandProcessor(apiCommandProcessor: command_processor.ApiCommandProcessor): void {
            this._apiCommandProcessors.push(apiCommandProcessor);
        }

        private findApiCommandProcessorByIds(did: number, cid: number): command_processor.ApiCommandProcessor {
            if (did == undefined || did == null) {
                return null;
            }

            if (cid == undefined || cid == null) {
                return null;
            }

            if (this._apiCommandProcessors.length == 0) {
                return null;
            }

            for (let i: number = 0; i < this._apiCommandProcessors.length; i++) {
                let apiCommandProcessor = this._apiCommandProcessors[i];

                if (apiCommandProcessor.did === did) {
                    if (apiCommandProcessor.cid === cid) {
                        return apiCommandProcessor;
                    }
                }
            }

            return null;
        }


        public queueBytes(bytes: Array<number>): void {
            if (!bytes || bytes.length == 0) {
                return;
            }

            for (let i: number = 0; i < bytes.length; i++) {
                let byte: number = bytes[i];
                this.processByte(byte);
            }
        }

        private processByte(byte: number): message.IApiMessage | void {
            if (this._activeDataBuffer.length == 0 && byte != this.startOfPacket) {
                this._hasSkippedData = true;
                return;
            }

            switch (byte) {
                case this.startOfPacket:
                    if (this._state != ApiParserState.WaitingForStartOfPacket) {
                        this.reset();
                        return;
                    }

                    if (this._hasSkippedData) {
                        this._hasSkippedData = false;
                    }

                    this._state = ApiParserState.WaitingForEndOfPacket;
                    this._runningChecksum = 0;
                    this._activeDataBuffer.push(byte);

                    return;
                case this.endOfPacket:
                    this._activeDataBuffer.push(byte);

                    if (this._state != ApiParserState.WaitingForEndOfPacket || this._activeDataBuffer.length < this.minimumPacketLength) {
                        this.reset();
                        return;
                    }

                    if (this._runningChecksum != 0xFF) {
                        this.reset();
                        return;
                    }

                    let requestsResponseSet: boolean = (this._activeDataBuffer[1] & (flags.ApiFlags.requestsResponse)) == (flags.ApiFlags.requestsResponse);
                    let isResponseSet: boolean = (this._activeDataBuffer[1] & (flags.ApiFlags.isResponse)) == (flags.ApiFlags.isResponse);
                    if (requestsResponseSet && isResponseSet) {
                        this.reset();
                        return;
                    }

                    this.processApiMessageFromRawBytes(this._activeDataBuffer);
                    this.reset();

                    return;
                case this.escape:
                    if (this._isEscaped) {
                        this.reset();
                        return;
                    }

                    this._isEscaped = true;

                    return;
                case this.escapedEscape:
                case this.escapedStartOfPacket:
                case this.escapedEndOfPacket:
                    if (this._isEscaped) {
                        byte = this.slipDecode(byte);
                        this._isEscaped = false;
                    }

                    break;
            }

            if (this._isEscaped) {
                this.reset();
                return;
            }

            this._activeDataBuffer.push(byte);
            this._runningChecksum += byte;
        }

        private processApiMessageFromRawBytes(bytes: Array<number>): void {
            if (bytes.length < 6) {
                return;
            }

            let index: number = 1;  // start at 1 to skip SoP

            let message_flags: number = bytes[index++];

            let targetId: number = 0xFF;
            if ((message_flags & flags.ApiFlags.packetHasTargetId) > 0x00) {
                targetId = bytes[index++];
            }

            let sourceId: number = 0xFF;
            if ((message_flags & flags.ApiFlags.packetHasSourceId) > 0x00) {
                sourceId = bytes[index++];
            }

            let endingBytesToIgnore: number = 2;    // Checksum and EoP

            // +3 to account for DID, CID and SequenceNumber
            if ((index + 3) > bytes.length - endingBytesToIgnore) {

            }

            let did: number = bytes[index++];
            let cid: number = bytes[index++];

            let sequenceNumber: number = bytes[index++];

            if ((message_flags & flags.ApiFlags.isResponse) > 0x00) {
                let errorCode: number = bytes[index++];     // TODO: what to do with error code?
            }

            let dataRawBytes: Array<number> = [];
            for (let i: number = index; i < bytes.length - endingBytesToIgnore; i++) {
                let rawByte: number = bytes[i];
                dataRawBytes.push(rawByte);
            }

            let apiMessage: message.ApiBaseMessage = new message.ApiBaseMessage(
                message_flags, sequenceNumber, targetId, sourceId, did, "", cid, "", dataRawBytes
            );

            let apiCommandProcessor = this.findApiCommandProcessorByIds(apiMessage.deviceId, apiMessage.commandId);

            apiCommandProcessor.generateResponseDataRawBytesFromRequestDataRawBytes(dataRawBytes);
        }

        private reset(): void {
            this._state = ApiParserState.WaitingForStartOfPacket;
            this._isEscaped = false;
            this._activeDataBuffer.length = 0;
        }

        private slipEncode(byte: number): number {
            return ((byte) & ~this.slipEscapeMask);
        }

        private slipDecode(byte: number): number {
            return ((byte) | this.slipEscapeMask);
        }
    }
}