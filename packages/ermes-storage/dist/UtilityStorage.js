"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPutDocument = toPutDocument;
/**
 * Avvolge un oggetto T in un PutDocument<T>, aggiungendo _id,
 * e opzionalmente _rev e _attachments se forniti.
 */
function toPutDocument(data, rev, attachments) {
    // Costruisco il documento includendo solo i campi presenti
    const doc = {
        // aggiungo _rev se passato
        ...(rev ? { _rev: rev } : {}),
        // aggiungo _attachments se passato
        ...(attachments ? { _attachments: attachments } : {}),
        // infine i campi del tuo oggetto
        ...data,
    };
    // Cast finale a PutDocument<T>, perché sappiamo che ha almeno T & BasicDocument
    return doc;
}
//# sourceMappingURL=UtilityStorage.js.map