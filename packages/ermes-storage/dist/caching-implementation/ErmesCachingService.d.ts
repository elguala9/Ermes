import { IdType, MessageType } from "ermes-types";
import { IErmesCachingRepository, IErmesCachingService } from "iermes/index";
export declare class ErmesCachingService<DataJson extends MessageType> implements IErmesCachingService<DataJson> {
    private _repo;
    constructor(repo: IErmesCachingRepository<DataJson>);
    destroy(): Promise<void>;
    clear(): Promise<void>;
    numberOfElements(): number;
    listOfIds(): Promise<IdType[]>;
    store(data: DataJson): Promise<void>;
    retrieve(id: IdType): Promise<DataJson | undefined>;
    delete(id: IdType): Promise<void>;
}
