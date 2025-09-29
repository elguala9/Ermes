import { ClientWorkDB } from "workdb/ClientWorkDB";
import { ErmesMessageControlRepository } from "../ErmesMessageControlRepository.js";
import { ErmesMessageControlService, ErmesMessageControlServiceOpts } from "../ErmesMessageControlService.js";
/**
 * Factory for creating message control instances
 */
export declare class ErmesMessageControlFactory {
    /**
     * Create a repository instance with the given ClientWorkDB
     */
    static createRepository(db: ClientWorkDB): ErmesMessageControlRepository;
    /**
     * Create a repository instance and load its state
     */
    static createRepositoryWithState(db: ClientWorkDB): Promise<ErmesMessageControlRepository>;
    /**
     * Create a service instance with the given repository
     */
    static createService(repository: ErmesMessageControlRepository, opts?: ErmesMessageControlServiceOpts): ErmesMessageControlService;
    /**
     * Create both repository and service with the given ClientWorkDB (without loading state)
     */
    static createRepositoryAndService(db: ClientWorkDB): {
        repository: ErmesMessageControlRepository;
        service: ErmesMessageControlService;
    };
    /**
     * Create both repository and service with state loaded
     */
    static createRepositoryAndServiceWithState(db: ClientWorkDB): Promise<{
        repository: ErmesMessageControlRepository;
        service: ErmesMessageControlService;
    }>;
    /**
     * Create a repository with default collection name (without state)
     */
    static createDefaultRepository(db: ClientWorkDB): ErmesMessageControlRepository;
}
