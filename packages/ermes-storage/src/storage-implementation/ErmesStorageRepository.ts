import { IdType, MessageType } from "ermes-types";
import { IErmesStorageRepository } from "iermes/index";
import PouchDB from "pouchdb";

import { createRxDatabase, RxDatabase } from "rxdb";
import { getRxStorageLocalstorage } from "rxdb/plugins/storage-localstorage";

// Generic repository backed by PouchDB
export class ErmesStorageRepository<  
  DataJson extends MessageType  
> implements IErmesStorageRepository<DataJson> {

  private _db!: RxDatabase;
  private ready: Promise<void>;
  private _idStorage: string;
  private _numberOfElements: number = 0;

  constructor(idStorage: string) {
    this._idStorage = idStorage;
    // initialize database and collections
    this.ready = this.init(idStorage);
  }
  destroy(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private async init(idStorage: string): Promise<void> {
    this._db = await createRxDatabase({
      name: idStorage,
      storage: getRxStorageLocalstorage()
    });
    await this._db.addCollections({

    });
  }

  async clear(): Promise<void> {
    await this.ready;
    await this._db.remove();
    this._numberOfElements = 0;
    // re-init
    this.ready = this.init(this._idStorage);
    await this.ready;
  }

  numberOfElements(): number {
    return this._numberOfElements;
  }

  async listOfIds(): Promise<IdType[]> {
    await this.ready;
    const ids: IdType[] = [];
    // gather from each collection
    for (const name of ['service','data','chunk'] as const) {
      const coll = this._db.collections[name];
      const docs = await coll.find().exec();
      docs.forEach(doc => ids.push((doc as any).id));
    }
    return ids;
  }

  async store(dataJson: DataJson): Promise<void> {
    await this.ready;
    // determine collection: chunk has index+roof, service has reason, else data
    const collName =
      'index' in dataJson && 'roof' in dataJson ? 'chunk' :
      'reason' in dataJson              ? 'service' :
                                          'data';
    const coll = this._db.collections[collName];
    // insert record
    await coll.insert(dataJson as any);
    this._numberOfElements++;
  }

  async retrieve(id: IdType): Promise<DataJson | undefined> {
    await this.ready;
    // search in each collection
    for (const name of ['service','data','chunk'] as const) {
      const coll = this._db.collections[name];
      const doc = await coll.findOne(id.toString()).exec();
      if (doc) {
        return doc.toJSON() as DataJson;
      }
    }
    return undefined;
  }

  async delete(id: IdType): Promise<void> {
    await this.ready;
    // find and remove
    for (const name of ['service','data','chunk'] as const) {
      const coll = this._db.collections[name];
      const doc = await coll.findOne(id.toString()).exec();
      if (doc) {
        await doc.remove();
        this._numberOfElements--;
        return;
      }
    }
  }

}
