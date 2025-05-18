import { IErmesStorageService } from "iermes/index";
import { testService } from "./ErmesCachingStorage.spec.js";

export function testStorageService(storageService: IErmesStorageService<any>) {

    describe('IErmeStorageService Tests', () => {

        testService(storageService);



    });
}
