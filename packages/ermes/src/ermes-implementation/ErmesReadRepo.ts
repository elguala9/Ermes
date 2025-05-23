import { ObservableList } from "observable-list/src/ObservableList";
import { calculateHashSync } from "serialization-utility/src/Hash";
import { arrayBufferToObject } from "serialization-utility/src/Serialization";

import { ChunkHandler } from "../ermes-utility/ChunkHandler.js";

import { CallbackOnMessageService, CallBackServiceMessage, IdType, InternalMessage, MessageChunkErmes, MessageDataErmes, MessageRoot, MessageType, MessageValue, SerializableDataType, ServiceMessage } from "ermes-types";
import { IErmesRepository } from "iermes/index";


type MessageRootErmes = MessageRoot<string>;


export type ErmesReadRepoOptions = {
    maxBufferSize?: number,
    messageCallback?: CallbackOnMessageService;
}

export class ErmesReadRepo {
    private messageNotReaded: ObservableList<MessageDataErmes>;
    private messageNotMerged: Map<IdType, ChunkHandler> = new Map<IdType, ChunkHandler>(); // the string is the id
    private repository: IErmesRepository
    private callbackServiceMessage: CallBackServiceMessage;
    private messageCallback?: CallbackOnMessageService;

    constructor(
        repository: IErmesRepository, 
        callbackServiceMessage: CallBackServiceMessage,
        {maxBufferSize, messageCallback}: ErmesReadRepoOptions){
            
        this.repository = repository;
        this.repository.onMessage(this.handleMessageArrayBuffer.bind(this)); // if i do not put .bind(this), the onMessage do not know the context
        this.callbackServiceMessage = callbackServiceMessage;
        this.messageNotReaded = new ObservableList<MessageDataErmes>(maxBufferSize);
        this.messageCallback = messageCallback;
        // the trigger on the arriving messages in the array
        this.messageNotReaded.onAdd(()=>{
            if(this.messageCallback){
                while(!this.messageNotReaded.isEmpty()){
                    let mess: MessageDataErmes = this.messageNotReaded.shift();
                    this.messageCallback(mess.data, mess);
                }
            }
        })
    }

    public setCallbackServiceMessage(callbackServiceMessage: CallBackServiceMessage): void {
        this.callbackServiceMessage = callbackServiceMessage
    }


    public setMessageDataCallback(messageCallback: CallbackOnMessageService): void{
        this.messageCallback = messageCallback;
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
        let res = this.messageNotMerged.get(mess.ref_id);
        // se il chunk non esite lo aggiungo
        if(res == undefined){
            res = new ChunkHandler(mess.ref_id, mess.roof)
            this.messageNotMerged.set(mess.ref_id, res);
        }

        this.addChunk(res, mess);
    }

    private addChunk(handler: ChunkHandler, mess: MessageChunkErmes): void{
        let buffer = handler.addChunk(mess);
        if(buffer !== undefined){
            this.pushInNotReaded({
                data: buffer,
                id: mess.ref_id
            })
            // need to delete the chunks
            this.messageNotMerged.delete(mess.ref_id);
        }
    }

    private pushInNotReaded(mess: MessageDataErmes): void{
        this.messageNotReaded.push(mess);
    }
}
