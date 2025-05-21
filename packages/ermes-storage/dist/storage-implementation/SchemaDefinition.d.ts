import { RxJsonSchema } from 'rxdb';
import { MessageChunkStorage, MessageDataStorage, ServiceMessageStorage } from '../ErmesStorageType.js';
export declare const messageDataSchema: RxJsonSchema<MessageDataStorage>;
export declare const messageChunkSchema: RxJsonSchema<MessageChunkStorage>;
export declare const serviceMessageSchema: RxJsonSchema<ServiceMessageStorage>;
