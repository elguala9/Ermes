import type { SignalData } from 'simple-peer';
import type { ReusableOffer, ReusableAnswer, ISignalInfo, ISignalInfoOffer, ISignalInfoAnswer } from 'ermes-types';
/**
 * Base implementation of ISignalInfo
 */
export declare class SignalInfo implements ISignalInfo {
    signalData: SignalData;
    constructor(signalData: SignalData);
    isOffer(): boolean;
    isAnswer(): boolean;
    getSignalData(): SignalData;
}
/**
 * Concrete offer info, carries both raw SignalData and ReusableOffer metadata
 */
export declare class SignalInfoOffer extends SignalInfo implements ISignalInfoOffer {
    reusableOffer: ReusableOffer;
    constructor(signalData: SignalData, reusableOffer: ReusableOffer);
    getOfferInfo(): ReusableOffer;
}
/**
 * Concrete answer info, carries both raw SignalData and ReusableAnswer metadata
 */
export declare class SignalInfoAnswer extends SignalInfo implements ISignalInfoAnswer {
    reusableAnswer: ReusableAnswer;
    constructor(signalData: SignalData, reusableAnswer: ReusableAnswer);
    getAnswerInfo(): ReusableAnswer;
}
