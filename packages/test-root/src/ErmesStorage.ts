import { ErmesStorageRepository, ErmesStorageService, WorkDBFactory } from "ermes-storage/index";
import { testCachingService } from "test-ermes";



let repo = new ErmesStorageRepository(WorkDBFactory.forNode("./test-db"), 'messages');
let service = new ErmesStorageService(repo);

testCachingService(service);