import { SignalData } from "simple-peer";
import { ISignalInfo, ISignalInfoOffer, ISignalInfoAnswer, ReusableOffer, ReusableAnswer } from "./ISignalManager.js";
export declare class SignalInfoFactory {
    /**
     * Create a generic ISignalInfo.  If you pass only a reusableOffer
     * it will delegate to createSignalInfoOffer; if you pass only a
     * reusableAnswer it will delegate to createSignalInfoAnswer.
     */
    static createSignalInfo(signalData: SignalData, reusableOffer?: ReusableOffer, reusableAnswer?: ReusableAnswer): ISignalInfo;
    /** Wrap a raw offer signal + metadata into an ISignalInfoOffer */
    static createSignalInfoOffer(signalData: SignalData, reusableOffer: ReusableOffer): ISignalInfoOffer;
    /** Wrap a raw answer signal + metadata into an ISignalInfoAnswer */
    static createSignalInfoAnswer(signalData: SignalData, reusableAnswer: ReusableAnswer): ISignalInfoAnswer;
}
import type { Instance } from 'simple-peer';
import type { ISignalManager } from './ISignalManager.js';
import type { IPacketManager } from './IPacketManager.js';
/**
 * Factory per il SignalManager.
 * @param iceConfig  configurazione ICE (se omesso usa DEFAULT_ICE_CONFIG)
 */
export declare function createSignalManager(iceConfig?: RTCConfiguration): ISignalManager;
/**
 * Factory per il PacketManager.
 * @param peer          istanza simple-peer già connessa
 * @param connectionId  identificativo univoco della connessione
 */
export declare function createPacketManager(peer: Instance, connectionId: string): IPacketManager;
