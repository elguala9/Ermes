import { CallbackOnDataArrived, CallbackOnMessageReceived, CallbackOnMessageSended, CallbackOnMessageSending, CallbackOnMessageService, ChunkInfo, IdType, ServiceMessage, TypeOfData } from "ermes-types";


import { ErmesServiceInput } from "iermes/index";
import { IErmesRepository, IErmesService } from "iermes/standard-interface/IErmes";
import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
import { DEFAULT_MAX_SIZE } from "../Utility.js";







export class ErmesService implements IErmesService{
    private _repository: IErmesRepository
    protected ermesSendRepo: ErmesSendRepo;
    protected ermesReadRepo: ErmesReadRepo;

    constructor({
            maxBuffer,
            maxByte,
            repository,
            idHandler,
            callbackOnMessageReceived
            }: ErmesServiceInput
        ){
        this._repository = repository;
        if((maxByte ?? DEFAULT_MAX_SIZE) > DEFAULT_MAX_SIZE)
            throw new Error(`maxByte cannot exceed ${DEFAULT_MAX_SIZE}`);
        this.ermesSendRepo = new ErmesSendRepo(repository, idHandler, maxByte ?? DEFAULT_MAX_SIZE)
        this.ermesReadRepo = new ErmesReadRepo(repository, this.handleServiceMessage, {
            callbackOnMessageReceived,
            maxBufferSize: maxBuffer ?? 100
        })

        
    }

    onMessageSending(callback: CallbackOnMessageSending): void {
        throw new Error("Method not implemented.");
    }
    onMessageSended(callback: CallbackOnMessageSended): void {
        throw new Error("Method not implemented.");
    }

    

    setRepository(repository: IErmesRepository): void {
        this._repository = repository;
    }
    isClosed(): boolean {
        return this._repository.isClosed();
    }
    
    onMessage(messageCallback: CallbackOnMessageReceived): void {
        this.ermesReadRepo.setMessageDataCallback(messageCallback);
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
    send(message: TypeOfData): void {
        this.ermesSendRepo.send(message);
    }    

    close(){
        this._repository.destroy(false);
    }

    isConnected(): boolean{
        return this._repository.isConnected();
    }

    waitForConnect(): Promise<void> {
        return this._repository.waitForConnect();
    }

    waitForClose(): Promise<void> {
        return this._repository.waitForClose();
    }
}
