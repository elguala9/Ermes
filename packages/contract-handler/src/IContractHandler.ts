import { ContractTransactionReceipt } from "ethers";

export interface IContractHandler {
    

    retriveLog(receipt: ContractTransactionReceipt): string;
    getAddressUser(): Promise<string>;
    getAddressSmartContract(): Promise<string>;
}

