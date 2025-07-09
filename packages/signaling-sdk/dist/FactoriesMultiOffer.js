"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalingMultiOfferSdkFactory = void 0;
exports.SignalingMultiOfferSdkFactoryNode = SignalingMultiOfferSdkFactoryNode;
exports.SignalingMultiOfferSdkFactoryBrowser = SignalingMultiOfferSdkFactoryBrowser;
const Utility_1 = require("contract-handler/Utility");
const SignalingMultiOfferSdk_1 = require("./SignalingMultiOfferSdk");
const typeschain_1 = require("./typeschain");
class SignalingMultiOfferSdkFactory {
    async createSingnalingMultiOfferSdkForNode(rpc, pk, addressSC) {
        return SignalingMultiOfferSdkFactoryNode(rpc, pk, addressSC);
    }
    async createSingnalingMultiOfferSdkForBrowser(addressSC) {
        return SignalingMultiOfferSdkFactoryBrowser(addressSC);
    }
}
exports.SignalingMultiOfferSdkFactory = SignalingMultiOfferSdkFactory;
async function SignalingMultiOfferSdkFactoryNode(rpc, pk, addressSC) {
    let provider = await (0, Utility_1.getProviderRpc)(rpc);
    let signer = await (0, Utility_1.getSignerFromProviderRpc)(provider, pk);
    return new SignalingMultiOfferSdk_1.SignalingMultiOfferSdk(new typeschain_1.SignalingMultiOffer__factory(), signer, addressSC);
}
async function SignalingMultiOfferSdkFactoryBrowser(addressSC) {
    let provider = await (0, Utility_1.getProviderBrowser)();
    let signer = await (0, Utility_1.getSignerFromProviderBrowser)(provider);
    return new SignalingMultiOfferSdk_1.SignalingMultiOfferSdk(new typeschain_1.SignalingMultiOffer__factory(), signer, addressSC);
}
//# sourceMappingURL=FactoriesMultiOffer.js.map