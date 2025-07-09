import { ContractHandler } from "contract-handler/ContractHandler";
import { ContractFactory, ContractTransactionReceipt, Signer } from "ethers";
import { ISignalingMultiOfferSdk } from "./ISignalingMultiOfferSdk";
import { AddressType, AnswerType, CallbackSignal, OfferType, OutputStruct } from "./Types";
import { SignalingMultiOffer } from "./typeschain";
export declare class SignalingMultiOfferSdk extends ContractHandler<SignalingMultiOffer> implements ISignalingMultiOfferSdk {
    private listenerOnAnswer?;
    private callbackOnAnswer?;
    private listenerOnOffer?;
    private callbackOnOffer?;
    /**
     *
     * @param contractFactory factory of typeschain by hardhat
     * @param signer signer created with utility function
     * @param address address of the contract
     * @param offerer in case is undefined, i take the address of the signer
     */
    constructor(contractFactory: ContractFactory, signer: Signer, address: string);
    private getListnerProposeAnswer;
    removeListnerProposeAnswer(): Promise<void>;
    removeListnerProposeAnswerPrivate(offerer: string): Promise<void>;
    private addListnerOnAnswer;
    private addListnerOnOffer;
    removeAllListeners(): Promise<void>;
    private logNonce;
    setOffer(offer: OfferType, peer: AddressType): Promise<ContractTransactionReceipt>;
    setAnswer(answer: AnswerType, offerer: AddressType): Promise<ContractTransactionReceipt>;
    getOffer(offerer: AddressType, answerer: AddressType): Promise<OutputStruct>;
    getAnswer(answerer: AddressType, offerer: AddressType): Promise<OutputStruct>;
    /**
     * on answer to your offer
     * @param callback
     */
    onAnswer(callback: CallbackSignal): Promise<void>;
    /**
    * on answer to your offer
    * @param callback
    */
    onOffer(callback: CallbackSignal): Promise<void>;
}
