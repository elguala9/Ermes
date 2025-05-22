import { buffer } from "stream/consumers";
import { chunkArrayBuffer, getMessageType } from "../Utility.js";
import { serializeObject } from "serialization-utility/src/Serialization";
import { calculateHashSync } from "serialization-utility/src/Hash";
export class ErmesSendRepo {
    constructor(repository, idHandler, maxByte = 1024) {
        if (maxByte >= 1200)
            throw new Error("Max byte cannot be more that 1299");
        this._repository = repository;
        this._maxByte = maxByte;
        this._idHandler = idHandler;
    }
    // lock the call of certain methods
    // metodo esposto all'utente per mandare il messaggio
    send(rawData) {
        //let rawData: SerializableDataType = objectToArrayBuffer(data);
        let newId = this._idHandler.getNewId();
        if (buffer.length > this._maxByte) {
            let rawDataArray = chunkArrayBuffer(rawData, newId, this._maxByte);
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
            let rawData = serializeObject(internalMessage);
            let messageRoot = {
                messageSerialized: rawData,
                integrityCheckValue: calculateHashSync(rawData)
            };
            this.sendRootMessage(messageRoot);
        });
    }
    // invio del messaggio all'altro peer, passando da una serializzazione
    sendRootMessage(message) {
        let rawData = serializeObject(message);
        this.sendWithRepo(rawData);
    }
    // effettiva chiamata alla repo. Ci va una logica che in caso di errore memorizzi il messaggio
    sendWithRepo(dataRaw) {
        this._repository.send(dataRaw);
    }
}
//# sourceMappingURL=ErmesSendRepo.js.map