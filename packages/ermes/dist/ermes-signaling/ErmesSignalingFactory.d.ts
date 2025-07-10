import { IErmesSignalingFactory, IErmesSignalingRepository, IErmesWebRtcService } from "iermes/index";
import { OutputStruct } from "signaling-sdk/Types";
import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";
export declare class ErmesSignalingFactory implements IErmesSignalingFactory {
    create(signaling: ISignalingSdk, webRtc: IErmesWebRtcService): IErmesSignalingRepository<OutputStruct>;
}
