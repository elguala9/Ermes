"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractHandler = void 0;
const ethers_1 = require("ethers");
class ContractHandler {
    constructor(contractFactory, signer, address) {
        this.confirms = 1;
        this.timeout = 1;
        this.signer = signer;
        let factory = contractFactory.connect(signer);
        this.contract = factory.attach(address);
    }
    getAddressUser() {
        return this.signer.getAddress();
    }
    getAddressSmartContract() {
        return this.contract.getAddress();
    }
    async waitTransaction(tx) {
        const receipt = await tx.wait(this.confirms, this.timeout);
        if (receipt == null)
            throw new Error("Transaction confirmation exceeded timeout");
        if (receipt.status === 0)
            throw new Error("Transaction reverted by the EVM");
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