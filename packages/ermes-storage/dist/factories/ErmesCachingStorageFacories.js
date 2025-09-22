import { ErmesCachingRepository } from "../caching-implementation/ErmesCachingRepository.js";
import { ErmesCachingService } from "../caching-implementation/ErmesCachingService.js";
import { ErmesStorageAndCaching } from "../ErmesStorageAndCaching.js";
import { createErmesStorageRepository, createErmesStorageService } from "./ErmesStorageFacories.js";
/**
 * Creates a combined storage and caching system
 */
export function createErmesStorageAndCaching(db, options) {
    const { collection = "ermes_messages", maxNumberOfElementCached = 100, cachingMode = "fifo" } = options || {};
    // Create storage repository and service
    const storageRepo = createErmesStorageRepository(db, collection);
    const storageService = createErmesStorageService(storageRepo);
    // Create caching repository and service
    const cachingRepo = new ErmesCachingRepository(maxNumberOfElementCached);
    const cachingService = new ErmesCachingService(cachingRepo);
    // Create and return the combined storage and caching system
    return new ErmesStorageAndCaching(storageService, cachingService, { maxNumberOfElementCached, cachingMode });
}
//# sourceMappingURL=ErmesCachingStorageFacories.js.map