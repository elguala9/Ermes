import { ChunkMessageGeneric, MessageChunkErmes, MessageDataErmes, MessageDataGeneric, ServiceMessage } from "ermes-types";


export type IdStorageForPouchDB = {
    _id: string
}

export type MessageDataForPouch = MessageDataGeneric<Buffer>;
export type ChunkMessageForPouch = ChunkMessageGeneric<Buffer>;

export type MessageTypeForPouch = MessageDataForPouch | ChunkMessageForPouch | ServiceMessage;

export type StorageType<DataJson> = DataJson & IdStorageForPouchDB

export type ServiceMessageStorage = ServiceMessage & IdStorageForPouchDB;
export type MessageDataStorage = MessageDataErmes & IdStorageForPouchDB;
export type MessageChunkStorage = MessageChunkErmes & IdStorageForPouchDB;