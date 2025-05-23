import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
import { CallbackOnMessage, IErmesService } from "iermes/standard-interface/IErmes";
import { ErmesServiceInput, IErmesWebRtcRepository } from "iermes/index";
export declare class ErmesService implements IErmesService {
    private _repository;
    protected ermesSendRepo: ErmesSendRepo;
    protected ermesReadRepo: ErmesReadRepo;
    protected messageCallback: CallbackOnMessage;
    constructor({ maxBuffer, maxByte, repository, idHandler, messageCallback }: ErmesServiceInput);
    setRepository(repository: IErmesWebRtcRepository): void;
    isClose(): boolean;
    onMessage(messageCallback: CallbackOnMessage): void;
    private handleServiceMessage;
    private sendMissingBaseMessage;
    private sendMissingChunks;
    send(message: Uint8Array): void;
    close(): void;
}
