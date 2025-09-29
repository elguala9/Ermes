import SimplePeer from 'simple-peer';
export declare enum MessageValue {
    base = 0,
    chunk = 1,
    service = 2
}
export type ServiceReason = 'c' | 's' | 'x';
export type MessageType = MessageData | ChunkMessage | ServiceMessage;
export type IntegrityCheckType = string | number | boolean;
export type IdType = number;
export type IdChunkType = string;
export type TypeOfData = Uint8Array;
export type TypeOfDataExternal = Uint8Array;
export type IdPeer = string;
export type MessageRoot<IntegrityCheckTypeGeneric extends IntegrityCheckType> = {
    messageSerialized: TypeOfData;
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
export type ChunkIndexType = number;
export declare const MAX_HEADER = 81;
export type ChunkMessageGeneric<DataType> = MessageDataGeneric<DataType> & {
    ref_id: IdChunkType;
    index: ChunkIndexType;
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
    chunkId: ChunkIndexType;
};
export type MessageRootErmes = MessageRoot<string>;
export type MessageDataErmes = MessageData;
export type MessageInternalErmes = InternalMessage<MessageType>;
export type MessageChunkErmes = ChunkMessage;
export type CallBackServiceMessage = (serviceMessage: ServiceMessage) => void;
export type CallbackOnMessageData = (serviceMessage: MessageDataErmes) => void;
export type CallbackOnMessage = (message: MessageType) => void;
export type CallbackOnData = (message: TypeOfData) => void;
export type CallbackOnDataArrived = (data: TypeOfDataExternal) => void;
export type CallbackOnDataArrivedFrom = (data: TypeOfDataExternal, peer: IdPeer) => void;
export type CallbackOnMessageSending = CallbackOnMessage;
export type CallbackOnMessageSended = CallbackOnMessage;
export type CallbackOnDataSending = CallbackOnData;
export type CallbackOnDataSended = CallbackOnData;
export type CallbackOnMessageReceived = {
    callbackonMessage: CallbackOnMessage;
    callbackOnData: CallbackOnDataArrived;
};
export type SerializableDataType = Uint8Array;
export type CallbackOnDataRepository = (data: SerializableDataType) => void;
export type CallbackOnMessageService = (data: TypeOfData, messageWithId: MessageWithId) => void;
export type PeerType = SimplePeer.Instance;
