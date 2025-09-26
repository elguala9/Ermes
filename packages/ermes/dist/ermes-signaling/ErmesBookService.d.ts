import { PaginationDTO } from "ermes-types/dist/PaginationTypes.js";
import { AccountInfo, IErmesBookService } from "iermes/index";
import { IdAccountType } from "iermes/signaling-interface/IErmesSignaling";
import { ErmesBookRepository, BookInput, BookData } from "./ErmesBookRepository.js";
/**
 * Service for managing book operations - delegates to repository
 */
export declare class ErmesBookService implements IErmesBookService<BookInput, BookData> {
    private _repository;
    constructor(repository: ErmesBookRepository);
    /**
     * Set an account to the book (delegates to repository)
     */
    setAccount(account: IdAccountType, info?: BookInput): Promise<void>;
    /**
     * Update an account in the book (delegates to repository)
     */
    updateAccount(account: IdAccountType, info: Partial<BookInput>): Promise<void>;
    /**
     * Get the account from the book (delegates to repository)
     */
    getAccount(account: IdAccountType): Promise<BookData>;
    /**
     * Get account list with pagination (delegates to repository)
     */
    getAccountList(cursor: IdAccountType, limit: number): Promise<PaginationDTO<AccountInfo<BookData>, IdAccountType>>;
    /**
     * Delete an account from the book (delegates to repository)
     */
    deleteAccount(account: IdAccountType): Promise<boolean>;
    /**
     * Destroy the database (delegates to repository)
     */
    destroy(): Promise<void>;
    /**
     * Clear all books (delegates to repository)
     */
    clear(): Promise<void>;
    /**
     * Get number of stored books (delegates to repository)
     */
    numberOfElements(): number;
    /**
     * Get list of all account IDs (delegates to repository)
     */
    listOfIds(): Promise<IdAccountType[]>;
}
