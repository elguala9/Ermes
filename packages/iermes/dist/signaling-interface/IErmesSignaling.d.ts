import { IErmesService } from "src/standard-interface/IErmes.js";
export type IdAccountType = string;
export type OnSignalCreateSocketCallbackIpnut = {
    peer: IdAccountType;
    ermesService: IErmesService;
};
export type OnSignalCreateSocketCallback = (input: OnSignalCreateSocketCallback) => void;
export type OnSignalCallbackInput<SignalMessageType> = {
    peer: IdAccountType;
    signal: SignalMessageType;
};
export type OnSignalCallback<SignalMessageType> = (input: OnSignalCallbackInput<SignalMessageType>) => void;
interface IErmesSignalingPrivate {
    /**
     * connect the server
    */
    connect(): Promise<void>;
    /**
     * Disconnect from the signal server
     */
    disconnect(): Promise<void>;
    /**
     *
     * retrive the id account active in the istance
     */
    getIdAccount(): Promise<IdAccountType>;
    /**
     * true if the server is online
     */
    pingServer(): Promise<boolean>;
    /**
     * Send a signal to the other peer
     * @param to ID of destinatary
     * @param signal signal
    */
    sendSignal(to: IdAccountType): Promise<void>;
    removeAllListeners(): void;
}
export interface IErmesSignalingRepository<SignalMessageType> extends IErmesSignalingPrivate {
    /**
     * Retrive the signal from the other peers and create the socket for comunication
    * @param callback function to call when a signal is received
    */
    onSignal(callback: OnSignalCallback<SignalMessageType>): Promise<void>;
    /**
     * Retrive the last signal from the other peer
     * @param from account of the peer
    */
    getSignal(from: IdAccountType): Promise<SignalMessageType>;
}
export interface IErmesSignalingService extends IErmesSignalingPrivate {
    /**
     * Retrive the signal from the other peers and create the socket for comunication
    * @param callback function to call when a signal is received
    */
    onSignal(callback: OnSignalCreateSocketCallback): Promise<void>;
}
export {};
