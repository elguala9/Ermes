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
    constructor(contractFactory, signer, address, offerer) {
        super(contractFactory, signer, address);
        /**
         * trigger on the propose answer event, filtered by offerer
         */
        this.contract.on(this.contract.filters.proposeAnswer(offerer ?? signer.getAddress()), (offerer, answerer, answer, event) => {
            console.log("Trigger event:" + offerer + "  ---  " + answerer);
            let outputStruct = (0, Utility_1.toOutputStruct)(answer);
            if (this.callbackProposeAnswer)
                this.callbackProposeAnswer(offerer, answerer, outputStruct);
        });
    }
    async setOffer(offer) {
        let offerSerialized = this.serialize(offer);
        let response = await this.contract.setOffer(offerSerialized);
        let receipt = await this.waitTransaction(response);
        return receipt;
    }
    async setAnswer(answer, offerer) {
        let offerSerialized = this.serialize(answer);
        let response = await this.contract.setAnswer(offerSerialized, offerer);
        let receipt = await this.waitTransaction(response);
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
    onAnswer(callback) {
        this.callbackProposeAnswer = callback;
    }
}
exports.SignalingSdk = SignalingSdk;
//# sourceMappingURL=SignalingSdk.js.map