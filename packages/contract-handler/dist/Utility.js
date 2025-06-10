"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProviderBrowser = getProviderBrowser;
exports.getProviderRpc = getProviderRpc;
exports.getSignerFromProviderBrowser = getSignerFromProviderBrowser;
exports.getSignerFromProviderRpc = getSignerFromProviderRpc;
const ethers_1 = require("ethers");
/**
 * use only on browser, when a wallet is installed
 * @returns return the provider metamask or similar
 */
async function getProviderBrowser() {
    const browserProvider = new ethers_1.BrowserProvider(window.ethereum);
    await browserProvider.send("eth_requestAccounts", []);
    return browserProvider;
}
async function getProviderRpc(rpc) {
    return new ethers_1.JsonRpcProvider(rpc);
}
async function getSignerFromProviderBrowser(providerBrowser) {
    return await providerBrowser.getSigner();
}
async function getSignerFromProviderRpc(provider, pk) {
    return new ethers_1.Wallet(pk, provider);
}
//# sourceMappingURL=Utility.js.map