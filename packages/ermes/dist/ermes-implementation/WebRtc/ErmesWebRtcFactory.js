// src/ErmesRepository.ts
import { ErmesWebRtcRepository } from "./ErmesWebRtcRepository.js";
import { ErmesWebRtcService } from "./ErmesWebRtcService.js";
import { IdHandlerFactory } from "../../ermes-utility/IdHandlerFactory.js";
export class ErmesWebRtcFactory {
    createRepository(input) {
        return new ErmesWebRtcRepository(input);
    }
    createService(input, inputForRepo) {
        let inputCleaned = ({
            ...input,
            idHandler: input.idHandler ?? new IdHandlerFactory().createService({}),
            messageCallback: () => { }, // needed to be fixed, it should probably become undefined
            repository: input.repository ?? this.createRepository({ ...inputForRepo }),
        });
        return new ErmesWebRtcService(inputCleaned);
    }
    connectRepository(repo, answer) {
        repo.setSignal(answer);
        return repo;
    }
    connectService(service, answer) {
        service.setSignal(answer);
        return service;
    }
}
//# sourceMappingURL=ErmesWebRtcFactory.js.map