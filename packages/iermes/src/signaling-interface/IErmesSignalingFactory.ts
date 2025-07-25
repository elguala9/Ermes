

import { PeerType } from "ermes-types";
import { IErmesSignalingRepository } from "./IErmesSignaling.js";
import { IErmesSignalingHandler } from "./IErmesSignalingHandler.js";
import { IErmesSignalingServer, SignalType } from "./IErmesSignalingServer.js";

export interface IErmesSignalingFactory {
    //createFromFactory(signaling: ISignalingSdkFactory, webRtc: IErmesWebRtcFactory): IErmesSignalingRepository<OutputStruct>;
    create(signalingServer: IErmesSignalingServer, 
        signalHandler: IErmesSignalingHandler<PeerType>)
        : IErmesSignalingRepository<SignalType>;
    /*create(signaling: ISignalingSdk, webRtc: IErmesWebRtcService): IErmesSignalingService;
    createFromRepo(repo: IErmesSignalingRepository<OutputStruct>): IErmesSignalingService;*/
}