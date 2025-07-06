export const DISCONNECTED_FLAG = "DISCONNECTED";
export class ErmesSignalingRepository {
    constructor(signaling, webRtc) {
        this.signaling = signaling;
        this.webRtc = webRtc;
        this.signaling.onAnswer(this.onAnswer);
    }
    async connect() {
        let offer = await this.webRtc.createSignalString();
        await this.signaling.setOffer(offer);
    }
    async disconnect() {
        await this.signaling.setOffer(DISCONNECTED_FLAG);
    }
    getIdAccount() {
        return this.signaling.getAddressUser();
    }
    async pingServer() {
        // this.signaling. DA FARE IL PING
        return true;
    }
    async sendSignal(to) {
        let offer = await this.signaling.getOffer(to);
        this.webRtc.setSignal(offer.signal);
        let answer = await this.webRtc.createSignalString();
        await this.signaling.setAnswer(answer, to);
    }
    getSignal(from) {
        return this.signaling.getOffer(from);
    }
    async getSignalOwner() {
        let signal = await this.webRtc.createSignalString();
        return {
            signal: signal,
            creationTime_EpochInSeconds: "",
        };
    }
    async onAnswer(input) {
        if (this.onAnswerCallback === undefined)
            return;
        this.onAnswerCallback({
            peer: input.answerer,
            signal: input.outputStruct
        });
        return;
    }
    async onSignal(callback) {
        this.onAnswerCallback = callback;
        return;
    }
    compareSignalMessage(signal_1, signal_2) {
        return ErmesSignalingRepository.compareSignalMessage(signal_1, signal_2);
    }
    static compareSignalMessage(signal_1, signal_2) {
        return signal_1.signal === signal_2.signal;
    }
    removeAllListeners() {
        this.signaling.removeAllListeners();
        this.onAnswerCallback = undefined;
    }
}
//# sourceMappingURL=ErmesSignalingRepository.js.map