"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErmesCachingRepository = void 0;
/**
 * In‐memory repository con capacità massima (FIFO eviction).
 */
class ErmesCachingRepository {
    constructor(maxBuffer) {
        this.maxBuffer = maxBuffer;
        this.buffer = new Map();
    }
    async clear() {
        this.buffer.clear();
    }
    numberOfElements() {
        return this.buffer.size;
    }
    async listOfIds() {
        return Array.from(this.buffer.keys());
    }
    async store(data) {
        // Se esiste già, lo "riportiamo in testa"
        if (this.buffer.has(data.id)) {
            this.buffer.delete(data.id);
        }
        this.buffer.set(data.id, data);
        // Se superiamo la capacità, rimuoviamo il più vecchio (prima chiave inserita)
        if (this.numberOfElements() > this.maxBuffer) {
            const oldestKey = this.buffer.keys().next().value;
            if (oldestKey)
                this.buffer.delete(oldestKey);
        }
    }
    async retrieve(id) {
        return this.buffer.get(id);
    }
    async delete(id) {
        this.buffer.delete(id);
    }
}
exports.ErmesCachingRepository = ErmesCachingRepository;
//# sourceMappingURL=ErmesCachingRepository.js.map