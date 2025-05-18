import { MessageType } from 'ermes-types';
import { MessageTypeForPouch } from './ErmesStorageType';
export declare function toPouchMessage(msg: MessageType): MessageTypeForPouch;
export declare function fromPouchMessage(msg: MessageTypeForPouch): MessageType;
