namespace sphero {
    export class Utilities {
        public static numberToByteArray(value: number, size: number): Array<number> {
            let bytes: Array<number> = [];

            for (let i: number = 0; i < size; i++) {
                bytes.push(0);
            }

            if (!value) {
                return bytes;
            }

            for (let i: number = bytes.length - 1; i >= 0; i--) {
                let byte: number = value & 0xFF;
                bytes[i] = byte;
                value = (value - byte) / 256;
            }

            return bytes;
        }

        public static int32ToByteArray(value: number): Array<number> {
            return this.numberToByteArray(value, 4);
        }

        public static int16ToByteArray(value: number): Array<number> {
            return this.numberToByteArray(value, 2);
        }

        public static nibblesToByte(nibbles: Array<number>): number {
            let value: number = 0;

            if (!nibbles) {
                return value;
            }

            for (let i: number = nibbles.length - 1; i >= 0 ; i--) {
                value = (value * 16) + nibbles[i];
            }

            return value;
        }
        public static reverseNibbles(nibbles: Array<number>): Array<number> {
            nibbles.reverse();
            return nibbles;
        }
    }
}
