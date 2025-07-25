import { IdAccountType, IErmesFactory, IErmesRepository, IErmesService, IErmesSignalingHandler } from "iermes/index";
import { PeerType } from "ermes-types";
export declare class PacketManagerFactory implements IErmesFactory<PeerType> {
    createService(ermesRepository: IErmesRepository): IErmesService;
    /**
     * Create the repository
     */
    createRepository(remotePeerId: IdAccountType, ermesSignalingHandler: IErmesSignalingHandler<PeerType>): Promise<IErmesRepository>;
}
