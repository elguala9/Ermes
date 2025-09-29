import { ErmesMessageControlRepository } from "../ErmesMessageControlRepository.js";
import { ErmesMessageControlService } from "../ErmesMessageControlService.js";
/**
 * Factory for creating message control instances
 */
export class ErmesMessageControlFactory {
    /**
     * Create a repository instance with the given ClientWorkDB
     */
    static createRepository(db) {
        return new ErmesMessageControlRepository(db, false);
    }
    /**
     * Create a repository instance and load its state
     */
    static async createRepositoryWithState(db) {
        const repository = new ErmesMessageControlRepository(db, true);
        await repository.loadState();
        return repository;
    }
    /**
     * Create a service instance with the given repository
     */
    static createService(repository, opts) {
        const defaultOpts = {
            frequencyIdSaveState: 0 // Default: always save state on ID changes
        };
        const finalOpts = { ...defaultOpts, ...opts };
        return new ErmesMessageControlService(repository, finalOpts);
    }
    /**
     * Create both repository and service with the given ClientWorkDB (without loading state)
     */
    static createRepositoryAndService(db) {
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
    static async createRepositoryAndServiceWithState(db) {
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
    static createDefaultRepository(db) {
        return this.createRepository(db);
    }
}
//# sourceMappingURL=ErmesMessageControlFactory.js.map