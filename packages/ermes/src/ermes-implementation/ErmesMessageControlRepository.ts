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

    idArrived(id: IdType) {
        // if i do not have last id i take it
        if(this.lastId === null) {
            this.handleInitialId(id);
            return;
        }
        // correct order, so ok
        if(id === this.lastId + 1) {
            this.lastId = id;
            return;
        }
        // i have a gap
        if(id > this.lastId + 1) {
            this.handleSequenceGap(id);
            return;
        }
        // out of order id, should never happen
        if(id < this.lastId) {
            this.cleanIdArrived(id);
        }
    }

    private handleInitialId(id: IdType): void {
        this.lastId = id;
        // If first ID is not 1, add missing IDs 1 to id-1
        if (id > 1) {
            for (let i = 1; i < id; i++) {
                this.missingIds.add(i);
            }
            this.notifyMissingIds();
        }
    }

    private handleSequenceGap(id: IdType): void {
        if (this.lastId === null) {
            // This should never happen based on our logic, but handle it anyway
            this.handleInitialId(id);
            return;
        }
        
        for (let i = this.lastId + 1; i < id; i++) {
            this.missingIds.add(i);
        }
        this.lastId = id;
        this.notifyMissingIds();
    }

    private notifyMissingIds(): void {
        if (this.callbackIdsToRequest !== undefined) {
            this.callbackIdsToRequest(Array.from(this.missingIds));
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

    numberOfMissingIds(): number {
        return this.missingIds.size;
    }

    setCallbackIdsToRequest(callback: CallbackIdsToRequest): void {
        this.callbackIdsToRequest = callback;
    }

    async clear(): Promise<void> {
        this.missingIds.clear();
    }

    async destroy(): Promise<void> {
        this.missingIds.clear();
    }

    async saveState(): Promise<void> {
        console.log('SaveState: Saving missing IDs:', Array.from(this.missingIds), 'lastId:', this.lastId, 'to collection:', this.collection);
        
        await this.db.createOrUpdate({
            id: 'message_control_state',
            collection: this.collection,
            item: {
                missing_ids: Array.from(this.missingIds),
                timestamp: Date.now(),
            },
        });
        await this.db.createOrUpdate({
            id: 'message_control_state_last_id',
            collection: this.collection,
            item: {
                last_id: this.lastId
            },
        });
        
        console.log('SaveState: State saved successfully');
    }

    public async loadState(): Promise<void> {
        console.log('LoadState: Loading from collection:', this.collection);
        
        // Load missing IDs
        const missingIdsData = await this.db.retrieve({
            id: 'message_control_state',
            collection: this.collection
        });
        
        console.log('LoadState: Retrieved missing IDs data:', missingIdsData);
        
        if (missingIdsData && missingIdsData.item) {
            const data = missingIdsData.item as MessageControlData;
            if (data.missing_ids && Array.isArray(data.missing_ids)) {
                // Convert array back to Set
                this.missingIds = new Set(data.missing_ids);
                console.log('LoadState: Loaded missing IDs:', Array.from(this.missingIds));
            }
        }
        
        // Load last ID
        const lastIdData = await this.db.retrieve({
            id: 'message_control_state_last_id',
            collection: this.collection
        });
        
        console.log('LoadState: Retrieved last ID data:', lastIdData);
        
        if (lastIdData && lastIdData.item) {
            const data = lastIdData.item as { last_id: IdType | null };
            this.lastId = data.last_id;
            console.log('LoadState: Loaded last ID:', this.lastId);
        }
    }
}