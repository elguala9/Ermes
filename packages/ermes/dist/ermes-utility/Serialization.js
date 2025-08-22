export function uint8ArrayToArrayBuffer(uint8Array) {
    // Crea un nuovo ArrayBuffer con la stessa lunghezza
    const arrayBuffer = new ArrayBuffer(uint8Array.length);
    // Crea una vista Uint8Array sul nuovo ArrayBuffer
    const view = new Uint8Array(arrayBuffer);
    // Copia i dati
    view.set(uint8Array);
    return arrayBuffer;
}
//# sourceMappingURL=Serialization.js.map