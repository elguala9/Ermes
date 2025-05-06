import { ObservableList } from "../utility/ArrayUtility.js";
import { calculateHashSync } from "../utility/Utility.js";
import { arrayBufferToObject } from "../utility/UtilitySerialization.js";
import { ChunkHandler } from "./ermesUtility/ChunkHandler.js";
import { MessageValue } from "./ermesUtility/ErmesType.js";
export class ErmesReadRepo {
    constructor(repository, callbackServiceMessage, { maxBufferSize, messageDataCallback }) {
        this.messageNotMerged = new Map(); // the string is the id
        this.repository = repository;
        this.repository.onMessage(this.handleMessageArrayBuffer.bind(this)); // if i do not put .bind(this), the onMessage do not know the context
        this.callbackServiceMessage = callbackServiceMessage;
        this.messageNotReaded = new ObservableList(maxBufferSize);
        this.messageDataCallback = messageDataCallback;
        // the trigger on the arriving messages in the array
        this.messageNotReaded.onAdd(() => {
            if (this.messageDataCallback) {
                while (!this.messageNotReaded.isEmpty()) {
                    let mess = this.messageNotReaded.shift();
                    this.messageDataCallback(mess);
                }
            }
        });
    }
    setCallbackServiceMessage(callbackServiceMessage) {
        this.callbackServiceMessage = callbackServiceMessage;
    }
    setMessageDataCallback(messageDataCallback) {
        this.messageDataCallback = messageDataCallback;
    }
    handleMessageArrayBuffer(message) {
        console.log("handleMessageArrayBuffer", message);
        let messRoot = arrayBufferToObject(message);
        if (messRoot.integrityCheckValue != calculateHashSync(messRoot.messageSerialized))
            throw new Error("Hash mismatched not implemented.");
        let messageDeserialized = arrayBufferToObject(messRoot.messageSerialized);
        this.handleMessageType(messageDeserialized);
    }
    handleMessageType(mess) {
        let messageType = mess.type;
        if (messageType === MessageValue.service) {
            this.callbackServiceMessage(mess.message);
            return;
        }
        let data = this.handleMessage(mess.message, messageType);
        return data;
    }
    handleMessage(mess, messageType) {
        if (messageType === MessageValue.base)
            return this.handleBaseMessage(mess);
        if (messageType === MessageValue.chunk)
            return this.handleChunkMessage(mess);
        throw new Error("Message type not found" + messageType);
    }
    handleBaseMessage(mess) {
        this.pushInNotReaded(mess);
    }
    handleChunkMessage(mess) {
        let res = this.messageNotMerged.get(mess.id);
        // se il chunk non esite lo aggiungo
        if (res == undefined) {
            res = new ChunkHandler(mess.id, mess.roof);
            this.messageNotMerged.set(mess.id, res);
        }
        let buffer = res.addChunk(mess);
        if (buffer !== undefined)
            this.pushInNotReaded({
                data: buffer,
                id: mess.id
            });
    }
    pushInNotReaded(mess) {
        this.messageNotReaded.push(mess);
    }
}
//# sourceMappingURL=ErmesReadRepo.js.map