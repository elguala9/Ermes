import { ErmesSignalingRepository } from "./ErmesSignalingRepository.js";
export class ErmesSignalingFactory {
    create(signalingServer, signalHandler) {
        return new ErmesSignalingRepository(signalingServer, signalHandler);
    }
}
//# sourceMappingURL=ErmesSignalingFactory.js.map