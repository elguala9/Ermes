
import { MessageType } from "ermes-types";
import { IErmesStorageRepository, IErmesStorageService } from "iermes/index";
import { ClientWorkDB } from "workdb/ClientWorkDB";
import { ErmesStorageRepository } from "../storage-implementation/ErmesStorageRepository.js";
import { ErmesStorageService } from "../storage-implementation/ErmesStorageService.js";

/**
 * Creates a storage repository with the specified database and collection
 */
export function createErmesStorageRepository<T extends MessageType>(
  db: ClientWorkDB,
  collection: string = "ermes_messages"
): IErmesStorageRepository<T> {
  return new ErmesStorageRepository<T>(db, collection);
}

/**
 * Creates a storage service with the specified repository
 */
export function createErmesStorageService<T extends MessageType>(
  repo: IErmesStorageRepository<T>
): IErmesStorageService<T> {
  return new ErmesStorageService<T>(repo);
}
