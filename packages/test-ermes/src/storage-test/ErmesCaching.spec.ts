import { IErmesCachingService } from "iermes/index";
import { testService } from "./ErmesCachingStorage.spec.js";

export function testCachingService(cachingService: IErmesCachingService<any>) {

    describe('IErmesCachingService Tests', () => {
        testService(cachingService);

       
    });
}
