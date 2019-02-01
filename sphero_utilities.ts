class SpheroUtilities {
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
}
