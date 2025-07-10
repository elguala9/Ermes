import { IdAccountType, IErmesSignalingRepository, IErmesWebRtcService, OnSignalCallback } from "iermes/index";
import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";
import { OutputStruct } from "signaling-sdk/Types";
/*! $RESERVED$ */
export declare const DISCONNECTED_FLAG__ = "DISCONNECTED";
export declare class ErmesSignalingRepository__ implements IErmesSignalingRepository<OutputStruct> {
    private signaling;
    private webRtc;
    private onAnswerCallback?;
    constructor(signaling: ISignalingSdk, webRtc: IErmesWebRtcService);
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
