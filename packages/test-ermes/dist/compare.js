"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eqServiceReason = eqServiceReason;
exports.eqMessageValue = eqMessageValue;
exports.eqIntegrityCheckType = eqIntegrityCheckType;
exports.eqIdType = eqIdType;
exports.eqChunkInfo = eqChunkInfo;
exports.eqMessageWithId = eqMessageWithId;
exports.eqMessageData = eqMessageData;
exports.eqChunkMessage = eqChunkMessage;
exports.eqServiceMessage = eqServiceMessage;
exports.eqMessageRootErmes = eqMessageRootErmes;
exports.eqMessageType = eqMessageType;
exports.eqMessageInternalErmes = eqMessageInternalErmes;
exports.eqMessageChunkErmes = eqMessageChunkErmes;
/** 1) ServiceReason */
function eqServiceReason(a, b) {
    return a === b;
}
/** 2) MessageValue */
function eqMessageValue(a, b) {
    return a === b;
}
/** 3) IntegrityCheckType (string | number | boolean) */
function eqIntegrityCheckType(a, b) {
    return a === b;
}
/** 4) IdType = number */
function eqIdType(a, b) {
    return a === b;
}
/** 5) ChunkInfo */
function eqChunkInfo(a, b) {
    if (a.chunkId !== b.chunkId)
        return false;
    if (a.index === b.index)
        return true;
    if (!a.index || !b.index)
        return false;
    if (a.index.length !== b.index.length)
        return false;
    return a.index.every((v, i) => v === b.index[i]);
}
/** 6) MessageWithId */
function eqMessageWithId(a, b) {
    return eqIdType(a.id, b.id);
}
/** 7) MessageData */
function eqMessageData(a, b) {
    if (!eqMessageWithId(a, b))
        return false;
    if (a.data.length !== b.data.length)
        return false;
    for (let i = 0; i < a.data.length; i++) {
        if (a.data[i] !== b.data[i])
            return false;
    }
    return true;
}
/** 8) ChunkMessage */
function eqChunkMessage(a, b) {
    if (!eqMessageData(a, b))
        return false;
    return a.index === b.index && a.roof === b.roof;
}
/** 9) ServiceMessage */
function eqServiceMessage(a, b) {
    if (!eqMessageWithId(a, b))
        return false;
    if (a.reason !== b.reason)
        return false;
    // arrayChunkInfo?
    if (a.arrayChunkInfo === b.arrayChunkInfo) {
        // ok (incluso entrambi undefined)
    }
    else {
        if (!a.arrayChunkInfo || !b.arrayChunkInfo)
            return false;
        if (a.arrayChunkInfo.length !== b.arrayChunkInfo.length)
            return false;
        for (let i = 0; i < a.arrayChunkInfo.length; i++) {
            if (!eqChunkInfo(a.arrayChunkInfo[i], b.arrayChunkInfo[i]))
                return false;
        }
    }
    // arrayId?
    if (a.arrayId === b.arrayId) {
    }
    else {
        if (!a.arrayId || !b.arrayId)
            return false;
        if (a.arrayId.length !== b.arrayId.length)
            return false;
        for (let i = 0; i < a.arrayId.length; i++) {
            if (a.arrayId[i] !== b.arrayId[i])
                return false;
        }
    }
    return true;
}
/** 10) MessageRootErmes */
function eqMessageRootErmes(a, b) {
    if (a.integrityCheckValue !== b.integrityCheckValue)
        return false;
    if (a.messageSerialized.length !== b.messageSerialized.length)
        return false;
    for (let i = 0; i < a.messageSerialized.length; i++) {
        if (a.messageSerialized[i] !== b.messageSerialized[i])
            return false;
    }
    return true;
}
/** Helper per MessageType (MessageData | ChunkMessage | ServiceMessage) */
function eqMessageType(a, b) {
    // discriminatore implicito: presenza di campi
    if ("data" in a && "index" in a && "roof" in a && "data" in b) {
        return eqChunkMessage(a, b);
    }
    else if ("data" in a && !("index" in a) && "data" in b) {
        return eqMessageData(a, b);
    }
    else if (!("data" in a) && "reason" in a && "reason" in b) {
        return eqServiceMessage(a, b);
    }
    return false;
}
/** 11) MessageInternalErmes */
function eqMessageInternalErmes(a, b) {
    if (!eqMessageValue(a.type, b.type))
        return false;
    return eqMessageType(a.message, b.message);
}
/** 12) MessageChunkErmes (alias di ChunkMessage) */
function eqMessageChunkErmes(a, b) {
    return eqChunkMessage(a, b);
}
//# sourceMappingURL=compare.js.map