
import { MessageType } from "ermes-types";
import { IErmesCachingRepository, IErmesCachingService } from "iermes/index";
import { ErmesCachingRepository } from "../caching-implementation/ErmesCachingRepository.js";
import { ErmesCachingService } from "../caching-implementation/ErmesCachingService.js";

/**
 * Creates a caching repository with the specified maximum buffer size
 */
export function createErmesCachingRepository<T extends MessageType>(
  maxBuffer: number = 1000
): IErmesCachingRepository<T> {
  return new ErmesCachingRepository<T>(maxBuffer);
}

/**
 * Creates a caching service with the specified repository or creates a default one
 */
export function createErmesCachingService<T extends MessageType>(
  repo?: IErmesCachingRepository<T>,
  maxBuffer: number = 1000
): IErmesCachingService<T> {
  const repository = repo || createErmesCachingRepository<T>(maxBuffer);
  return new ErmesCachingService<T>(repository);
}

