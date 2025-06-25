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
    getListner(offerer) {
        if (this.listener === undefined)
            throw Error("Listener not found");
        return this.listener;
    }
    async removeLister(offerer) {
        await this.contract.removeListener(this.contract.filters.proposeAnswer(offerer), this.getListner(offerer));
    }
    async addListner(offerer) {
        /**
         * trigger on the propose answer event, filtered by offerer
         */
        const listener = (offerer, answerer, answer, event) => {
            console.log("Trigger event:" + offerer + "  ---  " + answerer);
            const outputStruct = (0, Utility_1.toOutputStruct)(answer);
            // retrive the associated callback
            let callback = this.callback;
            if (callback) {
                callback({ offerer, answerer, outputStruct });
            }
        };
        await this.contract.on(this.contract.filters.proposeAnswer(offerer), listener);
        this.listener = listener;
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
    async onAnswer(callback) {
        let address = await this.getAddressUser();
        this.addListner(address);
        this.callback = callback;
    }
}
exports.SignalingSdk = SignalingSdk;
//# sourceMappingURL=SignalingSdk.js.map