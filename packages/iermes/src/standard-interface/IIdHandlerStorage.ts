import { IdType } from "ermes-types";


/**
 * interface used to create Ids for the messages
 */
interface IIdHandlerStoragePrivate {
    /**
     * updating the id
     */
    update(id: IdType): Promise<void>;
    /**
     * save the current id on a permanent memory
    */
    save(): void;
    /**
     * close the storage
    */
    close(): void;
    /**
     * destroy the storage
    */
    destroy(): void;
}

/**
 * interface used to create Ids for the messages
 */
export interface IIdHandlerStorageRepository extends IIdHandlerStoragePrivate {
}

/**
 * interface used to create Ids for the messages
 */
export interface IIdHandlerStorageService extends IIdHandlerStoragePrivate {

}



