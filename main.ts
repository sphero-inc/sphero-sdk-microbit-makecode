enum MotorMode {
    //% block="off"
    off = 0,
    //% block="forward"
    forward = 1,
    //% block="backward"
    backward = 2
}

enum rgbLEDs {
    //% block="Left Status"
    left_status = 0,
    //% block="Right Status"
    right_status = 3,
    //% block="Left Headlight"
    left_headlight = 6,
    //% block="Right Headlight"
    right_headlight = 9,
    //% block="Door 1"
    door_1 = 12,
    //% block="Door 2"
    door_2 = 15,
    //% block="Side 1"
    side_1 = 18,
    //% block="Side 2"
    side_2 = 21,
    //% block="Rear 1"
    rear_1 = 24,
    //% block="Rear 2"
    rear_2 = 27
}

//% weight=100 color=#00A654 icon="\uf0e7" block="BotControl"
namespace BotControl {
    let currentHeading: number = 0;

    class ApiFlags {
        public static readonly isResponse: number = 1 << 0;
        public static readonly requestsResponse: number = 1 << 1;
        public static readonly requestOnlyErrorResponse: number = 1 << 2;
        public static readonly resetInactivityTimeout: number = 1 << 3;
        public static readonly packetHasTargetId: number = 1 << 4;
        public static readonly packetHasSourceId: number = 1 << 5;
        //public static readonly unused: number = 1 << 6;
        public static readonly extendedFlags: number = 1 << 7;

        public static readonly defaultRequestWithResponseFlags: number = ((ApiFlags.requestsResponse) | (ApiFlags.resetInactivityTimeout) | (ApiFlags.packetHasTargetId) | (ApiFlags.packetHasSourceId));
        public static readonly defaultRequestWithNoResponseFlags: number = ((ApiFlags.requestOnlyErrorResponse) | (ApiFlags.resetInactivityTimeout) | (ApiFlags.packetHasTargetId) | (ApiFlags.packetHasSourceId));
        public static readonly defaultResponseFlags: number = ((ApiFlags.isResponse) | (ApiFlags.packetHasTargetId) | (ApiFlags.packetHasSourceId));
    }


    class ApiParserFlags {
        public static readonly escape: number = 0xAB;
        public static readonly startOfPacket: number = 0x8D;
        public static readonly endOfPacket: number = 0xD8;
        public static readonly escapedEscape: number = 0x23;
        public static readonly escapedStartOfPacket: number = 0x05;
        public static readonly escapedEndOfPacket: number = 0x50;
        public static readonly slipEscapeMask: number = 0x88;
    }

    interface IApiMessage {
        readonly flags: number;
        readonly sequenceNumber: number;

        readonly isCommand: boolean;
        readonly isResponse: boolean;
        readonly isRequestingResponse: boolean;

        readonly targetId: number;
        readonly sourceId: number;

        readonly deviceId: number;
        readonly deviceName: string;

        readonly commandId: number;
        readonly commandName: string;

        readonly dataRawBytes: Array<number>;
        readonly messageRawBytes: Array<number>;

        readonly data: object | null;

        readonly errorCode: number | null;
        readonly errorMessage: string | null;
        readonly hasError: boolean;

        generateMessageRawBytes(): void;

        associateError(errorCode: number, errorMessage: string): void;

        prettyPrint(): string;
    }

    class ApiBaseMessage implements IApiMessage {
        protected _flags: number;
        public get flags(): number {
            return this._flags;
        }

        protected _sequenceNumber: number;
        public get sequenceNumber(): number {
            return this._sequenceNumber;
        }

        public get isCommand(): boolean {
            return !this.isResponse;
        }

        public get isResponse(): boolean {
            return (this.flags & (ApiFlags.isResponse)) == (ApiFlags.isResponse);
        }

        public get isRequestingResponse(): boolean {
            return (this.flags & (ApiFlags.requestsResponse)) == (ApiFlags.requestsResponse);
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

        protected _deviceName: string;
        public get deviceName(): string {
            return this._deviceName;
        }

        protected _commandId: number;
        public get commandId(): number {
            return this._commandId;
        }

        protected _commandName: string;
        public get commandName(): string {
            return this._commandName;
        }

        protected _dataRawBytes: Array<number>;
        public get dataRawBytes(): Array<number> {
            return this._dataRawBytes;
        }

        public get messageRawBytes(): Array<number> {
            return [0];
        }

        protected _data: Array<number> | null;
        public get data(): Array<number> | null {
            return this._data;
        }

        protected _errorCode: number | null;
        public get errorCode(): number | null {
            return this._errorCode;
        }

        protected _errorMessage: string | null;
        public get errorMessage(): string | null {
            return this._errorMessage;
        }

        protected _hasError: boolean;
        public get hasError(): boolean {
            return this._hasError;
        }

        protected constructor(flags: number, sequenceNumber: number,
            targetId: number, sourceId: number,
            deviceId: number, deviceName: string,
            commandId: number, commandName: string,
            dataRawBytes: Array<number> | null = null) {

            this._flags = flags;
            this._sequenceNumber = sequenceNumber;

            this._targetId = targetId;
            this._sourceId = sourceId;

            this._deviceId = deviceId;
            this._deviceName = deviceName;

            this._commandId = commandId;
            this._commandName = commandName;

            if (dataRawBytes != null) {
                this._dataRawBytes = dataRawBytes;
            }
        }

        protected generateMessageRawBytesInternal(): void {

        }
        public generateMessageRawBytes(): void {
            this.generateMessageRawBytesInternal();
        }

        public associateError(errorCode: number, errorMessage: string): void {
            this._errorCode = errorCode;
            this._errorMessage = errorMessage;
            this._hasError = true;
        }

        public prettyPrint(): string {
            return '';
        }
    }

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


