import { IdType, MessageType } from "ermes-types";
import { IErmesCachingService, IErmesStorageAndCaching, IErmesStorageService } from "iermes/index";
type ErmesCachingServiceOptionsInput = Partial<ErmesCachingServiceOptions>;
type ErmesCachingServiceOptions = {
    maxNumberOfElementCached: number;
    cachingMode: "lifo" | "fifo";
};
export declare class ErmesStorageAndCaching<DataJson extends MessageType> implements IErmesStorageAndCaching<DataJson> {
    storage: IErmesStorageService<DataJson>;
    caching: IErmesCachingService<DataJson>;
    opts: ErmesCachingServiceOptions;
    constructor(storage: IErmesStorageService<DataJson>, caching: IErmesCachingService<DataJson>, opts: ErmesCachingServiceOptionsInput);
    flush(): Promise<void>;
    private _storeInCache;
    private _evictAndStore;
    private _evictFifo;
    private _evictLifo;
    store(data: DataJson): Promise<void>;
    retrieve(id: IdType): Promise<DataJson | undefined>;
    delete(id: IdType): Promise<boolean>;
    clear(): Promise<void>;
    numberOfElements(): number;
    listOfIds(): Promise<IdType[]>;
    destroy(): Promise<void>;
}
export {};
