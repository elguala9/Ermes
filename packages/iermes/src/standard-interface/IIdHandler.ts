import { IdType } from "ermes-types"
import { CallbackOnMessage, IErmesRepository } from "./IErmes.js";
import { IErmesWebRtcRepository } from "./IErmesWebRtc.js";

/**
 * interface used to create Ids for the messages
 */
export interface IIdHandlerPrivate{
    /**
     * function that return a unique id every time that it is called, the id should be progressive
     */
    getNewId(): IdType
    /**
     * reset the counter of the messages
     */
    reset(): void
}

/**
 * interface used to create Ids for the messages
 */
export interface IIdHandlerRepository extends IIdHandlerPrivate{
    /**
     * set the counter from the generation need to began
     * @param counter the starting point of the counter
     */
    setCounter(counter: IdType): void

    getCurrent(): IdType;
}

/**
 * interface used to create Ids for the messages
 */
export interface IIdHandlerService extends IIdHandlerPrivate{
}


