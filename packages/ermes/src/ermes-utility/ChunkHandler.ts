
import { IdType, MessageChunkErmes } from "ermes-types";

/**
 * class used to handle chunk
 */
export class ChunkHandler {
    private id: IdType; // the id of the message
    private roof: number; // the id of the message
    private chunks: Map<number, Uint8Array> = new Map<number, Uint8Array>();
    private isCompleted: boolean = false; // if the chink as been completed
      

    constructor(id: IdType, roof: number){
        this.id = id;
        this.roof = roof;
    }

    public getId(): IdType{
        return this.id;
    }

    public addChunk(chunk: MessageChunkErmes): Uint8Array | undefined{
        if(this.isDuplicate(chunk))
            return undefined;
        this.chunks.set(chunk.index, chunk.data); // I insert the new chunk
        if(this.roof === this.chunks.size - 1){ // if true this is the last chunk
            this.isCompleted = true;
            return this.handleLastChunk();
        }
        return undefined;
    }

    private isDuplicate(chunk: MessageChunkErmes): boolean{
        return this.chunks.has(chunk.index);
    }

    private handleLastChunk(): Uint8Array{
        const message = this.createData();
        if(message == undefined)
            throw new Error("Chunk are missing");
        return message;
    }

    // create the original message by merging the chunks
    public createData(): Uint8Array | undefined{
        const sortedValues = getSortedValues(this.chunks);
        if(this.isCompleted)
            return composeUint8Array(sortedValues.values)
        return undefined;
    }

    // to call if we want to ask missing indices
    public getMissingIndices(): number[]{
        const sortedValues = getSortedValues(this.chunks);
        return getMissingIndices(sortedValues.indexes, this.roof)
    }

    
}

type SortedChunk<K, V> = {
    indexes: K[],
    values: V[]
}

function getSortedValues<K, V>(
  map: Map<K, V>,
  compareFn?: (a: K, b: K) => number
): SortedChunk<K, V>{
  const entries = Array.from(map.entries());
  entries.sort((entry1, entry2) => {
    const key1 = entry1[0];
    const key2 = entry2[0];
    return compareFn ? compareFn(key1, key2) : ('' + key1).localeCompare('' + key2);
  });
  return {indexes: entries.map(entry => entry[0]), values: entries.map(entry => entry[1])}; // i need both to verify missing chunks
}

/**
 * Restituisce i numeri mancanti (buchi) nell'intervallo [0, max] rispetto all'array fornito.
 *
 * @param numbers - L'array di numeri.
 * @param max - Il valore massimo dell'intervallo considerato (incluso).
 * @returns Un array di numeri mancanti nell'intervallo [0, max].
 */
export function getMissingIndices(numbers: number[], max: number): number[] {
    // Set because is fast
    const numbersSet = new Set(numbers);
    const missing: number[] = [];
  
    // I start from 0, but the max is max -1
    for (let i = 0; i < max; i++) {
      if (!numbersSet.has(i)) {
        missing.push(i);
      }
    }
  
    return missing;
  }