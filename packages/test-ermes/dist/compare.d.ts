import { MessageValue, ServiceReason, IntegrityCheckType, IdType, ChunkInfo, MessageWithId, MessageData, ChunkMessage, ServiceMessage, MessageRootErmes, InternalMessage as MessageInternalErmes, MessageType, MessageChunkErmes } from "ermes-types";
/** 1) ServiceReason */
export declare function eqServiceReason(a: ServiceReason, b: ServiceReason): boolean;
/** 2) MessageValue */
export declare function eqMessageValue(a: MessageValue, b: MessageValue): boolean;
/** 3) IntegrityCheckType (string | number | boolean) */
export declare function eqIntegrityCheckType(a: IntegrityCheckType, b: IntegrityCheckType): boolean;
/** 4) IdType = number */
export declare function eqIdType(a: IdType, b: IdType): boolean;
/** 5) ChunkInfo */
export declare function eqChunkInfo(a: ChunkInfo, b: ChunkInfo): boolean;
/** 6) MessageWithId */
export declare function eqMessageWithId(a: MessageWithId, b: MessageWithId): boolean;
/** 7) MessageData */
export declare function eqMessageData(a: MessageData, b: MessageData): boolean;
/** 8) ChunkMessage */
export declare function eqChunkMessage(a: ChunkMessage, b: ChunkMessage): boolean;
/** 9) ServiceMessage */
export declare function eqServiceMessage(a: ServiceMessage, b: ServiceMessage): boolean;
/** 10) MessageRootErmes */
export declare function eqMessageRootErmes(a: MessageRootErmes, b: MessageRootErmes): boolean;
/** Helper per MessageType (MessageData | ChunkMessage | ServiceMessage) */
export declare function eqMessageType(a: MessageType, b: MessageType): boolean;
/** 11) MessageInternalErmes */
export declare function eqMessageInternalErmes(a: MessageInternalErmes<MessageType>, b: MessageInternalErmes<MessageType>): boolean;
/** 12) MessageChunkErmes (alias di ChunkMessage) */
export declare function eqMessageChunkErmes(a: MessageChunkErmes, b: MessageChunkErmes): boolean;
