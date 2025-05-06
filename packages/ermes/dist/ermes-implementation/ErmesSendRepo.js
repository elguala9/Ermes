import { buffer } from "stream/consumers";
import { calculateHashSync, chunkArrayBuffer, getMessageType } from "../utility/Utility.js";
import { serializeObject } from "../utility/UtilitySerialization.js";
export class ErmesSendRepo {
    constructor(repository, idHandlerNumber, maxByte = 1024) {
        this.locked = false;
        if (maxByte >= 1200)
            throw new Error("Max byte cannot be more that 1299");
        this.repository = repository;
        this.maxByte = maxByte;
        this.idHandlerNumber = idHandlerNumber;
    }
    // lock the call of certain methods
    // metodo esposto all'utente per mandare il messaggio
    send(rawData) {
        //let rawData: SerializableDataType = objectToArrayBuffer(data);
        let newId = this.idHandlerNumber.getNewId();
        if (buffer.length > this.maxByte) {
            let rawDataArray = chunkArrayBuffer(rawData, newId, this.maxByte);
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
        this.repository.send(dataRaw);
    }
}
//# sourceMappingURL=ErmesSendRepo.js.map