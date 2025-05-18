import { IdType, MessageType } from "ermes-types";
import { IErmesStorageRepository } from "iermes/index";
import { toPutDocument } from "../UtilityStorage";
import PouchDB from "pouchdb";
import { IdStorageForPouchDB, StorageType } from "src/ErmesStorageType";
import { toPouchMessage } from "src/NormalizaData";

// i need the generic so that i know which type i am storing
export class ErmesStorageRepository<  
  DataJson extends MessageType  
> implements IErmesStorageRepository<DataJson> {

  // il db salva documenti di tipo DataJson & { _id:string }
  private _db: PouchDB.Database<StorageType<DataJson>> = {} as any; // the proble is that the compiler do not see it initialized in the constructor
  private _idStorage: string;
  private _numberOfElements: number = 0;

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
      let res = await this.retrievePrivateStringSafe(docs.rows[i].id);
      ids.push(res.id);
    }
    return ids;
  }

  async store(dataJson: DataJson): Promise<void> {
    let normalized = toPouchMessage(dataJson);
    // 1) Create the document
    const record: StorageType<DataJson> = {
        _id: dataJson.id.toString(),
        ...dataJson
    };
    // 
    const doc = toPutDocument(record);
    await this._db.put(doc);
    this._numberOfElements++;
  }


  async retrieve(id: IdType): Promise<DataJson | undefined> {
    const doc = await this.retrievePrivate(id);
    return doc;
  }

  private async retrievePrivate(id: IdType): Promise<DataJson & IdStorageForPouchDB & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta | undefined> {
    const doc = this.retrievePrivateString(id.toString());
    return doc;
  }

  
  private async retrievePrivateSafe(id: IdType): Promise<DataJson & IdStorageForPouchDB & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta> {
    const doc = this.retrievePrivateStringSafe(id.toString());
    return doc;
  }

  // i want that in case of not found (404) is undefined, in other case i throw again the exception
  private async retrievePrivateString(id: string): Promise<DataJson & IdStorageForPouchDB & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta | undefined> {
    try {
      const doc = await this.retrievePrivateStringSafe(id);
      return doc;
    } catch (err: any) {
      if (err.status === 404) {
        // undefined if not ound
        return undefined;
      } else {
        // other errors not handled
        throw err;
      }
    }
  }

  private async retrievePrivateStringSafe(id: string): Promise<DataJson & IdStorageForPouchDB & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta> {
    return await this._db.get<DataJson & IdStorageForPouchDB>(id);
  }

  

  async delete(id: IdType): Promise<void> {
    // i need the document, not only the DataJson
    let doc = await this.retrievePrivateSafe(id);
    // here i need _id
    this._db.remove(doc);
    this._numberOfElements--;
  }

}

