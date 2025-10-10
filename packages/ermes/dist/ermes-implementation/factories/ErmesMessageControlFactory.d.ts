import { ClientWorkDB } from "workdb/ClientWorkDB";
import { ErmesMessageControlRepository } from "../ErmesMessageControlRepository.js";
import { ErmesMessageControlService, ErmesMessageControlServiceOpts } from "../ErmesMessageControlService.js";
/**
 * Create a repository instance with the given ClientWorkDB
 */
export declare function createMessageControlRepository(db: ClientWorkDB): ErmesMessageControlRepository;
/**
 * Create a repository instance and load its state
 */
export declare function createMessageControlRepositoryWithState(db: ClientWorkDB): Promise<ErmesMessageControlRepository>;
/**
 * Create a service instance with the given repository
 */
export declare function createMessageControlService(repository: ErmesMessageControlRepository, opts?: ErmesMessageControlServiceOpts): ErmesMessageControlService;
/**
 * Create both repository and service with the given ClientWorkDB (without loading state)
 */
export declare function createMessageControlRepositoryAndService(db: ClientWorkDB): {
    repository: ErmesMessageControlRepository;
    service: ErmesMessageControlService;
};
/**
 * Create both repository and service with state loaded
 */
export declare function createMessageControlRepositoryAndServiceWithState(db: ClientWorkDB): Promise<{
    repository: ErmesMessageControlRepository;
    service: ErmesMessageControlService;
}>;
/**
 * Create a repository with default collection name (without state)
 */
export declare function createDefaultMessageControlRepository(db: ClientWorkDB): ErmesMessageControlRepository;
