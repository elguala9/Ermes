import { BaseContract, ContractFactory, ContractTransactionReceipt, ContractTransactionResponse, Signer } from "ethers";
import { IContractHandler } from "./IContractHandler"

export class ContractHandler<C extends BaseContract> implements IContractHandler{
    contract: C;
    confirms?: number;
    timeout?: number = 1;

    constructor(contractFactory: ContractFactory, signer: Signer, address: string) {
        let factory = contractFactory.connect(signer);
        this.contract = factory.attach(address) as C;

    }

    public async waitTransaction(tx: ContractTransactionResponse): Promise<ContractTransactionReceipt>{
        let receipt = await tx.wait(this.confirms, this.timeout);
        if(receipt == null)
            throw new Error("Transaction confirmation exceed timeout");
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

}

