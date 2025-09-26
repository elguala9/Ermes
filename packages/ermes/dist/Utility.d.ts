import { ChunkMessage, IdChunkType, IdType, MessageDataErmes, MessageType, MessageValue, TypeOfData } from "ermes-types";
import { IIdHandlerService } from "iermes/index";
export declare const DEFAULT_MAX_SIZE: number;
/**
 * Splits an ArrayBuffer into chunks of a maximum size.
 *
 * @param buffer - The ArrayBuffer to be chunked.
 * @param maxByte - The maximum number of bytes allowed per chunk.
 * @returns An array of ChunkMessage objects, each containing a chunk of the original ArrayBuffer.
 */
export declare function chunkArrayBuffer(idHanlder: IIdHandlerService, buffer: TypeOfData, ref_id: IdChunkType, maxByte: number): ChunkMessage[];
export declare function getMessageType(message: MessageType): MessageValue;
/**
 * Creates a MessageDataErmes object from raw data and a new ID.
 *
 * @param rawData - The data to be included in the message (Uint8Array).
 * @param newId - The ID to be assigned to the message.
 * @returns A MessageDataErmes object with the provided data and ID.
 */
export declare function createMessageDataErmes(rawData: TypeOfData, newId: IdType): MessageDataErmes;
/**
 * Creates a MessageDataErmes object from raw data and generates a new ID using the provided ID handler.
 *
 * @param idHandler - The ID handler service to generate a new ID.
 * @param rawData - The data to be included in the message (Uint8Array).
 * @returns A MessageDataErmes object with the provided data and a newly generated ID.
 */
export declare function createMessageDataErmesWithNewId(idHandler: IIdHandlerService, rawData: TypeOfData): MessageDataErmes;
