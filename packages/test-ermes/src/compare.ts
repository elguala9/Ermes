import {
    MessageValue,
    ServiceReason,
    IntegrityCheckType,
    IdType,
    ChunkInfo,
    MessageWithId,
    MessageData,
    ChunkMessage,
    ServiceMessage,
    MessageRootErmes,
    InternalMessage as MessageInternalErmes,
    MessageType,
    MessageChunkErmes
  } from "ermes-types";
  
  /** 1) ServiceReason */
  export function eqServiceReason(a: ServiceReason, b: ServiceReason): boolean {
    return a === b;
  }
  
  /** 2) MessageValue */
  export function eqMessageValue(a: MessageValue, b: MessageValue): boolean {
    return a === b;
  }
  
  /** 3) IntegrityCheckType (string | number | boolean) */
  export function eqIntegrityCheckType(a: IntegrityCheckType, b: IntegrityCheckType): boolean {
    return a === b;
  }
  
  /** 4) IdType = number */
  export function eqIdType(a: IdType, b: IdType): boolean {
    return a === b;
  }
  
  /** 5) ChunkInfo */
  export function eqChunkInfo(a: ChunkInfo, b: ChunkInfo): boolean {
    if (a.chunkId !== b.chunkId) return false;
    if (a.index === b.index) return true;
    if (!a.index || !b.index) return false;
    if (a.index.length !== b.index.length) return false;
    return a.index.every((v, i) => v === b.index![i]);
  }
  
  /** 6) MessageWithId */
  export function eqMessageWithId(a: MessageWithId, b: MessageWithId): boolean {
    return eqIdType(a.id, b.id);
  }
  
  /** 7) MessageData */
  export function eqMessageData(a: MessageData, b: MessageData): boolean {
    if (!eqMessageWithId(a, b)) return false;
    if (a.data.length !== b.data.length) return false;
    for (let i = 0; i < a.data.length; i++) {
      if (a.data[i] !== b.data[i]) return false;
    }
    return true;
  }
  
  /** 8) ChunkMessage */
  export function eqChunkMessage(a: ChunkMessage, b: ChunkMessage): boolean {
    if (!eqMessageData(a, b)) return false;
    return a.index === b.index && a.roof === b.roof;
  }
  
  /** 9) ServiceMessage */
  export function eqServiceMessage(a: ServiceMessage, b: ServiceMessage): boolean {
    if (!eqMessageWithId(a, b)) return false;
    if (a.reason !== b.reason) return false;
  
    // arrayChunkInfo?
    if (a.arrayChunkInfo === b.arrayChunkInfo) {
      // ok (incluso entrambi undefined)
    } else {
      if (!a.arrayChunkInfo || !b.arrayChunkInfo) return false;
      if (a.arrayChunkInfo.length !== b.arrayChunkInfo.length) return false;
      for (let i = 0; i < a.arrayChunkInfo.length; i++) {
        if (!eqChunkInfo(a.arrayChunkInfo[i], b.arrayChunkInfo[i])) return false;
      }
    }
  
    // arrayId?
    if (a.arrayId === b.arrayId) {
    } else {
      if (!a.arrayId || !b.arrayId) return false;
      if (a.arrayId.length !== b.arrayId.length) return false;
      for (let i = 0; i < a.arrayId.length; i++) {
        if (a.arrayId[i] !== b.arrayId[i]) return false;
      }
    }
  
    return true;
  }
  
  /** 10) MessageRootErmes */
  export function eqMessageRootErmes(a: MessageRootErmes, b: MessageRootErmes): boolean {
    if (a.integrityCheckValue !== b.integrityCheckValue) return false;
    if (a.messageSerialized.length !== b.messageSerialized.length) return false;
    for (let i = 0; i < a.messageSerialized.length; i++) {
      if (a.messageSerialized[i] !== b.messageSerialized[i]) return false;
    }
    return true;
  }
  
  /** Helper per MessageType (MessageData | ChunkMessage | ServiceMessage) */
  export function eqMessageType(a: MessageType, b: MessageType): boolean {
    // discriminatore implicito: presenza di campi
    if ("data" in a && "index" in a && "roof" in a && "data" in b) {
      return eqChunkMessage(a as ChunkMessage, b as ChunkMessage);
    } else if ("data" in a && !("index" in a) && "data" in b) {
      return eqMessageData(a as MessageData, b as MessageData);
    } else if (!("data" in a) && "reason" in a && "reason" in b) {
      return eqServiceMessage(a as ServiceMessage, b as ServiceMessage);
    }
    return false;
  }
  
  /** 11) MessageInternalErmes */
  export function eqMessageInternalErmes(a: MessageInternalErmes<MessageType>, b: MessageInternalErmes<MessageType>): boolean {
    if (!eqMessageValue(a.type, b.type)) return false;
    return eqMessageType(a.message, b.message);
  }
  
  /** 12) MessageChunkErmes (alias di ChunkMessage) */
  export function eqMessageChunkErmes(a: MessageChunkErmes, b: MessageChunkErmes): boolean {
    return eqChunkMessage(a, b);
  }
  