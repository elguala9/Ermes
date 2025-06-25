"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOutputStruct = toOutputStruct;
const ethers_1 = require("ethers");
function toOutputStruct(struct) {
    let output = {
        signal: ethers_1.ethers.toUtf8String(struct.signal),
        creationTime_EpochInSeconds: struct.creationTime.toString()
    };
    return output;
}
//# sourceMappingURL=Utility.js.map