import { MessageType } from "ermes-types";
import { IErmesStorageAndCachingReserved } from "./IErmesStorageReserved.js";
/*! $RESERVED$ */
/**
 * repository that avoid source code duplication
 */
export interface IErmesStorageAndCaching<DataJson extends MessageType> extends IErmesStorageAndCachingReserved<DataJson> {
    flush(): Promise<void>;
}
