import { IdType, MessageType } from "ermes-types";
import { IErmesStorageRepository } from "iermes/index";
import { ClientWorkDB } from "workdb/ClientWorkDB";
export declare class ErmesStorageRepository<DataJson extends MessageType> implements IErmesStorageRepository<DataJson> {
    private _db;
    private _numberOfElements;
    private _collection;
    constructor(db: ClientWorkDB, collection?: string);
    private _loadElementCount;
    store(data: DataJson): Promise<void>;
    retrieve(id: IdType): Promise<DataJson | undefined>;
    delete(id: IdType): Promise<void>;
    clear(): Promise<void>;
    numberOfElements(): number;
    listOfIds(): Promise<IdType[]>;
    destroy(): Promise<void>;
}
