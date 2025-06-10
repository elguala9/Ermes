import { BrowserProvider, ethers, JsonRpcProvider, Provider, Signer, Wallet } from "ethers";

/**
 * use only on browser, when a wallet is installed
 * @returns return the provider metamask or similar
 */
export async function getProviderBrowser(): Promise<BrowserProvider> {
    
    const browserProvider = new BrowserProvider((window as any).ethereum);
    await browserProvider.send("eth_requestAccounts", []);
    return browserProvider;
}

export async function getProviderRpc(rpc: string): Promise<JsonRpcProvider> {
    return new JsonRpcProvider(rpc);
}

export async function getSignerFromProviderBrowser(providerBrowser: BrowserProvider): Promise<Signer> {
    return await providerBrowser.getSigner();  
}

export async function getSignerFromProviderRpc(provider: JsonRpcProvider, pk: string): Promise<Wallet> {
    return new Wallet(pk, provider);
}