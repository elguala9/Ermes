export type AccountType = string;
export type OnSignalCallback<Socket> = (peer: AccountType, socket: Socket) => void;
interface ISignalingPrivate<SignalMessage, SocketType> {
    /**
     *
     * @param account
     */
    connect(account: AccountType): Promise<void>;
    /**
     * Disconnect from the signal server
     */
    disconnect(): Promise<void>;
    /**
     * true if the server is online
     */
    pingServer(): Promise<boolean>;
    /**
     * Send a signal to the other peer
     * @param to ID of destinatary
     * @param signal signal
    */
    sendSignal(to: AccountType, signal: SignalMessage): Promise<void>;
    /**
     * Retrive the signal from the other peer
     * @param from account of the peer
    */
    getSignal(from: AccountType): Promise<SignalMessage>;
    /**
     * Retrive the signal from the other peer
     * @param from account of the peer
    */
    onSignal(callback: OnSignalCallback<SocketType>): void;
    removeAllListeners(): void;
}
export interface ISignalingService<SignalMessage, SocketType> extends ISignalingPrivate<SignalMessage, SocketType> {
}
export interface ISignalingRepository<SignalMessage, SocketType> extends ISignalingPrivate<SignalMessage, SocketType> {
}
export {};
