export class IdHandlerNumber {
    /**
     * @param max  Valore massimo consentito per l'ID (inclusivo). Al superamento si ricomincia da 0.
     * @param start Valore iniziale del contatore (default 0)
     */
    constructor(max = Number.MAX_SAFE_INTEGER, start = 0) {
        if (!Number.isInteger(max) || max < 1) {
            throw new Error("`max` deve essere un intero ≥ 1");
        }
        if (!Number.isInteger(start) || start < 0 || start > max) {
            throw new Error("`start` deve essere un intero compreso tra 0 e max");
        }
        this.max = max;
        this.current = start;
    }
    getNewId() {
        const id = this.current;
        // preparo il prossimo: se ho già raggiunto il max, torno a zero
        this.current = (this.current >= this.max) ? 0 : this.current + 1;
        return id;
    }
    reset() {
        this.current = 0;
        return this.current;
    }
    setCounter(counter) {
        if (!Number.isInteger(counter) || counter < 0 || counter > this.max) {
            throw new Error(`ID deve essere un intero tra 0 e ${this.max}`);
        }
        this.current = counter;
    }
}
//# sourceMappingURL=IdHandler.js.map