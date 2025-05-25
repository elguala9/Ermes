
import { ChunkMessage, InternalMessage, MessageData, MessageDataErmes, MessageRoot, MessageType, SerializableDataType } from "ermes-types";
import { buffer } from "stream/consumers";
import { IErmesRepository, IIdHandlerService } from "iermes/index";
import { chunkArrayBuffer, getMessageType } from "../Utility.js";
import { serializeObject } from "serialization-utility/src/Serialization";
import { calculateHashSync } from "serialization-utility/src/Hash";


export type MessageRootErmes = MessageRoot<string>;
type MessageInternalErmes = InternalMessage<MessageType>;




type NewType = IErmesRepository;

export class ErmesSendRepo {
    private _repository: NewType
    private _maxByte: number;
    private _idHandler: IIdHandlerService

    constructor(repository: IErmesRepository, idHandler: IIdHandlerService, maxByte: number = 1024){
        if(maxByte >= 1200)
            throw new Error("Max byte cannot be more that 1299")
        this._repository = repository;
        this._maxByte = maxByte;
        this._idHandler = idHandler;
    }

    // lock the call of certain methods
    
    // metodo esposto all'utente per mandare il messaggio
    send(rawData: Uint8Array): void {
        
        //let rawData: SerializableDataType = objectToArrayBuffer(data);
        let newId = this._idHandler.getNewId();
        if(buffer.length > this._maxByte){
            let rawDataArray: ChunkMessage[] = chunkArrayBuffer(this._idHandler, rawData, newId, this._maxByte);
            this.sendMessageType(rawDataArray);
            return; 
        }
        let message: MessageDataErmes = {
            data: rawData,
            id: newId
        }
        this.sendMessageType([message]);
    }

    // qui trasformo i messaggi in root message, passando per l'internal messagge
    private sendMessageType(array: MessageType[]): void {
        array.forEach(element => {
            let internalMessage: MessageInternalErmes = {
                message: element,
                type: getMessageType(element)
            }
            let rawData: Uint8Array = serializeObject(internalMessage);
            let messageRoot: MessageRootErmes = {
                messageSerialized: rawData,
                integrityCheckValue: calculateHashSync(rawData)
            };
            this.sendRootMessage(messageRoot);
        }); 
    }

    // invio del messaggio all'altro peer, passando da una serializzazione
    private sendRootMessage(message: MessageRootErmes): void {
        console.log('messRootSended', message);
        //let rawData: Uint8Array = serializeObject(message);
        const json = JSON.stringify({
            messageSerialized: Array.from(message.messageSerialized),
            integrityCheckValue: message.integrityCheckValue
        });
        let rawData = new TextEncoder().encode(json)
        this.sendWithRepo(rawData);       
    }

    // effettiva chiamata alla repo. Ci va una logica che in caso di errore memorizzi il messaggio
    private sendWithRepo(dataRaw: SerializableDataType): void {
        this._repository.send(dataRaw);
    }

    

    

    
}
