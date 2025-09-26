import { CallbackOnDataArrived, CallbackOnMessageSended, CallbackOnMessageSending, MessageType, TypeOfData } from "ermes-types";
import { ErmesServiceInput, IErmesStorageAndCaching } from "iermes/index";
import { IErmesRepository, IErmesService } from "iermes/standard-interface/IErmes";
import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
export declare class ErmesService implements IErmesService {
    private _repository;
    protected ermesSendRepo: ErmesSendRepo;
    protected ermesReadRepo: ErmesReadRepo;
    protected ermesStorageAndCaching?: IErmesStorageAndCaching<MessageType>;
    constructor({ maxBuffer, maxByte, repository, idHandler, callbackOnDataArrived, ermesStorageAndCaching }: ErmesServiceInput);
    onMessageSending(callback: CallbackOnMessageSending): void;
    onMessageSended(callback: CallbackOnMessageSended): void;
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
