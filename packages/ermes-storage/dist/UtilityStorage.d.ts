/**
 * Avvolge un oggetto T in un PutDocument<T>, aggiungendo _id,
 * e opzionalmente _rev e _attachments se forniti.
 */
export declare function toPutDocument<T extends object>(data: T, rev?: string, attachments?: PouchDB.Core.Attachments): PouchDB.Core.PutDocument<T>;
