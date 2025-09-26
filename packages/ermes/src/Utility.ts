import { ChunkMessage, IdChunkType, IdType, MessageDataErmes, MessageType, MessageValue, TypeOfData } from "ermes-types";
import { IIdHandlerService } from "iermes/index";


export const DEFAULT_MAX_SIZE: number = 1024; 

/**
 * Splits an ArrayBuffer into chunks of a maximum size.
 * 
 * @param buffer - The ArrayBuffer to be chunked.
 * @param maxByte - The maximum number of bytes allowed per chunk.
 * @returns An array of ChunkMessage objects, each containing a chunk of the original ArrayBuffer.
 */
export function chunkArrayBuffer(idHanlder: IIdHandlerService, buffer: TypeOfData, ref_id: IdChunkType, maxByte: number): ChunkMessage[] {
    const totalLength = buffer.length;
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
            // TO DO: need to find a smarter method in order to avoid this field
            // because it takes too much space
            roof: numChunks,
            id: idHanlder.getNewId(),
            ref_id
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

/**
 * Creates a MessageDataErmes object from raw data and a new ID.
 * 
 * @param rawData - The data to be included in the message (Uint8Array).
 * @param newId - The ID to be assigned to the message.
 * @returns A MessageDataErmes object with the provided data and ID.
 */
export function createMessageDataErmes(rawData: TypeOfData, newId: IdType): MessageDataErmes {
    return {
        data: rawData,
        id: newId
    };
}

/**
 * Creates a MessageDataErmes object from raw data and generates a new ID using the provided ID handler.
 * 
 * @param idHandler - The ID handler service to generate a new ID.
 * @param rawData - The data to be included in the message (Uint8Array).
 * @returns A MessageDataErmes object with the provided data and a newly generated ID.
 */
export function createMessageDataErmesWithNewId(idHandler: IIdHandlerService, rawData: TypeOfData): MessageDataErmes {
    const newId = idHandler.getNewId();
    return createMessageDataErmes(rawData, newId);
}

