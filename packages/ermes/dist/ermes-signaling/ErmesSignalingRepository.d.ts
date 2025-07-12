import { IdAccountType, IErmesSignalingHandler, IErmesSignalingRepository, IErmesSignalingServer, OnSignalCallback, SignalType } from "iermes/index";
/*! $RESERVED$ */
export declare const DISCONNECTED_FLAG = "DISCONNECTED";
export declare class ErmesSignalingRepository implements IErmesSignalingRepository<SignalType> {
    private signalingServer;
    private signalHandler;
    private onAnswerCallback?;
    constructor(signalingServer: IErmesSignalingServer, signalHandler: IErmesSignalingHandler);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getIdAccount(): Promise<string>;
    pingServer(): Promise<boolean>;
    sendSignal(to: IdAccountType): Promise<void>;
    getSignal(from: string): Promise<SignalType>;
    getSignalOwner(): Promise<SignalType>;
    private onSignalPrivate;
    onSignal(callback: OnSignalCallback<string>): Promise<void>;
    compareSignalMessage(signal_1: SignalType, signal_2: SignalType): boolean;
    static compareSignalMessage(signal_1: SignalType, signal_2: SignalType): boolean;
    removeAllListeners(): void;
}