        protected generateMessageRawBytesInternal(): void {
            let checksum = 0;
            this._commandRawBytes = []

            this._commandRawBytes.push(ApiParserFlags.startOfPacket);

            this.encodeByteInBytes(this._commandRawBytes, this.flags);
            checksum += this.flags;


            if ((this.flags & ApiFlags.packetHasTargetId) > 0x00) {
                this.encodeByteInBytes(this._commandRawBytes, this.targetId);
                checksum += this.targetId;
            }

            if ((this.flags & ApiFlags.packetHasSourceId) > 0x00) {
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

            this._commandRawBytes.push(ApiParserFlags.endOfPacket);
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

    function buildApiCommandMessageWithDefaultFlags(targetId: number, sourceId: number,
        deviceId: number, deviceName: string,
        commandId: number, commandName: string,
        dataRawBytes: Array<number> | null = null): IApiCommandMessage {

        let flags: number = ApiFlags.defaultRequestWithResponseFlags;
        let sequenceNumber: number = 0x00;  // TODO: own sequence number here?

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

    function ArrayFromUint16(value: number): Array<number> {

        return [((value >> 8) & 0xFF), (value & 0xFF)];
    }

    function ArrayFromUint32(value: number): Array<number> {
        return [((value >> 24) & 0xFF), ((value >> 16) & 0xFF), ((value >> 8) & 0xFF), (value & 0xFF)];
    }

    //% block="drive with %heading|Heading and %speed|Speed"
    //% heading.min=0 heading.max=359
    //% speed.min=-255 speed.max=255 
    //% subcategory=Movement
    export function drive(heading: number, speed: number): void {
        currentHeading = heading;
        let flags: number = 0x00;
        if (speed < 0) {
            flags = 0x01;
        }

        let msg_data: Array<number> = [Math.abs(speed)];
        let headingArray: Array<number> = ArrayFromUint16(currentHeading);
        for (let i: number = 0; i < 2; i++) {
            msg_data[i + 1] = headingArray[i];
        }
        msg_data[3] = flags;

        let msg = buildApiCommandMessageWithDefaultFlags(0x12, 0x01, 0x16, "", 0x07, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    //% block="stop"
    //% subcategory=Movement
    export function stop(): void {
        let speed = 0x00;
        let flags = 0x00;

        let msg_data: Array<number> = [speed];
        let headingArray: Array<number> = ArrayFromUint16(currentHeading)
        for (let i: number = 0; i < 2; i++) {
            msg_data[i + 1] = headingArray[i];
        }
        msg_data[3] = flags;

        let msg = buildApiCommandMessageWithDefaultFlags(0x12, 0x01, 0x16, "", 0x07, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    //% block="Set Raw Motors with LeftMode:%left_mode| LeftSpeed:%left_speed| RightMode:%right_mode| RightSpeed:%right_speed|"
    //% left_speed.min=0 left_speed.max=255
    //% right_speed.min=0 right_speed.max=255
    //% subcategory=Movement
    export function rawMotors(left_mode: MotorMode, left_speed: number, right_mode: MotorMode, right_speed: number): void {
        let msg_data: Array<number> = [left_mode, left_speed, right_mode, right_speed];
        let msg = buildApiCommandMessageWithDefaultFlags(0x12, 0x01, 0x16, "", 0x01, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    //% block="Set All LEDs to red:%red| green:%green| blue:%blue|"
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% subcategory=Lights
    export function set_all_leds(red: number, green: number, blue: number): void {
        let led_bitmask: Array<number> = [0x3F, 0xFF, 0xFF, 0xFF];
        let led_data: Array<number> = [];
        for (let i: number = 0; i < 30; i += 3) {
            led_data[i] = red;
            led_data[i + 1] = green;
            led_data[i + 2] = blue;
        }

        let msg_data: Array<number> = led_bitmask;
        for (let i: number = 0; i < led_data.length; i++) {
            msg_data[i + 4] = led_data[i];
        }

        let msg = buildApiCommandMessageWithDefaultFlags(0x11, 0x01, 0x1A, "", 0x1A, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    //% block="Set RGB LED:%index| to red:%red| green:%green| blue:%blue|"
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% subcategory=Lights
    export function set_rgb_led_by_index(index: rgbLEDs, red: number, green: number, blue: number): void {
        let led_bitvalue: number = (0x07 << index);
        let led_bitmask: Array<number> = ArrayFromUint32(led_bitvalue);
        let led_data: Array<number> = [red, green, blue];

        let msg_data: Array<number> = led_bitmask;
        for (let i: number = 0; i < led_data.length; i++) {
            msg_data[i + 4] = led_data[i];
        }

        let msg = buildApiCommandMessageWithDefaultFlags(0x11, 0x01, 0x1A, "", 0x1A, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    //% block="Set Undercarriage LED to %intensity|"
    //% intensity.min=0 intensity.max=255
    //% subcategory=Lights
    export function set_undercarriage_white_led(intensity: number): void {
        let msg_data: Array<number> = [0x40, 0x00, 0x00, 0x00, intensity];

        let msg = buildApiCommandMessageWithDefaultFlags(0x11, 0x01, 0x1A, "", 0x1A, "", msg_data);

        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }
}