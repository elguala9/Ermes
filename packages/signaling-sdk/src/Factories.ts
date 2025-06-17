import { getProviderBrowser, getProviderRpc, getSignerFromProviderBrowser, getSignerFromProviderRpc } from "contract-handler/Utility";
import { Signaling__factory } from "./typeschain";
import { SignalingSdk } from "./SignalingSdk";


export async function SignalingSdkFactoryNode(rpc: string, pk: string, addressSC: string): Promise<SignalingSdk>{
    let provider = await getProviderRpc(rpc);
    let signer = await getSignerFromProviderRpc(provider, pk)
    return new SignalingSdk(new Signaling__factory(), signer, addressSC);
}

export async function SignalingSdkFactoryBrowser(addressSC: string): Promise<SignalingSdk>{
    let provider = await getProviderBrowser();
    let signer = await getSignerFromProviderBrowser(provider)
    return new SignalingSdk(new Signaling__factory(), signer, addressSC);
}