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
    createSignal() {
        return this._repository.createSignal();
    }
    setSignal(signal) {
        return this._repository.setSignal(signal);
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