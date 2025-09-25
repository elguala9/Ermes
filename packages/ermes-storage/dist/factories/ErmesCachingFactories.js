import { ErmesCachingRepository } from "../caching-implementation/ErmesCachingRepository.js";
import { ErmesCachingService } from "../caching-implementation/ErmesCachingService.js";
/**
 * Creates a caching repository with the specified maximum buffer size
 */
export function createErmesCachingRepository(maxBuffer = 1000) {
    return new ErmesCachingRepository(maxBuffer);
}
/**
 * Creates a caching service with the specified repository or creates a default one
 */
export function createErmesCachingService(repo, maxBuffer = 1000) {
    const repository = repo || createErmesCachingRepository(maxBuffer);
    return new ErmesCachingService(repository);
}
//# sourceMappingURL=ErmesCachingFactories.js.map