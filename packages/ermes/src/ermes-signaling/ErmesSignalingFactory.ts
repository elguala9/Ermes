import { IErmesSignalingFactory, IErmesSignalingHandler, IErmesSignalingRepository, IErmesSignalingServer, IErmesWebRtcService, SignalType } from "iermes/index";
import { ISignalingMultiOfferSdk } from "signaling-sdk/ISignalingMultiOfferSdk";

import { OutputStruct } from "signaling-sdk/Types";
import { ErmesSignalingRepository } from "./ErmesSignalingRepository.js";
import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";



export class ErmesSignalingFactory implements IErmesSignalingFactory {
  create(signalingServer: IErmesSignalingServer, signalHandler: IErmesSignalingHandler): IErmesSignalingRepository<SignalType> {
    return new ErmesSignalingRepository(signalingServer, signalHandler);
  }

}