import { OutputStruct } from "./Types"
import { SignalStructOutput } from "./typeschain/contracts/ISignaling"


export function toOutputStruct(struct: SignalStructOutput): OutputStruct {
    let output: OutputStruct = {
        signal: struct.signal,
        creationTime_EpochInSeconds: struct.creationTime.toString()
    }
    return output;
}