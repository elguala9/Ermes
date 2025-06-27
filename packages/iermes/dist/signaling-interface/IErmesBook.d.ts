import { PaginationDTO } from "ermes-types/dist/PaginationTypes.js";
import { IdAccountType } from "./IErmesSignaling.js";
export type AccountInfo<InfoJsonType> = {
    account: IdAccountType;
    info?: InfoJsonType;
};
export interface IErmesBookPrivate<InfoJsonType> {
    /**
     * set an account to the book
     * @param account the account to set
     */
    setAccount(account: IdAccountType, info?: InfoJsonType): Promise<void>;
    /**
     * get the account from the book
     * @param account the account to retrive
     * @returns the account setted in the book
     */
    getAccount(account: IdAccountType): Promise<InfoJsonType>;
    /**
     * get the account from the book
     * @param cursor the account from which start the retrive, it is order alphabetically
     * @returns the account setted in the book
    */
    getAccountList(cursor: IdAccountType, limit: number): Promise<PaginationDTO<AccountInfo<InfoJsonType>, IdAccountType>>;
}
export interface IErmesBookService<InfoJsonType> extends IErmesBookPrivate<InfoJsonType> {
}
export interface IErmesBookRepository<InfoJsonType> extends IErmesBookPrivate<InfoJsonType> {
}
