// src/ErmesRepository.ts

import { Signal } from "ermes-types";
import { ErmesWbrtcRepositoryInput, ErmesWebRtcServiceInput, IErmesWebRtcFactory, IErmesWebRtcRepository, IErmesWebRtcService } from "iermes/index";
import { ErmesWebRtcRepository } from "./ErmesWebRtcRepository.js";
import { ErmesWebRtcService } from "./ErmesWebRtcService.js";
import { IdHandlerFactory } from "../../ermes-utility/IdHandlerFactory.js";








export class ErmesWebRtcFactory implements IErmesWebRtcFactory{
    createRepository(input: ErmesWbrtcRepositoryInput): IErmesWebRtcRepository {
        return new ErmesWebRtcRepository(input);
    }

    createService(input: Partial<ErmesWebRtcServiceInput>, inputForRepo?: ErmesWbrtcRepositoryInput): IErmesWebRtcService {
            
        let inputCleaned: ErmesWebRtcServiceInput = ({
            ...input,
            idHandler: input.idHandler ?? new IdHandlerFactory().createService({}),
            messageCallback: () => {},// needed to be fixed, it should probably become undefined
            repository: input.repository ?? this.createRepository({...inputForRepo}),
            
        });
        return new ErmesWebRtcService(inputCleaned)
    }

    connectRepository(repo: IErmesWebRtcRepository, answer: Signal): IErmesWebRtcRepository {
        repo.setSignal(answer);
        return repo;
    }

    connectService(service: IErmesWebRtcService, answer: Signal): IErmesWebRtcService {
        service.setSignal(answer);
        return service;
    }

}