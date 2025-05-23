import { ChunkInfo, ChunkMessage, IdType, MessageData, ServiceMessage, Signal } from "ermes-types";


import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
import { CallbackOnMessage, IErmesRepository, IErmesService } from "iermes/standard-interface/IErmes";
import { ErmesServiceInput, IErmesWebRtcRepository, IErmesWebRtcService, IIdHandlerService } from "iermes/index";
import { SignalData } from "simple-peer";







export class ErmesService implements IErmesService{
    private _repository: IErmesRepository
    protected ermesSendRepo: ErmesSendRepo;
    protected ermesReadRepo: ErmesReadRepo;
    // at this level i do not want MessageData, but only the buffer that the user sent
    protected messageCallback: CallbackOnMessage;

    constructor({
            maxBuffer,
            maxByte,
            repository,
            idHandler,
            messageCallback
            }: ErmesServiceInput
        ){
        this.messageCallback = messageCallback;
        this._repository = repository;
        this.ermesSendRepo = new ErmesSendRepo(repository, idHandler, maxByte ?? 1024)
        this.ermesReadRepo = new ErmesReadRepo(repository, this.handleServiceMessage, {
            // the 
            messageDataCallback: (mess ) =>{
                if(this.messageCallback)
                    this.messageCallback(mess.data);
            },
            maxBufferSize: maxBuffer ?? 100
        })

        
    }

    setRepository(repository: IErmesWebRtcRepository): void {
        this._repository = repository;
    }
    isClose(): boolean {
        return this._repository.isClose();
    }
    
    onMessage(messageCallback: CallbackOnMessage): void {
        this.messageCallback = messageCallback;
    }

    private handleServiceMessage(mess: ServiceMessage): void{
        if(mess.reason === "x")
            return this._repository.destroy(true);
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
        this._repository.destroy(false);
    }
}
