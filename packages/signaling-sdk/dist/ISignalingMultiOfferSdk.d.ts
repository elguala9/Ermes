import { ContractTransactionReceipt } from "ethers/contract";
import { AddressType, AnswerType, CallbackSignal, OfferType, OutputStruct } from "./Types";
import { IContractHandler } from "contract-handler/IContractHandler";
export interface ISignalingMultiOfferSdk extends IContractHandler {
    setOffer(offer: OfferType, peer: AddressType): Promise<ContractTransactionReceipt>;
    setAnswer(answer: AnswerType, peer: AddressType): Promise<ContractTransactionReceipt>;
    getOffer(offerer: AddressType, answerer: AddressType): Promise<OutputStruct>;
    getAnswer(answerer: AddressType, offerer: AddressType): Promise<OutputStruct>;
    onAnswer(callback: CallbackSignal): Promise<void>;
    onOffer(callback: CallbackSignal): Promise<void>;
    removeAllListeners(): Promise<void>;
    removeListnerProposeAnswer(): Promise<void>;
}
