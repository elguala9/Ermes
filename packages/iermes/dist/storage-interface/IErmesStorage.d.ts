import { MessageType } from "ermes-types";
/**
 * repository that handle the storage of the messages, both arrived and sent
 */
export interface IErmesStorageRepository<DataJson extends MessageType, IdType> {
    store(data: DataJson): Promise<void>;
    retrieve(id: IdType): Promise<DataJson>;
    delete(id: IdType): Promise<void>;
}
/**
 * service that handle the storage of the messages, both arrived and sent
 */
export interface IErmesStorageService<DataJson extends MessageType, IdType> extends IErmesStorageRepository<DataJson, IdType> {
}
