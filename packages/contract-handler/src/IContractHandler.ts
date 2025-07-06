import { BytesLike, ContractTransactionReceipt } from "ethers";

export interface IContractHandler {
    
    serialize(propose: string): Uint8Array;
    deSerialize(propose: BytesLike): string;
    retriveLog(receipt: ContractTransactionReceipt): string;
    getAddressUser(): Promise<string>;
    getAddressSmartContract(): Promise<string>;
}

