/**
 * Control a Sphero RVR using these commands.
 */
//% weight=100 color=#8527D7 icon="\uf120" block="Sphero RVR"
namespace sphero {
    /**
     * Drive with a speed from -255 to +255 and a heading from 0 to 359
     */
    //% block="drive with speed %speed| and heading %heading|"
    //% help=spheroRvr/drive
    //% speed.min=-255 speed.max=255
    //% heading.min=0 heading.max=359
    //% subcategory=Movement
    export function drive(speed: number, heading: number): void {
        let flags: number = 0x00;
        if (speed < 0) {
            flags = 0x01;
        }

        let messageData: Array<number> = [Math.abs(speed)];
        let headingArray: Array<number> = Utilities.int16ToByteArray(heading);

        for (let i: number = 0; i < headingArray.length; i++) {
            messageData.push(headingArray[i]);
        }

        messageData.push(flags);

        let apiMessage = buildApiCommandMessageWithDefaultFlags(
            ApiTargetsAndSources.robotStTarget,
            ApiTargetsAndSources.serviceSource,
            DriveCommands.driveDeviceId,
            DriveCommands.driveWithHeadingCommandId,
            messageData
        );

        serial.writeBuffer(pins.createBufferFromArray(apiMessage.messageRawBytes));
    }

    /**
     * Stop the RVR from driving with the given heading
     */
    //% block="stop with heading %heading|"
    //% help=spheroRvr/stop
    //% heading.min=0 heading.max=359
    //% subcategory=Movement
    export function stop(heading: number): void {
        let speed = 0x00;
        let flags = 0x00;

        let messageData: Array<number> = [speed];
        let headingArray: Array<number> = Utilities.int16ToByteArray(heading);

        for (let i: number = 0; i < headingArray.length; i++) {
            messageData.push(headingArray[i]);
        }

        messageData.push(flags);

        let apiMessage = buildApiCommandMessageWithDefaultFlags(
            ApiTargetsAndSources.robotStTarget,
            ApiTargetsAndSources.serviceSource,
            DriveCommands.driveDeviceId,
            DriveCommands.driveWithHeadingCommandId,
            messageData
        );

        serial.writeBuffer(pins.createBufferFromArray(apiMessage.messageRawBytes));
    }

    /**
     * Manually control the left and right motors
     */
    //% block="set raw motors with left mode:%leftMode| left speed:%leftSpeed| right mode:%rightMode| right speed:%rightSpeed|"
    //% help=spheroRvr/setRawMotors
    //% leftSpeed.min=0 leftSpeed.max=255
    //% rightSpeed.min=0 rightSpeed.max=255
    //% subcategory=Movement
    export function setRawMotors(leftMode: RawMotorModes, leftSpeed: number, rightMode: RawMotorModes, rightSpeed: number): void {
        let messageData: Array<number> = [leftMode, leftSpeed, rightMode, rightSpeed];

        let apiMessage = buildApiCommandMessageWithDefaultFlags(
            ApiTargetsAndSources.robotStTarget,
            ApiTargetsAndSources.serviceSource,
            DriveCommands.driveDeviceId,
            DriveCommands.setRawMotorsCommandId,
            messageData
        );

        serial.writeBuffer(pins.createBufferFromArray(apiMessage.messageRawBytes));
    }

    /**
     * Set the current yaw angle to zero
     */
    //% block="reset the yaw"
    //% help=spheroRvr/resetYaw
    //% subcategory=Movement
    export function resetYaw(): void {
        let apiMessage = buildApiCommandMessageWithDefaultFlags(
            ApiTargetsAndSources.robotStTarget,
            ApiTargetsAndSources.serviceSource,
            DriveCommands.driveDeviceId,
            DriveCommands.resetYawCommandId,
            null
        );

        serial.writeBuffer(pins.createBufferFromArray(apiMessage.messageRawBytes));
    }

    /**
     * Set all RGB LEDs on the RVR to one RGB value
     */
    //% block="set all LEDs to red:%red| green:%green| blue:%blue|"
    //% help=spheroRvr/setAllLeds
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% subcategory=Lights
    export function setAllLeds(red: number, green: number, blue: number): void {
        let ledBitmask: Array<number> = [0x3F, 0xFF, 0xFF, 0xFF];

        let messageData: Array<number> = ledBitmask;
        for (let i: number = 0; i < 30; i += 3) {
            messageData.push(red);
            messageData.push(green);
            messageData.push(blue);
        }

        let apiMessage = buildApiCommandMessageWithDefaultFlags(
            ApiTargetsAndSources.robotNordicTarget,
            ApiTargetsAndSources.serviceSource,
            UserIoCommands.userIoDeviceId,
            UserIoCommands.setLEDsCommandId,
            messageData
        );

        serial.writeBuffer(pins.createBufferFromArray(apiMessage.messageRawBytes));
    }

    /**
     * Set one individual RGB LED on the RVR to a specific RGB value
     */
    //% block="set RGB LED:%index| to red:%red| green:%green| blue:%blue|"
    //% help=spheroRvr/setRgbLedByIndex
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% subcategory=Lights
    export function setRgbLedByIndex(index: LEDs, red: number, green: number, blue: number): void {
        let ledBitValue: number = (0x07 << index);
        let ledBitmask: Array<number> = Utilities.int32ToByteArray(ledBitValue);
        let ledData: Array<number> = [red, green, blue];

        let messageData: Array<number> = ledBitmask;
        for (let i: number = 0; i < ledData.length; i++) {
            messageData.push(ledData[i]);
        }

        let apiMessage = buildApiCommandMessageWithDefaultFlags(
            ApiTargetsAndSources.robotNordicTarget,
            ApiTargetsAndSources.serviceSource,
            UserIoCommands.userIoDeviceId,
            UserIoCommands.setLEDsCommandId,
            messageData
        );

        serial.writeBuffer(pins.createBufferFromArray(apiMessage.messageRawBytes));
    }

    /**
     * Wake the RVR from sleep
     */
    //% block="wake"
    //% help=spheroRvr/wake
    //% subcategory=Power
    export function wake(): void {
        let apiMessage = buildApiCommandMessageWithDefaultFlags(
            ApiTargetsAndSources.robotNordicTarget,
            ApiTargetsAndSources.serviceSource,
            PowerCommands.powerDeviceId,
            PowerCommands.wakeCommandId,
            null
        );

        serial.writeBuffer(pins.createBufferFromArray(apiMessage.messageRawBytes));
    }

    /**
     * Put the RVR in a soft sleep state
     */
    //% block="sleep"
    //% help=spheroRvr/sleep
    //% subcategory=Power
    export function sleep(): void {
        let apiMessage = buildApiCommandMessageWithDefaultFlags(
            ApiTargetsAndSources.robotNordicTarget,
            ApiTargetsAndSources.serviceSource,
            PowerCommands.powerDeviceId,
            PowerCommands.softSleepCommandId,
            null
        );

        serial.writeBuffer(pins.createBufferFromArray(apiMessage.messageRawBytes));
    }
}
