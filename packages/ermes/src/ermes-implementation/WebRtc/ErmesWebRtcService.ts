import { ChunkInfo, ChunkMessage, IdType, MessageData, ServiceMessage, Signal } from "ermes-types";


import { ErmesReadRepo } from "../ErmesReadRepo.js";
import { ErmesSendRepo } from "../ErmesSendRepo.js";
import { CallbackOnMessage, IErmesRepository, IErmesService } from "iermes/standard-interface/IErmes";
import {  ErmesWebRtcServiceInput, IErmesWebRtcRepository, IErmesWebRtcService, IIdHandlerService } from "iermes/index";
import { SignalData } from "simple-peer";
import { ErmesService } from "../ErmesService.js";




export class ErmesWebRtcService extends ErmesService implements IErmesWebRtcService {
    private _repositoryWebRtc: IErmesWebRtcRepository

    constructor(input: ErmesWebRtcServiceInput
        ){
        super(input);
        this._repositoryWebRtc = input.repository;
    }

    setRepository(repository: IErmesWebRtcRepository): void {
        this._repositoryWebRtc = repository;
        // i also need to set the repo of the base class
        super.setRepository(repository);
    }

    createSignal(): Promise<Signal> {
       return this._repositoryWebRtc.createSignal();
    }


    setSignal(signal: Signal): void {
        return this._repositoryWebRtc.setSignal(signal);
    }

    onConnect(callback: () => void): void {
        return this._repositoryWebRtc.onConnect(callback);
    }
    onError(callback: (err: Error) => void): void {
        return this._repositoryWebRtc.onError(callback);
    }
    onClose(callback: () => void): void {
        return this._repositoryWebRtc.onClose(callback);
    }
    onSignal(callback: (data: SignalData | PromiseLike<SignalData>) => void): void {
        return this._repositoryWebRtc.onSignal(callback);
    }

}
