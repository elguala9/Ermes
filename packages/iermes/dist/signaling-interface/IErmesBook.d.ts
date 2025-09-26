import { PaginationDTO } from "ermes-types/dist/PaginationTypes.js";
import { IdAccountType } from "./IErmesSignaling.js";
export type AccountInfo<InfoJsonType> = {
    account: IdAccountType;
    info?: InfoJsonType;
};
export interface IErmesBookPrivate<Input, InfoJsonType> {
    /**
     * set an account to the book
     * @param account the account to set
     */
    setAccount(account: IdAccountType, info?: Input): Promise<void>;
    /**
     * Update an account in the book
     * @param account the account to update
     */
    updateAccount(account: IdAccountType, info: Partial<Input>): Promise<void>;
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
    deleteAccount(account: IdAccountType): Promise<boolean>;
    destroy(): Promise<void>;
    clear(): Promise<void>;
    numberOfElements(): number;
    listOfIds(): Promise<IdAccountType[]>;
}
export interface IErmesBookService<Input, InfoJsonType> extends IErmesBookPrivate<Input, InfoJsonType> {
}
export interface IErmesBookRepository<Input, InfoJsonType> extends IErmesBookPrivate<Input, InfoJsonType> {
}
