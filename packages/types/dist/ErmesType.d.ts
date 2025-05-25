export declare enum MessageValue {
    base = 0,
    chunk = 1,
    service = 2
}
export type ServiceReason = 'c' | 's' | 'x';
export type MessageType = MessageData | ChunkMessage | ServiceMessage;
export type IntegrityCheckType = string | number | boolean;
export type IdType = number;
export type TypeOfData = Uint8Array;
export type TypeOfDataExternal = Uint8Array;
export type MessageRoot<IntegrityCheckTypeGeneric extends IntegrityCheckType> = {
    messageSerialized: Uint8Array;
    integrityCheckValue: IntegrityCheckTypeGeneric;
};
export type InternalMessage<MessageTypeGeneric extends MessageType> = {
    message: MessageTypeGeneric;
    type: MessageValue;
};
export type MessageWithId = {
    id: IdType;
};
export type MessageData = MessageDataGeneric<TypeOfData> & MessageWithId & {};
export type MessageDataGeneric<DataType> = MessageWithId & {
    data: DataType;
};
export type ChunkMessageGeneric<DataType> = MessageDataGeneric<DataType> & {
    ref_id: IdType;
    index: number;
    roof: number;
};
export type ChunkMessage = ChunkMessageGeneric<TypeOfData> & {};
export type ServiceMessage = MessageWithId & {
    arrayChunkInfo?: ChunkInfo[];
    arrayId?: IdType[];
    reason: ServiceReason;
};
export type ChunkInfo = {
    index?: number[];
    chunkId: string;
};
export type MessageRootErmes = MessageRoot<string>;
export type MessageDataErmes = MessageData;
export type MessageInternalErmes = InternalMessage<MessageType>;
export type MessageChunkErmes = ChunkMessage;
export type CallBackServiceMessage = (serviceMessage: ServiceMessage) => void;
export type CallbackOnMessageData = (serviceMessage: MessageDataErmes) => void;
export type CallbackOnMessage = (message: MessageType) => void;
export type CallbackOnDataArrived = (data: TypeOfDataExternal) => void;
export type CallbackOnMessageSending = CallbackOnMessage;
export type CallbackOnMessageSended = CallbackOnMessage;
export type CallbackOnMessageReceived = {
    callbackonMessage: CallbackOnMessage;
    callbackOnData: CallbackOnDataArrived;
};
export type SerializableDataType = ArrayBuffer;
export type CallbackOnDataRepository = (data: SerializableDataType) => void;
export type CallbackOnMessageService = (data: TypeOfData, messageWithId: MessageWithId) => void;
