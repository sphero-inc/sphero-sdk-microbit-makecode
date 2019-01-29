// Add your code here

namespace command {
    interface IApiCommandMessage extends message.IApiMessage {
        readonly commandRawBytes: Array<number>;
    }

    class ApiCommandMessage extends message.ApiBaseMessage implements IApiCommandMessage {
        public get messageRawBytes(): Array<number> {
            return this._commandRawBytes;
        }

        private _commandRawBytes: Array<number>;
        public get commandRawBytes(): Array<number> | null {
            return this._commandRawBytes;
        }

        constructor(flags: number, sequenceNumber: number,
            targetId: number, sourceId: number,
            deviceId: number, deviceName: string,
            commandId: number, commandName: string,
            dataRawBytes: Array<number> | null = null) {

            super(
                flags, sequenceNumber,
                targetId, sourceId,
                deviceId, deviceName,
                commandId, commandName,
                dataRawBytes
            );
        }

        private encodeByteInBytes(bytes: Array<number>, byte: number): void {
            switch (byte) {
                case flags.ApiParserFlags.startOfPacket:
                    bytes.push(flags.ApiParserFlags.escape);
                    bytes.push(flags.ApiParserFlags.escapedStartOfPacket);
                    break;
                case flags.ApiParserFlags.endOfPacket:
                    bytes.push(flags.ApiParserFlags.escape);
                    bytes.push(flags.ApiParserFlags.escapedEndOfPacket);
                    break;
                case flags.ApiParserFlags.escape:
                    bytes.push(flags.ApiParserFlags.escape);
                    bytes.push(flags.ApiParserFlags.escapedEscape);
                    break;
                default:
                    bytes.push(byte);
                    break;
            }
        }


        protected generateMessageRawBytesInternal(): void {
            let checksum = 0;
            this._commandRawBytes = []

            this._commandRawBytes.push(flags.ApiParserFlags.startOfPacket);

            this.encodeByteInBytes(this._commandRawBytes, this.flags);
            checksum += this.flags;


            if ((this.flags & flags.ApiFlags.packetHasTargetId) > 0x00) {
                this.encodeByteInBytes(this._commandRawBytes, this.targetId);
                checksum += this.targetId;
            }

            if ((this.flags & flags.ApiFlags.packetHasSourceId) > 0x00) {
                this.encodeByteInBytes(this._commandRawBytes, this.sourceId);
                checksum += this.sourceId;
            }

            this.encodeByteInBytes(this._commandRawBytes, this.deviceId);
            checksum += this.deviceId;

            this.encodeByteInBytes(this._commandRawBytes, this.commandId);
            checksum += this.commandId;

            this.encodeByteInBytes(this._commandRawBytes, this.sequenceNumber);
            checksum += this.sequenceNumber;

            for (let i: number = 0; i < this.dataRawBytes.length; i++) {
                let dataByte = this.dataRawBytes[i];
                this.encodeByteInBytes(this._commandRawBytes, dataByte);
                checksum += dataByte;
            }

            checksum = ~(checksum % 256);
            if (checksum < 0) {
                checksum = 256 + checksum;
            }

            this.encodeByteInBytes(this._commandRawBytes, checksum);

            this._commandRawBytes.push(flags.ApiParserFlags.endOfPacket);
        }
    }

    function buildApiCommandMessage(flags: number, sequenceNumber: number | null,
        targetId: number, sourceId: number,
        deviceId: number, deviceName: string,
        commandId: number, commandName: string,
        dataRawBytes: Array<number> | null = null): IApiCommandMessage {

        if (sequenceNumber == null) {
            sequenceNumber = 0x00;  // TODO: own sequence number here?
        }

        let apiMessage: IApiCommandMessage = new ApiCommandMessage(
            flags, sequenceNumber,
            targetId, sourceId,
            deviceId, deviceName,
            commandId, commandName,
            dataRawBytes
        );

        apiMessage.generateMessageRawBytes();

        return apiMessage;
    }

    export function buildApiCommandMessageWithDefaultFlags(targetId: number, sourceId: number,
        deviceId: number, deviceName: string,
        commandId: number, commandName: string,
        dataRawBytes: Array<number> | null = null): IApiCommandMessage {

        let message_flags: number = flags.ApiFlags.defaultRequestWithResponseFlags;
        let sequenceNumber: number = 0x00;  // TODO: own sequence number here?

        let apiMessage: IApiCommandMessage = new ApiCommandMessage(
            message_flags, sequenceNumber,
            targetId, sourceId,
            deviceId, deviceName,
            commandId, commandName,
            dataRawBytes
        );

        apiMessage.generateMessageRawBytes();

        return apiMessage;
    }
}