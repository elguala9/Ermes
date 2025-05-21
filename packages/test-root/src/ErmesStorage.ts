import { ErmesStorageRepository, ErmesStorageService } from "ermes-storage/index";
import { testCachingService } from "test-ermes";

let repo = new ErmesStorageRepository("test-db");
let service = new ErmesStorageService(repo);

testCachingService(service);