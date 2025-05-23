import { ObservableList } from "observable-list/src/ObservableList";
import { calculateHashSync } from "serialization-utility/src/Hash";
import { arrayBufferToObject } from "serialization-utility/src/Serialization";
import { ChunkHandler } from "../ermes-utility/ChunkHandler.js";
import { MessageValue } from "ermes-types";
export class ErmesReadRepo {
    constructor(repository, callbackServiceMessage, { maxBufferSize, messageCallback }) {
        this.messageNotMerged = new Map(); // the string is the id
        this.repository = repository;
        this.repository.onMessage(this.handleMessageArrayBuffer.bind(this)); // if i do not put .bind(this), the onMessage do not know the context
        this.callbackServiceMessage = callbackServiceMessage;
        this.messageNotReaded = new ObservableList(maxBufferSize);
        this.messageCallback = messageCallback;
        // the trigger on the arriving messages in the array
        this.messageNotReaded.onAdd(() => {
            if (this.messageCallback) {
                while (!this.messageNotReaded.isEmpty()) {
                    let mess = this.messageNotReaded.shift();
                    this.messageCallback(mess.data, mess);
                }
            }
        });
    }
    setCallbackServiceMessage(callbackServiceMessage) {
        this.callbackServiceMessage = callbackServiceMessage;
    }
    setMessageDataCallback(messageCallback) {
        this.messageCallback = messageCallback;
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
        let res = this.messageNotMerged.get(mess.ref_id);
        // se il chunk non esite lo aggiungo
        if (res == undefined) {
            res = new ChunkHandler(mess.ref_id, mess.roof);
            this.messageNotMerged.set(mess.ref_id, res);
        }
        this.addChunk(res, mess);
    }
    addChunk(handler, mess) {
        let buffer = handler.addChunk(mess);
        if (buffer !== undefined) {
            this.pushInNotReaded({
                data: buffer,
                id: mess.ref_id
            });
            // need to delete the chunks
            this.messageNotMerged.delete(mess.ref_id);
        }
    }
    pushInNotReaded(mess) {
        this.messageNotReaded.push(mess);
    }
}
//# sourceMappingURL=ErmesReadRepo.js.map