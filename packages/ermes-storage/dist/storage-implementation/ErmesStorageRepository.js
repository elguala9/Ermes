"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErmesStorageRepository = void 0;
const UtilityStorage_1 = require("../UtilityStorage");
const pouchdb_1 = __importDefault(require("pouchdb"));
const NormalizaData_1 = require("src/NormalizaData");
// i need the generic so that i know which type i am storing
class ErmesStorageRepository {
    constructor(idStorage) {
        // il db salva documenti di tipo DataJson & { _id:string }
        this._db = {}; // the proble is that the compiler do not see it initialized in the constructor
        this._numberOfElements = 0;
        this._idStorage = idStorage;
        this.createDb(idStorage);
    }
    createDb(idStorage) {
        this._db = new pouchdb_1.default(idStorage);
    }
    async clear() {
        await this._db.destroy();
        this.createDb(this._idStorage);
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
        let normalized = (0, NormalizaData_1.toPouchMessage)(dataJson);
        // 1) Create the document
        const record = {
            _id: dataJson.id.toString(),
            ...dataJson
        };
        // 
        const doc = (0, UtilityStorage_1.toPutDocument)(record);
        await this._db.put(doc);
        this._numberOfElements++;
    }
    async retrieve(id) {
        const doc = await this.retrievePrivate(id);
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
        this._db.remove(doc);
        this._numberOfElements--;
    }
}
exports.ErmesStorageRepository = ErmesStorageRepository;
//# sourceMappingURL=ErmesStorageRepository.js.map