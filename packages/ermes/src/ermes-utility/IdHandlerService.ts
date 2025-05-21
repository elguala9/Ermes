import { IdType } from "ermes-types";
import { IIdHandlerRepository, IIdHandlerService, IIdHandlerStorageService } from "iermes/index";






  export class IdHandlerService implements IIdHandlerService {
      private _repo: IIdHandlerRepository
    
      /**
       * @param repo 
       * @param storage where data will be stored permanently
       */
      constructor(repo: IIdHandlerRepository) {
        this._repo = repo;
      }
    
      public getNewId(): number {
        return this._repo.getNewId();
      }
    
      public reset(): void {
        return this._repo.reset();
      }
    }