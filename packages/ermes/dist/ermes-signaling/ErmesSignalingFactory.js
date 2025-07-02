import { ErmesSignalingRepository } from "./ErmesSignalingRepository.js";
export class ErmesSignalingFactory {
    create(signaling, webRtc) {
        return new ErmesSignalingRepository(signaling, webRtc);
    }
}
//# sourceMappingURL=ErmesSignalingFactory.js.map