import { SignalData } from "simple-peer";
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
import type { ISignalManager } from './ISignalManager.js';
import { IdAccountType } from "iermes/index";
import { ISignalInfo, ISignalInfoAnswer, ISignalInfoOffer, ReusableAnswer, ReusableOffer } from "ermes-types";
/**
 * Factory per il SignalManager.
 * @param iceConfig  configurazione ICE (se omesso usa DEFAULT_ICE_CONFIG)
 */
export declare function createSignalManager(idAccount: IdAccountType, isInitiator?: boolean, iceConfig?: RTCConfiguration): ISignalManager;
