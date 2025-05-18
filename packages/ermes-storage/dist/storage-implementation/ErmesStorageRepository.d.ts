import { IdType, MessageType } from "ermes-types";
import { IErmesStorageRepository } from "iermes/index";
export declare class ErmesStorageRepository<DataJson extends MessageType> implements IErmesStorageRepository<DataJson> {
    private _db;
    private _idStorage;
    private _numberOfElements;
    constructor(idStorage: string);
    private createDb;
    clear(): Promise<void>;
    numberOfElements(): number;
    listOfIds(): Promise<IdType[]>;
    store(dataJson: DataJson): Promise<void>;
    retrieve(id: IdType): Promise<DataJson | undefined>;
    private retrievePrivate;
    private retrievePrivateSafe;
    private retrievePrivateString;
    private retrievePrivateStringSafe;
    delete(id: IdType): Promise<void>;
}
