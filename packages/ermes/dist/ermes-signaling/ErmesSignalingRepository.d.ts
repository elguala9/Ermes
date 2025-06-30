import { IdAccountType, IErmesSignalingRepository, IErmesWebRtcService, OnSignalCallback } from "iermes/index";
import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";
import { OutputStruct } from "signaling-sdk/Types";
export declare const DISCONNECTED_FLAG = "DISCONNECTED";
export declare class ErmesSignalingRepository implements IErmesSignalingRepository<OutputStruct> {
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
    private onAnswer;
    onSignal(callback: OnSignalCallback<OutputStruct>): Promise<void>;
    removeAllListeners(): void;
}
