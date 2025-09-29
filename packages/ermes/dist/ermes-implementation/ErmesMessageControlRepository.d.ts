import { IdType } from "ermes-types";
import { CallbackIdsToRequest, IErmesMessageControlRepository } from "iermes/index";
import { ClientWorkDB } from "workdb/ClientWorkDB";
/**
 * Repository implementation of message control that handles ID tracking and gap detection
 * Provides persistent storage of received message IDs and detection of missing sequences
 */
export declare class ErmesMessageControlRepository implements IErmesMessageControlRepository {
    private readonly db;
    private readonly collection;
    private callbackIdsToRequest?;
    private missingIds;
    private lastId;
    constructor(db: ClientWorkDB, loadState: boolean);
    idArrived(id: IdType): Promise<void>;
    private cleanIdArrived;
    idsToRequest(): Promise<IdType[]>;
    setCallbackIdsToRequest(callback: CallbackIdsToRequest): Promise<void>;
    clear(): Promise<void>;
    destroy(): Promise<void>;
    saveState(): Promise<void>;
    loadState(): Promise<void>;
}
