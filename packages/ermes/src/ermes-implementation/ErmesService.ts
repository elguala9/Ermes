import { CallbackOnDataArrived, CallbackOnDataSended, CallbackOnDataSending, CallbackOnMessageService, ChunkInfo, IdType, MessageType, ServiceMessage, TypeOfData } from "ermes-types";


import { ErmesServiceInput, IErmesStorageAndCaching } from "iermes/index";
import { IErmesRepository, IErmesService } from "iermes/standard-interface/IErmes";
import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
import { createMessageDataErmes, DEFAULT_MAX_SIZE } from "../utility.js";

const DATA_NOT_FOUND: Uint8Array = new TextEncoder().encode("DATA NOT FOUND");
const NO_STORAGE_ENABLE: Uint8Array = new TextEncoder().encode("NO STORAGE ENABLE");


export class ErmesService implements IErmesService{
    private _repository: IErmesRepository
    protected ermesSendRepo: ErmesSendRepo;
    protected ermesReadRepo: ErmesReadRepo;
    protected ermesStorageAndCaching?: IErmesStorageAndCaching<MessageType>;
    
    // Local callback variables
    private _callbackOnDataSending?: CallbackOnDataSending;
    private _callbackOnDataSended?: CallbackOnDataSended;

    constructor({
            maxBuffer,
            maxByte,
            repository,
            idHandler,
            callbackOnDataArrived,
            ermesStorageAndCaching
            }: ErmesServiceInput
        ){
        this._repository = repository;
        if((maxByte ?? DEFAULT_MAX_SIZE) > DEFAULT_MAX_SIZE)
            throw new Error(`maxByte cannot exceed ${DEFAULT_MAX_SIZE}`);
        this.ermesSendRepo = new ErmesSendRepo(repository, idHandler, maxByte ?? DEFAULT_MAX_SIZE)
        this.ermesReadRepo = new ErmesReadRepo(repository, this.handleServiceMessage, {
            callbackOnDataArrived,
            maxBufferSize: maxBuffer ?? 100
        })
        if(this.ermesStorageAndCaching !== undefined)
            this.ermesSendRepo.setCallbackOnDataSending(this.ermesStorageAndCaching.store);
        this.ermesStorageAndCaching = ermesStorageAndCaching;
    }

    onDataSending(callback: CallbackOnDataSending): void {
        this._callbackOnDataSending = callback;
    }
    onDataSended(callback: CallbackOnDataSended): void {
        this._callbackOnDataSended = callback;
    }

    setRepository(repository: IErmesRepository): void {
        this._repository = repository;
    }
    isClosed(): boolean {
        return this._repository.isClosed();
    }
    
    onMessage(messageCallback: CallbackOnDataArrived): void {
        this.ermesReadRepo.setMessageDataCallback(messageCallback);
    }

    private handleServiceMessage(mess: ServiceMessage): void{
        if(mess.reason === "x")
            return this._repository.destroy(true);
        if(mess.reason == "c")
            throw new Error("Not implemented")

        if(mess.arrayId !== undefined)
            this.sendMissingMessages(mess.arrayId)
    }

    private async sendMissingMessages(arrayId: IdType[]){
        let items: MessageType[] = [];
        for(const id of arrayId){
            // if not storage is enabled i send a message to inform the peer
            if(this.ermesStorageAndCaching === undefined){
                items.push(createMessageDataErmes(NO_STORAGE_ENABLE, id));
                continue;
            }
            const mess = await this.ermesStorageAndCaching.retrieve(id);
            // if mess is undefined i send a message to inform the peer
            if(mess === undefined){
                items.push(createMessageDataErmes(DATA_NOT_FOUND, id));
                continue;
            }
            items.push(mess);
        }
        if(items.length === 0)
            throw new Error("Error during sendMissingBaseMessage, empty items array");
        // send all the messages together
        this.ermesSendRepo.sendMessageType(items);
    }


    // metodo esposto all'utente per mandare il messaggio
    send(message: TypeOfData): void {
        // Call sending callback before sending
        if (this._callbackOnDataSending) {
            this._callbackOnDataSending(message);
        }
        
        this.ermesSendRepo.send(message);
        
        // Call sent callback after sending
        if (this._callbackOnDataSended) {
            this._callbackOnDataSended(message);
        }
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
