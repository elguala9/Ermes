import { IdPeer } from "ermes-types";
import { PaginationDTO } from "ermes-types/dist/PaginationTypes.js";
import { AccountInfo, IErmesBookService } from "iermes/index";
import { IdAccountType } from "iermes/signaling-interface/IErmesSignaling";
import { ErmesBookRepository, BookInput, BookData } from "./ErmesBookRepository.js";

/**
 * Service for managing book operations - delegates to repository
 */
export class ErmesBookService implements IErmesBookService<BookInput, BookData> {
    private _repository: ErmesBookRepository;

    constructor(repository: ErmesBookRepository) {
        this._repository = repository;
    }

    /**
     * Set an account to the book (delegates to repository)
     */
    async setAccount(account: IdAccountType, info?: BookInput): Promise<void> {
        return await this._repository.setAccount(account, info);
    }

    /**
     * Update an account in the book (delegates to repository)
     */
    async updateAccount(account: IdAccountType, info: Partial<BookInput>): Promise<void> {
        return await this._repository.updateAccount(account, info);
    }

    /**
     * Get the account from the book (delegates to repository)
     */
    async getAccount(account: IdAccountType): Promise<BookData> {
        return await this._repository.getAccount(account);
    }

    /**
     * Get account list with pagination (delegates to repository)
     */
    async getAccountList(cursor: IdAccountType, limit: number): Promise<PaginationDTO<AccountInfo<BookData>, IdAccountType>> {
        return await this._repository.getAccountList(cursor, limit);
    }

    /**
     * Delete an account from the book (delegates to repository)
     */
    async deleteAccount(account: IdAccountType): Promise<boolean> {
        return await this._repository.deleteAccount(account);
    }

    /**
     * Destroy the database (delegates to repository)
     */
    async destroy(): Promise<void> {
        return await this._repository.destroy();
    }

    /**
     * Clear all books (delegates to repository)
     */
    async clear(): Promise<void> {
        return await this._repository.clear();
    }

    /**
     * Get number of stored books (delegates to repository)
     */
    numberOfElements(): number {
        return this._repository.numberOfElements();
    }

    /**
     * Get list of all account IDs (delegates to repository)
     */
    async listOfIds(): Promise<IdAccountType[]> {
        return await this._repository.listOfIds();
    }
}