import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
export class ErmesService {
    constructor({ maxBuffer, maxByte, repository, idHandler, messageCallback }) {
        this.messageCallback = messageCallback;
        this._repository = repository;
        this.ermesSendRepo = new ErmesSendRepo(repository, idHandler, maxByte ?? 1024);
        this.ermesReadRepo = new ErmesReadRepo(repository, this.handleServiceMessage, {
            messageCallback: this.messageCallback,
            maxBufferSize: maxBuffer ?? 100
        });
    }
    onMessageSending(callback) {
        throw new Error("Method not implemented.");
    }
    onMessageSended(callback) {
        throw new Error("Method not implemented.");
    }
    // this function is NEEDED. 
    // What i want: be able to pass an undefined messageCallback to the constructor
    // The problem: messageDataCallback and messageCallback are different types, i cannot directly pass messageCallback
    //              this means that i need to create a function like  (mess ) => this.messageCallback(mess.data)
    //              but this function (dummy) will never be undefined and i will lose messages
    // Solution: create a method that will set messageDataCallback undefined or defined, based on messageCallback
    setRepository(repository) {
        this._repository = repository;
    }
    isClosed() {
        return this._repository.isClosed();
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