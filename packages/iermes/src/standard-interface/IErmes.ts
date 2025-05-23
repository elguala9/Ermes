import { CallbackOnDataRepository, CallbackOnMessageSended, CallbackOnMessageSending, CallbackOnMessageService, SerializableDataType, TypeOfData } from "ermes-types";



export interface CallbackFunction {
    // false -> problems
    (): boolean;
}





     
/**
 * implementation of the ermes protocol
 */
export interface IErmesPrivate {
    /**
     * true if the connection has been closed
     */
    isClose(): boolean

}


/**
 * implementation of the ermes protocol
 */
export interface IErmesRepository extends IErmesPrivate {
    /**
     * send data
     * @param data the data that will be sedn over webrtc
     */
    send(data: SerializableDataType): void;

    /**
     * callbak on 'data'
     * @param callback callback that will be called when the data arrives
     */
    onMessage(callback: CallbackOnDataRepository): void

    /**
     * close the connection with the other peer
     * @param force flush before close -> force == false
     */
    destroy(force: boolean): void;
}



/**
 * handler of the repository
 */
export interface IErmesService extends IErmesPrivate  {
 
    /**
     * on message arrivede call the callback
     * @param messageCallback the callback 
     */
    onMessage(callback: CallbackOnMessageService): void
    /**
     * the message that the service is sending
     * @param callback the callback called
     */
    onMessageSending(callback: CallbackOnMessageSending): void
    /**
     * the message that the service sended (not confirmed if arrived)
     * @param callback the callback called
     */
    onMessageSended(callback: CallbackOnMessageSended): void
    /**
     * send data
     * @param data the data that will be send over webrtc
    */
    send(message: TypeOfData): void;

    /**
     * close the connection
     */
    close(): void;

    /**
     * change the repo, this will retain all the information in the service
     * @param repository new repository that the service is going to use
     */
    setRepository(repository: IErmesRepository): void;
}



