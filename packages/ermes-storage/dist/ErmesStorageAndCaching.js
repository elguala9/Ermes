// Generic repository backed by PouchDB through WorkDB
export class ErmesStorageAndCaching {
    constructor(storage, caching, opts) {
        this.storage = storage;
        this.caching = caching;
        this.opts = opts;
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
    async store(data) {
        // Always store in persistent storage
        await this.storage.store(data);
        // Check if we should also store in cache based on available space
        const maxCacheSize = this.opts.maxNumberOfElementCached || 1000; // Default to 1000 if not specified
        const currentCacheSize = this.caching.numberOfElements();
        if (currentCacheSize < maxCacheSize) {
            // Cache has space, store there too
            await this.caching.store(data);
        }
        // If cache is full, we don't store in cache - only in persistent storage
        // The cache will be populated when items are retrieved if needed
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