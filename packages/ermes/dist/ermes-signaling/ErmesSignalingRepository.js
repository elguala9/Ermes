export const DISCONNECTED_FLAG = "DISCONNECTED";
export class ErmesSignalingRepository {
    constructor(signaling, webRtc) {
        this.signaling = signaling;
        this.webRtc = webRtc;
        this.signaling.onAnswer(this.onAnswer);
    }
    async connect() {
        let offer = await this.webRtc.createSignal();
        await this.signaling.setOffer(offer.toString());
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
        let answer = await this.webRtc.createSignal();
        await this.signaling.setAnswer(answer.toString(), to);
    }
    getSignal(from) {
        return this.signaling.getOffer(from);
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
    removeAllListeners() {
        this.signaling.removeAllListeners();
        this.onAnswerCallback = undefined;
    }
}
//# sourceMappingURL=ErmesSignalingRepository.js.map