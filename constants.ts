namespace sphero {
    export class ApiFlags {
        public static readonly requestsResponse: number = 1 << 1;
        public static readonly resetInactivityTimeout: number = 1 << 3;
        public static readonly packetHasTargetId: number = 1 << 4;
        public static readonly packetHasSourceId: number = 1 << 5;

        public static readonly defaultRequestWithResponseFlags: number = ((ApiFlags.requestsResponse) | (ApiFlags.resetInactivityTimeout) | (ApiFlags.packetHasTargetId) | (ApiFlags.packetHasSourceId));
    }

    export class ApiParserFlags {
        public static readonly escape: number = 0xAB;
        public static readonly startOfPacket: number = 0x8D;
        public static readonly endOfPacket: number = 0xD8;
        public static readonly escapedEscape: number = 0x23;
        public static readonly escapedStartOfPacket: number = 0x05;
        public static readonly escapedEndOfPacket: number = 0x50;
        public static readonly slipEscapeMask: number = 0x88;
    }

    export class ApiTargetsAndSources {
        public static readonly robotNordicTarget: number = Utilities.nibblesToByte(Utilities.reverseNibbles([1, 1]));
        public static readonly robotStTarget: number = Utilities.nibblesToByte(Utilities.reverseNibbles([1, 2]));
        public static readonly serviceSource: number = Utilities.nibblesToByte(Utilities.reverseNibbles([0, 1]));
    }

    export enum RawMotorModes {
        //% block="Off"
        off = 0,
        //% block="Forward"
        forward = 1,
        //% block="Backward"
        backward = 2
    }

    export enum LEDs {
        //% block="Right Headlight"
        rightHeadlight = 0,
        //% block="Left Headlight"
        leftHeadlight = 3,
        //% block="Left Status"
        leftStatus = 6,
        //% block="Right Status"
        rightStatus = 9,
        //% block="Battery Door Rear"
        batteryDoorRear = 12,
        //% block="Battery Door Front"
        batteryDoorFront = 15,
        //% block="Power Button Front"
        powerButtonFront = 18,
        //% block="Power Button Rear"
        powerButtonRear = 21,
        //% block="Left Brakelight"
        leftBrakelight = 24,
        //% block="Right Brakelight"
        rightBrakelight = 27
    }

    export class DriveCommands {
        public static readonly driveDeviceId: number = 0x16;

        public static readonly driveWithHeadingCommandId: number = 0x07;
        public static readonly setRawMotorsCommandId: number = 0x01;
        public static readonly resetYawCommandId: number = 0x06;
    }

    export class UserIoCommands {
        public static readonly userIoDeviceId: number = 0x1A;

        public static readonly setLEDsCommandId: number = 0x1A;
    }

    export class PowerCommands {
        public static readonly powerDeviceId: number = 0x13;

        public static readonly wakeCommandId: number = 0x0D;
        public static readonly softSleepCommandId: number = 0x01;
    }
}
