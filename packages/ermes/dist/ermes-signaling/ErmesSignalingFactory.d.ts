import { IErmesSignalingFactory, IErmesSignalingRepository, IErmesWebRtcService } from "iermes/index";
import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";
import { OutputStruct } from "signaling-sdk/Types";
export declare class ErmesSignalingFactory implements IErmesSignalingFactory {
    create(signaling: ISignalingSdk, webRtc: IErmesWebRtcService): IErmesSignalingRepository<OutputStruct>;
}
