import { IErmesSignalingFactory, IErmesSignalingHandler, IErmesSignalingRepository, IErmesSignalingServer, SignalType } from "iermes/index";
import { PeerType } from "ermes-types";
export declare class ErmesSignalingFactory implements IErmesSignalingFactory {
    create(signalingServer: IErmesSignalingServer, signalHandler: IErmesSignalingHandler<PeerType>): IErmesSignalingRepository<SignalType>;
}
