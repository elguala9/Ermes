import { ErmesStorageRepository } from "../storage-implementation/ErmesStorageRepository.js";
import { ErmesStorageService } from "../storage-implementation/ErmesStorageService.js";
/**
 * Creates a storage repository with the specified database and collection
 */
export function createErmesStorageRepository(db, collection = "ermes_messages") {
    return new ErmesStorageRepository(db, collection);
}
/**
 * Creates a storage service with the specified repository
 */
export function createErmesStorageService(repo) {
    return new ErmesStorageService(repo);
}
//# sourceMappingURL=ErmesStorageFactories.js.map