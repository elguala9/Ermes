
import { ChunkMessage, InternalMessage, MAX_HEADER, MessageDataErmes, MessageRoot, MessageType, SerializableDataType, TypeOfData } from "ermes-types";
import { IErmesRepository, IIdHandlerService } from "iermes/index";
import { calculateHashSync } from "serialization-utility/src/Hash";
import { objectToUint8Array, uint8ArrayToArrayBuffer } from "serialization-utility/src/Serialization";
import { chunkArrayBuffer, getMessageType } from "../Utility.js";


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
        this._maxByte = maxByte + MAX_HEADER;
        this._idHandler = idHandler;
    }

    // lock the call of certain methods
    
    // metodo esposto all'utente per mandare il messaggio
    send(rawData: TypeOfData): void {
        
        let newId = this._idHandler.getNewId();
        if(rawData.length > this._maxByte){
            let rawDataArray: ChunkMessage[] = chunkArrayBuffer(this._idHandler, rawData, newId, this._maxByte - 300);
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
            let rawData: TypeOfData = objectToUint8Array(internalMessage);
            let rawDataArrayBuffer = uint8ArrayToArrayBuffer(rawData);
            let messageRoot: MessageRootErmes = {
                messageSerialized: rawData,
                integrityCheckValue: calculateHashSync(rawDataArrayBuffer)
            };
            this.sendRootMessage(messageRoot);
        }); 
    }

    // invio del messaggio all'altro peer, passando da una serializzazione
    private sendRootMessage(message: MessageRootErmes): void {
        let rawData = objectToUint8Array(message);
        this.sendWithRepo(rawData);       
    }

    // effettiva chiamata alla repo. Ci va una logica che in caso di errore memorizzi il messaggio
    private sendWithRepo(dataRaw: SerializableDataType): void {
        this._repository.send(dataRaw);
    }    
}
