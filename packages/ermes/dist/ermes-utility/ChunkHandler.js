import { composeUint8Array } from "serialization-utility/src/Array";
/**
 * class used to handle chunk
 */
export class ChunkHandler {
    constructor(id, roof) {
        this.chunks = new Map();
        this.isCompleted = false; // if the chunk has been completed
        this.id = id;
        this.roof = roof;
    }
    getId() {
        return this.id;
    }
    // if chunk is not completed undefined
    addChunk(chunk) {
        if (this.isDuplicate(chunk))
            return undefined;
        this.chunks.set(chunk.index, chunk.data); // I insert the new chunk
        if (this.roof === this.chunks.size) { // if true this is the last chunk
            this.isCompleted = true;
            return this.handleLastChunk();
        }
        return undefined;
    }
    isDuplicate(chunk) {
        return this.chunks.has(chunk.index);
    }
    handleLastChunk() {
        const message = this.createData();
        if (message == undefined)
            throw new Error("Chunk are missing");
        return message;
    }
    // create the original message by merging the chunks
    createData() {
        const sortedValues = getSortedValues(this.chunks);
        if (this.isCompleted) {
            const result = composeUint8Array(sortedValues.values);
            return result;
        }
        return undefined;
    }
    // to call if we want to ask missing indices
    getMissingIndices() {
        const sortedValues = getSortedValues(this.chunks);
        return getMissingIndices(sortedValues.indexes, this.roof);
    }
}
function getSortedValues(map, compareFn) {
    const entries = Array.from(map.entries());
    entries.sort((entry1, entry2) => {
        const key1 = entry1[0];
        const key2 = entry2[0];
        // Use numeric comparison for chunk indices instead of lexicographic
        if (compareFn) {
            return compareFn(key1, key2);
        }
        else if (typeof key1 === 'number' && typeof key2 === 'number') {
            return key1 - key2;
        }
        else {
            return ('' + key1).localeCompare('' + key2);
        }
    });
    return { indexes: entries.map(entry => entry[0]), values: entries.map(entry => entry[1]) }; // i need both to verify missing chunks
}
/**
 * Restituisce i numeri mancanti (buchi) nell'intervallo [0, max] rispetto all'array fornito.
 *
 * @param numbers - L'array di numeri.
 * @param max - Il valore massimo dell'intervallo considerato (incluso).
 * @returns Un array di numeri mancanti nell'intervallo [0, max].
 */
export function getMissingIndices(numbers, max) {
    // Set because is fast
    const numbersSet = new Set(numbers);
    const missing = [];
    // I start from 0, but the max is max -1
    for (let i = 0; i < max; i++) {
        if (!numbersSet.has(i)) {
            missing.push(i);
        }
    }
    return missing;
}
//# sourceMappingURL=ChunkHandler.js.map