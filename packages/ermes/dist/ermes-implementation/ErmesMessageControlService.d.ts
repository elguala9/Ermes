import { IdType } from "ermes-types";
import { IErmesMessageControlService, IErmesMessageControlRepository, CallbackIdsToRequest } from "iermes/index";
export type ErmesMessageControlServiceOpts = {
    frequencyIdSaveState: number;
};
/**
 * Service implementation of message control that delegates to a repository
 * Provides a service layer over the repository for message ID tracking and gap detection
 */
export declare class ErmesMessageControlService implements IErmesMessageControlService {
    private readonly repository;
    private externalCallback?;
    private readonly opts;
    private idsCountChange;
    constructor(repository: IErmesMessageControlRepository, opts: ErmesMessageControlServiceOpts);
    /**
     * Record that an ID has arrived - delegates to repository
     */
    idArrived(id: IdType): Promise<void>;
    /**
     * Get the list of missing IDs that should be requested - delegates to repository
     */
    idsToRequest(): Promise<IdType[]>;
    /**
     * Set callback for additional ID request logic - stores the external callback
     */
    setCallbackIdsToRequest(callback: CallbackIdsToRequest): Promise<void>;
    /**
     * Private callback function that handles both internal operations and external callback
     * This function is always called by the repository when IDs need to be requested
     */
    private handleIdsToRequest;
    /**
     * Perform internal service operations when IDs need to be requested
     */
    private performInternalOperations;
    /**
     * Set up the default callback for ID requests (deprecated - now automatic)
     */
    setupDefaultCallback(): Promise<void>;
    /**
     * Clear all stored data - delegates to repository
     */
    clear(): Promise<void>;
    /**
     * Destroy and cleanup resources - delegates to repository
     */
    destroy(): Promise<void>;
}
