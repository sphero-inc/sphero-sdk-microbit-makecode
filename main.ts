
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

enum SpheroRvrSensable {
    //% block="Yaw"
    yaw = 0,
    //% block="Pitch"
    pitch = 1,
    //% block="Roll"
    roll = 2,
}

//% weight=100 color=#00A654 icon="\uf0e7" block="Sphero RVR"
namespace spheroRvr {
    let currentHeading: number = 0;

    function arrayFromUint16(value: number): Array<number> {

        return [((value >> 8) & 0xFF), (value & 0xFF)];
    }

    function arrayFromUint32(value: number): Array<number> {
        return [((value >> 24) & 0xFF), ((value >> 16) & 0xFF), ((value >> 8) & 0xFF), (value & 0xFF)];
    }

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
        let headingArray: Array<number> = arrayFromUint16(currentHeading);
        for (let i: number = 0; i < 2; i++) {
            msg_data[i + 1] = headingArray[i];
        }
        msg_data[3] = flags;

        let msg = command.buildApiCommandMessageWithDefaultFlags(0x12, 0x01, 0x16, "", 0x07, "", msg_data);
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
        let headingArray: Array<number> = arrayFromUint16(currentHeading)
        for (let i: number = 0; i < 2; i++) {
            msg_data[i + 1] = headingArray[i];
        }
        msg_data[3] = flags;

        let msg = command.buildApiCommandMessageWithDefaultFlags(0x12, 0x01, 0x16, "", 0x07, "", msg_data);
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
        let msg = command.buildApiCommandMessageWithDefaultFlags(0x12, 0x01, 0x16, "", 0x01, "", msg_data);
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

        let msg = command.buildApiCommandMessageWithDefaultFlags(0x11, 0x01, 0x1A, "", 0x1A, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    //% block="set RGB LED:%index| to red:%red| green:%green| blue:%blue|"
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% subcategory=Lights
    export function set_rgb_led_by_index(index: SpheroRvrRgbLeds, red: number, green: number, blue: number): void {
        let led_bitvalue: number = (0x07 << index);
        let led_bitmask: Array<number> = arrayFromUint32(led_bitvalue);
        let led_data: Array<number> = [red, green, blue];

        let msg_data: Array<number> = led_bitmask;
        for (let i: number = 0; i < led_data.length; i++) {
            msg_data[i + 4] = led_data[i];
        }

        let msg = command.buildApiCommandMessageWithDefaultFlags(0x11, 0x01, 0x1A, "", 0x1A, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));
    }

    //% block="set Undercarriage LED to %intensity|"
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

    let apiParser = new parser.ApiParser();

    function createArrayFromBuffer(buffer: Buffer): Array<number> {
        let output: Array<number> = [];
        for (let i:number = 0; i < buffer.length; i++) {
            output[i] = buffer[i];
        }

        return output;
    }

    function createArrayFromString(str: string): Array<number> {
        let output: Array<number> = [];

        for (let i:number = 0; i < str.length; i++) {
            output[i] = str.charCodeAt(i);
        }

        return output;
    }

    function set_sensor_streaming_mask(mask: number): void {
        let msg_data: Array<number> = [0x00, 0x64, 0x00];
        let mask_array: Array<number> = arrayFromUint32(mask);

        for (let i: number = 0; i < mask_array.length; i++) {
            msg_data[i + 3] = mask_array[i];
        }

        let msg = command.buildApiCommandMessageWithDefaultFlags(0x12, 0x01, 0x18, "", 0x00, "", msg_data);
        serial.writeBuffer(pins.createBufferFromArray(msg.commandRawBytes));        

        serial.onDataReceived(String.fromCharCode(flags.ApiParserFlags.endOfPacket), function () {
            let number_buffer: Array<number> = createArrayFromString(serial.readUntil(String.fromCharCode(0xD8)));
            apiParser.queueBytes(number_buffer);
            number_buffer = createArrayFromBuffer(serial.readBuffer(0));
            apiParser.queueBytes(number_buffer);
        })
    }

    //% block="yaw"
    //% subcategory=Sensors
    export function Yaw(): number {
        if (!yaw_enabled) {
            sensor_bitmask != 0x00010000;
            set_sensor_streaming_mask(sensor_bitmask);
            yaw_enabled = true;
        }
        return _yaw;
    }

    //% block="pitch"
    //% subcategory=Sensors
    export function Pitch(): number {
        if (!pitch_enabled) {
            sensor_bitmask != 0x00040000;
            set_sensor_streaming_mask(sensor_bitmask);
            pitch_enabled = true;
        }

        return _pitch;
    }

    //% block="roll"
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
