const MESSAGE_CONTROL_DEFAULT_COLLECTION = 'message_control';
/**
 * Repository implementation of message control that handles ID tracking and gap detection
 * Provides persistent storage of received message IDs and detection of missing sequences
 */
export class ErmesMessageControlRepository {
    constructor(db, loadState) {
        this.missingIds = new Set();
        this.lastId = null;
        this.db = db;
        this.collection = MESSAGE_CONTROL_DEFAULT_COLLECTION;
        // loadState() is now public and should be called manually after construction
    }
    async idArrived(id) {
        // if i do not have last id i take it
        if (this.lastId === null) {
            this.lastId = id;
            return;
        }
        // correct order, so ok
        if (id === this.lastId + 1) {
            this.lastId = id;
            return;
        }
        // i have a gap
        if (id > this.lastId + 1) {
            this.missingIds.add(id);
            this.lastId = id;
            if (this.callbackIdsToRequest !== undefined) {
                await this.callbackIdsToRequest(Array.from(this.missingIds));
            }
            return;
        }
        // out of order id, should never happen
        if (id < this.lastId) {
            this.cleanIdArrived(id);
            return;
        }
    }
    cleanIdArrived(id) {
        if (!this.missingIds.has(id))
            throw new Error(`ID: ${id}, is not missing`);
        this.missingIds.delete(id);
    }
    async idsToRequest() {
        return Array.from(this.missingIds).sort((a, b) => a - b);
    }
    async setCallbackIdsToRequest(callback) {
        this.callbackIdsToRequest = callback;
    }
    async clear() {
        this.missingIds.clear();
    }
    async destroy() {
        this.missingIds.clear();
    }
    async saveState() {
        this.db.createOrUpdate({
            id: 'message_control_state',
            collection: this.collection,
            item: {
                missing_ids: Array.from(this.missingIds),
                timestamp: Date.now(),
            },
        });
        this.db.createOrUpdate({
            id: 'message_control_state_last_id',
            collection: this.collection,
            item: {
                last_id: this.lastId
            },
        });
    }
    async loadState() {
        // Load missing IDs
        const missingIdsData = await this.db.retrieve({
            id: 'message_control_state',
            collection: this.collection
        });
        if (missingIdsData && missingIdsData.item) {
            const data = missingIdsData.item;
            if (data.missing_ids && Array.isArray(data.missing_ids)) {
                // Convert array back to Set
                this.missingIds = new Set(data.missing_ids);
            }
        }
        // Load last ID
        const lastIdData = await this.db.retrieve({
            id: 'message_control_state_last_id',
            collection: this.collection
        });
        if (lastIdData && lastIdData.item) {
            const data = lastIdData.item;
            this.lastId = data.last_id;
        }
    }
}
//# sourceMappingURL=ErmesMessageControlRepository.js.map