import { MAX_HEADER } from "ermes-types";
import { calculateHashSync } from "serialization-utility/src/Hash";
import { objectToUint8Array, uint8ArrayToArrayBuffer } from "serialization-utility/src/Serialization";
import { chunkArrayBuffer, getMessageType } from "../Utility.js";
export class ErmesSendRepo {
    constructor(repository, idHandler, maxByte = 1024) {
        if (maxByte >= 1200)
            throw new Error("Max byte cannot be more that 1299");
        this._repository = repository;
        this._maxByte = maxByte + MAX_HEADER;
        this._idHandler = idHandler;
    }
    // lock the call of certain methods
    // metodo esposto all'utente per mandare il messaggio
    send(rawData) {
        let newId = this._idHandler.getNewId();
        if (rawData.length > this._maxByte) {
            let rawDataArray = chunkArrayBuffer(this._idHandler, rawData, newId, this._maxByte - 300);
            this.sendMessageType(rawDataArray);
            return;
        }
        let message = {
            data: rawData,
            id: newId
        };
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
            let messageRoot = {
                messageSerialized: rawData,
                integrityCheckValue: calculateHashSync(rawDataArrayBuffer)
            };
            this.sendRootMessage(messageRoot);
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
    }
}
//# sourceMappingURL=ErmesSendRepo.js.map