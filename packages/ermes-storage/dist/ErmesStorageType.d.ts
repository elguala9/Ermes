import { MessageChunkErmes, MessageDataErmes, ServiceMessage } from "ermes-types";
export type StorageType<DataJson> = DataJson;
export type MessageTypeStorage = ServiceMessageStorage | ServiceMessageStorage | MessageChunkStorage;
export type ServiceMessageStorage = ServiceMessage;
export type MessageDataStorage = MessageDataErmes;
export type MessageChunkStorage = MessageChunkErmes;
