"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalingMultiOfferSdk = void 0;
const ContractHandler_1 = require("contract-handler/ContractHandler");
const Utility_1 = require("./Utility");
class SignalingMultiOfferSdk extends ContractHandler_1.ContractHandler {
    /**
     *
     * @param contractFactory factory of typeschain by hardhat
     * @param signer signer created with utility function
     * @param address address of the contract
     * @param offerer in case is undefined, i take the address of the signer
     */
    constructor(contractFactory, signer, address) {
        super(contractFactory, signer, address);
    }
    getListnerProposeAnswer() {
        if (this.listenerOnAnswer === undefined)
            throw Error("Listener not found");
        return this.listenerOnAnswer;
    }
    async removeListnerProposeAnswer() {
        await this.removeListnerProposeAnswerPrivate(await this.getAddressUser());
    }
    async removeListnerProposeAnswerPrivate(offerer) {
        await this.contract.removeListener(this.contract.filters.proposeAnswer(offerer), this.getListnerProposeAnswer());
        this.listenerOnAnswer = undefined;
    }
    async addListnerOnAnswer(offerer) {
        /**
         * trigger on the propose answer event, filtered by offerer
         */
        const listener = (payload) => {
            const [offerer, answerer, answer] = payload.args;
            const outputStruct = (0, Utility_1.toOutputStruct)(answer);
            // retrive the associated callback
            if (this.callbackOnAnswer)
                this.callbackOnAnswer({ offerer, answerer, outputStruct });
        };
        this.listenerOnAnswer = listener;
        await this.contract.on(this.contract.filters.proposeAnswer(offerer), this.listenerOnAnswer);
    }
    async addListnerOnOffer(answerer) {
        /**
         * trigger on the propose answer event, filtered by offerer
         */
        const listener = (payload) => {
            const [offerer, answerer, answer] = payload.args;
            const outputStruct = (0, Utility_1.toOutputStruct)(answer);
            // retrive the associated callback
            if (this.callbackOnOffer)
                this.callbackOnOffer({ offerer, answerer, outputStruct });
        };
        this.listenerOnOffer = listener;
        await this.contract.on(this.contract.filters.proposeOffer(answerer), this.listenerOnOffer);
    }
    async removeAllListeners() {
        await this.contract.removeAllListeners();
    }
    async logNonce() {
        const addr = await this.signer.getAddress();
        const provider = this.signer.provider;
        const latest = await provider.getTransactionCount(addr, "latest");
        const pending = await provider.getTransactionCount(addr, "pending");
        console.log(`Nonce confermato  (latest):  ${latest}`);
        console.log(`Nonce in mempool (pending): ${pending}`);
    }
    async setOffer(offer, peer) {
        let offerSerialized = this.serialize(offer);
        await this.logNonce();
        let response = await this.contract.setOffer(offerSerialized, peer);
        let receipt = await this.waitTransaction(response);
        await this.logNonce();
        return receipt;
    }
    async setAnswer(answer, offerer) {
        let offerSerialized = this.serialize(answer);
        await this.logNonce();
        let response = await this.contract.setAnswer(offerSerialized, offerer);
        let receipt = await this.waitTransaction(response);
        await this.logNonce();
        return receipt;
    }
    async getOffer(offerer, answerer) {
        let x = await this.contract.getOffer(offerer, answerer);
        return (0, Utility_1.toOutputStruct)(x);
    }
    async getAnswer(answerer, offerer) {
        let x = await this.contract.getAnswer(answerer, offerer);
        return (0, Utility_1.toOutputStruct)(x);
    }
    /**
     * on answer to your offer
     * @param callback
     */
    async onAnswer(callback) {
        let address = await this.getAddressUser();
        this.callbackOnAnswer = callback;
        // i create the listner only if it is not already created
        if (this.listenerOnAnswer === undefined)
            this.addListnerOnAnswer(address);
    }
    /**
    * on answer to your offer
    * @param callback
    */
    async onOffer(callback) {
        let address = await this.getAddressUser();
        this.callbackOnAnswer = callback;
        // i create the listner only if it is not already created
        if (this.listenerOnOffer === undefined)
            this.addListnerOnOffer(address);
    }
}
exports.SignalingMultiOfferSdk = SignalingMultiOfferSdk;
//# sourceMappingURL=SignalingMultiOfferSdk.js.map