import { IdAccountType, IErmesFactory, IErmesRepository, IErmesService, IErmesSignalingHandler } from "iermes/index";
import { PacketManager } from "../PacketManager.js";
import { PeerType } from "ermes-types";

export class PacketManagerFactory implements IErmesFactory<PeerType> {
    createService(ermesRepository: IErmesRepository): IErmesService {
        throw new Error("Method not implemented.");
    }
    /**
     * Create the repository
     */
    async createRepository(
        remotePeerId: IdAccountType, 
        ermesSignalingHandler: IErmesSignalingHandler<PeerType>
    ): Promise<IErmesRepository>{
        let socketDTO = await ermesSignalingHandler.getSocket(remotePeerId);
        let repo = new PacketManager(socketDTO);
        return repo;
    }

}
