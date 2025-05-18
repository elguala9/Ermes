import { testCachingService } from "test-ermes"
import { ErmesCachingRepository } from "ermes-storage/caching-implementation/ErmesCachingRepository"
import { ErmesCachingService } from "ermes-storage/caching-implementation/ErmesCachingService"

let repo = new ErmesCachingRepository(1000);
let service = new ErmesCachingService(repo);

testCachingService(service);