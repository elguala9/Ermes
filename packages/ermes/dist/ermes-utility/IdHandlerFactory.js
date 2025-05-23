import { IdHandlerRepository } from "./IdHandlerRepository.js";
import { IdHandlerService } from "./IdHandlerService.js";
export class IdHandlerFactory {
    createRepository(input) {
        return new IdHandlerRepository(input);
    }
    createService(input, inputForRepo) {
        let inputCleaned = {
            ...input,
            repo: input.repo ?? this.createRepository({ ...inputForRepo }), // if input.repo is undefined i create it
        };
        return new IdHandlerService(inputCleaned);
    }
}
//# sourceMappingURL=IdHandlerFactory.js.map