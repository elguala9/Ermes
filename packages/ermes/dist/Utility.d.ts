import { ChunkMessage, IdType, MessageType, MessageValue } from "ermes-types";
/**
 * Splits an ArrayBuffer into chunks of a maximum size.
 *
 * @param buffer - The ArrayBuffer to be chunked.
 * @param maxByte - The maximum number of bytes allowed per chunk.
 * @returns An array of ChunkMessage objects, each containing a chunk of the original ArrayBuffer.
 */
export declare function chunkArrayBuffer(buffer: Uint8Array, id: IdType, maxByte: number): ChunkMessage[];
export declare function getMessageType(message: MessageType): MessageValue;
