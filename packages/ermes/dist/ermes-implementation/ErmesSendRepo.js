import { MAX_HEADER } from "ermes-types";
import { calculateHashSync } from "serialization-utility/src/Hash";
import { objectToUint8Array, uint8ArrayToArrayBuffer } from "serialization-utility/src/Serialization";
import { chunkArrayBuffer, createMessageDataErmes, getMessageType } from "../utility.js";
import { v4 } from 'uuid';
export class ErmesSendRepo {
    constructor(repository, idHandler, maxByte = 1024) {
        if (maxByte >= 1200)
            throw new Error("Max byte cannot be more that 1299");
        this._repository = repository;
        this._maxByte = maxByte + MAX_HEADER;
        this._idHandler = idHandler;
    }
    /**
     * Set callback for when a message is being sent
     */
    setCallbackOnDataSending(callback) {
        this.callbackOnMessageSending = callback;
    }
    /**
     * Set callback for when a message has been sent
     */
    setCallbackOnDataSended(callback) {
        this.callbackOnMessageSended = callback;
    }
    // lock the call of certain methods
    // metodo esposto all'utente per mandare il messaggio
    send(rawData) {
        if (rawData.length > this._maxByte) {
            // i need a different id for the chunked message
            let uuid = v4();
            let chunkedId = uuid.toString();
            let rawDataArray = chunkArrayBuffer(this._idHandler, rawData, chunkedId, this._maxByte - 300);
            // Call the sending callback for each chunk if set
            if (this.callbackOnMessageSending) {
                rawDataArray.forEach(chunk => this.callbackOnMessageSending(chunk));
            }
            this.sendMessageType(rawDataArray);
            return;
        }
        let newId = this._idHandler.getNewId();
        let message = createMessageDataErmes(rawData, newId);
        // Call the sending callback if set
        if (this.callbackOnMessageSending) {
            this.callbackOnMessageSending(message);
        }
        this.sendMessageType([message]);
    }
    // qui trasformo i messaggi in root message, passando per l'internal messagge
    sendMessageType(array) {
        array.forEach(element => {
            let internalMessage = {
                message: element,
                type: getMessageType(element)
            };
            let rawData = objectToUint8Array(internalMessage);
            let rawDataArrayBuffer = uint8ArrayToArrayBuffer(rawData);
            if (this.callbackOnMessageSending !== undefined)
                this.callbackOnMessageSending(element);
            let messageRoot = {
                messageSerialized: rawData,
                integrityCheckValue: calculateHashSync(rawDataArrayBuffer)
            };
            this.sendRootMessage(messageRoot);
            if (this.callbackOnMessageSended !== undefined)
                this.callbackOnMessageSended(element);
        });
    }
    // invio del messaggio all'altro peer, passando da una serializzazione
    sendRootMessage(message) {
        let rawData = objectToUint8Array(message);
        this.sendWithRepo(rawData);
    }
    // effettiva chiamata alla repo. Ci va una logica che in caso di errore memorizzi il messaggio
    sendWithRepo(dataRaw) {
        this._repository.send(dataRaw);
        // For now, we assume the message was sent successfully
        // In a real implementation, you might want to wait for confirmation
        // TODO: Implement proper message tracking and confirmation
    }
}
//# sourceMappingURL=ErmesSendRepo.js.map