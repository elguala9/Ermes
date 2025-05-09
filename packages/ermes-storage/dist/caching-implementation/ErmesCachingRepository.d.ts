import { IdType, MessageType } from "ermes-types";
import { IErmesCachingRepository } from "iermes/index";
/**
 * In‐memory repository con capacità massima (FIFO eviction).
 */
export declare class ErmesCachingRepository<D extends MessageType> implements IErmesCachingRepository<D> {
    private maxBuffer;
    private buffer;
    constructor(maxBuffer: number);
    clear(): Promise<void>;
    numberOfElements(): number;
    listOfIds(): Promise<IdType[]>;
    store(data: D): Promise<void>;
    retrieve(id: IdType): Promise<D | undefined>;
    delete(id: IdType): Promise<void>;
}
