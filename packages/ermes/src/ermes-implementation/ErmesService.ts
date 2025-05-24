import { CallbackOnMessageSended, CallbackOnMessageSending, CallbackOnMessageService, ChunkInfo, IdType, ServiceMessage } from "ermes-types";


import { ErmesServiceInput, IErmesWebRtcRepository } from "iermes/index";
import { IErmesRepository, IErmesService } from "iermes/standard-interface/IErmes";
import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";







export class ErmesService implements IErmesService{
    private _repository: IErmesRepository
    protected ermesSendRepo: ErmesSendRepo;
    protected ermesReadRepo: ErmesReadRepo;
    // at this level i do not want MessageData, but only the buffer that the user sent
    protected messageCallback?: CallbackOnMessageService;
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
            messageCallback: this.messageCallback,
            maxBufferSize: maxBuffer ?? 100
        })

        
    }
    onMessageSending(callback: CallbackOnMessageSending): void {
        throw new Error("Method not implemented.");
    }
    onMessageSended(callback: CallbackOnMessageSended): void {
        throw new Error("Method not implemented.");
    }

    // this function is NEEDED. 
    // What i want: be able to pass an undefined messageCallback to the constructor
    // The problem: messageDataCallback and messageCallback are different types, i cannot directly pass messageCallback
    //              this means that i need to create a function like  (mess ) => this.messageCallback(mess.data)
    //              but this function (dummy) will never be undefined and i will lose messages
    // Solution: create a method that will set messageDataCallback undefined or defined, based on messageCallback
    

    setRepository(repository: IErmesWebRtcRepository): void {
        this._repository = repository;
    }
    isClosed(): boolean {
        return this._repository.isClosed();
    }
    
    onMessage(messageCallback: CallbackOnMessageService): void {
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
