"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPouchMessage = toPouchMessage;
exports.fromPouchMessage = fromPouchMessage;
const buffer_1 = require("buffer");
//
// * Overload signatures *
//
function toPouchMessage(msg) {
    // Se è un messaggio con campo `data`, converto Uint8Array → Buffer
    if ('data' in msg) {
        return {
            ...msg,
            data: buffer_1.Buffer.from(msg.data) // Buffer.from(Uint8Array) copia i byte
        };
    }
    // ServiceMessage non ha data: lo restituisco invariato
    return msg;
}
//
// * E il viceversa *
//
function fromPouchMessage(msg) {
    // Se è un messaggio con campo `data`, converto Buffer → Uint8Array
    if ('data' in msg) {
        const buf = msg.data;
        // creo un Uint8Array views sullo stesso ArrayBuffer
        const u8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
        return {
            ...msg,
            data: u8
        };
    }
    // ServiceMessage non ha data
    return msg;
}
//# sourceMappingURL=NormalizaData.js.map