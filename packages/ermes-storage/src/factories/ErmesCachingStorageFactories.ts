
import { MessageType } from "ermes-types";
import { IErmesStorageAndCaching } from "iermes/index";
import { ClientWorkDB } from "workdb/ClientWorkDB";
import { ErmesCachingRepository } from "../caching-implementation/ErmesCachingRepository.js";
import { ErmesCachingService } from "../caching-implementation/ErmesCachingService.js";
import { ErmesStorageAndCaching } from "../ErmesStorageAndCaching.js";
import { createErmesStorageRepository, createErmesStorageService } from "./ErmesStorageFactories.js";

/**
 * Creates a combined storage and caching system
 */
export function createErmesStorageAndCaching<T extends MessageType>(
  db: ClientWorkDB,
  options?: {
    collection?: string;
    maxNumberOfElementCached?: number;
    cachingMode?: "lifo" | "fifo";
  }
): IErmesStorageAndCaching<T> {
  const {
    collection = "ermes_messages",
    maxNumberOfElementCached = 100,
    cachingMode = "fifo"
  } = options || {};

  // Create storage repository and service
  const storageRepo = createErmesStorageRepository<T>(db, collection);
  const storageService = createErmesStorageService<T>(storageRepo);

  // Create caching repository and service
  const cachingRepo = new ErmesCachingRepository<T>(maxNumberOfElementCached);
  const cachingService = new ErmesCachingService<T>(cachingRepo);

  // Create and return the combined storage and caching system
  return new ErmesStorageAndCaching<T>(
    storageService,
    cachingService,
    { maxNumberOfElementCached, cachingMode }
  );
}
