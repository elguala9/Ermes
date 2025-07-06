import { BaseContract, BytesLike, ContractFactory, ContractTransactionReceipt, ContractTransactionResponse, Signer } from "ethers";
import { IContractHandler } from "./IContractHandler";
export declare class ContractHandler<C extends BaseContract> implements IContractHandler {
    contract: C;
    confirms?: number;
    timeout?: number;
    protected signer: Signer;
    constructor(contractFactory: ContractFactory, signer: Signer, address: string);
    getAddressUser(): Promise<string>;
    getAddressSmartContract(): Promise<string>;
    protected waitTransaction(tx: ContractTransactionResponse): Promise<ContractTransactionReceipt>;
    retriveLog(receipt: ContractTransactionReceipt): string;
    serialize(propose: string): Uint8Array;
    deSerialize(propose: BytesLike): string;
}
