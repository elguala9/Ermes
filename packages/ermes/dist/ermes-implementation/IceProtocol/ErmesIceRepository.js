export class ErmesIceRepository {
    constructor(signalManager, packetManager) {
        this.signalManager = signalManager;
        this.packetManager = packetManager;
    }
    send(data) {
        throw new Error("Method not implemented.");
    }
    onMessage(callback) {
        throw new Error("Method not implemented.");
    }
    destroy(force) {
        throw new Error("Method not implemented.");
    }
    isClosed() {
        throw new Error("Method not implemented.");
    }
    isConnected() {
        throw new Error("Method not implemented.");
    }
    waitForConnect(timeoutMs) {
        throw new Error("Method not implemented.");
    }
    waitForClose(timeoutMs) {
        throw new Error("Method not implemented.");
    }
    createSignal() {
        throw new Error("Method not implemented.");
        //let offer = thissignalManager.createReusableOffer();
    }
    createSignalString() {
        throw new Error("Method not implemented.");
    }
    parseSignalString(signalString) {
        throw new Error("Method not implemented.");
    }
    setSignal(signal) {
        throw new Error("Method not implemented.");
    }
    onConnect(callback) {
        throw new Error("Method not implemented.");
    }
    onError(callback) {
        throw new Error("Method not implemented.");
    }
    onClose(callback) {
        throw new Error("Method not implemented.");
    }
    onSignal(callback) {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=ErmesIceRepository.js.map