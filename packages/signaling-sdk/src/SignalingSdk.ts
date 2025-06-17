import { ContractHandler } from "contract-handler/ContractHandler";
import { ContractFactory, ContractTransactionReceipt, Listener, Signer } from "ethers";
import { ISignalingSdk } from "./ISignalingSdk";
import { AddressType, AnswerType, CallbackSignal, OfferType, OutputStruct } from "./Types";
import { Signaling } from "./typeschain";
import { proposeAnswerEvent } from "./typeschain/Signaling";
import { toOutputStruct } from "./Utility";


export class SignalingSdk extends ContractHandler<Signaling> implements ISignalingSdk {
    
    private listener?: Listener;
    private callback?: CallbackSignal;

    /**
     * 
     * @param contractFactory factory of typeschain by hardhat
     * @param signer signer created with utility function
     * @param address address of the contract
     * @param offerer in case is undefined, i take the address of the signer
     */
    constructor(contractFactory: ContractFactory, signer: Signer, address: string){
        super(contractFactory, signer, address);

    }

    private getListner(offerer: string): Listener {
        if(this.listener === undefined)
            throw Error("Listener not found");
        return this.listener;
    }

    async removeLister(offerer: AddressType): Promise<void> {
        await this.contract.removeListener(this.contract.filters.proposeAnswer(offerer), this.getListner(offerer) );
    }

    async addListner(offerer: AddressType): Promise<void> {
        /**
         * trigger on the propose answer event, filtered by offerer
         */

        const listener = (
            offerer: string,
            answerer: string,
            answer: proposeAnswerEvent.OutputObject["answer"],
            event: proposeAnswerEvent.Log
        ) => {
            console.log("Trigger event:" + offerer + "  ---  " + answerer);
            const outputStruct = toOutputStruct(answer);
            // retrive the associated callback
            let callback = this.callback;
            if (callback) {
                callback({offerer, answerer, outputStruct});
            }
        };

        await this.contract.on(this.contract.filters.proposeAnswer(offerer), listener);

        this.listener = listener;
    }
    
    async removeAllListeners(): Promise<void> {
        await this.contract.removeAllListeners();
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

    async onAnswer(callback: CallbackSignal): Promise<void> {
        let address = await this.getAddressUser();
        this.addListner(address);
        this.callback = callback;
    }  
}