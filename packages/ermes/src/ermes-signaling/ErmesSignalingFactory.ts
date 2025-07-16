import { IErmesSignalingFactory, IErmesSignalingHandler, IErmesSignalingRepository, IErmesSignalingServer, SignalType } from "iermes/index";


import { ErmesSignalingRepository } from "./ErmesSignalingRepository.js";
import { PeerType } from "src/ermes-implementation/IceProtocol/SignalManager.js";



export class ErmesSignalingFactory implements IErmesSignalingFactory {
  create(signalingServer: IErmesSignalingServer, signalHandler: IErmesSignalingHandler<PeerType>): IErmesSignalingRepository<SignalType> {
    return new ErmesSignalingRepository(signalingServer, signalHandler);
  }

}