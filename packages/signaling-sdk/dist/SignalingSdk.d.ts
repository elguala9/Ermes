import { ContractHandler } from "contract-handler/ContractHandler";
import { ContractFactory, ContractTransactionReceipt, Signer } from "ethers";
import { ISignalingSdk } from "./ISignalingSdk";
import { AddressType, AnswerType, CallbackSignal, OfferType, OutputStruct } from "./Types";
import { Signaling } from "./typeschain";
export declare class SignalingSdk extends ContractHandler<Signaling> implements ISignalingSdk {
    private callbackProposeAnswer?;
    /**
     *
     * @param contractFactory factory of typeschain by hardhat
     * @param signer signer created with utility function
     * @param address address of the contract
     * @param offerer in case is undefined, i take the address of the signer
     */
    constructor(contractFactory: ContractFactory, signer: Signer, address: string, offerer: AddressType);
    addListner(offerer: AddressType): void;
    removeAllListeners(): void;
    setOffer(offer: OfferType): Promise<ContractTransactionReceipt>;
    setAnswer(answer: AnswerType, offerer: AddressType): Promise<ContractTransactionReceipt>;
    getOffer(offerer: AddressType): Promise<OutputStruct>;
    getAnswer(answerer: AddressType, offerer: AddressType): Promise<OutputStruct>;
    onAnswer(callback: CallbackSignal): void;
}
