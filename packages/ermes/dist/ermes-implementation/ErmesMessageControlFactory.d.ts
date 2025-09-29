import { IErmesStorageAndCaching } from "iermes/index";
import { ServiceMessage } from "ermes-types";
import { ErmesMessageControlRepository } from "./ErmesMessageControlRepository.js";
import { ErmesMessageControlService } from "./ErmesMessageControlService.js";
/**
 * Storage type for message control data
 */
type MessageControlData = ServiceMessage & {
    timestamp: number;
};
/**
 * Factory for creating message control instances
 */
export declare class ErmesMessageControlFactory {
    /**
     * Create a repository instance with the given storage
     */
    static createRepository(storage: IErmesStorageAndCaching<MessageControlData>): ErmesMessageControlRepository;
    /**
     * Create a service instance with the given repository
     */
    static createService(repository: ErmesMessageControlRepository): ErmesMessageControlService;
    /**
     * Create both repository and service with the given storage
     */
    static createRepositoryAndService(storage: IErmesStorageAndCaching<MessageControlData>): {
        repository: ErmesMessageControlRepository;
        service: ErmesMessageControlService;
    };
}
export {};
