import { IErmesService } from "src/standard-interface/IErmes.js";
export type IdAccountType = string;
export type OnSignalCreateSocketCallbackInput = {
    peer: IdAccountType;
    ermesService: IErmesService;
};
export type OnSignalCreateSocketCallback = (input: OnSignalCreateSocketCallbackInput) => void;
export type OnSignalCallback<SignalMessageType> = (input: SignalMessageType) => void;
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
    /**
     * Retrive the signal of the account owner
    */
    getSignalOwner(): Promise<SignalMessageType>;
    /**
     * true if the two paraemters are the same signal
     * @param signal_1
     * @param signal_2
     */
    compareSignalMessage(signal_1: SignalMessageType, signal_2: SignalMessageType): boolean;
}
export interface IErmesSignalingService extends IErmesSignalingPrivate {
    /**
     * create a ErmesService for comunicate with the account
     * @param of ID of the account to retrive the connection
     */
    getErmes(of: IdAccountType): Promise<IErmesService>;
    /**
     * Retrive the signal from the other peers and create the socket for comunication
    * @param callback function to call when a signal is received
    */
    onSignal(callback: OnSignalCreateSocketCallback): Promise<void>;
}
export {};
