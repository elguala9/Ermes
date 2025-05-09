"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.examplesMessageChunkErmes = exports.examplesMessageInternalErmes = exports.examplesMessageRootErmes = exports.examplesServiceMessage = exports.examplesChunkMessage = exports.examplesMessageData = exports.examplesMessageWithId = exports.examplesChunkInfo = exports.examplesId = exports.examplesIntegrity = exports.examplesMessageValue = exports.examplesServiceReason = void 0;
const ermes_types_1 = require("ermes-types");
// 1) ServiceReason (blocchi di 10 ID, qui usiamo IDs  1–10)
exports.examplesServiceReason = [
    'c', 's', 'x', 'c', 's', 'x', 'c', 's', 'x', 'c'
];
// 2) MessageValue (IDs 11–20, ma l’ID è solo per associare all’array interno)
exports.examplesMessageValue = [
    ermes_types_1.MessageValue.base,
    ermes_types_1.MessageValue.chunk,
    ermes_types_1.MessageValue.service,
    ermes_types_1.MessageValue.base,
    ermes_types_1.MessageValue.chunk,
    ermes_types_1.MessageValue.service,
    ermes_types_1.MessageValue.base,
    ermes_types_1.MessageValue.chunk,
    ermes_types_1.MessageValue.service,
    ermes_types_1.MessageValue.base
];
// 3) IntegrityCheckType (IDs 21–30)
exports.examplesIntegrity = [
    'ok', 'checksum123', '',
    0, 42, -7,
    true, false, true,
    3.14
];
// 4) IdType (IDs 31–40)
exports.examplesId = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
// 5) ChunkInfo  (usiamo 41–50 per i chunkId, per tenerli unici)
exports.examplesChunkInfo = Array.from({ length: 10 }, (_, i) => ({
    chunkId: `c${41 + i}`,
    ...(i % 3 === 1 ? { index: [i] } : i % 3 === 2 ? { index: [i - 1, i] } : {})
}));
// 6) MessageWithId   (IDs 51–60)
exports.examplesMessageWithId = Array.from({ length: 10 }, (_, i) => ({
    id: 51 + i
}));
// 7) MessageData     (IDs 61–70)
exports.examplesMessageData = Array.from({ length: 10 }, (_, i) => ({
    id: 61 + i,
    data: new Uint8Array([61 + i, 62 + i, 63 + i])
}));
// 8) ChunkMessage    (IDs 71–80)
exports.examplesChunkMessage = Array.from({ length: 10 }, (_, i) => ({
    id: 71 + i,
    data: new Uint8Array([i, i + 1]),
    index: i,
    roof: i + 2
}));
// 9) ServiceMessage  (IDs 81–90)
exports.examplesServiceMessage = [
    { id: 81, reason: 'c' },
    { id: 82, reason: 's', arrayId: [82, 83] },
    { id: 83, reason: 'x', arrayChunkInfo: [exports.examplesChunkInfo[0]] },
    { id: 84, reason: 'c', arrayId: [84, 85, 86] },
    { id: 85, reason: 's', arrayChunkInfo: [exports.examplesChunkInfo[1], exports.examplesChunkInfo[2]] },
    { id: 86, reason: 'x' },
    { id: 87, reason: 'c', arrayId: [87] },
    { id: 88, reason: 's', arrayChunkInfo: [] },
    { id: 89, reason: 'x', arrayId: [89, 90] },
    { id: 90, reason: 'c', arrayChunkInfo: [exports.examplesChunkInfo[9]] }
];
// 10) MessageRootErmes (IDs 91–100)
exports.examplesMessageRootErmes = Array.from({ length: 10 }, (_, i) => ({
    messageSerialized: new Uint8Array([91 + i]),
    integrityCheckValue: `ic-${91 + i}`
}));
// 11) MessageInternalErmes (IDs 101–110)
exports.examplesMessageInternalErmes = exports.examplesMessageData.map((msg, i) => ({
    message: msg,
    type: exports.examplesMessageValue[i]
})).map((item, i) => ({
    ...item,
    // assicuriamoci che l’id interno sia unico: usiamo 101+i
    message: { ...item.message, id: 101 + i }
}));
// 12) MessageChunkErmes (alias di ChunkMessage, IDs 111–120)
exports.examplesMessageChunkErmes = exports.examplesChunkMessage.map((chunk, i) => ({
    ...chunk,
    id: 111 + i
}));
//# sourceMappingURL=var.js.map