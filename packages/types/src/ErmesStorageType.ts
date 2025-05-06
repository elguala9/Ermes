import { MessageChunkErmes, MessageDataErmes, ServiceMessage } from "./ErmesType";



export type IdStorageForPouchDB = {
    _id: string
}

export type StorageType<DataJson> = DataJson & IdStorageForPouchDB

export type ServiceMessageStorage = ServiceMessage & IdStorageForPouchDB;
export type MessageDataStorage = MessageDataErmes & IdStorageForPouchDB;
export type MessageChunkStorage = MessageChunkErmes & IdStorageForPouchDB;

