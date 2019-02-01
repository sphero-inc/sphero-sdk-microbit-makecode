// Add your code here

namespace spheroMessage{
    interface IApiCommandMessage extends IApiMessage {
        readonly commandRawBytes: Array<number>;
    }

    class ApiCommandMessage extends ApiBaseMessage implements IApiCommandMessage {
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
                case SpheroApiParserFlags.startOfPacket:
                    bytes.push(SpheroApiParserFlags.escape);
                    bytes.push(SpheroApiParserFlags.escapedStartOfPacket);
                    break;
                case SpheroApiParserFlags.endOfPacket:
                    bytes.push(SpheroApiParserFlags.escape);
                    bytes.push(SpheroApiParserFlags.escapedEndOfPacket);
                    break;
                case SpheroApiParserFlags.escape:
                    bytes.push(SpheroApiParserFlags.escape);
                    bytes.push(SpheroApiParserFlags.escapedEscape);
                    break;
                default:
                    bytes.push(byte);
                    break;
            }
        }


        protected generateMessageRawBytesInternal(): void {
            let checksum = 0;
            this._commandRawBytes = []

            this._commandRawBytes.push(SpheroApiParserFlags.startOfPacket);

            this.encodeByteInBytes(this._commandRawBytes, this.flags);
            checksum += this.flags;


            if ((this.flags & SpheroApiFlags.packetHasTargetId) > 0x00) {
                this.encodeByteInBytes(this._commandRawBytes, this.targetId);
                checksum += this.targetId;
            }

            if ((this.flags & SpheroApiFlags.packetHasSourceId) > 0x00) {
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

            this._commandRawBytes.push(SpheroApiParserFlags.endOfPacket);
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

        let message_flags: number = SpheroApiFlags.defaultRequestWithResponseFlags;
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
