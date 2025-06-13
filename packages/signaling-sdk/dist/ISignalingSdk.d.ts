import { ContractTransactionReceipt } from "ethers/contract";
import { AddressType, AnswerType, CallbackSignal, OfferType, OutputStruct } from "./Types";
export interface ISignalingSdk {
    setOffer(offer: OfferType): Promise<ContractTransactionReceipt>;
    setAnswer(answer: AnswerType, offerer: AddressType): Promise<ContractTransactionReceipt>;
    getOffer(offerer: AddressType): Promise<OutputStruct>;
    getAnswer(answerer: AddressType, offerer: AddressType): Promise<OutputStruct>;
    onAnswer(input: CallbackSignal): void;
}
