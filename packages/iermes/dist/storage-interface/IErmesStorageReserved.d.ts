import { IdType, MessageType } from "ermes-types";
/**
 * repository that avoid source code duplication
 */
export interface IErmesStorageAndCaching<DataJson extends MessageType> {
    store(data: DataJson): Promise<void>;
    retrieve(id: IdType): Promise<DataJson>;
    delete(id: IdType): Promise<void>;
    clear(): Promise<void>;
    numberOfElements(): number;
    listOfIds(): Promise<IdType[]>;
}
