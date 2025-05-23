import { IdHandlerRepositoryInput, IdHandlerServiceInput, IIdHandlerRepository, IIdHandlerService } from "../index.js";
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
    createService(input: Partial<IdHandlerServiceInput>, inputForRepo?: IdHandlerRepositoryInput): IIdHandlerService;
}
