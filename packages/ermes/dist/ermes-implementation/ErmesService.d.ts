import { ChunkMessage, MessageData } from "ermes-types";
import { ErmesReadRepo } from "./ErmesReadRepo.js";
import { ErmesSendRepo } from "./ErmesSendRepo.js";
import { CallbackOnMessage } from "iermes/standard-interface/IErmes";
import { IErmesWebRtcRepository, IErmesWebRtcService, IIdHandlerService } from "iermes/index";
import { SignalData } from "simple-peer";
export type MessageDataErmes = MessageData;
export type MessageChunkErmes = ChunkMessage;
export type ErmesServiceInput = {
    repository: IErmesWebRtcRepository;
    messageCallback: CallbackOnMessage;
    idHandler: IIdHandlerService;
    maxByte?: number;
    maxBuffer?: number;
};
export declare class ErmesService implements IErmesWebRtcService {
    private _repository;
    protected ermesSendRepo: ErmesSendRepo;
    protected ermesReadRepo: ErmesReadRepo;
    protected messageCallback: CallbackOnMessage;
    constructor({ maxBuffer, maxByte, repository, idHandler, messageCallback }: ErmesServiceInput);
    setRepository(repository: IErmesWebRtcRepository): void;
    isClose(): boolean;
    createOffer(): Promise<SignalData>;
    createOfferString(): Promise<string>;
    setAnswer(answer: SignalData): void;
    setAnswerString(answer: string): void;
    onConnect(callback: () => void): void;
    onError(callback: (err: Error) => void): void;
    onClose(callback: () => void): void;
    onSignal(callback: (data: SignalData | PromiseLike<SignalData>) => void): void;
    onMessage(messageCallback: CallbackOnMessage): void;
    private handleServiceMessage;
    private sendMissingBaseMessage;
    private sendMissingChunks;
    send(message: Uint8Array): void;
    close(): void;
}
