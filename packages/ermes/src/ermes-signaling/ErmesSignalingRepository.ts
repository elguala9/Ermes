import { IdAccountType, IErmesSignalingHandler, IErmesSignalingRepository, IErmesSignalingServer, IErmesWebRtcService, OnSignalCallback, SignalType } from "iermes/index";
import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";
import { CallbackSignalInput, OutputStruct } from "signaling-sdk/Types";
/*! $RESERVED$ */

export const DISCONNECTED_FLAG = "DISCONNECTED";

export class ErmesSignalingRepository implements IErmesSignalingRepository<SignalType> {
    private onAnswerCallback?: OnSignalCallback<SignalType>

    constructor(private signalingServer: IErmesSignalingServer, private signalHandler: IErmesSignalingHandler) {
        this.signalingServer.onSignal(this.onSignalPrivate);
    }

    async connect(): Promise<void> {
        await this.signalingServer.connect();
    }

    async disconnect(): Promise<void> {
        await this.signalingServer.disconnect();
    }

    getIdAccount(): Promise<string> {
        return this.signalingServer.getIdAccount();
    }

    async pingServer(): Promise<boolean> {
        // this.signalingServer. DA FARE IL PING
        return true; 
    }

    async sendSignal(to: IdAccountType): Promise<void> {
        let signal = await this.signalHandler.createSignal();
        await this.signalingServer.setSignal(to, signal);
    }

    async getSignal(from: string): Promise<SignalType> {
        return this.signalingServer.getSignal(from);
    }

    async getSignalOwner(): Promise<SignalType> {
        return this.signalHandler.createSignal();
    }

    private async onSignalPrivate(input: SignalType): Promise<void> {
        if(this.onAnswerCallback === undefined) 
            return;
        this.onAnswerCallback(input)
        return;
    }

    async onSignal(callback: OnSignalCallback<string>): Promise<void> {
        this.onAnswerCallback = callback;
        return;
    }

    compareSignalMessage(signal_1: SignalType, signal_2: SignalType): boolean {
        return ErmesSignalingRepository.compareSignalMessage(signal_1, signal_2);
    }

    static compareSignalMessage(signal_1: SignalType, signal_2: SignalType): boolean {
        return signal_1 === signal_2;
    }

    removeAllListeners(): void {
        this.signalingServer.removeAllListeners();
        this.onAnswerCallback = undefined;
    }
}