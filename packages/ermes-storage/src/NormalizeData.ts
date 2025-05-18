import { Buffer } from 'buffer';
import { ChunkMessage, MessageData, MessageType, ServiceMessage } from 'ermes-types';
import { ChunkMessageForPouch, MessageDataForPouch, MessageTypeForPouch } from './ErmesStorageType';

//
// * Overload signatures *
//
// I need this because i have different types connected
export type Pouchify<T> =
  T extends MessageData  ? MessageDataForPouch  :
  T extends ChunkMessage ? ChunkMessageForPouch :
                           ServiceMessage;

// 2) Un’unica implementazione “smart” che copre tutti i casi
export function toPouchMessage<T extends MessageType>(msg: T): Pouchify<T> {
  if ('data' in msg) {
    return {
      ...msg,
      data: Buffer.from(msg.data),
    } as any;
  }
  return msg as any;
}

//
// * E il viceversa *
//


export function fromPouchMessage<T extends MessageType>(msg: Pouchify<T>): T  {
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
  return msg as any;
}
