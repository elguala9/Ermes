import { Buffer } from 'buffer';
import { ChunkMessage, MessageData, MessageType, ServiceMessage } from 'ermes-types';
import { ChunkMessageForPouch, MessageDataForPouch, MessageTypeForPouch } from './ErmesStorageType';

//
// * Overload signatures *
//


export function toPouchMessage(msg: MessageType): MessageTypeForPouch {
  // Se è un messaggio con campo `data`, converto Uint8Array → Buffer
  if ('data' in msg) {
    return {
      ...msg,
      data: Buffer.from(msg.data) // Buffer.from(Uint8Array) copia i byte
    } as any;
  }
  // ServiceMessage non ha data: lo restituisco invariato
  return msg as ServiceMessage;
}

//
// * E il viceversa *
//

export function fromPouchMessage(msg: MessageTypeForPouch): MessageType {
  // Se è un messaggio con campo `data`, converto Buffer → Uint8Array
  if ('data' in msg) {
    const buf: Buffer = msg.data;
    // creo un Uint8Array views sullo stesso ArrayBuffer
    const u8 = new Uint8Array(
      buf.buffer,
      buf.byteOffset,
      buf.byteLength
    );
    return {
      ...msg,
      data: u8
    } as any;
  }
  // ServiceMessage non ha data
  return msg as ServiceMessage;
}
