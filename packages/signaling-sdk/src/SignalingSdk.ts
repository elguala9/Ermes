import { ContractHandler } from "contract-handler/ContractHandler";
import { ContractFactory, ContractTransactionReceipt, Signer } from "ethers";
import { ISignalingSdk } from "./ISignalingSdk";
import { AddressType, AnswerType, CallbackSignal, OfferType, OutputStruct } from "./Types";
import { Signaling } from "./typeschain";
import { toOutputStruct } from "./Utility";
import { proposeAnswerEvent } from "./typeschain/Signaling";


export class SignalingSdk extends ContractHandler<Signaling> implements ISignalingSdk {
    
    private callbackProposeAnswer?: CallbackSignal;

    /**
     * 
     * @param contractFactory factory of typeschain by hardhat
     * @param signer signer created with utility function
     * @param address address of the contract
     * @param offerer in case is undefined, i take the address of the signer
     */
    constructor(contractFactory: ContractFactory, signer: Signer, address: string, offerer?: AddressType){
        super(contractFactory, signer, address);
        /**
         * trigger on the propose answer event, filtered by offerer
         */
        this.contract.on(this.contract.filters.proposeAnswer(offerer ?? signer.getAddress() ), (
            offerer: string,
            answerer: string,
            answer: proposeAnswerEvent.OutputObject["answer"],
            event: proposeAnswerEvent.Log
        )=>{
            console.log("Trigger event:" + offerer + "  ---  " + answerer);
            let outputStruct = toOutputStruct(answer);
            if(this.callbackProposeAnswer)
                this.callbackProposeAnswer(offerer, answerer, outputStruct);
        });
    }

    async setOffer(offer: OfferType): Promise<ContractTransactionReceipt> {
        let offerSerialized: Uint8Array = this.serialize(offer);
        let response = await this.contract.setOffer(offerSerialized);
        let receipt = await this.waitTransaction(response);
        return receipt;
    }
    
    async setAnswer(answer: AnswerType, offerer: AddressType): Promise<ContractTransactionReceipt> {
        let offerSerialized: Uint8Array = this.serialize(answer);
        let response = await this.contract.setAnswer(offerSerialized, offerer);
        let receipt = await this.waitTransaction(response);
        return receipt;
    }

    async getOffer(offerer: AddressType): Promise<OutputStruct> {
        let x = await this.contract.getOffer(offerer);
        return toOutputStruct(x);
    }
    
    async getAnswer(answerer: AddressType, offerer: AddressType): Promise<OutputStruct> {
        let x = await this.contract.getAnswer(answerer, offerer);
        return toOutputStruct(x);
    }

    onAnswer(callback: CallbackSignal): void {
        this.callbackProposeAnswer = callback;
    }    
}