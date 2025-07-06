import { IdAccountType, IErmesSignalingRepository, IErmesWebRtcService, OnSignalCallback } from "iermes/index";
import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";
import { CallbackSignalInput, OutputStruct } from "signaling-sdk/Types";

export const DISCONNECTED_FLAG = "DISCONNECTED";

export class ErmesSignalingRepository implements IErmesSignalingRepository<OutputStruct> {
    private signaling: ISignalingSdk;
    private webRtc: IErmesWebRtcService;
    private onAnswerCallback?: OnSignalCallback<OutputStruct>

    constructor(signaling: ISignalingSdk, webRtc: IErmesWebRtcService) {
        this.signaling = signaling;
        this.webRtc = webRtc;
        this.signaling.onAnswer(this.onAnswer);
    }

    async connect(): Promise<void> {
        let offer = await this.webRtc.createSignalString()
        await this.signaling.setOffer(offer);
    }

    async disconnect(): Promise<void> {
        await this.signaling.setOffer(DISCONNECTED_FLAG);
    }

    getIdAccount(): Promise<string> {
        return this.signaling.getAddressUser();
    }

    async pingServer(): Promise<boolean> {
        // this.signaling. DA FARE IL PING
        return true; 
    }

    async sendSignal(to: IdAccountType): Promise<void> {
        let offer = await this.signaling.getOffer(to);
        this.webRtc.setSignal(offer.signal);
        let answer = await this.webRtc.createSignalString();
        await this.signaling.setAnswer(answer ,to);
    }

    getSignal(from: string): Promise<OutputStruct> {
        return this.signaling.getOffer(from);
    }

    async getSignalOwner(): Promise<OutputStruct> {
        let signal = await this.webRtc.createSignalString()
        return {
            signal: signal,
            creationTime_EpochInSeconds: "",
        }
    }

    private async onAnswer(input: CallbackSignalInput): Promise<void> {
        if(this.onAnswerCallback === undefined) 
            return;
        this.onAnswerCallback({
            peer: input.answerer,
            signal: input.outputStruct
        })
        return;
    }

    async onSignal(callback: OnSignalCallback<OutputStruct>): Promise<void> {
        this.onAnswerCallback = callback;
        return;
    }

    compareSignalMessage(signal_1: OutputStruct, signal_2: OutputStruct): boolean {
        return ErmesSignalingRepository.compareSignalMessage(signal_1, signal_2);
    }

    static compareSignalMessage(signal_1: OutputStruct, signal_2: OutputStruct): boolean {
        return signal_1.signal === signal_2.signal;
    }

    removeAllListeners(): void {
        this.signaling.removeAllListeners();
        this.onAnswerCallback = undefined;
    }
}