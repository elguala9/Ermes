export function toArrayBuffer(data) {
    // 1) Node Buffer → ArrayBuffer slice
    if (Buffer.isBuffer(data)) {
        return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    }
    // 2) Uint8Array → its underlying buffer
    if (data instanceof Uint8Array) {
        return data.buffer;
    }
    // 3) Already an ArrayBuffer
    return data;
}
//# sourceMappingURL=NormalizationUtility.js.map