import { IdType, MessageType } from "ermes-types";
import { IErmesStorageRepository, IErmesStorageService } from "iermes/index";





export class ErmesStorageService<  
  DataJson extends MessageType  
> implements IErmesStorageService<DataJson> {

  // il db salva documenti di tipo DataJson & { _id:string }
  private repo: IErmesStorageRepository<DataJson>;

  constructor(repo: IErmesStorageRepository<DataJson>) {
    this.repo = repo;
  }
  destroy(): Promise<void> {
    return this.repo.destroy();
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

  async delete(id: IdType): Promise<boolean> {
    return this.repo.delete(id);
  }

}

