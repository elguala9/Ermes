import { toPutDocument } from "../UtilityStorage.js";
import PouchDB from "pouchdb";
// i need the generic so that i know which type i am storing
export class ErmesStorageRepository {
    constructor(idStorage) {
        this._numberOfElements = 0;
        this._idStorage = idStorage;
        this.createDb(idStorage);
    }
    createDb(idStorage) {
        this._db = new PouchDB(idStorage);
    }
    async clear() {
        await this._db.destroy();
        this.createDb(this._idStorage);
        this._numberOfElements = 0;
    }
    numberOfElements() {
        return this._numberOfElements;
    }
    async listOfIds() {
        let docs = await this._db.allDocs();
        let ids = [];
        for (let i = 0; i < docs.rows.length; i++) {
            let res = await this.retrievePrivateStringSafe(docs.rows[i].id);
            ids.push(res.id);
        }
        return ids;
    }
    async store(dataJson) {
        // 1) Create the document
        const record = {
            _id: dataJson.id.toString(),
            ...dataJson
        };
        const doc = toPutDocument(record);
        await this._db.put(doc);
        this._numberOfElements++;
    }
    async retrieve(id) {
        const doc = await this.retrievePrivate(id);
        console.log();
        return doc;
    }
    async retrievePrivate(id) {
        const doc = this.retrievePrivateString(id.toString());
        return doc;
    }
    async retrievePrivateSafe(id) {
        const doc = this.retrievePrivateStringSafe(id.toString());
        return doc;
    }
    // i want that in case of not found (404) is undefined, in other case i throw again the exception
    async retrievePrivateString(id) {
        try {
            const doc = await this.retrievePrivateStringSafe(id);
            return doc;
        }
        catch (err) {
            if (err.status === 404) {
                // undefined if not ound
                return undefined;
            }
            else {
                // other errors not handled
                throw err;
            }
        }
    }
    async retrievePrivateStringSafe(id) {
        return await this._db.get(id);
    }
    async delete(id) {
        // i need the document, not only the DataJson
        let doc = await this.retrievePrivateSafe(id);
        // here i need _id
        await this._db.remove(doc);
        this._numberOfElements--;
    }
}
//# sourceMappingURL=ErmesStorageRepository.js.map