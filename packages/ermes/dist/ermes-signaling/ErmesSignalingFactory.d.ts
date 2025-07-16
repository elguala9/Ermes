import { IErmesSignalingFactory, IErmesSignalingHandler, IErmesSignalingRepository, IErmesSignalingServer, SignalType } from "iermes/index";
import { PeerType } from "src/ermes-implementation/IceProtocol/SignalManager.js";
export declare class ErmesSignalingFactory implements IErmesSignalingFactory {
    create(signalingServer: IErmesSignalingServer, signalHandler: IErmesSignalingHandler<PeerType>): IErmesSignalingRepository<SignalType>;
}
