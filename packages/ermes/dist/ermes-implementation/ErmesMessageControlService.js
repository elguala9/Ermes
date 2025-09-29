/**
 * Service implementation of message control that delegates to a repository
 * Provides a service layer over the repository for message ID tracking and gap detection
 */
export class ErmesMessageControlService {
    constructor(repository, opts) {
        this.idsCountChange = 0; // how many time the set of the unarrived ids has changed
        this.repository = repository;
        this.opts = opts;
        // Imposta la nostra callback interna come callback del repository
        this.repository.setCallbackIdsToRequest(this.handleIdsToRequest.bind(this));
    }
    /**
     * Record that an ID has arrived - delegates to repository
     */
    async idArrived(id) {
        await this.repository.idArrived(id);
    }
    /**
     * Get the list of missing IDs that should be requested - delegates to repository
     */
    async idsToRequest() {
        return await this.repository.idsToRequest();
    }
    /**
     * Set callback for additional ID request logic - stores the external callback
     */
    async setCallbackIdsToRequest(callback) {
        this.externalCallback = callback;
    }
    /**
     * Private callback function that handles both internal operations and external callback
     * This function is always called by the repository when IDs need to be requested
     */
    async handleIdsToRequest(ids) {
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
    async performInternalOperations(ids) {
        this.idsCountChange += 1;
        if (this.idsCountChange >= this.opts.frequencyIdSaveState) {
            await this.repository.saveState();
            this.idsCountChange = 0;
        }
    }
    /**
     * Set up the default callback for ID requests (deprecated - now automatic)
     */
    async setupDefaultCallback() {
        // Non più necessario - la callback interna è già impostata nel costruttore
        console.warn('setupDefaultCallback is deprecated - internal callback is set automatically');
    }
    /**
     * Clear all stored data - delegates to repository
     */
    async clear() {
        await this.repository.clear();
    }
    /**
     * Destroy and cleanup resources - delegates to repository
     */
    async destroy() {
        await this.repository.destroy();
    }
}
//# sourceMappingURL=ErmesMessageControlService.js.map