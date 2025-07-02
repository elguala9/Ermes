import { IdHandlerRepositoryInput, IdHandlerServiceInput, IIdHandlerFactory, IIdHandlerRepository, IIdHandlerService } from "iermes/index";
export declare class IdHandlerFactory implements IIdHandlerFactory {
    r: any;
    createRepository(input: IdHandlerRepositoryInput): IIdHandlerRepository;
    createService(input: Partial<IdHandlerServiceInput>, inputForRepo?: IdHandlerRepositoryInput): IIdHandlerService;
}
