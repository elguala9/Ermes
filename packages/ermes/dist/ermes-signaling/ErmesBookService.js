/**
 * Service for managing book operations - delegates to repository
 */
export class ErmesBookService {
    constructor(repository) {
        this._repository = repository;
    }
    /**
     * Set an account to the book (delegates to repository)
     */
    async setAccount(account, info) {
        return await this._repository.setAccount(account, info);
    }
    /**
     * Update an account in the book (delegates to repository)
     */
    async updateAccount(account, info) {
        return await this._repository.updateAccount(account, info);
    }
    /**
     * Get the account from the book (delegates to repository)
     */
    async getAccount(account) {
        return await this._repository.getAccount(account);
    }
    /**
     * Get account list with pagination (delegates to repository)
     */
    async getAccountList(cursor, limit) {
        return await this._repository.getAccountList(cursor, limit);
    }
    /**
     * Delete an account from the book (delegates to repository)
     */
    async deleteAccount(account) {
        return await this._repository.deleteAccount(account);
    }
    /**
     * Destroy the database (delegates to repository)
     */
    async destroy() {
        return await this._repository.destroy();
    }
    /**
     * Clear all books (delegates to repository)
     */
    async clear() {
        return await this._repository.clear();
    }
    /**
     * Get number of stored books (delegates to repository)
     */
    numberOfElements() {
        return this._repository.numberOfElements();
    }
    /**
     * Get list of all account IDs (delegates to repository)
     */
    async listOfIds() {
        return await this._repository.listOfIds();
    }
}
//# sourceMappingURL=ErmesBookService.js.map