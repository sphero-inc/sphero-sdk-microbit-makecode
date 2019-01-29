namespace flags {
    export class ApiFlags {
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


    export class ApiParserFlags {
        public static readonly escape: number = 0xAB;
        public static readonly startOfPacket: number = 0x8D;
        public static readonly endOfPacket: number = 0xD8;
        public static readonly escapedEscape: number = 0x23;
        public static readonly escapedStartOfPacket: number = 0x05;
        public static readonly escapedEndOfPacket: number = 0x50;
        public static readonly slipEscapeMask: number = 0x88;
    }
}
