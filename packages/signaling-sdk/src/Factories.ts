import { getProviderBrowser, getProviderRpc, getSignerFromProviderBrowser, getSignerFromProviderRpc } from "contract-handler/Utility";
import { Signaling__factory } from "./typeschain";
import { SignalingSdk } from "./SignalingSdk";


export interface ISignalingSdkFactory{
    createSingnalingSdkForNode(rpc: string, pk: string, addressSC: string): Promise<SignalingSdk>;
    createSingnalingSdkForBrowser(addressSC: string): Promise<SignalingSdk>;
}

export class SignalingSdkFactory implements ISignalingSdkFactory {
    async createSingnalingSdkForNode(rpc: string, pk: string, addressSC: string): Promise<SignalingSdk> {
        return SignalingSdkFactoryNode(rpc, pk, addressSC);
    }

    async createSingnalingSdkForBrowser(addressSC: string): Promise<SignalingSdk> {
        return SignalingSdkFactoryBrowser(addressSC);
    }
}

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