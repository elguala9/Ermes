"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPouchMessage = toPouchMessage;
exports.fromPouchMessage = fromPouchMessage;
const buffer_1 = require("buffer");
// 2) Un’unica implementazione “smart” che copre tutti i casi
function toPouchMessage(msg) {
    if ('data' in msg) {
        return {
            ...msg,
            data: buffer_1.Buffer.from(msg.data),
        };
    }
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
//# sourceMappingURL=NormalizeData.js.map