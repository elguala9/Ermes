export declare enum MessageValue {
    base = 0,
    chunk = 1,
    service = 2
}
export type ServiceReason = 'c' | 's' | 'x';
export type MessageType = MessageData | ChunkMessage | ServiceMessage;
export type IntegrityCheckType = string | number | boolean;
export type IdType = number;
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
export type MessageData = MessageDataGeneric<Uint8Array> & MessageWithId & {};
export type MessageDataGeneric<DataType> = MessageWithId & {
    data: DataType;
};
export type ChunkMessageGeneric<DataType> = MessageDataGeneric<DataType> & {
    index: number;
    roof: number;
};
export type ChunkMessage = ChunkMessageGeneric<Uint8Array> & {};
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
