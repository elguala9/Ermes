import { IdHandlerRepositoryInput, IdHandlerServiceInput } from "src/types/IdHandlerInput.js";
import { IIdHandlerRepository, IIdHandlerService } from "./IIdHandler.js";

 
export interface IIdHandlerFactory {
    /**
     * 
     * @param input same input as IdHandlerRepository
     */
    createRepository(input: IdHandlerRepositoryInput): IIdHandlerRepository;
    
    /**
     * Create the service
     * @param input same input as IdHandlerService
     * @param inputForRepo only used if the repo inside input is undefined
     */
    //// I use Partial because in this way everything is optional.
    createService(input: Partial<IdHandlerServiceInput>, inputForRepo?: IdHandlerRepositoryInput): IIdHandlerService;
}
