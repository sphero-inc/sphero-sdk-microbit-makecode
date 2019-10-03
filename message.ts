namespace sphero {
    export interface IApiMessage {
        readonly flags: number;
        readonly sequenceNumber: number;

        readonly targetId: number;
        readonly sourceId: number;

        readonly deviceId: number;
        readonly commandId: number;

        readonly dataRawBytes: Array<number> | null;
        readonly messageRawBytes: Array<number>;

        generateMessageRawBytes(): void;
    }

    export class ApiMessage implements IApiMessage {
        protected _flags: number;
        public get flags(): number {
            return this._flags;
        }

        protected _sequenceNumber: number;
        public get sequenceNumber(): number {
            return this._sequenceNumber;
        }

        protected _targetId: number;
        public get targetId(): number {
            return this._targetId;
        }

        protected _sourceId: number;
        public get sourceId(): number {
            return this._sourceId;
        }

        protected _deviceId: number;
        public get deviceId(): number {
            return this._deviceId;
        }

        protected _commandId: number;
        public get commandId(): number {
            return this._commandId;
        }

        protected _dataRawBytes: Array<number>;
        public get dataRawBytes(): Array<number> {
            return this._dataRawBytes;
        }

        private _messageRawBytes: Array<number>;
        public get messageRawBytes(): Array<number> {
            return this._messageRawBytes;
        }

        public constructor(
            flags: number, sequenceNumber: number,
            targetId: number, sourceId: number,
            deviceId: number, commandId: number,
            dataRawBytes: Array<number> | null = null) {

            this._flags = flags;
            this._sequenceNumber = sequenceNumber;

            this._targetId = targetId;
            this._sourceId = sourceId;

            this._deviceId = deviceId;
            this._commandId = commandId;

            this._dataRawBytes = !dataRawBytes ? [] : dataRawBytes;
        }

        public generateMessageRawBytes(): void {
            this.generateMessageRawBytesInternal();
        }

        protected generateMessageRawBytesInternal(): void {
            let checksum = 0;
            this._messageRawBytes = [];

            this._messageRawBytes.push(ApiParserFlags.startOfPacket);

            this.encodeByteInBytes(this._messageRawBytes, this.flags);
            checksum += this.flags;


            if ((this.flags & ApiFlags.packetHasTargetId) > 0x00) {
                this.encodeByteInBytes(this._messageRawBytes, this.targetId);
                checksum += this.targetId;
            }

            if ((this.flags & ApiFlags.packetHasSourceId) > 0x00) {
                this.encodeByteInBytes(this._messageRawBytes, this.sourceId);
                checksum += this.sourceId;
            }

            this.encodeByteInBytes(this._messageRawBytes, this.deviceId);
            checksum += this.deviceId;

            this.encodeByteInBytes(this._messageRawBytes, this.commandId);
            checksum += this.commandId;

            this.encodeByteInBytes(this._messageRawBytes, this.sequenceNumber);
            checksum += this.sequenceNumber;

            for (let i: number = 0; i < this.dataRawBytes.length; i++) {
                let dataByte = this.dataRawBytes[i];
                this.encodeByteInBytes(this._messageRawBytes, dataByte);
                checksum += dataByte;
            }

            checksum = ~(checksum % 256);
            if (checksum < 0) {
                checksum = 256 + checksum;
            }

            this.encodeByteInBytes(this._messageRawBytes, checksum);

            this._messageRawBytes.push(ApiParserFlags.endOfPacket);
        }

        private encodeByteInBytes(bytes: Array<number>, byte: number): void {
            switch (byte) {
                case ApiParserFlags.startOfPacket:
                    bytes.push(ApiParserFlags.escape);
                    bytes.push(ApiParserFlags.escapedStartOfPacket);
                    break;
                case ApiParserFlags.endOfPacket:
                    bytes.push(ApiParserFlags.escape);
                    bytes.push(ApiParserFlags.escapedEndOfPacket);
                    break;
                case ApiParserFlags.escape:
                    bytes.push(ApiParserFlags.escape);
                    bytes.push(ApiParserFlags.escapedEscape);
                    break;
                default:
                    bytes.push(byte);
                    break;
            }
        }
    }

    let _sequenceNumber: number = 0;
    function getNextSequenceNumber(): number {
        return _sequenceNumber++ % 256;
    }

    function buildApiCommandMessage(
        flags: number,
        targetId: number, sourceId: number,
        deviceId: number, commandId: number,
        dataRawBytes: Array<number> | null = null): IApiMessage {

        let sequenceNumber: number = getNextSequenceNumber();

        let apiMessage: IApiMessage = new ApiMessage(
            flags, sequenceNumber,
            targetId, sourceId,
            deviceId, commandId,
            dataRawBytes
        );

        apiMessage.generateMessageRawBytes();

        return apiMessage;
    }

    export function buildApiCommandMessageWithDefaultFlags(
        targetId: number, sourceId: number,
        deviceId: number, commandId: number,
        dataRawBytes: Array<number> | null = null): IApiMessage {

        let messageFlags: number = ApiFlags.defaultRequestWithResponseFlags;

        let apiMessage: IApiMessage = buildApiCommandMessage(
            messageFlags,
            targetId, sourceId,
            deviceId, commandId,
            dataRawBytes
        );

        return apiMessage;
    }
}
