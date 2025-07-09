import { getProviderBrowser, getProviderRpc, getSignerFromProviderBrowser, getSignerFromProviderRpc } from "contract-handler/Utility";
import { SignalingMultiOfferSdk } from "./SignalingMultiOfferSdk";
import { SignalingMultiOffer__factory } from "./typeschain";


export interface ISignalingMultiOfferSdkFactory{
    createSingnalingMultiOfferSdkForNode(rpc: string, pk: string, addressSC: string): Promise<SignalingMultiOfferSdk>;
    createSingnalingMultiOfferSdkForBrowser(addressSC: string): Promise<SignalingMultiOfferSdk>;
}

export class SignalingMultiOfferSdkFactory implements ISignalingMultiOfferSdkFactory {
    async createSingnalingMultiOfferSdkForNode(rpc: string, pk: string, addressSC: string): Promise<SignalingMultiOfferSdk> {
        return SignalingMultiOfferSdkFactoryNode(rpc, pk, addressSC);
    }

    async createSingnalingMultiOfferSdkForBrowser(addressSC: string): Promise<SignalingMultiOfferSdk> {
        return SignalingMultiOfferSdkFactoryBrowser(addressSC);
    }
}

export async function SignalingMultiOfferSdkFactoryNode(rpc: string, pk: string, addressSC: string): Promise<SignalingMultiOfferSdk>{
    let provider = await getProviderRpc(rpc);
    let signer = await getSignerFromProviderRpc(provider, pk)
    return new SignalingMultiOfferSdk(new SignalingMultiOffer__factory(), signer, addressSC);
}

export async function SignalingMultiOfferSdkFactoryBrowser(addressSC: string): Promise<SignalingMultiOfferSdk>{
    let provider = await getProviderBrowser();
    let signer = await getSignerFromProviderBrowser(provider)
    return new SignalingMultiOfferSdk(new SignalingMultiOffer__factory(), signer, addressSC);
}