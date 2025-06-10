import { BaseContract, ContractFactory, ContractTransactionReceipt, ContractTransactionResponse, Signer } from "ethers";
import { IContractHandler } from "./IContractHandler";
export declare class ContractHandler<C extends BaseContract> implements IContractHandler {
    contract: C;
    confirms?: number;
    timeout?: number;
    constructor(contractFactory: ContractFactory, signer: Signer, address: string);
    waitTransaction(tx: ContractTransactionResponse): Promise<ContractTransactionReceipt>;
    retriveLog(receipt: ContractTransactionReceipt): string;
}
