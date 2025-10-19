import { IdType } from "ermes-types";
import { IErmesMessageControlService, IErmesMessageControlRepository, CallbackIdsToRequest } from "iermes/index";

export type ErmesMessageControlServiceOpts = {
    frequencyIdSaveState: number; // after how many id added/deleted to save state, if not provided no automatic save state, 0 -> always
}

/**
 * Service implementation of message control that delegates to a repository
 * Provides a service layer over the repository for message ID tracking and gap detection
 */
export class ErmesMessageControlService implements IErmesMessageControlService {
    private readonly repository: IErmesMessageControlRepository;
    private externalCallback?: CallbackIdsToRequest; // Callback fornita dall'utente
    private readonly opts: ErmesMessageControlServiceOpts;
    private idsCountChange: number = 0; // how many time the set of the unarrived ids has changed
    
    constructor(repository: IErmesMessageControlRepository, opts: ErmesMessageControlServiceOpts) {
        this.repository = repository;
        this.opts = opts;
        // Imposta la nostra callback interna come callback del repository
        this.repository.setCallbackIdsToRequest(this.handleIdsToRequest.bind(this));
    }

    /**
     * Record that an ID has arrived - delegates to repository
     */
    idArrived(id: IdType) {
        this.repository.idArrived(id);
    }

    /**
     * Get the list of missing IDs that should be requested - delegates to repository
     */
    async idsToRequest(): Promise<IdType[]> {
        return await this.repository.idsToRequest();
    }

    /**
     * Get the count of missing IDs - delegates to repository
     */
    numberOfMissingIds(): number {
        return this.repository.numberOfMissingIds();
    }

    /**
     * Set callback for additional ID request logic - stores the external callback
     */
    setCallbackIdsToRequest(callback: CallbackIdsToRequest): void {
        this.externalCallback = callback;
    }

    /**
     * Private callback function that handles both internal operations and external callback
     * This function is always called by the repository when IDs need to be requested
     */
    private async handleIdsToRequest(ids: IdType[]): Promise<void> {
        // 1. Esegui operazioni interne del Service
        await this.performInternalOperations(ids);
        
        // 2. Chiama la callback esterna se è stata fornita
        if (this.externalCallback) {
            await this.externalCallback(ids);
        }
    }

    /**
     * Perform internal service operations when IDs need to be requested
     */
    private async performInternalOperations(ids: IdType[]): Promise<void> {
        this.idsCountChange += 1;
        if (this.idsCountChange >= this.opts.frequencyIdSaveState) {
            await this.repository.saveState();
            this.idsCountChange = 0;
        }
    }


    /**
     * Clear all stored data - delegates to repository
     */
    async clear(): Promise<void> {
        await this.repository.clear();
    }

    /**
     * Destroy and cleanup resources - delegates to repository
     */
    async destroy(): Promise<void> {
        await this.repository.destroy();
    }
}