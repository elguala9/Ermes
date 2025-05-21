import { IdType, MessageType } from "ermes-types";
import { IErmesStorageRepository, IErmesStorageService } from "iermes/index";
export declare class ErmesStorageService<DataJson extends MessageType> implements IErmesStorageService<DataJson> {
    private repo;
    constructor(repo: IErmesStorageRepository<DataJson>);
    destroy(): Promise<void>;
    clear(): Promise<void>;
    numberOfElements(): number;
    listOfIds(): Promise<IdType[]>;
    store(data: DataJson): Promise<void>;
    retrieve(id: IdType): Promise<DataJson | undefined>;
    delete(id: IdType): Promise<void>;
}
