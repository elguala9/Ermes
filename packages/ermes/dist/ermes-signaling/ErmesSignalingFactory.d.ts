import { IErmesSignalingFactory, IErmesSignalingHandler, IErmesSignalingRepository, IErmesSignalingServer, SignalType } from "iermes/index";
export declare class ErmesSignalingFactory implements IErmesSignalingFactory {
    create(signalingServer: IErmesSignalingServer, signalHandler: IErmesSignalingHandler): IErmesSignalingRepository<SignalType>;
}
