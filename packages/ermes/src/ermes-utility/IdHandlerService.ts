import { IdType } from "ermes-types";
import { IdHandlerServiceInput, IIdHandlerRepository, IIdHandlerService, IIdHandlerStorageService } from "iermes/index";






  export class IdHandlerService implements IIdHandlerService {
      private _repo: IIdHandlerRepository
      private _storage?: IIdHandlerStorageService
    
      /**
       * @param repo 
       * @param storage where data will be stored permanently
       */
      constructor({repo, storage}: IdHandlerServiceInput) {
        this._repo = repo;
        this._storage = storage;
      }

      private storeNewId(newId: IdType){
        if(this._storage)
          this._storage.update(newId);
      }
    
      public getNewId(): number {
        let newId: IdType = this._repo.getNewId();
        this.storeNewId(newId);
        return newId;
      }
    
      public reset(): void {
        this._repo.reset();
        let res = this._repo.getCurrent();
        this.storeNewId(res);
      }
    }