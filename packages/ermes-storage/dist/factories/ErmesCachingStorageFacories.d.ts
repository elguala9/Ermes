import { MessageType } from "ermes-types";
import { IErmesStorageAndCaching } from "iermes/index";
import { ClientWorkDB } from "workdb/ClientWorkDB";
/**
 * Creates a combined storage and caching system
 */
export declare function createErmesStorageAndCaching<T extends MessageType>(db: ClientWorkDB, options?: {
    collection?: string;
    maxNumberOfElementCached?: number;
    cachingMode?: "lifo" | "fifo";
}): IErmesStorageAndCaching<T>;
