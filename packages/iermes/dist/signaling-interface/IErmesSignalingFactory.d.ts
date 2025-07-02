import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";
import { OutputStruct } from "signaling-sdk/Types";
import { IErmesWebRtcService } from "src/standard-interface/IErmesWebRtc.js";
import { IErmesSignalingRepository } from "./IErmesSignaling.js";
export interface IErmesSignalingFactory {
    create(signaling: ISignalingSdk, webRtc: IErmesWebRtcService): IErmesSignalingRepository<OutputStruct>;
}
