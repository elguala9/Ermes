import { CallbackOnMessageReceived, CallbackOnMessageSended, CallbackOnMessageSending, TypeOfData } from "ermes-types";
import { ErmesServiceInput } from "iermes/index";
import { IErmesRepository, IErmesService } from "iermes/standard-interface/IErmes";
import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
export declare class ErmesService implements IErmesService {
    private _repository;
    protected ermesSendRepo: ErmesSendRepo;
    protected ermesReadRepo: ErmesReadRepo;
    constructor({ maxBuffer, maxByte, repository, idHandler, callbackOnMessageReceived }: ErmesServiceInput);
    onMessageSending(callback: CallbackOnMessageSending): void;
    onMessageSended(callback: CallbackOnMessageSended): void;
    setRepository(repository: IErmesRepository): void;
    isClosed(): boolean;
    onMessage(messageCallback: CallbackOnMessageReceived): void;
    private handleServiceMessage;
    private sendMissingBaseMessage;
    private sendMissingChunks;
    send(message: TypeOfData): void;
    close(): void;
    isConnected(): boolean;
    waitForConnect(): Promise<void>;
    waitForClose(): Promise<void>;
}
