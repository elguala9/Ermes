import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
import { DEFAULT_MAX_SIZE } from "../Utility.js";
export class ErmesService {
    constructor({ maxBuffer, maxByte, repository, idHandler, callbackOnMessageReceived }) {
        this._repository = repository;
        if ((maxByte ?? DEFAULT_MAX_SIZE) > DEFAULT_MAX_SIZE)
            throw new Error(`maxByte cannot exceed ${DEFAULT_MAX_SIZE}`);
        this.ermesSendRepo = new ErmesSendRepo(repository, idHandler, maxByte ?? DEFAULT_MAX_SIZE);
        this.ermesReadRepo = new ErmesReadRepo(repository, this.handleServiceMessage, {
            callbackOnMessageReceived,
            maxBufferSize: maxBuffer ?? 100
        });
    }
    onMessageSending(callback) {
        throw new Error("Method not implemented.");
    }
    onMessageSended(callback) {
        throw new Error("Method not implemented.");
    }
    setRepository(repository) {
        this._repository = repository;
    }
    isClosed() {
        return this._repository.isClosed();
    }
    onMessage(messageCallback) {
        this.ermesReadRepo.setMessageDataCallback(messageCallback);
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
    isConnected() {
        return this._repository.isConnected();
    }
    waitForConnect() {
        return this._repository.waitForConnect();
    }
    waitForClose() {
        return this._repository.waitForClose();
    }
}
//# sourceMappingURL=ErmesService.js.map