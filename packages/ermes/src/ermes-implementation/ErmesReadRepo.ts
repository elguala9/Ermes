import { ObservableList } from "../utility/ArrayUtility.js";
import { calculateHashSync } from "../utility/Utility.js";
import { arrayBufferToObject } from "../utility/UtilitySerialization.js";
import { MessageChunkErmes, MessageDataErmes } from "./ErmesSendRepo.js";
import { ChunkHandler } from "./ermesUtility/ChunkHandler.js";
import { IdType, InternalMessage, MessageRoot, MessageType, MessageValue, ServiceMessage } from "./ermesUtility/ErmesType.js";
import { IErmesRepository, SerializableDataType } from "./interfaces/IErmes.js";

type MessageRootErmes = MessageRoot<string>;
export type CallBackServiceMessage = (serviceMessage: ServiceMessage) => void
export type CallbackOnMessageData = (serviceMessage: MessageDataErmes) => void

export type ErmesReadRepoOptions = {
    maxBufferSize?: number,
    messageDataCallback?: CallbackOnMessageData
}

export class ErmesReadRepo {
    private messageNotReaded: ObservableList<MessageDataErmes> ;
    private messageNotMerged: Map<IdType, ChunkHandler> = new Map<IdType, ChunkHandler>(); // the string is the id
    private repository: IErmesRepository
    private callbackServiceMessage: CallBackServiceMessage;
    private messageDataCallback?: CallbackOnMessageData;

    constructor(
        repository: IErmesRepository, 
        callbackServiceMessage: CallBackServiceMessage,
        {maxBufferSize, messageDataCallback}: ErmesReadRepoOptions){
            
        this.repository = repository;
        this.repository.onMessage(this.handleMessageArrayBuffer.bind(this)); // if i do not put .bind(this), the onMessage do not know the context
        this.callbackServiceMessage = callbackServiceMessage;
        this.messageNotReaded = new ObservableList<MessageDataErmes>(maxBufferSize);
        this.messageDataCallback = messageDataCallback;
        // the trigger on the arriving messages in the array
        this.messageNotReaded.onAdd(()=>{
            if(this.messageDataCallback){
                while(!this.messageNotReaded.isEmpty()){
                    let mess: MessageDataErmes = this.messageNotReaded.shift();
                    this.messageDataCallback(mess);
                }
            }
        })
    }

    public setCallbackServiceMessage(callbackServiceMessage: CallBackServiceMessage): void {
        this.callbackServiceMessage = callbackServiceMessage
    }


    public setMessageDataCallback(messageDataCallback: CallbackOnMessageData): void{
        this.messageDataCallback = messageDataCallback;
    }

    private handleMessageArrayBuffer(message: SerializableDataType): void{
        console.log("handleMessageArrayBuffer", message);
        let messRoot: MessageRootErmes = arrayBufferToObject(message);
        if(messRoot.integrityCheckValue != calculateHashSync(messRoot.messageSerialized))
            throw new Error("Hash mismatched not implemented.");
        let messageDeserialized: InternalMessage<MessageType> = arrayBufferToObject(messRoot.messageSerialized)
        this.handleMessageType(messageDeserialized);
    }

    private handleMessageType(mess: InternalMessage<MessageType>): void{
        let messageType = mess.type;

        if(messageType === MessageValue.service){
            this.callbackServiceMessage(mess.message as ServiceMessage);
            return;
        }
        

        let data = this.handleMessage(mess.message, messageType);

        return data
    }

    private handleMessage(mess: MessageType, messageType: MessageValue): void{
        if(messageType === MessageValue.base) 
            return this.handleBaseMessage(mess as MessageDataErmes);
        if(messageType === MessageValue.chunk) 
            return this.handleChunkMessage(mess as MessageChunkErmes);

        throw new Error("Message type not found" + messageType);
        
    }

    private handleBaseMessage(mess: MessageDataErmes): void{
        this.pushInNotReaded(mess);
    }

    private handleChunkMessage(mess: MessageChunkErmes): void{
        let res = this.messageNotMerged.get(mess.id);
        // se il chunk non esite lo aggiungo
        if(res == undefined){
            res = new ChunkHandler(mess.id, mess.roof)
            this.messageNotMerged.set(mess.id, res);
        }
        let buffer = res.addChunk(mess);
        if(buffer !== undefined)
            this.pushInNotReaded({
                data: buffer,
                id: mess.id
            })
    }

    private pushInNotReaded(mess: MessageDataErmes): void{
        this.messageNotReaded.push(mess);
    }
}
