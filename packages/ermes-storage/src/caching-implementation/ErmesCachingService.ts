import { IdType, MessageType } from "ermes-types";
import { IErmesCachingRepository, IErmesCachingService } from "iermes/index";


export class ErmesCachingService<  
  DataJson extends MessageType  
> implements IErmesCachingService<DataJson> {

  
  private _repo: IErmesCachingRepository<DataJson>;

  constructor(repo: IErmesCachingRepository<DataJson>) {
    this._repo = repo;
  }

  async destroy(): Promise<void> {
    await this._repo.destroy();
    //    @ts-expect-error vogliamo nullare
    this._repo = null;
  }

  clear(): Promise<void> {
    return this._repo.clear();
  }

  numberOfElements(): number {
    return this._repo.numberOfElements();
  }
  
  listOfIds(): Promise<IdType[]> {
    return this._repo.listOfIds();
  }

  async store(data: DataJson): Promise<void> {
    return this._repo.store(data);
  }

  async retrieve(id: IdType): Promise<DataJson | undefined> {
    return this._repo.retrieve(id);
  }

  async delete(id: IdType): Promise<void> {
    return this._repo.delete(id);
  }

}

