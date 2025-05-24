import { testCachingService, testIIdHandler } from "test-ermes"
import { ErmesCachingRepository } from "ermes-storage/caching-implementation/ErmesCachingRepository"
import { ErmesCachingService } from "ermes-storage/caching-implementation/ErmesCachingService"
import { IdHandlerRepository, IdHandlerService } from "../../ermes/dist";

let max = 100;
let start = 0;

let repo = new IdHandlerRepository({max, start});
let service = new IdHandlerService({repo});

testIIdHandler(service, max, start);