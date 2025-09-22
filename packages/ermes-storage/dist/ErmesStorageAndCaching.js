const defaultOpts = {
    maxNumberOfElementCached: 100,
    cachingMode: "fifo"
};
// Generic repository backed by PouchDB through WorkDB
export class ErmesStorageAndCaching {
    constructor(storage, caching, opts) {
        this.storage = storage;
        this.caching = caching;
        this.opts = { ...defaultOpts, ...opts };
    }
    async flush() {
        // Get all IDs from cache
        const cacheIds = await this.caching.listOfIds();
        // For each item in cache, retrieve it and store it in persistent storage
        for (const id of cacheIds) {
            const cachedItem = await this.caching.retrieve(id);
            if (cachedItem) {
                await this.storage.store(cachedItem);
            }
        }
    }
    async _storeInCache(data) {
        const maxCacheSize = this.opts.maxNumberOfElementCached;
        const currentCacheSize = this.caching.numberOfElements();
        if (currentCacheSize < maxCacheSize) {
            // Cache has space, store directly
            await this.caching.store(data);
        }
        else {
            // Cache is full, apply eviction policy
            await this._evictAndStore(data);
        }
    }
    async _evictAndStore(data) {
        const cachingMode = this.opts.cachingMode;
        const cacheIds = await this.caching.listOfIds();
        if (cacheIds.length === 0) {
            // Cache is empty, just store
            await this.caching.store(data);
            return;
        }
        if (cachingMode === "fifo") {
            await this._evictFifo(cacheIds);
        }
        else if (cachingMode === "lifo") {
            await this._evictLifo(cacheIds);
        }
        await this.caching.store(data);
    }
    async _evictFifo(cacheIds) {
        // FIFO: Remove the oldest (first inserted) item
        const oldestId = cacheIds[0];
        await this.caching.delete(oldestId);
    }
    async _evictLifo(cacheIds) {
        // LIFO: Remove the newest (last inserted) item
        const newestId = cacheIds[cacheIds.length - 1];
        await this.caching.delete(newestId);
    }
    async store(data) {
        // Always store in persistent storage first
        await this.storage.store(data);
        // Then handle caching with eviction policies
        await this._storeInCache(data);
    }
    async retrieve(id) {
        // Try cache first (faster)
        let result = await this.caching.retrieve(id);
        if (result !== undefined) {
            return result;
        }
        // If not in cache, try persistent storage
        result = await this.storage.retrieve(id);
        if (result !== undefined) {
            // Store in cache for future retrievals
            await this.caching.store(result);
        }
        return result;
    }
    async delete(id) {
        // Delete from both cache and persistent storage
        const [cacheResult, storageResult] = await Promise.all([
            this.caching.delete(id),
            this.storage.delete(id)
        ]);
        return cacheResult && storageResult;
    }
    async clear() {
        // Clear both cache and persistent storage
        await Promise.all([
            this.caching.clear(),
            this.storage.clear()
        ]);
    }
    numberOfElements() {
        // Return the number of elements in persistent storage
        // Cache might have different count due to eviction policies
        return this.storage.numberOfElements() + this.caching.numberOfElements();
    }
    async listOfIds() {
        // Return IDs from persistent storage (authoritative source)
        const [storageIds, cacheIds] = await Promise.all([
            this.storage.listOfIds(),
            this.caching.listOfIds()
        ]);
        // Combine the arrays and ensure uniqueness
        return [...new Set([...cacheIds, ...storageIds])];
    }
    async destroy() {
        // Destroy both cache and storage
        await this.flush();
        await Promise.all([
            this.caching.destroy(),
            this.storage.destroy()
        ]);
    }
}
//# sourceMappingURL=ErmesStorageAndCaching.js.map