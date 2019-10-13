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
    //% block="set raw motors with left mode:%left_mode| left speed:%left_speed| right mode:%right_mode| right speed:%right_speed|"
    //% help=spheroRvr/set_raw_motors
    //% left_speed.min=0 left_speed.max=255
    //% right_speed.min=0 right_speed.max=255
    //% subcategory=Movement
    export function set_raw_motors(left_mode: RawMotorModes, left_speed: number, right_mode: RawMotorModes, right_speed: number): void {
        let messageData: Array<number> = [left_mode, left_speed, right_mode, right_speed];

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
    //% help=spheroRvr/reset_yaw
    //% subcategory=Movement
    export function reset_yaw(): void {
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
    //% help=spheroRvr/set_all_leds
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% subcategory=Lights
    export function set_all_leds(red: number, green: number, blue: number): void {
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
    //% help=spheroRvr/set_rgb_led_by_index
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% subcategory=Lights
    export function set_rgb_led_by_index(index: LEDs, red: number, green: number, blue: number): void {
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
