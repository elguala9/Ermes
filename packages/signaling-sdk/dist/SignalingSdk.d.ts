import { ContractHandler } from "contract-handler/ContractHandler";
import { ContractFactory, ContractTransactionReceipt, Signer } from "ethers";
import { ISignalingSdk } from "./ISignalingSdk";
import { AddressType, AnswerType, CallbackSignal, OfferType, OutputStruct } from "./Types";
import { Signaling } from "./typeschain";
export declare class SignalingSdk extends ContractHandler<Signaling> implements ISignalingSdk {
    private listenerOnAnswer?;
    private callbackOnAnswer?;
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
    private addListner;
    removeAllListeners(): Promise<void>;
    private logNonce;
    setOffer(offer: OfferType): Promise<ContractTransactionReceipt>;
    setAnswer(answer: AnswerType, offerer: AddressType): Promise<ContractTransactionReceipt>;
    getOffer(offerer: AddressType): Promise<OutputStruct>;
    getAnswer(answerer: AddressType, offerer: AddressType): Promise<OutputStruct>;
    /**
     * on answer to your offer
     * @param callback
     */
    onAnswer(callback: CallbackSignal): Promise<void>;
}
