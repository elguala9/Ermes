/*! $RESERVED$ */
export const DISCONNECTED_FLAG = "DISCONNECTED";
export class ErmesSignalingRepository {
    constructor(signalingServer, signalHandler) {
        this.signalingServer = signalingServer;
        this.signalHandler = signalHandler;
        this.signalingServer.onSignal(this.onSignalPrivate);
    }
    async isConnected() {
        return await this.signalingServer.isConnected();
    }
    async destroy() {
        await this.signalingServer.destroy();
    }
    getIdAccount() {
        return this.signalingServer.getIdAccount();
    }
    async sendSignal(to) {
        let signal = await this.signalHandler.createSignal();
        await this.signalingServer.setSignal(to, signal);
    }
    async getSignal(from) {
        return this.signalingServer.getSignal(from);
    }
    async getSignalOwner() {
        return this.signalHandler.createSignal();
    }
    async onSignalPrivate(input) {
        if (this.onAnswerCallback === undefined)
            return;
        this.onAnswerCallback(input);
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
        return signal_1 === signal_2;
    }
    removeAllListeners() {
        this.signalingServer.removeAllListeners();
        this.onAnswerCallback = undefined;
    }
}
//# sourceMappingURL=ErmesSignalingRepository.js.map