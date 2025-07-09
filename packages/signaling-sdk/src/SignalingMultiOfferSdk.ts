import { ContractHandler } from "contract-handler/ContractHandler";
import { ContractEventPayload, ContractFactory, ContractTransactionReceipt, Listener, Signer } from "ethers";
import { ISignalingMultiOfferSdk } from "./ISignalingMultiOfferSdk";
import { AddressType, AnswerType, CallbackSignal, OfferType, OutputStruct } from "./Types";
import { SignalingMultiOffer } from "./typeschain";
import { toOutputStruct } from "./Utility";


export class SignalingMultiOfferSdk extends ContractHandler<SignalingMultiOffer> implements ISignalingMultiOfferSdk {
    
    private listenerOnAnswer?: Listener;
    private callbackOnAnswer?: CallbackSignal;
    private listenerOnOffer?: Listener;
    private callbackOnOffer?: CallbackSignal;

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

    private getListnerProposeAnswer(): Listener {
        if(this.listenerOnAnswer === undefined)
            throw Error("Listener not found");
        return this.listenerOnAnswer;
    }

    async removeListnerProposeAnswer(): Promise<void> {
        await this.removeListnerProposeAnswerPrivate(await this.getAddressUser());
    }

    async removeListnerProposeAnswerPrivate(offerer: string): Promise<void> {
        await this.contract.removeListener(this.contract.filters.proposeAnswer(offerer), this.getListnerProposeAnswer());
        this.listenerOnAnswer = undefined;
    }

    private async addListnerOnAnswer(offerer: AddressType): Promise<void> {

        /**
         * trigger on the propose answer event, filtered by offerer
         */
        const listener = (
            payload: ContractEventPayload 
        ) => {
            const [offerer, answerer, answer] = payload.args;
            const outputStruct = toOutputStruct(answer);
            // retrive the associated callback
            if (this.callbackOnAnswer) 
                this.callbackOnAnswer({offerer, answerer, outputStruct});
            
        };
        this.listenerOnAnswer = listener;
        await this.contract.on(this.contract.filters.proposeAnswer(offerer), this.listenerOnAnswer); 
    }

    private async addListnerOnOffer(answerer: AddressType): Promise<void> {

        /**
         * trigger on the propose answer event, filtered by offerer
         */
        const listener = (
            payload: ContractEventPayload 
        ) => {
            const [offerer, answerer, answer] = payload.args;
            const outputStruct = toOutputStruct(answer);
            // retrive the associated callback
            if (this.callbackOnOffer) 
                this.callbackOnOffer({offerer, answerer, outputStruct});
            
        };
        this.listenerOnOffer = listener;
        await this.contract.on(this.contract.filters.proposeOffer(answerer), this.listenerOnOffer); 
    }
    
    async removeAllListeners(): Promise<void> {
        await this.contract.removeAllListeners();
    }
    
    private async logNonce(){
        const addr = await this.signer.getAddress();
        const provider = this.signer.provider!;
        const latest   = await provider.getTransactionCount(addr, "latest");
        const pending  = await provider.getTransactionCount(addr, "pending");

        console.log(`Nonce confermato  (latest):  ${latest}`);
        console.log(`Nonce in mempool (pending): ${pending}`);  
    }

    async setOffer(offer: OfferType, peer: AddressType): Promise<ContractTransactionReceipt> {
        let offerSerialized: Uint8Array = this.serialize(offer);
        await this.logNonce();
        let response = await this.contract.setOffer(offerSerialized, peer);
        let receipt = await this.waitTransaction(response);
        await this.logNonce();
        return receipt;
    }
    
    async setAnswer(answer: AnswerType, offerer: AddressType): Promise<ContractTransactionReceipt> {
        let offerSerialized: Uint8Array = this.serialize(answer);
        await this.logNonce();
        let response = await this.contract.setAnswer(offerSerialized, offerer);
        let receipt = await this.waitTransaction(response);
        await this.logNonce();
        return receipt;
    }

    async getOffer(offerer: AddressType, answerer: AddressType): Promise<OutputStruct> {
        let x = await this.contract.getOffer(offerer, answerer);
        return toOutputStruct(x);
    }
    
    async getAnswer(answerer: AddressType, offerer: AddressType): Promise<OutputStruct> {
        let x = await this.contract.getAnswer(answerer, offerer);
        return toOutputStruct(x);
    }

    /**
     * on answer to your offer
     * @param callback 
     */
    async onAnswer(callback: CallbackSignal): Promise<void> {
        let address = await this.getAddressUser();
        this.callbackOnAnswer = callback;
        // i create the listner only if it is not already created
        if(this.listenerOnAnswer === undefined)
            this.addListnerOnAnswer(address);
        
    }  

     /**
     * on answer to your offer
     * @param callback 
     */
    async onOffer(callback: CallbackSignal): Promise<void> {
        let address = await this.getAddressUser();
        this.callbackOnAnswer = callback;
        // i create the listner only if it is not already created
        if(this.listenerOnOffer === undefined)
            this.addListnerOnOffer(address);
        
    }  
}