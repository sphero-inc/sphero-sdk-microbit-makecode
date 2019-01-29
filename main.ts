
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

enum Sensable {
    //% block="Yaw"
    yaw = 0,
    //% block="Pitch"
    pitch = 1,
    //% block="Roll"
    roll = 2,
}

//% weight=100 color=#00A654 icon="\uf0e7" block="BotControl"
namespace BotControl {
    let currentHeading: number = 0;

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

        let msg = command.buildApiCommandMessageWithDefaultFlags(0x12, 0x01, 0x16, "", 0x07, "", msg_data);
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

        let msg = command.buildApiCommandMessageWithDefaultFlags(0x12, 0x01, 0x16, "", 0x07, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    //% block="Set Raw Motors with LeftMode:%left_mode| LeftSpeed:%left_speed| RightMode:%right_mode| RightSpeed:%right_speed|"
    //% left_speed.min=0 left_speed.max=255
    //% right_speed.min=0 right_speed.max=255
    //% subcategory=Movement
    export function rawMotors(left_mode: MotorMode, left_speed: number, right_mode: MotorMode, right_speed: number): void {
        let msg_data: Array<number> = [left_mode, left_speed, right_mode, right_speed];
        let msg = command.buildApiCommandMessageWithDefaultFlags(0x12, 0x01, 0x16, "", 0x01, "", msg_data);
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

        let msg = command.buildApiCommandMessageWithDefaultFlags(0x11, 0x01, 0x1A, "", 0x1A, "", msg_data);
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

        let msg = command.buildApiCommandMessageWithDefaultFlags(0x11, 0x01, 0x1A, "", 0x1A, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    //% block="Set Undercarriage LED to %intensity|"
    //% intensity.min=0 intensity.max=255
    //% subcategory=Lights
    export function set_undercarriage_white_led(intensity: number): void {
        let msg_data: Array<number> = [0x40, 0x00, 0x00, 0x00, intensity];

        let msg = command.buildApiCommandMessageWithDefaultFlags(0x11, 0x01, 0x1A, "", 0x1A, "", msg_data);

        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    let sensor_bitmask: number = 0;
    let yaw_enabled: boolean = false;
    let pitch_enabled: boolean = false;
    let roll_enabled: boolean = false;
    let _yaw: number = 0;
    let _pitch: number = 0;
    let _roll: number = 0;

    function set_sensor_streaming_mask(mask: number): void {
        let msg_data: Array<number> = [0x00, 0x64, 0x00];
        let mask_array: Array<number> = ArrayFromUint32(mask);

        for (let i: number = 0; i < mask_array.length; i++) {
            msg_data[i + 3] = mask_array[i];
        }

        let msg = command.buildApiCommandMessageWithDefaultFlags(0x12, 0x01, 0x18, "", 0x00, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    //% block="Yaw"
    //% subcategory=Sensors
    export function Yaw(): number {
        if (!yaw_enabled) {
            sensor_bitmask != 0x00010000;
            set_sensor_streaming_mask(sensor_bitmask);
            yaw_enabled = true;
        }
        return _yaw;
    }

    //% block="Pitch"
    //% subcategory=Sensors
    export function Pitch(): number {
        if (!pitch_enabled) {
            sensor_bitmask != 0x00040000;
            set_sensor_streaming_mask(sensor_bitmask);
            pitch_enabled = true;
        }

        return _pitch;
    }

    //% block="Roll"
    //% subcategory=Sensors
    export function Roll(): number {
        if (!roll_enabled) {
            sensor_bitmask != 0x00020000;
            set_sensor_streaming_mask(sensor_bitmask);
            roll_enabled = true;
        }
        return _roll;
    }
}