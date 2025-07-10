/**
 * Base implementation of ISignalInfo
 */
export class SignalInfo {
    constructor(signalData) {
        this.signalData = signalData;
    }
    isOffer() {
        return this.signalData.type === 'offer';
    }
    isAnswer() {
        return this.signalData.type === 'answer';
    }
    getSignalData() {
        return this.signalData;
    }
}
/**
 * Concrete offer info, carries both raw SignalData and ReusableOffer metadata
 */
export class SignalInfoOffer extends SignalInfo {
    constructor(signalData, reusableOffer) {
        super(signalData);
        this.reusableOffer = reusableOffer;
    }
    getOfferInfo() {
        return this.reusableOffer;
    }
}
/**
 * Concrete answer info, carries both raw SignalData and ReusableAnswer metadata
 */
export class SignalInfoAnswer extends SignalInfo {
    constructor(signalData, reusableAnswer) {
        super(signalData);
        this.reusableAnswer = reusableAnswer;
    }
    getAnswerInfo() {
        return this.reusableAnswer;
    }
}
//# sourceMappingURL=SignalInfo.js.map