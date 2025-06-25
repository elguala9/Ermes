import { ethers } from "ethers";
import { OutputStruct } from "./Types"
import { SignalStructOutput } from "./typeschain/contracts/ISignaling"


export function toOutputStruct(struct: SignalStructOutput): OutputStruct {
    let output: OutputStruct = {
        signal: ethers.toUtf8String(struct.signal),
        creationTime_EpochInSeconds: struct.creationTime.toString()
    }
    return output;
}