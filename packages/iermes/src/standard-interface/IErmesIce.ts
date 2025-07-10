import { Signal } from "ermes-types";
import type { SignalData } from 'simple-peer';
import { IErmesRepository, IErmesService } from "./IErmes.js";


interface IErmesIcePrivate {
    /**
     * create the signal (offer/answer) that will be passed to the other peer
     */
    createSignal(): Promise<Signal>

    /**
     * create the signal (offer/answer) that will be passed to the other peer
     */
    createSignalString(): Promise<string>

    /**
     * 
     * @param signalString  signal (offer/answer) from the other peer as a string
     * @returns SignalData object parsed from the string
     */
    parseSignalString(signalString: string): SignalData 
    /**
     * 
     * @param answer signal (offer/answer) from the other peer
     */
    setSignal(signal: Signal): void

    onConnect(callback: () => void) : void;
    
    onError(callback: (err: Error) => void)  : void;
    
    onClose(callback: () => void)  : void;

    onSignal(callback: (data: SignalData | PromiseLike<SignalData>) => void)  : void;
}

/**
 * extension of ermes with some methods for webrtc
 */
export interface IErmesIceRepository extends IErmesRepository, IErmesIcePrivate {

}

