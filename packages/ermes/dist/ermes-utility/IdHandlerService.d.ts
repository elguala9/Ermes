import { IdHandlerServiceInput, IIdHandlerService } from "iermes/index";
export declare class IdHandlerService implements IIdHandlerService {
    private _repo;
    private _storage?;
    /**
     * @param repo
     * @param storage where data will be stored permanently
     */
    constructor({ repo, storage }: IdHandlerServiceInput);
    private storeNewId;
    getNewId(): number;
    reset(): void;
}
