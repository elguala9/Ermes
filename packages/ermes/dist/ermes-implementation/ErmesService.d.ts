import { CallbackOnMessageSended, CallbackOnMessageSending, CallbackOnMessageService } from "ermes-types";
import { ErmesServiceInput, IErmesWebRtcRepository } from "iermes/index";
import { IErmesService } from "iermes/standard-interface/IErmes";
import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
export declare class ErmesService implements IErmesService {
    private _repository;
    protected ermesSendRepo: ErmesSendRepo;
    protected ermesReadRepo: ErmesReadRepo;
    protected messageCallback?: CallbackOnMessageService;
    constructor({ maxBuffer, maxByte, repository, idHandler, messageCallback }: ErmesServiceInput);
    onMessageSending(callback: CallbackOnMessageSending): void;
    onMessageSended(callback: CallbackOnMessageSended): void;
    setRepository(repository: IErmesWebRtcRepository): void;
    isClosed(): boolean;
    onMessage(messageCallback: CallbackOnMessageService): void;
    private handleServiceMessage;
    private sendMissingBaseMessage;
    private sendMissingChunks;
    send(message: Uint8Array): void;
    close(): void;
    isConnected(): boolean;
    waitForConnect(): Promise<void>;
    waitForClose(): Promise<void>;
}
