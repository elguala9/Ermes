import { SignalingMultiOfferSdk } from "./SignalingMultiOfferSdk";
export interface ISignalingMultiOfferSdkFactory {
    createSingnalingMultiOfferSdkForNode(rpc: string, pk: string, addressSC: string): Promise<SignalingMultiOfferSdk>;
    createSingnalingMultiOfferSdkForBrowser(addressSC: string): Promise<SignalingMultiOfferSdk>;
}
export declare class SignalingMultiOfferSdkFactory implements ISignalingMultiOfferSdkFactory {
    createSingnalingMultiOfferSdkForNode(rpc: string, pk: string, addressSC: string): Promise<SignalingMultiOfferSdk>;
    createSingnalingMultiOfferSdkForBrowser(addressSC: string): Promise<SignalingMultiOfferSdk>;
}
export declare function SignalingMultiOfferSdkFactoryNode(rpc: string, pk: string, addressSC: string): Promise<SignalingMultiOfferSdk>;
export declare function SignalingMultiOfferSdkFactoryBrowser(addressSC: string): Promise<SignalingMultiOfferSdk>;
