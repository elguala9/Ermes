import { IIdHandlerRepository, IIdHandlerService } from "iermes/index";
export declare class IdHandlerService implements IIdHandlerService {
    private _repo;
    /**
     * @param repo
     * @param storage where data will be stored permanently
     */
    constructor(repo: IIdHandlerRepository);
    getNewId(): number;
    reset(): void;
}
