"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalingSdk = void 0;
const ContractHandler_1 = require("contract-handler/ContractHandler");
const Utility_1 = require("./Utility");
class SignalingSdk extends ContractHandler_1.ContractHandler {
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
    async isConnected() {
        return this.signer.provider !== null && this.signer.provider !== undefined;
    }
    async connect() {
        return;
    }
    async disconnect() {
        return this.removeAllListeners();
    }
    getIdAccount() {
        return super.getAddressUser();
    }
    async getSignal(from) {
        let addressuser = await super.getAddressUser();
        let outputAnswer = await this.getAnswer(addressuser, from);
        let outputOfferer = await this.getOffer(from);
        // to not return empty signals
        let outputStructToReturn = outputOfferer;
        // I always take the most recent signal
        if (outputAnswer.creationTime_EpochInSeconds > outputOfferer.creationTime_EpochInSeconds)
            outputStructToReturn = outputAnswer;
        return outputAnswer.signal;
    }
    async setSignal(signal, to) {
        if (to === undefined)
            await this.setOffer(signal);
        else
            await this.setAnswer(signal, to);
    }
    onSignal(callback) {
        this.onAnswer((input) => {
            callback(input.outputStruct.signal);
        });
    }
    onError(callback) {
        throw new Error("Method not implemented.");
    }
    onClose(callback) {
        throw new Error("Method not implemented.");
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
    async addListner(offerer) {
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
    async setOffer(offer) {
        let offerSerialized = this.serialize(offer);
        await this.logNonce();
        let response = await this.contract.setOffer(offerSerialized);
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
    async getOffer(offerer) {
        let x = await this.contract.getOffer(offerer);
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
            this.addListner(address);
    }
}
exports.SignalingSdk = SignalingSdk;
//# sourceMappingURL=SignalingSdk.js.map