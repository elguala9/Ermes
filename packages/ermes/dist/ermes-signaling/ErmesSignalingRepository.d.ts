import { IdAccountType, IErmesSignalingRepository, OnSignalCallback } from "iermes/index";
import { OutputStruct } from "signaling-sdk/Types";
/*! $RESERVED$ */
export declare const DISCONNECTED_FLAG = "DISCONNECTED";
export declare class ErmesSignalingRepository implements IErmesSignalingRepository<OutputStruct> {
    private signaling;
    private onAnswerCallback?;
    constructor(signaling: IErmesSignalingServer, singalHandler: IErmesSignalingHandler);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getIdAccount(): Promise<string>;
    pingServer(): Promise<boolean>;
    sendSignal(to: IdAccountType): Promise<void>;
    getSignal(from: string): Promise<OutputStruct>;
    getSignalOwner(): Promise<OutputStruct>;
    private onAnswer;
    onSignal(callback: OnSignalCallback<OutputStruct>): Promise<void>;
    compareSignalMessage(signal_1: OutputStruct, signal_2: OutputStruct): boolean;
    static compareSignalMessage(signal_1: OutputStruct, signal_2: OutputStruct): boolean;
    removeAllListeners(): void;
}
