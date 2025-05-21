import { IdType } from "ermes-types";
/**
 * interface used to create Ids for the messages
 */
interface IIdHandlerPrivate {
    /**
     * function that return a unique id every time that it is called, the id should be progressive
     */
    getNewId(): IdType;
    /**
     * reset the counter of the messages
     */
    reset(): void;
}
/**
 * interface used to create Ids for the messages
 */
export interface IIdHandlerRepository extends IIdHandlerPrivate {
    /**
     * set the counter from the generation need to began
     * @param counter the starting point of the counter
     */
    setCounter(counter: IdType): void;
}
/**
 * interface used to create Ids for the messages
 */
export interface IIdHandlerService extends IIdHandlerPrivate {
}

/**
 * interface used to create Ids for the messages
 */
interface IIdHandlerStoragePrivate {
    /**
     * updating the id
     */
    update(id: IdType): Promise<IdType>;
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
