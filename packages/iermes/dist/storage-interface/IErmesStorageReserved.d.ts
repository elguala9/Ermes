import { IdType, MessageType } from "ermes-types";
/*! $RESERVED$ */
/**
 * repository that avoid source code duplication
 */
export interface IErmesStorageAndCachingReserved<DataJson extends MessageType> {
    store(data: DataJson): Promise<void>;
    retrieve(id: IdType): Promise<DataJson | undefined>;
    /**
     *
     * @param id
     * @returns — true if an element existed and has been removed, or false if the element does not exist.
     */
    delete(id: IdType): Promise<boolean>;
    clear(): Promise<void>;
    numberOfElements(): number;
    listOfIds(): Promise<IdType[]>;
    destroy(): Promise<void>;
}
