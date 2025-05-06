import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
export class ErmesService {
    constructor({ maxBuffer, maxByte, repository, idHandlerNumber, messageCallback }) {
        this.messageCallback = messageCallback;
        this.repository = repository;
        this.ermesSendRepo = new ErmesSendRepo(repository, idHandlerNumber, maxByte ?? 1024);
        this.ermesReadRepo = new ErmesReadRepo(repository, this.handleServiceMessage, {
            // the 
            messageDataCallback: (mess) => {
                if (this.messageCallback)
                    this.messageCallback(mess.data);
            },
            maxBufferSize: maxBuffer ?? 100
        });
    }
    onMessage(messageCallback) {
        this.messageCallback = messageCallback;
    }
    handleServiceMessage(mess) {
        if (mess.reason === "x")
            return this.repository.destroy(true);
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
        this.repository.destroy(false);
    }
}
//# sourceMappingURL=Ermes.js.map