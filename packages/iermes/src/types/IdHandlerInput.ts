import { IIdHandlerRepository } from "../standard-interface/IIdHandler.js"
import { IIdHandlerStorageService } from "../standard-interface/IIdHandlerStorage.js"


export type IdHandlerRepositoryInput = {
    max?: number //= Number.MAX_SAFE_INTEGER, 
    start?: number //= 0
}

export type IdHandlerServiceInput = {
    repo: IIdHandlerRepository, 
    storage?: IIdHandlerStorageService
}
