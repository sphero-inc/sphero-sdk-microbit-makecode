// Add your code here

namespace utilities {
    export class Utilities {
        public static int32ToByteArray(value: number): Array<number> {
            let bytes: Array<number> = [0, 0, 0, 0];

            if (value == undefined || value == null) {
                return bytes;
            }

            for (let i: number = 0; i < bytes.length; i++) {
                let byte: number = value & 0xFF;
                bytes[i] = byte;
                value = (value - byte) / 256;
            }

            return bytes;
        }

        public static int16ToByteArray(value: number): Array<number> {
            let bytes: Array<number> = [0, 0];

            if (value == undefined || value == null) {
                return bytes;
            }

            for (let i: number = 0; i < bytes.length; i++) {
                let byte: number = value & 0xFF;
                bytes[i] = byte;
                value = (value - byte) / 256;
            }

            return bytes;
        }

        public static floatToByteArray(value: number): Array<number> {

            let bytes: Array<number> = [];

            return bytes;
        }

        public static stringToByteArray(value: string): Array<number> {
            let bytes: Array<number> = [];

            if (value == undefined || value == null) {
                return bytes;
            }

            for (let i = 0; i < value.length; i++) {
                bytes.push(value.charCodeAt(i));
            }

            return bytes;
        }

        public static byteArrayToNumber(bytes: Array<number>): number {
            let value: number = 0;

            if (!bytes) {
                return value;
            }

            for (let i: number = bytes.length - 1; i >= 0; i--) {
                value = (value * 256) + bytes[i];
            }

            return value;
        }

        public static byteArrayToFloat(bytes: Array<number>): number {
            if (!bytes) {
                return 0;
            }

            return 0;
        }

        public static incrementByteValue(byte: number, incrementBy: number): number {
            byte += incrementBy;
            if (byte >= 256) {
                byte = byte - 256;
            }

            return byte;
        }

        public static byteToNibbles(byte: number): Array<number> {
            let bytes: Array<number> = [0, 0];

            for (let j: number = 0; j < bytes.length; j++) {
                let tempByte: number = byte & 0x0f;
                bytes[j] = tempByte;
                byte = (byte - tempByte) / 16;
            }

            return bytes;
        }

        public static nibblesToByte(nibbles: Array<number>): number {
            let value: number = 0;

            if (!nibbles) {
                return value;
            }

            for (let i: number = nibbles.length - 1; i >= 0; i--) {
                value = (value * 16) + nibbles[i];
            }

            return value;
        }
    }
}