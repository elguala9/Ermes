import { IErmesSignalingFactory, IErmesSignalingRepository, IErmesWebRtcService } from "iermes/index";
import { ISignalingMultiOfferSdk } from "signaling-sdk/ISignalingMultiOfferSdk";

import { OutputStruct } from "signaling-sdk/Types";
import { ErmesSignalingRepository } from "./ErmesSignalingRepository.js";
import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";



export class ErmesSignalingFactory implements IErmesSignalingFactory {
  create(signaling: ISignalingSdk, webRtc: IErmesWebRtcService): IErmesSignalingRepository<OutputStruct> {
    return new ErmesSignalingRepository(signaling, webRtc);
  }

}