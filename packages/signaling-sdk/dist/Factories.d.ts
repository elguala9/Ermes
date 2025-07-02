import { SignalingSdk } from "./SignalingSdk";
export interface ISignalingSdkFactory {
    createSingnalingSdkForNode(rpc: string, pk: string, addressSC: string): Promise<SignalingSdk>;
    createSingnalingSdkForBrowser(addressSC: string): Promise<SignalingSdk>;
}
export declare class SignalingSdkFactory implements ISignalingSdkFactory {
    createSingnalingSdkForNode(rpc: string, pk: string, addressSC: string): Promise<SignalingSdk>;
    createSingnalingSdkForBrowser(addressSC: string): Promise<SignalingSdk>;
}
export declare function SignalingSdkFactoryNode(rpc: string, pk: string, addressSC: string): Promise<SignalingSdk>;
export declare function SignalingSdkFactoryBrowser(addressSC: string): Promise<SignalingSdk>;
