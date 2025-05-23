import { IdType } from "ermes-types";
import { IdHandlerRepositoryInput, IIdHandlerRepository } from "iermes/index";
export declare class IdHandlerRepository implements IIdHandlerRepository {
    private current;
    private readonly max;
    /**
     * @param max  Valore massimo consentito per l'ID (inclusivo). Al superamento si ricomincia da 0.
     * @param start Valore iniziale del contatore (default 0)
     */
    constructor({ max, start }: IdHandlerRepositoryInput);
    getNewId(): number;
    reset(): void;
    setCounter(counter: number): void;
    getCurrent(): IdType;
}
