import { SignalInfo, SignalInfoOffer, SignalInfoAnswer } from "./SignalInfo.js";
export class SignalInfoFactory {
    /**
     * Create a generic ISignalInfo.  If you pass only a reusableOffer
     * it will delegate to createSignalInfoOffer; if you pass only a
     * reusableAnswer it will delegate to createSignalInfoAnswer.
     */
    static createSignalInfo(signalData, reusableOffer, reusableAnswer) {
        if (reusableOffer && !reusableAnswer) {
            return this.createSignalInfoOffer(signalData, reusableOffer);
        }
        if (reusableAnswer && !reusableOffer) {
            return this.createSignalInfoAnswer(signalData, reusableAnswer);
        }
        return new SignalInfo(signalData);
    }
    /** Wrap a raw offer signal + metadata into an ISignalInfoOffer */
    static createSignalInfoOffer(signalData, reusableOffer) {
        return new SignalInfoOffer(signalData, reusableOffer);
    }
    /** Wrap a raw answer signal + metadata into an ISignalInfoAnswer */
    static createSignalInfoAnswer(signalData, reusableAnswer) {
        return new SignalInfoAnswer(signalData, reusableAnswer);
    }
}
import { SignalManager, DEFAULT_ICE_CONFIG } from './SignalManager.js';
import { PacketManager } from './PacketManager.js';
/**
 * Factory per il SignalManager.
 * @param iceConfig  configurazione ICE (se omesso usa DEFAULT_ICE_CONFIG)
 */
export function createSignalManager(idAccount, isInitiator = true, iceConfig) {
    return new SignalManager(iceConfig ?? DEFAULT_ICE_CONFIG, idAccount, isInitiator);
}
/**
 * Factory per il PacketManager.
 * @param peer          istanza simple-peer già connessa
 * @param connectionId  identificativo univoco della connessione
 */
export function createPacketManager(peer, connectionId) {
    return new PacketManager(peer, connectionId);
}
//# sourceMappingURL=Factories.js.map