import { IdAccountType, IErmesSignalingHandler, IErmesSignalingRepository, IErmesSignalingServer, OnSignalCallback, SignalType } from "iermes/index";
import { PeerType } from "src/ermes-implementation/IceProtocol/SignalManager.js";
/*! $RESERVED$ */
export declare const DISCONNECTED_FLAG = "DISCONNECTED";
export declare class ErmesSignalingRepository implements IErmesSignalingRepository<SignalType> {
    private signalingServer;
    private signalHandler;
    private onAnswerCallback?;
    constructor(signalingServer: IErmesSignalingServer, signalHandler: IErmesSignalingHandler<PeerType>);
    isConnected(): Promise<boolean>;
    destroy(): Promise<void>;
    getIdAccount(): Promise<string>;
    sendSignal(to: IdAccountType): Promise<void>;
    getSignal(from: string): Promise<SignalType>;
    getSignalOwner(): Promise<SignalType>;
    private onSignalPrivate;
    onSignal(callback: OnSignalCallback<string>): Promise<void>;
    compareSignalMessage(signal_1: SignalType, signal_2: SignalType): boolean;
    static compareSignalMessage(signal_1: SignalType, signal_2: SignalType): boolean;
    removeAllListeners(): void;
}
