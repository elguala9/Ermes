import { BrowserProvider, JsonRpcProvider, Signer, Wallet } from "ethers";
/**
 * use only on browser, when a wallet is installed
 * @returns return the provider metamask or similar
 */
export declare function getProviderBrowser(): Promise<BrowserProvider>;
export declare function getProviderRpc(rpc: string): Promise<JsonRpcProvider>;
export declare function getSignerFromProviderBrowser(providerBrowser: BrowserProvider): Promise<Signer>;
export declare function getSignerFromProviderRpc(provider: JsonRpcProvider, pk: string): Promise<Wallet>;
