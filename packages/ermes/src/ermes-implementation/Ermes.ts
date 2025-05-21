import { ChunkInfo, ChunkMessage, IdType, MessageData, ServiceMessage } from "ermes-types";


import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
import { CallbackOnMessage, IErmesRepository, IErmesService } from "iermes/standard-interface/IErmes";
import { IIdHandlerService } from "iermes/index";



export type MessageDataErmes = MessageData;
export type MessageChunkErmes = ChunkMessage;

export type ErmesServiceInput = {
    repository: IErmesRepository, 
    messageCallback: CallbackOnMessage
    idHandlerNumber: IIdHandlerService,
    maxByte?: number,
    maxBuffer?: number
}

export class ErmesService implements IErmesService{
    private repository: IErmesRepository
    private ermesSendRepo: ErmesSendRepo;
    private ermesReadRepo: ErmesReadRepo;
    // at this level i do not want MessageData, but only the buffer that the user sent
    private messageCallback: CallbackOnMessage;

    constructor({
            maxBuffer,
            maxByte,
            repository,
            idHandlerNumber,
            messageCallback
            }: ErmesServiceInput
        ){
        this.messageCallback = messageCallback;
        this.repository = repository;
        this.ermesSendRepo = new ErmesSendRepo(repository, idHandlerNumber, maxByte ?? 1024)
        this.ermesReadRepo = new ErmesReadRepo(repository, this.handleServiceMessage, {
            // the 
            messageDataCallback: (mess ) =>{
                if(this.messageCallback)
                    this.messageCallback(mess.data);
            },
            maxBufferSize: maxBuffer ?? 100
        })

        
    }
    
    onMessage(messageCallback: CallbackOnMessage): void {
        this.messageCallback = messageCallback;
    }

    private handleServiceMessage(mess: ServiceMessage): void{
        if(mess.reason === "x")
            return this.repository.destroy(true);
        if(mess.reason == "c")
            throw new Error("Not implemented")

        // here i handle resend of messages
        if(mess.arrayChunkInfo !== undefined)
            this.sendMissingChunks(mess.arrayChunkInfo)
        if(mess.arrayId !== undefined)
            this.sendMissingBaseMessage(mess.arrayId)
    }

    private sendMissingBaseMessage(arrayId: IdType[]){
        throw new Error("sendMissingBaseMessage not implemented");
    }

    private sendMissingChunks(arrayChunkInfo: ChunkInfo[]){
        throw new Error("sendMissingChunk not implemented");
    }

    // metodo esposto all'utente per mandare il messaggio
    send(message: Uint8Array): void {
        this.ermesSendRepo.send(message);
    }    

    close(){
        this.repository.destroy(false);
    }
}
