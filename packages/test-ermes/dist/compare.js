function notEqual(a, b) {
    console.log("First Object: --------- ");
    console.log(a);
    console.log("Second Object: --------- ");
    console.log(b);
    return false;
}
/** 1) ServiceReason */
export function eqServiceReason(a, b) {
    return a === b;
}
/** 2) MessageValue */
export function eqMessageValue(a, b) {
    return a === b;
}
/** 3) IntegrityCheckType (string | number | boolean) */
export function eqIntegrityCheckType(a, b) {
    return a === b;
}
/** 4) IdType = number */
export function eqIdType(a, b) {
    return a === b;
}
/** 5) ChunkInfo */
export function eqChunkInfo(a, b) {
    if (a.chunkId !== b.chunkId)
        return notEqual(a, b);
    if (a.index === b.index)
        return true;
    if (!a.index || !b.index)
        return notEqual(a, b);
    if (a.index.length !== b.index.length)
        return notEqual(a, b);
    return a.index.every((v, i) => v === b.index[i]);
}
/** 6) MessageWithId */
export function eqMessageWithId(a, b) {
    return eqIdType(a.id, b.id);
}
/** 7) MessageData */
export function eqMessageData(a, b) {
    if (!eqMessageWithId(a, b))
        return notEqual(a, b);
    if (a.data.length !== b.data.length)
        return notEqual(a, b);
    for (let i = 0; i < a.data.length; i++) {
        if (a.data[i] !== b.data[i])
            return notEqual(a, b);
    }
    return true;
}
/** 8) ChunkMessage */
export function eqChunkMessage(a, b) {
    if (!eqMessageData(a, b))
        return notEqual(a, b);
    return a.index === b.index && a.roof === b.roof;
}
/** 9) ServiceMessage */
export function eqServiceMessage(a, b) {
    if (!eqMessageWithId(a, b))
        return notEqual(a, b);
    if (a.reason !== b.reason)
        return notEqual(a, b);
    // arrayChunkInfo?
    if (a.arrayChunkInfo === b.arrayChunkInfo) {
        // ok (incluso entrambi undefined)
    }
    else {
        if (!a.arrayChunkInfo || !b.arrayChunkInfo)
            return notEqual(a, b);
        if (a.arrayChunkInfo.length !== b.arrayChunkInfo.length)
            return notEqual(a, b);
        for (let i = 0; i < a.arrayChunkInfo.length; i++) {
            if (!eqChunkInfo(a.arrayChunkInfo[i], b.arrayChunkInfo[i]))
                return notEqual(a, b);
        }
    }
    // arrayId?
    if (a.arrayId === b.arrayId) {
    }
    else {
        if (!a.arrayId || !b.arrayId)
            return notEqual(a, b);
        if (a.arrayId.length !== b.arrayId.length)
            return notEqual(a, b);
        for (let i = 0; i < a.arrayId.length; i++) {
            if (a.arrayId[i] !== b.arrayId[i])
                return notEqual(a, b);
        }
    }
    return true;
}
/** 10) MessageRootErmes */
export function eqMessageRootErmes(a, b) {
    if (a.integrityCheckValue !== b.integrityCheckValue)
        return notEqual(a, b);
    if (a.messageSerialized.length !== b.messageSerialized.length)
        return notEqual(a, b);
    for (let i = 0; i < a.messageSerialized.length; i++) {
        if (a.messageSerialized[i] !== b.messageSerialized[i])
            return notEqual(a, b);
    }
    return true;
}
/** Helper per MessageType (MessageData | ChunkMessage | ServiceMessage) */
export function eqMessageType(a, b) {
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
    return notEqual(a, b);
}
/** 11) MessageInternalErmes */
export function eqMessageInternalErmes(a, b) {
    if (!eqMessageValue(a.type, b.type))
        return notEqual(a, b);
    return eqMessageType(a.message, b.message);
}
/** 12) MessageChunkErmes (alias di ChunkMessage) */
export function eqMessageChunkErmes(a, b) {
    return eqChunkMessage(a, b);
}
//# sourceMappingURL=compare.js.map