

export type SerializableDataType = ArrayBuffer;

export interface CallbackFunction {
    // false -> problems
    (): boolean;
}


export type CallbackOnData = (data: SerializableDataType) => void;
export type CallbackOnMessage = (obj: Uint8Array) => void;


     
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
    onMessage(callback: CallbackOnData): void

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
     * on message arrived call the function in input
     * @param messageCallback the callback 
     */
    onMessage(messageCallback: CallbackOnMessage): void
     /**
     * send data
     * @param data the data that will be send over webrtc
     */
    send(message: Uint8Array): void;

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



