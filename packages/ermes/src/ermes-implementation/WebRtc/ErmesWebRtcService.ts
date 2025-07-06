import { Signal } from "ermes-types";


import { ErmesWebRtcServiceInput, IErmesWebRtcRepository, IErmesWebRtcService } from "iermes/index";
import { SignalData } from "simple-peer";
import { ErmesService } from "../ErmesService.js";




export class ErmesWebRtcService extends ErmesService implements IErmesWebRtcService {
    private _repositoryWebRtc: IErmesWebRtcRepository

    constructor(input: ErmesWebRtcServiceInput
        ){
        super(input);
        this._repositoryWebRtc = input.repository;
    }
    createSignalString(): Promise<string> {
        return this._repositoryWebRtc.createSignalString();
    }
    parseSignalString(signalString: string): SignalData {
        return this._repositoryWebRtc.parseSignalString(signalString);
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
