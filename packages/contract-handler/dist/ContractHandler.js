"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractHandler = void 0;
const ethers_1 = require("ethers");
class ContractHandler {
    constructor(contractFactory, signer, address) {
        this.timeout = 1;
        let factory = contractFactory.connect(signer);
        this.contract = factory.attach(address);
    }
    async waitTransaction(tx) {
        let receipt = await tx.wait(this.confirms, this.timeout);
        if (receipt == null)
            throw new Error("Transaction confirmation exceed timeout");
        return receipt;
    }
    retriveLog(receipt) {
        for (const log of receipt.logs) {
            try {
                const parsed = this.contract.interface.parseLog(log);
                if (parsed == null)
                    throw new Error("No log found");
                console.log("📣 Event:", parsed.name, parsed.args);
                return parsed.name + " " + parsed.args;
            }
            catch (e) {
                // not our event, skip
            }
        }
        return "";
    }
    serialize(propose) {
        return ethers_1.ethers.toUtf8Bytes(propose);
    }
    deSerialize(propose) {
        return ethers_1.ethers.toUtf8String(propose);
    }
}
exports.ContractHandler = ContractHandler;
//# sourceMappingURL=ContractHandler.js.map