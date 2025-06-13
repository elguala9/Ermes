"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOutputStruct = toOutputStruct;
function toOutputStruct(struct) {
    let output = {
        signal: struct.signal,
        creationTime_EpochInSeconds: struct.creationTime.toString()
    };
    return output;
}
//# sourceMappingURL=Utility.js.map