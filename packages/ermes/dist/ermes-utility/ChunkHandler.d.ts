import { IdChunkType, IdType, MessageChunkErmes, TypeOfData } from "ermes-types";
/**
 * class used to handle chunk
 */
export declare class ChunkHandler {
    private id;
    private roof;
    private chunks;
    private isCompleted;
    constructor(id: IdChunkType, roof: IdType);
    getId(): IdChunkType;
    addChunk(chunk: MessageChunkErmes): TypeOfData | undefined;
    private isDuplicate;
    private handleLastChunk;
    createData(): TypeOfData | undefined;
    getMissingIndices(): number[];
}
/**
 * Restituisce i numeri mancanti (buchi) nell'intervallo [0, max] rispetto all'array fornito.
 *
 * @param numbers - L'array di numeri.
 * @param max - Il valore massimo dell'intervallo considerato (incluso).
 * @returns Un array di numeri mancanti nell'intervallo [0, max].
 */
export declare function getMissingIndices(numbers: number[], max: number): number[];
