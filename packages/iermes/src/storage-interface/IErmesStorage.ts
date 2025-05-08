import { MessageType } from "ermes-types";
import { IErmesStorageAndCaching } from "./IErmesStorageReserved.js";

/**
 * repository that handle the storage of the messages, both arrived and sent
 */
export interface IErmesStorageRepository<
  DataJson extends MessageType
> extends IErmesStorageAndCaching<DataJson>{

}
/**
 * service that handle the storage of the messages, both arrived and sent
 */
export interface IErmesStorageService<
  DataJson extends MessageType>
  extends IErmesStorageRepository<DataJson>{

}