import { SignalingSdk } from "./SignalingSdk";
export declare function SignalingSdkFactoryNode(rpc: string, pk: string, addressSC: string): Promise<SignalingSdk>;
export declare function SignalingSdkFactoryBrowser(addressSC: string): Promise<SignalingSdk>;
