import { PacketManager } from "../PacketManager.js";
export class PacketManagerFactory {
    createService(ermesRepository) {
        throw new Error("Method not implemented.");
    }
    /**
     * Create the repository
     */
    async createRepository(remotePeerId, ermesSignalingHandler) {
        let socketDTO = await ermesSignalingHandler.getSocket(remotePeerId);
        let repo = new PacketManager(socketDTO);
        return repo;
    }
}
//# sourceMappingURL=PacketManagerFactory.js.map