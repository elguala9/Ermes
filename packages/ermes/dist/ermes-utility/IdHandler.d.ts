import { IIdHandlerRepository } from "iermes/index";
export declare class IdHandler implements IIdHandlerRepository {
    private current;
    private readonly max;
    /**
     * @param max  Valore massimo consentito per l'ID (inclusivo). Al superamento si ricomincia da 0.
     * @param start Valore iniziale del contatore (default 0)
     */
    constructor(max?: number, start?: number);
    getNewId(): number;
    reset(): number;
    setCounter(counter: number): void;
}
