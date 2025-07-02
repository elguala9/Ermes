

import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";
import { OutputStruct } from "signaling-sdk/Types";
import { IErmesWebRtcService } from "src/standard-interface/IErmesWebRtc.js";
import { IErmesSignalingRepository, IErmesSignalingService } from "./IErmesSignaling.js";

export interface IErmesSignalingFactory {
    //createFromFactory(signaling: ISignalingSdkFactory, webRtc: IErmesWebRtcFactory): IErmesSignalingRepository<OutputStruct>;
    create(signaling: ISignalingSdk, webRtc: IErmesWebRtcService): IErmesSignalingRepository<OutputStruct>;
    /*create(signaling: ISignalingSdk, webRtc: IErmesWebRtcService): IErmesSignalingService;
    createFromRepo(repo: IErmesSignalingRepository<OutputStruct>): IErmesSignalingService;*/
}