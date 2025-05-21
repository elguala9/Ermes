import { IIdHandlerRepository, IIdHandlerService, IIdHandlerStorageService } from "iermes/index";
export declare class IdHandlerService implements IIdHandlerService {
    private _repo;
    private _storage?;
    /**
     * @param repo
     * @param storage where data will be stored permanently
     */
    constructor(repo: IIdHandlerRepository, storage?: IIdHandlerStorageService);
    private storeNewId;
    getNewId(): number;
    reset(): void;
}
