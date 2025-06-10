import { ContractTransactionReceipt } from "ethers";
export interface IContractHandler {
    retriveLog(receipt: ContractTransactionReceipt): string;
}
