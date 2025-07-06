import { Signal } from "ermes-types";
import { ErmesWebRtcServiceInput, IErmesWebRtcRepository, IErmesWebRtcService } from "iermes/index";
import { SignalData } from "simple-peer";
import { ErmesService } from "../ErmesService.js";
export declare class ErmesWebRtcService extends ErmesService implements IErmesWebRtcService {
    private _repositoryWebRtc;
    constructor(input: ErmesWebRtcServiceInput);
    createSignalString(): Promise<string>;
    parseSignalString(signalString: string): SignalData;
    setRepository(repository: IErmesWebRtcRepository): void;
    createSignal(): Promise<Signal>;
    setSignal(signal: Signal): void;
    onConnect(callback: () => void): void;
    onError(callback: (err: Error) => void): void;
    onClose(callback: () => void): void;
    onSignal(callback: (data: SignalData | PromiseLike<SignalData>) => void): void;
}
