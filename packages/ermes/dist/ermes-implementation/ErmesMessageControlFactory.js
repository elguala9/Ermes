import { ErmesMessageControlRepository } from "./ErmesMessageControlRepository.js";
import { ErmesMessageControlService } from "./ErmesMessageControlService.js";
/**
 * Factory for creating message control instances
 */
export class ErmesMessageControlFactory {
    /**
     * Create a repository instance with the given storage
     */
    static createRepository(storage) {
        return new ErmesMessageControlRepository(storage);
    }
    /**
     * Create a service instance with the given repository
     */
    static createService(repository) {
        return new ErmesMessageControlService(repository);
    }
    /**
     * Create both repository and service with the given storage
     */
    static createRepositoryAndService(storage) {
        const repository = this.createRepository(storage);
        const service = this.createService(repository);
        return {
            repository,
            service
        };
    }
}
//# sourceMappingURL=ErmesMessageControlFactory.js.map