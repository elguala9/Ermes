"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractHandler = void 0;
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
}
exports.ContractHandler = ContractHandler;
//# sourceMappingURL=ContractHandler.js.map