import { ChunkMessage, IdType, MessageType, MessageValue } from "ermes-types";


/**
 * Splits an ArrayBuffer into chunks of a maximum size.
 * 
 * @param buffer - The ArrayBuffer to be chunked.
 * @param maxByte - The maximum number of bytes allowed per chunk.
 * @returns An array of ChunkMessage objects, each containing a chunk of the original ArrayBuffer.
 */
export function chunkArrayBuffer(buffer: Uint8Array, id: IdType, maxByte: number): ChunkMessage[] {
    const totalLength = buffer.byteLength;
    const numChunks = Math.ceil(totalLength / maxByte);
    const chunks: ChunkMessage[] = [];
  
    for (let i = 0; i < numChunks; i++) {
        const start = i * maxByte;
        const end = Math.min(start + maxByte, totalLength);
        // The ArrayBuffer slice method returns a new ArrayBuffer from the original.
        const chunkBuffer = buffer.slice(start, end);
      
        chunks.push({
            data: chunkBuffer,
            index: i,
            roof: numChunks,
            id
        });
    }
  
    return chunks;
}



export function getMessageType(message: MessageType): MessageValue {
    // If the message has both `index` and `roof`, it's a ChunkMessage.
    if ('index' in message && 'roof' in message) {
      return MessageValue.chunk;
    }
    // If the message has a `service` property, treat it as a ServiceMessage.
    if ('reason' in message) {
      return MessageValue.service;
    }
    // Otherwise, assume it's a base message.
    return MessageValue.base;
  }

