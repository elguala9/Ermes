import { MessageType } from "ermes-types";
import { IErmesStorageAndCachingReserved } from "./IErmesStorageReserved.js";


/**
 * repository that handle the caching of the messages, both arrived and sent
 */
export interface IErmesCachingRepository<
    DataJson extends MessageType
    > extends IErmesStorageAndCachingReserved<DataJson>{
}

/**
 * service that handle the caching of the messages, both arrived and sent
 */
export interface IErmesCachingService<
    DataJson extends MessageType
    > extends IErmesCachingRepository<DataJson>{
}