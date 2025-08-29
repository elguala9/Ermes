import { MessageValue } from "ermes-types";
// 1) ServiceReason (blocchi di 10 ID, qui usiamo IDs  1–10)
export const examplesServiceReason = [
    'c', 's', 'x', 'c', 's', 'x', 'c', 's', 'x', 'c'
];
// 2) MessageValue (IDs 11–20, ma l’ID è solo per associare all’array interno)
export const examplesMessageValue = [
    MessageValue.base,
    MessageValue.chunk,
    MessageValue.service,
    MessageValue.base,
    MessageValue.chunk,
    MessageValue.service,
    MessageValue.base,
    MessageValue.chunk,
    MessageValue.service,
    MessageValue.base
];
// 3) IntegrityCheckType (IDs 21–30)
export const examplesIntegrity = [
    'ok', 'checksum123', '',
    0, 42, -7,
    true, false, true,
    3.14
];
// 4) IdType (IDs 31–40)
export const examplesId = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
// 5) ChunkInfo  (usiamo 41–50 per i chunkId, per tenerli unici)
export const examplesChunkInfo = Array.from({ length: 10 }, (_, i) => ({
    chunkId: 41 + i,
    ...(i % 3 === 1 ? { index: [i] } : i % 3 === 2 ? { index: [i - 1, i] } : {})
}));
// 6) MessageWithId   (IDs 51–60)
export const examplesMessageWithId = Array.from({ length: 10 }, (_, i) => ({
    id: 51 + i
}));
// 7) MessageData     (IDs 61–70)
export const examplesMessageData = Array.from({ length: 10 }, (_, i) => ({
    id: 61 + i,
    data: new Uint8Array([61 + i, 62 + i, 63 + i])
}));
// 8) ChunkMessage    (IDs 71–80)
export const examplesChunkMessage = Array.from({ length: 9 }, (_, i) => ({
    id: 72 + i,
    ref_id: 71,
    data: new Uint8Array([i, i + 1]),
    index: i,
    roof: i + 2
}));
// 9) ServiceMessage  (IDs 81–90)
export const examplesServiceMessage = [
    { id: 81, reason: 'c' },
    { id: 82, reason: 's', arrayId: [82, 83] },
    { id: 83, reason: 'x', arrayChunkInfo: [examplesChunkInfo[0]] },
    { id: 84, reason: 'c', arrayId: [84, 85, 86] },
    { id: 85, reason: 's', arrayChunkInfo: [examplesChunkInfo[1], examplesChunkInfo[2]] },
    { id: 86, reason: 'x' },
    { id: 87, reason: 'c', arrayId: [87] },
    { id: 88, reason: 's', arrayChunkInfo: [] },
    { id: 89, reason: 'x', arrayId: [89, 90] },
    { id: 90, reason: 'c', arrayChunkInfo: [examplesChunkInfo[9]] }
];
// 10) MessageRootErmes (IDs 91–100)
export const examplesMessageRootErmes = Array.from({ length: 10 }, (_, i) => ({
    messageSerialized: new Uint8Array([91 + i]),
    integrityCheckValue: `ic-${91 + i}`
}));
// 11) MessageInternalErmes (IDs 101–110)
export const examplesMessageInternalErmes = examplesMessageData.map((msg, i) => ({
    message: msg,
    type: examplesMessageValue[i]
})).map((item, i) => ({
    ...item,
    // assicuriamoci che l’id interno sia unico: usiamo 101+i
    message: { ...item.message, id: 101 + i }
}));
// 12) MessageChunkErmes (alias di ChunkMessage, IDs 111–120)
export const examplesMessageChunkErmes = examplesChunkMessage.map((chunk, i) => ({
    ...chunk,
    id: 111 + i
}));
//# sourceMappingURL=var.js.map