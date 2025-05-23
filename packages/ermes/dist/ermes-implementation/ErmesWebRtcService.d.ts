import { ChunkMessage, MessageData, Signal } from "ermes-types";
import { CallbackOnMessage } from "iermes/standard-interface/IErmes";
import { IErmesWebRtcRepository, IErmesWebRtcService, IIdHandlerService } from "iermes/index";
import { SignalData } from "simple-peer";
import { ErmesService } from "./ErmesService.js";
export type MessageDataErmes = MessageData;
export type MessageChunkErmes = ChunkMessage;
export type ErmesServiceInput = {
    repository: IErmesWebRtcRepository;
    messageCallback: CallbackOnMessage;
    idHandler: IIdHandlerService;
    maxByte?: number;
    maxBuffer?: number;
};
export declare class ErmesWebRtcService extends ErmesService implements IErmesWebRtcService {
    private _repositoryWebRtc;
    constructor(input: ErmesServiceInput);
    setRepository(repository: IErmesWebRtcRepository): void;
    createSignal(): Promise<Signal>;
    setSignal(signal: Signal): void;
    onConnect(callback: () => void): void;
    onError(callback: (err: Error) => void): void;
    onClose(callback: () => void): void;
    onSignal(callback: (data: SignalData | PromiseLike<SignalData>) => void): void;
}
