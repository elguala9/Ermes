import { TypeOfDataExternal, CallbackOnDataArrived, CallbackOnDataRepository, CallbackOnMessageSended, CallbackOnMessageSending, SerializableDataType } from "ermes-types";
export interface CallbackFunction {
    (): boolean;
}
/**
 * implementation of the ermes protocol
 */
export interface IErmesPrivate {
    /**
     * true if the connection has been closed
     */
    isClosed(): boolean;
    /**
     * true if the connection is open
     */
    isConnected(): boolean;
    /**
     * wait for the connection of the peer
     */
    waitForConnect(): Promise<void>;
    /**
     * resolve when the connection is done
     * @param timeoutMs
     */
    waitForConnect(timeoutMs?: number): Promise<void>;
    /**
     * resolve when the connection is closed
     * @param timeoutMs
     */
    waitForClose(timeoutMs?: number): Promise<void>;
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
    onMessage(callback: CallbackOnDataRepository): void;
    /**
     * close the connection with the other peer
     * @param force flush before close -> force == false
     */
    destroy(force: boolean): void;
}
/**
 * handler of the repository
 */
export interface IErmesService extends IErmesPrivate {
    /**
     * on message arrived call the callback
     * @param messageCallback the callback
     */
    onMessage(callback: CallbackOnDataArrived): void;
    /**
     * the message that the service is sending
     * @param callback the callback called
     */
    onMessageSending(callback: CallbackOnMessageSending): void;
    /**
     * the message that the service sended (not confirmed if arrived)
     * @param callback the callback called
     */
    onMessageSended(callback: CallbackOnMessageSended): void;
    /**
     * send data
     * @param data the data that will be send over webrtc
    */
    send(message: TypeOfDataExternal): void;
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
