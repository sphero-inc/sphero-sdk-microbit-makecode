// Add your code here

namespace command_processor {
    export interface ApiCommandProcessor {
        readonly name: string;

        readonly did: number;
        readonly cid: number;

        // generates the JSON 'payload' content for ROBOT >> SERVER communication
        generateRequestDataObjectFromRequestDataRawBytes(rawBytes: Array<number>): object;

        // generates the response BYTES 'payload' data for ROBOT >> SERVER communication
        generateResponseDataRawBytesFromRequestDataRawBytes(rawBytes: Array<number>): Array<number>;
    }

    class SensorStreamDataNotifyCommandProcessor implements command_processor.ApiCommandProcessor {
        public get name() {
            return "Sensor Streaming Data Notify";
        }

        public get did() {
            return 0x18;
        }
        
        public get cid() {
            return 0x02;
        }

        // generates the JSON 'payload' content for ROBOT >> SERVER communication
        generateRequestDataObjectFromRequestDataRawBytes(rawBytes: Array<number>): object {
            return null;
        }

        // generates the response BYTES 'payload' data for ROBOT >> SERVER communication
        generateResponseDataRawBytesFromRequestDataRawBytes(rawBytes: Array<number>): Array<number> {
            return null;
        }
    }
}