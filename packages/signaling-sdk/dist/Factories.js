"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalingSdkFactoryNode = SignalingSdkFactoryNode;
exports.SignalingSdkFactoryBrowser = SignalingSdkFactoryBrowser;
const Utility_1 = require("contract-handler/Utility");
const typeschain_1 = require("./typeschain");
const SignalingSdk_1 = require("./SignalingSdk");
async function SignalingSdkFactoryNode(rpc, pk, addressSC) {
    let provider = await (0, Utility_1.getProviderRpc)(rpc);
    let signer = await (0, Utility_1.getSignerFromProviderRpc)(provider, pk);
    return new SignalingSdk_1.SignalingSdk(new typeschain_1.Signaling__factory(), signer, addressSC);
}
async function SignalingSdkFactoryBrowser(addressSC) {
    let provider = await (0, Utility_1.getProviderBrowser)();
    let signer = await (0, Utility_1.getSignerFromProviderBrowser)(provider);
    return new SignalingSdk_1.SignalingSdk(new typeschain_1.Signaling__factory(), signer, addressSC);
}
//# sourceMappingURL=Factories.js.map