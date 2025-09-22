import { MessageType } from "ermes-types";
import { IErmesStorageRepository, IErmesStorageService } from "iermes/index";
import { ClientWorkDB } from "workdb/ClientWorkDB";
/**
 * Creates a storage repository with the specified database and collection
 */
export declare function createErmesStorageRepository<T extends MessageType>(db: ClientWorkDB, collection?: string): IErmesStorageRepository<T>;
/**
 * Creates a storage service with the specified repository
 */
export declare function createErmesStorageService<T extends MessageType>(repo: IErmesStorageRepository<T>): IErmesStorageService<T>;
