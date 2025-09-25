import { MessageType } from "ermes-types";
import { IErmesCachingRepository, IErmesCachingService } from "iermes/index";
/**
 * Creates a caching repository with the specified maximum buffer size
 */
export declare function createErmesCachingRepository<T extends MessageType>(maxBuffer?: number): IErmesCachingRepository<T>;
/**
 * Creates a caching service with the specified repository or creates a default one
 */
export declare function createErmesCachingService<T extends MessageType>(repo?: IErmesCachingRepository<T>, maxBuffer?: number): IErmesCachingService<T>;
