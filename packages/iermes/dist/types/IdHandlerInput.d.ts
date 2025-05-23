import { IIdHandlerRepository } from "../standard-interface/IIdHandler.js";
import { IIdHandlerStorageService } from "../standard-interface/IIdHandlerStorage.js";
export type IdHandlerRepositoryInput = {
    max?: number;
    start?: number;
};
export type IdHandlerServiceInput = {
    repo: IIdHandlerRepository;
    storage?: IIdHandlerStorageService;
};
