import { ClientWorkDB } from "workdb/ClientWorkDB";
import { ErmesMessageControlRepository } from "../ErmesMessageControlRepository.js";
import { ErmesMessageControlService, ErmesMessageControlServiceOpts } from "../ErmesMessageControlService.js";

/**
 * Create a repository instance with the given ClientWorkDB
 */
export function createMessageControlRepository(db: ClientWorkDB): ErmesMessageControlRepository {
    return new ErmesMessageControlRepository(db, false);
}

/**
 * Create a repository instance and load its state
 */
export async function createMessageControlRepositoryWithState(db: ClientWorkDB): Promise<ErmesMessageControlRepository> {
    const repository = new ErmesMessageControlRepository(db, true);
    await repository.loadState();
    return repository;
}

/**
 * Create a service instance with the given repository
 */
export function createMessageControlService(repository: ErmesMessageControlRepository, opts?: ErmesMessageControlServiceOpts): ErmesMessageControlService {
    const defaultOpts: ErmesMessageControlServiceOpts = {
        frequencyIdSaveState: 0 // Default: always save state on ID changes
    };
    
    const finalOpts = { ...defaultOpts, ...opts };
    return new ErmesMessageControlService(repository, finalOpts);
}

/**
 * Create both repository and service with the given ClientWorkDB (without loading state)
 */
export function createMessageControlRepositoryAndService(db: ClientWorkDB) {
    const repository = createMessageControlRepository(db);
    const service = createMessageControlService(repository);
    
    return {
        repository,
        service
    };
}

/**
 * Create both repository and service with state loaded
 */
export async function createMessageControlRepositoryAndServiceWithState(db: ClientWorkDB) {
    const repository = await createMessageControlRepositoryWithState(db);
    const service = createMessageControlService(repository);
    
    return {
        repository,
        service
    };
}

/**
 * Create a repository with default collection name (without state)
 */
export function createDefaultMessageControlRepository(db: ClientWorkDB): ErmesMessageControlRepository {
    return createMessageControlRepository(db);
}