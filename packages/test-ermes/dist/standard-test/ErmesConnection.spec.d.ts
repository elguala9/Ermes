import { IErmesService } from "iermes/index";
export declare function testErmesServiceConnection(f: () => Promise<{
    service_1: IErmesService;
    service_2: IErmesService;
}>): void;
/**
 *
 * @param service this service should not be connected to any peer
 */
export declare function testErmesServiceAbsentConnection(service: IErmesService): void;
