import type { MessageData } from "ermes-types";
import { IErmesService, IErmesStorageService } from "iermes/index";
export declare function testErmesMessagingFailure(f: () => Promise<{
    service_1: IErmesService;
    service_2: IErmesService;
    storageService_1: IErmesStorageService<MessageData>;
}>): void;
