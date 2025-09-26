import { CallbackOnDataArrived, CallbackOnMessageSended, CallbackOnMessageSending, CallbackOnMessageService, ChunkInfo, IdType, MessageType, ServiceMessage, TypeOfData } from "ermes-types";


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

        this.ermesStorageAndCaching = ermesStorageAndCaching;
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
            // IF NOT STORAGE ENABLED I SEND A MESSAGE TO INFORM THE PEER
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
