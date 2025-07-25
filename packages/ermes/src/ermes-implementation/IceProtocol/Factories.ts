import { SignalData } from "simple-peer";
import {
  SignalInfo,
  SignalInfoOffer,
  SignalInfoAnswer
} from "./SignalInfo.js";

export class SignalInfoFactory {
  /**
   * Create a generic ISignalInfo.  If you pass only a reusableOffer
   * it will delegate to createSignalInfoOffer; if you pass only a
   * reusableAnswer it will delegate to createSignalInfoAnswer.
   */
  static createSignalInfo(
    signalData: SignalData,
    reusableOffer?: ReusableOffer,
    reusableAnswer?: ReusableAnswer
  ): ISignalInfo {
    if (reusableOffer && !reusableAnswer) {
      return this.createSignalInfoOffer(signalData, reusableOffer);
    }
    if (reusableAnswer && !reusableOffer) {
      return this.createSignalInfoAnswer(signalData, reusableAnswer);
    }
    return new SignalInfo(signalData);
  }

  /** Wrap a raw offer signal + metadata into an ISignalInfoOffer */
  static createSignalInfoOffer(
    signalData: SignalData,
    reusableOffer: ReusableOffer
  ): ISignalInfoOffer {
    return new SignalInfoOffer(signalData, reusableOffer);
  }

  /** Wrap a raw answer signal + metadata into an ISignalInfoAnswer */
  static createSignalInfoAnswer(
    signalData: SignalData,
    reusableAnswer: ReusableAnswer
  ): ISignalInfoAnswer {
    return new SignalInfoAnswer(signalData, reusableAnswer);
  }
}

import type { Instance } from 'simple-peer';
import type { ISignalManager }  from './ISignalManager.js';
import type { IPacketManager }  from './IPacketManager.js';

import { PacketManager }                   from './PacketManager.js';
import { IdAccountType } from "iermes/index";
import { DEFAULT_ICE_CONFIG, SignalManager } from "./SignalManager.js";
import { ISignalInfo, ISignalInfoAnswer, ISignalInfoOffer, ReusableAnswer, ReusableOffer } from "ermes-types";

/**
 * Factory per il SignalManager.
 * @param iceConfig  configurazione ICE (se omesso usa DEFAULT_ICE_CONFIG)
 */
export function createSignalManager(
  idAccount: IdAccountType,
  isInitiator: boolean = true,
  iceConfig?: RTCConfiguration
): ISignalManager {
  return new SignalManager(iceConfig ?? DEFAULT_ICE_CONFIG, idAccount);
}

