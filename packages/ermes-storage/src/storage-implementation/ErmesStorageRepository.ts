import { IdStorageForPouchDB, IdType, MessageType, StorageType } from "ermes-types";
import { IErmesStorageRepository } from "iermes/index";
import { toPutDocument } from "../UtilityStorage";



export class ErmesStorageRepository<  
  DataJson extends MessageType  
> implements IErmesStorageRepository<DataJson> {

  // il db salva documenti di tipo DataJson & { _id:string }
  private _db: PouchDB.Database<StorageType<DataJson>>;
  private _idStorage: string;
  private _numberOfElements: number;

  constructor(idStorage: string) {
    this._idStorage = idStorage;
    this.createDb(idStorage);
  }

  private createDb(idStorage: string){
    this._db = new PouchDB<StorageType<DataJson>>(idStorage);
  }
  
  async clear(): Promise<void> {
    await this._db.destroy();
    this.createDb(this._idStorage);
  }

  numberOfElements(): number {
    return this._numberOfElements;
  }

  async listOfIds(): Promise<IdType[]> {
    let docs = await this._db.allDocs();
    let ids: IdType[] = [];
    for(let i = 0; i < docs.rows.length; i++){
      let res = await this.retrievePrivateString(docs.rows[i].id);
      ids.push(res.id);
    }
    return ids;
  }

  async store(data: DataJson): Promise<void> {

    // 1) Costruiamo un PutDocument<T>
    const record: StorageType<DataJson> = {
        _id: data.id.toString(),
        ...data
    };
    // 
    const doc = toPutDocument(record);
    await this._db.put(doc);
    this._numberOfElements++;
  }

  async retrieve(id: IdType): Promise<DataJson> {
    const doc = await this.retrievePrivate(id);
    return doc;
  }

  private async retrievePrivate(id: IdType): Promise<DataJson & IdStorageForPouchDB & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta> {
    const doc = this.retrievePrivateString(id.toString());
    return doc;
  }

  private async retrievePrivateString(id: string): Promise<DataJson & IdStorageForPouchDB & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta> {
    const doc = await this._db.get<DataJson & IdStorageForPouchDB>(id);
    
    return doc;
  }

  async delete(id: IdType): Promise<void> {
    let doc = await this.retrievePrivate(id);
    // qui ho bisogno di _id
    this._db.remove(doc);
    this._numberOfElements--;
  }

}

