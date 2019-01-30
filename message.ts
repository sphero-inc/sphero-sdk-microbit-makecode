// Add your code here

namespace message {
    export interface IApiMessage {
        readonly flags: number;
        readonly sequenceNumber: number;

        readonly isCommand: boolean;
        readonly isResponse: boolean;
        readonly isRequestingResponse: boolean;

        readonly targetId: number;
        readonly sourceId: number;

        readonly deviceId: number;
        readonly deviceName: string;

        readonly commandId: number;
        readonly commandName: string;

        readonly dataRawBytes: Array<number>;
        readonly messageRawBytes: Array<number>;

        readonly data: object | null;

        readonly errorCode: number | null;
        readonly errorMessage: string | null;
        readonly hasError: boolean;

        generateMessageRawBytes(): void;

        associateError(errorCode: number, errorMessage: string): void;

        prettyPrint(): string;
    }

    export class ApiBaseMessage implements IApiMessage {
        protected _flags: number;
        public get flags(): number {
            return this._flags;
        }

        protected _sequenceNumber: number;
        public get sequenceNumber(): number {
            return this._sequenceNumber;
        }

        public get isCommand(): boolean {
            return !this.isResponse;
        }

        public get isResponse(): boolean {
            return (this.flags & (flags.ApiFlags.isResponse)) == (flags.ApiFlags.isResponse);
        }

        public get isRequestingResponse(): boolean {
            return (this.flags & (flags.ApiFlags.requestsResponse)) == (flags.ApiFlags.requestsResponse);
        }

        protected _targetId: number;
        public get targetId(): number {
            return this._targetId;
        }

        protected _sourceId: number;
        public get sourceId(): number {
            return this._sourceId;
        }

        protected _deviceId: number;
        public get deviceId(): number {
            return this._deviceId;
        }

        protected _deviceName: string;
        public get deviceName(): string {
            return this._deviceName;
        }

        protected _commandId: number;
        public get commandId(): number {
            return this._commandId;
        }

        protected _commandName: string;
        public get commandName(): string {
            return this._commandName;
        }

        protected _dataRawBytes: Array<number>;
        public get dataRawBytes(): Array<number> {
            return this._dataRawBytes;
        }

        public get messageRawBytes(): Array<number> {
            return [0];
        }

        protected _data: Array<number> | null;
        public get data(): Array<number> | null {
            return this._data;
        }

        protected _errorCode: number | null;
        public get errorCode(): number | null {
            return this._errorCode;
        }

        protected _errorMessage: string | null;
        public get errorMessage(): string | null {
            return this._errorMessage;
        }

        protected _hasError: boolean;
        public get hasError(): boolean {
            return this._hasError;
        }

        public constructor(flags: number, sequenceNumber: number,
            targetId: number, sourceId: number,
            deviceId: number, deviceName: string,
            commandId: number, commandName: string,
            dataRawBytes: Array<number> | null = null) {

            this._flags = flags;
            this._sequenceNumber = sequenceNumber;

            this._targetId = targetId;
            this._sourceId = sourceId;

            this._deviceId = deviceId;
            this._deviceName = deviceName;

            this._commandId = commandId;
            this._commandName = commandName;

            if (dataRawBytes != null) {
                this._dataRawBytes = dataRawBytes;
            }
        }

        protected generateMessageRawBytesInternal(): void {

        }
        public generateMessageRawBytes(): void {
            this.generateMessageRawBytesInternal();
        }

        public associateError(errorCode: number, errorMessage: string): void {
            this._errorCode = errorCode;
            this._errorMessage = errorMessage;
            this._hasError = true;
        }

        public prettyPrint(): string {
            return '';
        }
    }
}