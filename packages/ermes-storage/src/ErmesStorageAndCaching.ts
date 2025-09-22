import { IdType, MessageType } from "ermes-types";
import { IErmesCachingService, IErmesStorageAndCaching, IErmesStorageRepository, IErmesStorageService } from "iermes/index";
import { ClientWorkDB } from "workdb/ClientWorkDB";


type ErmesCachingServiceOptionsInput = Partial<ErmesCachingServiceOptions>

// so that i do not have undefined everywhere
type ErmesCachingServiceOptions = {
  maxNumberOfElementCached: number;
  cachingMode: "lifo" | "fifo"; 
}

const defaultOpts: ErmesCachingServiceOptions = {
  maxNumberOfElementCached: 100,
  cachingMode: "fifo"
}

// Generic repository backed by PouchDB through WorkDB
export class ErmesStorageAndCaching<  
  DataJson extends MessageType  
> implements IErmesStorageAndCaching<DataJson> {

  storage: IErmesStorageService<DataJson>;
  caching: IErmesCachingService<DataJson>;
  opts : ErmesCachingServiceOptions;

  constructor(storage: IErmesStorageService<DataJson>, 
    caching: IErmesCachingService<DataJson>,
    opts: ErmesCachingServiceOptionsInput) {
    this.storage = storage;
    this.caching = caching;
    this.opts = { ...defaultOpts, ...opts };
  }

  async flush(): Promise<void> {
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

  private async _storeInCache(data: DataJson): Promise<void> {
    const maxCacheSize = this.opts.maxNumberOfElementCached;
    const currentCacheSize = this.caching.numberOfElements();
    
    if (currentCacheSize < maxCacheSize) {
      // Cache has space, store directly
      await this.caching.store(data);
    } else {
      // Cache is full, apply eviction policy
      await this._evictAndStore(data);
    }
  }

  private async _evictAndStore(data: DataJson): Promise<void> {
    const cachingMode = this.opts.cachingMode;
    const cacheIds = await this.caching.listOfIds();
    
    if (cacheIds.length === 0) {
      // Cache is empty, just store
      await this.caching.store(data);
      return;
    }

    if (cachingMode === "fifo") {
      await this._evictFifo(cacheIds);
    } else if (cachingMode === "lifo") {
      await this._evictLifo(cacheIds);
    }
    
    await this.caching.store(data);
  }

  private async _evictFifo(cacheIds: IdType[]): Promise<void> {
    // FIFO: Remove the oldest (first inserted) item
    const oldestId = cacheIds[0];
    await this.caching.delete(oldestId);
  }

  private async _evictLifo(cacheIds: IdType[]): Promise<void> {
    // LIFO: Remove the newest (last inserted) item
    const newestId = cacheIds[cacheIds.length - 1];
    await this.caching.delete(newestId);
  }

  async store(data: DataJson): Promise<void> {
    // Always store in persistent storage first
    await this.storage.store(data);
    
    // Then handle caching with eviction policies
    await this._storeInCache(data);
  }

  async retrieve(id: IdType): Promise<DataJson | undefined> {
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

  async delete(id: IdType): Promise<boolean> {
    // Delete from both cache and persistent storage
    const [cacheResult, storageResult] = await Promise.all([
      this.caching.delete(id),
      this.storage.delete(id)
    ]);

    return cacheResult && storageResult;
  }

  async clear(): Promise<void> {
    // Clear both cache and persistent storage
    await Promise.all([
      this.caching.clear(),
      this.storage.clear()
    ]);
  }

  numberOfElements(): number {
    // Return the number of elements in persistent storage
    // Cache might have different count due to eviction policies
    return this.storage.numberOfElements() + this.caching.numberOfElements();
  }

  async listOfIds(): Promise<IdType[]> {
    // Return IDs from persistent storage (authoritative source)
    const [storageIds, cacheIds] = await Promise.all([
      this.storage.listOfIds(),
      this.caching.listOfIds()
    ]);
    
    // Combine the arrays and ensure uniqueness
    return [...new Set([...cacheIds, ...storageIds])];
  }

  async destroy(): Promise<void> {
    // Destroy both cache and storage
    await this.flush();
    await Promise.all([
      this.caching.destroy(),
      this.storage.destroy()
    ]);
  }

  
}
