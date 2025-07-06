import { BaseContract, BytesLike, ContractFactory, ContractTransactionReceipt, ContractTransactionResponse, ethers, Signer } from "ethers";
import { IContractHandler } from "./IContractHandler"

export class ContractHandler<C extends BaseContract> implements IContractHandler{
    contract: C;
    confirms?: number = 1;
    timeout?: number = 1;
    protected signer: Signer

    constructor(contractFactory: ContractFactory, signer: Signer, address: string) {
        this.signer = signer;
        let factory = contractFactory.connect(signer);
        this.contract = factory.attach(address) as C;

    }
    getAddressUser(): Promise<string> {
        return this.signer.getAddress();
    }
    getAddressSmartContract(): Promise<string> {
        return this.contract.getAddress();
    }

    protected async waitTransaction(tx: ContractTransactionResponse): Promise<ContractTransactionReceipt> {
        const receipt = await tx.wait(this.confirms, this.timeout);

        if (receipt == null)
            throw new Error("Transaction confirmation exceeded timeout");

        if (receipt.status === 0)
            throw new Error("Transaction reverted by the EVM");

        return receipt;
    }

    public retriveLog(receipt: ContractTransactionReceipt){
        for (const log of receipt.logs) {
            try {
            const parsed = this.contract.interface.parseLog(log)
            if(parsed == null)
                throw new Error("No log found");
            console.log("📣 Event:", parsed.name, parsed.args);
            return parsed.name + " " +  parsed.args;
            } catch (e) {
                // not our event, skip
            }
        }
        return "";
    }

    serialize(propose: string): Uint8Array {
        return ethers.toUtf8Bytes(propose);
    }
    deSerialize(propose: BytesLike): string {
        return ethers.toUtf8String(propose);
    }

}

