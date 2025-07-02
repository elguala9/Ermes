import { IErmesSignalingFactory, IErmesSignalingRepository, IErmesWebRtcService } from "iermes/index";
import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";
import { ErmesSignalingRepository } from "./ErmesSignalingRepository.js";
import { OutputStruct } from "signaling-sdk/Types";



export class ErmesSignalingFactory implements IErmesSignalingFactory {
  create(signaling: ISignalingSdk, webRtc: IErmesWebRtcService): IErmesSignalingRepository<OutputStruct> {
    return new ErmesSignalingRepository(signaling, webRtc);
  }

}