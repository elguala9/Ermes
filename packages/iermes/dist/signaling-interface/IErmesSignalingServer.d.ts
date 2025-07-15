import { IdAccountType } from "./IErmesSignaling.js";
export type SignalType = string;
/**
 * * Interface for a signaling server that allows setting and receiving signals.
 */
export interface IErmesSignalingServer {
    destroy(): Promise<void>;
    /**
     * the unique identifier of the user
     */
    getIdAccount(): Promise<IdAccountType>;
    /**
     * retrive the signal that was sent from another peer
     * @param from the account that sent the signal
     */
    getSignal(from: IdAccountType): Promise<SignalType>;
    /**
     *
     * @param signal signal to sent
     * @param to the account to which the signal is sent, if not specified the signal is available to all peers
     */
    setSignal(signal: SignalType, to?: IdAccountType): Promise<void>;
    /**
     * triggered when a signal regarding the peer is received
     * @param callback will be called when a signal is received
     * @param from filter the signal that are specifically sent from that peer to this peer
     */
    onSignal(callback: (data: SignalType) => void, from?: IdAccountType): void;
    onError(callback: (err: Error) => void): void;
    onClose(callback: () => void): void;
    removeAllListeners(): Promise<void>;
    isConnected(): Promise<boolean>;
}
