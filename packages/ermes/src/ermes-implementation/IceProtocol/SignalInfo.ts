import type { SignalData } from 'simple-peer';
import type {
  ReusableOffer,
  ReusableAnswer,
  ISignalInfo,
  ISignalInfoOffer,
  ISignalInfoAnswer
} from 'ermes-types';

/**
 * Base implementation of ISignalInfo
 */
export class SignalInfo implements ISignalInfo {
  public signalData: SignalData;

  constructor(signalData: SignalData) {
    this.signalData = signalData;
  }

  public isOffer(): boolean {
    return this.signalData.type === 'offer';
  }

  public isAnswer(): boolean {
    return this.signalData.type === 'answer';
  }

  public getSignalData(): SignalData {
    return this.signalData;
  }
}

/**
 * Concrete offer info, carries both raw SignalData and ReusableOffer metadata
 */
export class SignalInfoOffer extends SignalInfo implements ISignalInfoOffer {
  public reusableOffer: ReusableOffer;

  constructor(signalData: SignalData, reusableOffer: ReusableOffer) {
    super(signalData);
    this.reusableOffer = reusableOffer;
  }

  public getOfferInfo(): ReusableOffer {
    return this.reusableOffer;
  }
}

/**
 * Concrete answer info, carries both raw SignalData and ReusableAnswer metadata
 */
export class SignalInfoAnswer extends SignalInfo implements ISignalInfoAnswer {
  public reusableAnswer: ReusableAnswer;

  constructor(signalData: SignalData, reusableAnswer: ReusableAnswer) {
    super(signalData);
    this.reusableAnswer = reusableAnswer;
  }

  public getAnswerInfo(): ReusableAnswer {
    return this.reusableAnswer;
  }
}
