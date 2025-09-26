import { IdPeer } from "ermes-types";
import { PaginationDTO } from "ermes-types/dist/PaginationTypes.js";
import { AccountInfo, IErmesBookRepository } from "iermes/index";
import { IdAccountType } from "iermes/signaling-interface/IErmesSignaling";
import { ClientWorkDB } from "workdb/ClientWorkDB";
/**
 * Book data type - simple structure for book information
 */
export type BookInput = {
    name: string;
};
export type BookData = {
    peerId: IdPeer;
    name: string;
    timestamp: number;
};
/**
 * Repository for managing book operations using ClientWorkDB
 */
export declare class ErmesBookRepository implements IErmesBookRepository<BookInput, BookData> {
    private _db;
    private _numberOfElements;
    private _collection;
    constructor(db: ClientWorkDB, collection?: string);
    private _loadElementCount;
    /**
     * Sanitize peerId to be safe for filesystem operations
     */
    private sanitizePeerId;
    /**
     * Store a book
     */
    private storeBook;
    /**
     * Retrieve a book by ID
     */
    private retrieveBook;
    /**
     * Delete a book by ID
     */
    private deleteBook;
    /**
     * Create a new book with default values
     */
    private createBook;
    /**
     * Get all book IDs
     */
    private getAllBookIds;
    /**
     * Check if a book exists
     */
    private bookExists;
    /**
     * Find the starting index for pagination based on cursor
     */
    private findStartIndex;
    /**
     * Create account info items from IDs
     */
    private createAccountInfoItems;
    /**
     * Generate next cursor for pagination
     */
    private generateNextCursor;
    /**
     * Set an account to the book (required by IErmesBookRepository)
     */
    setAccount(account: IdAccountType, info?: BookInput): Promise<void>;
    /**
     * Update an account in the book (required by IErmesBookRepository)
     */
    updateAccount(account: IdAccountType, info: Partial<BookInput>): Promise<void>;
    /**
     * Get the account from the book (required by IErmesBookRepository)
     */
    getAccount(account: IdAccountType): Promise<BookData>;
    /**
     * Get account list with pagination (required by IErmesBookRepository)
     */
    getAccountList(cursor: IdAccountType, limit: number): Promise<PaginationDTO<AccountInfo<BookData>, IdAccountType>>;
    /**
     * Delete an account from the book (required by IErmesBookRepository)
     */
    deleteAccount(account: IdAccountType): Promise<boolean>;
    /**
     * Destroy the database (required by IErmesBookRepository)
     */
    destroy(): Promise<void>;
    /**
     * Clear all books (required by IErmesBookRepository)
     */
    clear(): Promise<void>;
    /**
     * Get number of stored books (required by IErmesBookRepository)
     */
    numberOfElements(): number;
    /**
     * Get list of all account IDs (required by IErmesBookRepository)
     */
    listOfIds(): Promise<IdAccountType[]>;
}
