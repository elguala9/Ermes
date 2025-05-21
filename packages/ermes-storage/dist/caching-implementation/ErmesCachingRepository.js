/**
 * In‐memory repository con capacità massima (FIFO eviction).
 */
export class ErmesCachingRepository {
    constructor(maxBuffer) {
        this.maxBuffer = maxBuffer;
        this._buffer = new Map();
    }
    async destroy() {
        await this.clear();
    }
    async clear() {
        return this._buffer.clear();
    }
    numberOfElements() {
        return this._buffer.size;
    }
    async listOfIds() {
        return Array.from(this._buffer.keys());
    }
    async store(data) {
        // Se esiste già, lo "riportiamo in testa"
        if (this._buffer.has(data.id)) {
            this._buffer.delete(data.id);
        }
        this._buffer.set(data.id, data);
        // Se superiamo la capacità, rimuoviamo il più vecchio (prima chiave inserita)
        if (this.numberOfElements() > this.maxBuffer) {
            const oldestKey = this._buffer.keys().next().value;
            if (oldestKey)
                this._buffer.delete(oldestKey);
        }
    }
    async retrieve(id) {
        return this._buffer.get(id);
    }
    async delete(id) {
        this._buffer.delete(id);
    }
}
//# sourceMappingURL=ErmesCachingRepository.js.map