import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
export class ErmesService {
    constructor({ maxBuffer, maxByte, repository, idHandler, messageCallback }) {
        this.messageCallback = messageCallback;
        this._repository = repository;
        this.ermesSendRepo = new ErmesSendRepo(repository, idHandler, maxByte ?? 1024);
        this.ermesReadRepo = new ErmesReadRepo(repository, this.handleServiceMessage, {
            // the 
            messageDataCallback: (mess) => {
                if (this.messageCallback)
                    this.messageCallback(mess.data);
            },
            maxBufferSize: maxBuffer ?? 100
        });
    }
    setRepository(repository) {
        this._repository = repository;
    }
    isClose() {
        return this._repository.isClose();
    }
    createOffer() {
        return this._repository.createOffer();
    }
    async createOfferString() {
        let offer = await this.createOffer();
        return JSON.stringify(offer);
    }
    setAnswer(answer) {
        return this._repository.setAnswer(answer);
    }
    setAnswerString(answer) {
        this.setAnswer(JSON.parse(answer));
    }
    onConnect(callback) {
        return this._repository.onConnect(callback);
    }
    onError(callback) {
        return this._repository.onError(callback);
    }
    onClose(callback) {
        return this._repository.onClose(callback);
    }
    onSignal(callback) {
        return this._repository.onSignal(callback);
    }
    onMessage(messageCallback) {
        this.messageCallback = messageCallback;
    }
    handleServiceMessage(mess) {
        if (mess.reason === "x")
            return this._repository.destroy(true);
        if (mess.reason == "c")
            throw new Error("Not implemented");
        // here i handle resend of messages
        if (mess.arrayChunkInfo !== undefined)
            this.sendMissingChunks(mess.arrayChunkInfo);
        if (mess.arrayId !== undefined)
            this.sendMissingBaseMessage(mess.arrayId);
    }
    sendMissingBaseMessage(arrayId) {
        throw new Error("sendMissingBaseMessage not implemented");
    }
    sendMissingChunks(arrayChunkInfo) {
        throw new Error("sendMissingChunk not implemented");
    }
    // metodo esposto all'utente per mandare il messaggio
    send(message) {
        this.ermesSendRepo.send(message);
    }
    close() {
        this._repository.destroy(false);
    }
}
//# sourceMappingURL=ErmesService.js.map