import { IdHandlerRepositoryInput, IdHandlerServiceInput, IIdHandlerFactory, IIdHandlerRepository, IIdHandlerService } from "iermes/index";
export declare class IdHandlerFactory implements IIdHandlerFactory {
    createRepository(input: IdHandlerRepositoryInput): IIdHandlerRepository;
    createService(input: Partial<IdHandlerServiceInput>, inputForRepo?: IdHandlerRepositoryInput): IIdHandlerService;
}
