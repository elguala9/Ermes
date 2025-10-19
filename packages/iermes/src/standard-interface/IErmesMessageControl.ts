import { IdType } from "ermes-types";


export type CallbackIdsToRequest = (ids: IdType[]) => Promise<void>;
     
/**
 * parts of the ermes protocol that handle the ids of message arriving
 * it is needed to understand which messages need to be asked retransmitted from the other client
 */
export interface IErmesMessageControlPrivate {
    /**
     * store the id that arrived
     */
    idArrived(id: IdType): void

    /**
     * request the ids of the messages that are missing
     * @returns the ids of the messages that are missing
     */
    idsToRequest(): Promise<IdType[]>

    numberOfMissingIds(): number;


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



