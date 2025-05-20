import { ChunkMessage, MessageData, MessageType, ServiceMessage } from 'ermes-types';
import { ChunkMessageForPouch, MessageDataForPouch } from './ErmesStorageType.js';
export type Pouchify<T> = T extends MessageData ? MessageDataForPouch : T extends ChunkMessage ? ChunkMessageForPouch : ServiceMessage;
export declare function toPouchMessage<T extends MessageType>(msg: T): Pouchify<T>;
export declare function fromPouchMessage<T extends MessageType>(msg: Pouchify<T>): T;
