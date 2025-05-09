import { testCachingService } from "test-ermes"
import { ErmesCachingRepository, ErmesCachingService } from "ermes-storage/index"

let repo = new ErmesCachingRepository(1000);
let service = new ErmesCachingService(repo);

testCachingService(service);