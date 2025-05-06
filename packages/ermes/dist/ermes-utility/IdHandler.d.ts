import { IIdHandler } from "../interfaces/IIdHandler.js";
import { IdType } from "./ErmesType.js";
/**
 * IIdHandler interface but typized with number
 */
export interface IIdHandlerNumber extends IIdHandler<IdType> {
}
export declare class IdHandlerNumber implements IIdHandlerNumber {
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
