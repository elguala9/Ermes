import { IdAccountType } from "src/signaling-interface/IErmesSignaling.js";
import { IErmesSignalingHandler } from "src/signaling-interface/IErmesSignalingHandler.js";
import { IErmesRepository, IErmesService } from "./IErmes.js";

 
export interface IErmesFactory<SocketType> {
    /**
     * Create the repository
     */
    createRepository(
        remotePeerId: IdAccountType, 
        ermesSignalingHandler: IErmesSignalingHandler<SocketType>
    ): Promise<IErmesRepository>;
    
    /**
     * Create the service
     */
    createService(ermesRepository: IErmesRepository): IErmesService;
}
