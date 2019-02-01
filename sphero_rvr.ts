
enum SpheroRvrMotorMode {
    //% block="off"
    off = 0,
    //% block="forward"
    forward = 1,
    //% block="backward"
    backward = 2
}

enum SpheroRvrRgbLeds {
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

/**
 * Control A Sphero RVR Using these Commands
 */
//% weight=100 color=#00A654 icon="\uf0e7" block="Sphero RVR"
namespace spheroRvr {
    let currentHeading: number = 0;

    /**
     * Drive with a Heading from 0 to 359 and a speed from -255 to +255
     */
    //% block="drive with %heading|Heading and %speed|Speed"
    //% help=spheroRvr/drive
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
        let headingArray: Array<number> = SpheroUtilities.int16ToByteArray(currentHeading);
        for (let i: number = 0; i < 2; i++) {
            msg_data[i + 1] = headingArray[i];
        }
        msg_data[3] = flags;

        let msg = spheroMessage.buildApiCommandMessageWithDefaultFlags(0x12, 0x01, 0x16, "", 0x07, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    /**
     * Stop the Robot from Driving
     */
    //% block="stop"
    //% help=spheroRvr/stop
    //% subcategory=Movement
    export function stop(): void {
        let speed = 0x00;
        let flags = 0x00;

        let msg_data: Array<number> = [speed];
        let headingArray: Array<number> = SpheroUtilities.int16ToByteArray(currentHeading);
        for (let i: number = 0; i < 2; i++) {
            msg_data[i + 1] = headingArray[i];
        }
        msg_data[3] = flags;

        let msg = spheroMessage.buildApiCommandMessageWithDefaultFlags(0x12, 0x01, 0x16, "", 0x07, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    /**
     * Manually control the left and right motors
     */
    //% block="set raw motors with Left Mode:%left_mode| Left Speed:%left_speed| Right Mode:%right_mode| Right Speed:%right_speed|"
    //% left_speed.min=0 left_speed.max=255
    //% right_speed.min=0 right_speed.max=255
    //% subcategory=Movement
    export function rawMotors(left_mode: SpheroRvrMotorMode, left_speed: number, right_mode: SpheroRvrMotorMode, right_speed: number): void {
        let msg_data: Array<number> = [left_mode, left_speed, right_mode, right_speed];
        let msg = spheroMessage.buildApiCommandMessageWithDefaultFlags(0x12, 0x01, 0x16, "", 0x01, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    //% block="set all LEDs to red:%red| green:%green| blue:%blue|"
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

        let msg = spheroMessage.buildApiCommandMessageWithDefaultFlags(0x11, 0x01, 0x1A, "", 0x1A, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    //% block="set RGB LED:%index| to red:%red| green:%green| blue:%blue|"
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% subcategory=Lights
    export function set_rgb_led_by_index(index: SpheroRvrRgbLeds, red: number, green: number, blue: number): void {
        let led_bitvalue: number = (0x07 << index);
        let led_bitmask: Array<number> = SpheroUtilities.int32ToByteArray(led_bitvalue);
        let led_data: Array<number> = [red, green, blue];

        let msg_data: Array<number> = led_bitmask;
        for (let i: number = 0; i < led_data.length; i++) {
            msg_data[i + 4] = led_data[i];
        }

        let msg = spheroMessage.buildApiCommandMessageWithDefaultFlags(0x11, 0x01, 0x1A, "", 0x1A, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    //% block="set Undercarriage LED to %intensity|"
    //% intensity.min=0 intensity.max=255
    //% subcategory=Lights
    export function set_undercarriage_white_led(intensity: number): void {
        let msg_data: Array<number> = [0x40, 0x00, 0x00, 0x00, intensity];

        let msg = spheroMessage.buildApiCommandMessageWithDefaultFlags(0x11, 0x01, 0x1A, "", 0x1A, "", msg_data);

        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }
}
