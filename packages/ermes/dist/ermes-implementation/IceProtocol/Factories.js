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
import { DEFAULT_ICE_CONFIG, SignalManager } from "./SignalManager.js";
/**
 * Factory per il SignalManager.
 * @param iceConfig  configurazione ICE (se omesso usa DEFAULT_ICE_CONFIG)
 */
export function createSignalManager(idAccount, isInitiator = true, iceConfig) {
    return new SignalManager(iceConfig ?? DEFAULT_ICE_CONFIG, idAccount);
}
//# sourceMappingURL=Factories.js.map