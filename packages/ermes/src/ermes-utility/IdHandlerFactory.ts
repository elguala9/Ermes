import { IdType, Signal } from "ermes-types";
import { ErmesWbrtcRepositoryInput, IdHandlerRepositoryInput, IdHandlerServiceInput, IErmesWebRtcRepository, IErmesWebRtcService, IIdHandlerFactory, IIdHandlerRepository, IIdHandlerService } from "iermes/index";
import { IdHandlerRepository } from "./IdHandlerRepository.js";
import { IdHandlerService } from "./IdHandlerService.js";


export class IdHandlerFactory implements IIdHandlerFactory {

    
    createRepository(input: IdHandlerRepositoryInput): IIdHandlerRepository {
        return new IdHandlerRepository(input);
    }

    createService(input: Partial<IdHandlerServiceInput>, inputForRepo?: IdHandlerRepositoryInput): IIdHandlerService {
        
        let inputCleaned: IdHandlerServiceInput = {
            ...input,
            repo: input.repo ?? this.createRepository({...inputForRepo}), // if input.repo is undefined i create it
        }
        return new IdHandlerService(inputCleaned);
    }

    
}