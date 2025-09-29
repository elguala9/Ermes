import { ClientWorkDB } from "workdb/ClientWorkDB";
import { ErmesMessageControlRepository } from "../ErmesMessageControlRepository.js";
import { ErmesMessageControlService, ErmesMessageControlServiceOpts } from "../ErmesMessageControlService.js";

/**
 * Factory for creating message control instances
 */
export class ErmesMessageControlFactory {
    
    /**
     * Create a repository instance with the given ClientWorkDB
     */
    static createRepository(db: ClientWorkDB): ErmesMessageControlRepository {
        return new ErmesMessageControlRepository(db, false);
    }

    /**
     * Create a repository instance and load its state
     */
    static async createRepositoryWithState(db: ClientWorkDB): Promise<ErmesMessageControlRepository> {
        const repository = new ErmesMessageControlRepository(db, true);
        await repository.loadState();
        return repository;
    }

    /**
     * Create a service instance with the given repository
     */
    static createService(repository: ErmesMessageControlRepository, opts?: ErmesMessageControlServiceOpts): ErmesMessageControlService {
        const defaultOpts: ErmesMessageControlServiceOpts = {
            frequencyIdSaveState: 0 // Default: always save state on ID changes
        };
        
        const finalOpts = { ...defaultOpts, ...opts };
        return new ErmesMessageControlService(repository, finalOpts);
    }

    /**
     * Create both repository and service with the given ClientWorkDB (without loading state)
     */
    static createRepositoryAndService(db: ClientWorkDB) {
        const repository = this.createRepository(db);
        const service = this.createService(repository);
        
        return {
            repository,
            service
        };
    }

    /**
     * Create both repository and service with state loaded
     */
    static async createRepositoryAndServiceWithState(db: ClientWorkDB) {
        const repository = await this.createRepositoryWithState(db);
        const service = this.createService(repository);
        
        return {
            repository,
            service
        };
    }

    /**
     * Create a repository with default collection name (without state)
     */
    static createDefaultRepository(db: ClientWorkDB): ErmesMessageControlRepository {
        return this.createRepository(db);
    }
}