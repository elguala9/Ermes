import { ContractTransactionReceipt } from "ethers/contract";
import { AddressType, AnswerType, CallbackSignal, OfferType, OutputStruct } from "./Types";
import { IContractHandler } from "contract-handler/IContractHandler";
export interface ISignalingSdk extends IContractHandler {
    setOffer(offer: OfferType): Promise<ContractTransactionReceipt>;
    setAnswer(answer: AnswerType, offerer: AddressType): Promise<ContractTransactionReceipt>;
    getOffer(offerer: AddressType): Promise<OutputStruct>;
    getAnswer(answerer: AddressType, offerer: AddressType): Promise<OutputStruct>;
    onAnswer(callback: CallbackSignal): Promise<void>;
    removeAllListeners(): Promise<void>;
    removeListnerProposeAnswer(): Promise<void>;
}
