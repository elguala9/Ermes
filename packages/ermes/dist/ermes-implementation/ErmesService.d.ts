import { CallbackOnDataArrived, CallbackOnDataSended, CallbackOnDataSending, MessageType, TypeOfData } from "ermes-types";
import { ErmesServiceInput, IErmesStorageAndCaching } from "iermes/index";
import { IErmesRepository, IErmesService } from "iermes/standard-interface/IErmes";
import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
export declare class ErmesService implements IErmesService {
    private _repository;
    protected ermesSendRepo: ErmesSendRepo;
    protected ermesReadRepo: ErmesReadRepo;
    protected ermesStorageAndCaching?: IErmesStorageAndCaching<MessageType>;
    private _callbackOnDataSending?;
    private _callbackOnDataSended?;
    constructor({ maxBuffer, maxByte, repository, idHandler, callbackOnDataArrived, ermesStorageAndCaching }: ErmesServiceInput);
    onDataSending(callback: CallbackOnDataSending): void;
    onDataSended(callback: CallbackOnDataSended): void;
    setRepository(repository: IErmesRepository): void;
    isClosed(): boolean;
    onMessage(messageCallback: CallbackOnDataArrived): void;
    private handleServiceMessage;
    private sendMissingMessages;
    send(message: TypeOfData): void;
    close(): void;
    isConnected(): boolean;
    waitForConnect(): Promise<void>;
    waitForClose(): Promise<void>;
}
