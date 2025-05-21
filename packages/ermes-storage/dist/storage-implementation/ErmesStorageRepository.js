import { messageChunkSchema, messageDataSchema, serviceMessageSchema } from "./SchemaDefinition.js";
import { createRxDatabase } from "rxdb";
import { getRxStorageLocalstorage } from "rxdb/plugins/storage-localstorage";
// Generic repository backed by PouchDB
export class ErmesStorageRepository {
    constructor(idStorage) {
        this._numberOfElements = 0;
        this._idStorage = idStorage;
        // initialize database and collections
        this.ready = this.init(idStorage);
    }
    async init(idStorage) {
        this._db = await createRxDatabase({
            name: idStorage,
            storage: getRxStorageLocalstorage()
        });
        await this._db.addCollections({
            service: { schema: serviceMessageSchema },
            data: { schema: messageDataSchema },
            chunk: { schema: messageChunkSchema }
        });
    }
    async clear() {
        await this.ready;
        await this._db.remove();
        this._numberOfElements = 0;
        // re-init
        this.ready = this.init(this._idStorage);
        await this.ready;
    }
    numberOfElements() {
        return this._numberOfElements;
    }
    async listOfIds() {
        await this.ready;
        const ids = [];
        // gather from each collection
        for (const name of ['service', 'data', 'chunk']) {
            const coll = this._db.collections[name];
            const docs = await coll.find().exec();
            docs.forEach(doc => ids.push(doc.id));
        }
        return ids;
    }
    async store(dataJson) {
        await this.ready;
        // determine collection: chunk has index+roof, service has reason, else data
        const collName = 'index' in dataJson && 'roof' in dataJson ? 'chunk' :
            'reason' in dataJson ? 'service' :
                'data';
        const coll = this._db.collections[collName];
        // insert record
        await coll.insert(dataJson);
        this._numberOfElements++;
    }
    async retrieve(id) {
        await this.ready;
        // search in each collection
        for (const name of ['service', 'data', 'chunk']) {
            const coll = this._db.collections[name];
            const doc = await coll.findOne(id.toString()).exec();
            if (doc) {
                return doc.toJSON();
            }
        }
        return undefined;
    }
    async delete(id) {
        await this.ready;
        // find and remove
        for (const name of ['service', 'data', 'chunk']) {
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
//# sourceMappingURL=ErmesStorageRepository.js.map