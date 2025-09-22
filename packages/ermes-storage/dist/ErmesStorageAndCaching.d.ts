import { IdType, MessageType } from "ermes-types";
import { IErmesCachingService, IErmesStorageAndCaching, IErmesStorageService } from "iermes/index";
type IErmesCachingServiceOptions = {
    maxNumberOfElementCached?: number;
};
export declare class ErmesStorageAndCaching<DataJson extends MessageType> implements IErmesStorageAndCaching<DataJson> {
    storage: IErmesStorageService<DataJson>;
    caching: IErmesCachingService<DataJson>;
    opts: IErmesCachingServiceOptions;
    constructor(storage: IErmesStorageService<DataJson>, caching: IErmesCachingService<DataJson>, opts: IErmesCachingServiceOptions);
    flush(): Promise<void>;
    store(data: DataJson): Promise<void>;
    retrieve(id: IdType): Promise<DataJson | undefined>;
    delete(id: IdType): Promise<boolean>;
    clear(): Promise<void>;
    numberOfElements(): number;
    listOfIds(): Promise<IdType[]>;
    destroy(): Promise<void>;
}
export {};
