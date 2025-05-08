import { IdType, MessageType } from "ermes-types";
import { IErmesCachingRepository, IErmesCachingService } from "iermes/index";


export class ErmesCachingService<  
  DataJson extends MessageType  
> implements IErmesCachingService<DataJson> {

  
  private repo: IErmesCachingRepository<DataJson>;

  constructor(repo: IErmesCachingRepository<DataJson>) {
    this.repo = repo;
  }

  clear(): Promise<void> {
    return this.repo.clear();
  }

  numberOfElements(): number {
    return this.repo.numberOfElements();
  }
  
  listOfIds(): Promise<IdType[]> {
    return this.repo.listOfIds();
  }

  async store(data: DataJson): Promise<void> {
    return this.repo.store(data);
  }

  async retrieve(id: IdType): Promise<DataJson | undefined> {
    return this.repo.retrieve(id);
  }

  async delete(id: IdType): Promise<void> {
    this.repo.delete(id);
  }

}

