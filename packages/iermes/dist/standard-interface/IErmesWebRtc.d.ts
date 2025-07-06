import { Signal } from "ermes-types";
import type { SignalData } from 'simple-peer';
import { IErmesRepository, IErmesService } from "./IErmes.js";
interface IErmesWebRtcPrivate {
    /**
     * create the signal (offer/answer) that will be passed to the other peer
     */
    createSignal(): Promise<Signal>;
    /**
     * create the signal (offer/answer) that will be passed to the other peer
     */
    createSignalString(): Promise<string>;
    /**
     *
     * @param signalString  signal (offer/answer) from the other peer as a string
     * @returns SignalData object parsed from the string
     */
    parseSignalString(signalString: string): SignalData;
    /**
     *
     * @param answer signal (offer/answer) from the other peer
     */
    setSignal(signal: Signal): void;
    onConnect(callback: () => void): void;
    onError(callback: (err: Error) => void): void;
    onClose(callback: () => void): void;
    onSignal(callback: (data: SignalData | PromiseLike<SignalData>) => void): void;
}
/**
 * extension of ermes with some methods for webrtc
 */
export interface IErmesWebRtcRepository extends IErmesRepository, IErmesWebRtcPrivate {
}
/**
 * extension of ermes with some methods for webrtc
 */
export interface IErmesWebRtcService extends IErmesService, IErmesWebRtcPrivate {
    /**
     * change the repo, this will retain all the information in the service
     * @param repository new repository that the service is going to use
     */
    setRepository(repository: IErmesWebRtcRepository): void;
}
export {};
