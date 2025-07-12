import { Signal } from "ermes-types";
import type { SignalData } from 'simple-peer';
import { IdAccountType } from "./IErmesSignaling.js";


export type SignalType = string;


/**
 * * Interface for a signaling server that allows setting and receiving signals.
 */
export interface IErmesSignalingServer  {

    connect(): Promise<void>;

    disconnect(): Promise<void>;
    
    getIdAccount(): Promise<IdAccountType>;

    getSignal(from: IdAccountType): Promise<SignalType>;

    setSignal(signal: SignalType, to?: IdAccountType): Promise<void>;

    onSignal(callback: (data: SignalType) => void)  : void;
    
    onError(callback: (err: Error) => void)  : void;
    
    onClose(callback: () => void)  : void;

    removeAllListeners(): Promise<void>;

    isConnected(): Promise<boolean>;
}



