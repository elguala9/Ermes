import { IErmesSignalingRepository } from "./IErmesSignaling.js";
import { IErmesSignalingHandler } from "./IErmesSignalingHandler.js";
import { IErmesSignalingServer, SignalType } from "./IErmesSignalingServer.js";
export interface IErmesSignalingFactory {
    create(signalingServer: IErmesSignalingServer, signalHandler: IErmesSignalingHandler<PeerType>): IErmesSignalingRepository<SignalType>;
}
