import { IdType } from "ermes-types";


export type CallbackIdsToRequest = (ids: IdType[]) => Promise<void>;
     
/**
 * parts of the ermes protocol that handle the ids of message arriving
 * it is needed to understand which messages need to be asked retransmitted from the other client
 */
export interface IErmesMessageControlPrivate {
    /**
     * true if the connection has been closed
     */
    idArrived(id: IdType): Promise<void>

    /**
     * request the ids of the messages that are missing
     * @returns the ids of the messages that are missing
     */
    idsToRequest(): Promise<IdType[]>


    setCallbackIdsToRequest(callback: CallbackIdsToRequest): void

    clear(): Promise<void>

    destroy(): Promise<void>;
}


     
/**
 * parts of the ermes protocol that handle the ids of message arriving
 * it is needed to understand which messages need to be asked retransmitted from the other client
 */
export interface IErmesMessageControlRepository extends IErmesMessageControlPrivate {

    saveState(): Promise<void>;
}



     
/**
 * parts of the ermes protocol that handle the ids of message arriving
 * it is needed to understand which messages need to be asked retransmitted from the other client
 */
export interface IErmesMessageControlService extends IErmesMessageControlPrivate  {

}



