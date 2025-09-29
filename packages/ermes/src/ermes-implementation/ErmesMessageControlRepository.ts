import { IdType } from "ermes-types";
import { CallbackIdsToRequest, IErmesMessageControlRepository } from "iermes/index";
import { ClientWorkDB } from "workdb/ClientWorkDB";


/**
 * Storage type for message control data
 */
type MessageControlData = {
    missing_ids?: IdType[];
    timestamp: number;
};

const MESSAGE_CONTROL_DEFAULT_COLLECTION = 'message_control';

/**
 * Repository implementation of message control that handles ID tracking and gap detection
 * Provides persistent storage of received message IDs and detection of missing sequences
 */
export class ErmesMessageControlRepository implements IErmesMessageControlRepository {

    private readonly db: ClientWorkDB;
    private readonly collection: string;
    private callbackIdsToRequest?: CallbackIdsToRequest;
    private missingIds: Set<IdType> = new Set();
    private lastId: IdType | null = null;

    constructor(db: ClientWorkDB, loadState: boolean) {
        this.db = db;
        this.collection = MESSAGE_CONTROL_DEFAULT_COLLECTION;
        // loadState() is now public and should be called manually after construction
    }

    async idArrived(id: IdType): Promise<void> {
        // if i do not have last id i take it
        if(this.lastId === null) {
            this.lastId = id;
            return;
        }
        // correct order, so ok
        if(id === this.lastId + 1) {
            this.lastId = id;
            return;
        }
        // i have a gap
        if(id > this.lastId + 1) {
            this.missingIds.add(id);
            this.lastId = id;
            if (this.callbackIdsToRequest !== undefined) {
                await this.callbackIdsToRequest(Array.from(this.missingIds));
            }
            return;
        }
        // out of order id, should never happen
        if(id < this.lastId) {
            this.cleanIdArrived(id);
            return; 
        }

    }

    private cleanIdArrived(id: IdType): void {
        if(!this.missingIds.has(id))
            throw new Error(`ID: ${id}, is not missing`);
        this.missingIds.delete(id);
    }

    async idsToRequest(): Promise<IdType[]> {
        return Array.from(this.missingIds).sort((a, b) => a - b);
    }

    async setCallbackIdsToRequest(callback: CallbackIdsToRequest): Promise<void> {
        this.callbackIdsToRequest = callback;
    }

    async clear(): Promise<void> {
        this.missingIds.clear();
    }

    async destroy(): Promise<void> {
        this.missingIds.clear();
    }

    async saveState(): Promise<void> {
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

    public async loadState(): Promise<void> {
        // Load missing IDs
        const missingIdsData = await this.db.retrieve({
            id: 'message_control_state',
            collection: this.collection
        });
        
        if (missingIdsData && missingIdsData.item) {
            const data = missingIdsData.item as MessageControlData;
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
            const data = lastIdData.item as { last_id: IdType | null };
            this.lastId = data.last_id;
        }
    }
}