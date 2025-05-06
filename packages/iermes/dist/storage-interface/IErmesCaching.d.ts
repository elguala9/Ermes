import { MessageType } from "ermes-types";
/**
 * repository that handle the caching of the messages, both arrived and sent
 */
export interface IErmesCachingRepository<DataJson extends MessageType, IdType> {
    store(data: DataJson): Promise<void>;
    retrieve(id: IdType): Promise<DataJson | undefined>;
    delete(id: IdType): Promise<void>;
}
/**
 * service that handle the caching of the messages, both arrived and sent
 */
export interface IErmesCachingService<DataJson extends MessageType, IdType> extends IErmesCachingRepository<DataJson, IdType> {
}
