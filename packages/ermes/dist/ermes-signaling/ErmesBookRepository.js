// Default collection name constant
const DEFAULT_BOOKING_COLLECTION = "ermes_books";
/**
 * Repository for managing book operations using ClientWorkDB
 */
export class ErmesBookRepository {
    constructor(db, collection = DEFAULT_BOOKING_COLLECTION) {
        this._numberOfElements = 0;
        this._db = db;
        this._collection = collection;
        this._loadElementCount();
    }
    async _loadElementCount() {
        const ids = await this.getAllBookIds();
        this._numberOfElements = ids.length;
    }
    /**
     * Sanitize peerId to be safe for filesystem operations
     */
    sanitizePeerId(peerId) {
        // Handle empty or whitespace-only peerIds by converting to a placeholder
        if (!peerId || peerId.trim() === '') {
            return '_empty_';
        }
        // Replace invalid filesystem characters and limit length
        const sanitized = peerId
            .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_') // Replace invalid Windows chars
            .replace(/^\.+/, '_') // Replace leading dots
            .substring(0, 200); // Limit length to 200 chars
        if (sanitized === '' || sanitized === '_') {
            return '_empty_';
        }
        return sanitized;
    }
    /**
     * Store a book
     */
    async storeBook(book) {
        const bookId = this.sanitizePeerId(book.peerId);
        const dbItemId = {
            id: bookId,
            collection: this._collection
        };
        const dbItem = {
            item: book
        };
        const existingBook = await this._db.retrieve(dbItemId);
        if (existingBook) {
            await this._db.update({ ...dbItemId, ...dbItem });
        }
        else {
            await this._db.create({ ...dbItemId, ...dbItem });
            this._numberOfElements++;
        }
    }
    /**
     * Retrieve a book by ID
     */
    async retrieveBook(peerId) {
        const dbItemId = {
            id: this.sanitizePeerId(peerId.toString()),
            collection: this._collection
        };
        const dbResult = await this._db.retrieve(dbItemId);
        if (dbResult && dbResult.item) {
            return dbResult.item;
        }
        return undefined;
    }
    /**
     * Delete a book by ID
     */
    async deleteBook(peerId) {
        const dbItemId = {
            id: this.sanitizePeerId(peerId.toString()),
            collection: this._collection
        };
        const existingBook = await this._db.retrieve(dbItemId);
        if (existingBook) {
            await this._db.delete(dbItemId);
            this._numberOfElements = Math.max(0, this._numberOfElements - 1);
            return true;
        }
        return false;
    }
    /**
     * Create a new book with default values
     */
    createBook(peerId, name) {
        return {
            peerId,
            name,
            timestamp: Date.now()
        };
    }
    /**
     * Get all book IDs
     */
    async getAllBookIds() {
        const stringIds = await this._db.getItemsInCollection(this._collection);
        return stringIds;
    }
    /**
     * Check if a book exists
     */
    async bookExists(peerId) {
        const book = await this.retrieveBook(peerId);
        return book !== undefined;
    }
    /**
     * Find the starting index for pagination based on cursor
     */
    findStartIndex(sortedIds, cursor) {
        if (!cursor)
            return 0;
        // Find exact match for cursor and include it in results
        const cursorIndex = sortedIds.findIndex(id => id === cursor);
        if (cursorIndex === -1) {
            // If cursor doesn't exist, return end of array to indicate no more results
            return sortedIds.length;
        }
        // Return the cursor index itself (include the cursor in results)
        return cursorIndex;
    }
    /**
     * Create account info items from IDs
     */
    async createAccountInfoItems(ids) {
        const items = [];
        for (const id of ids) {
            const book = await this.retrieveBook(id);
            if (book) {
                items.push({
                    account: id,
                    info: book
                });
            }
        }
        return items;
    }
    /**
     * Generate next cursor for pagination
     */
    generateNextCursor(hasMore, items, currentCursor) {
        if (!hasMore || items.length === 0) {
            return currentCursor;
        }
        return items[items.length - 1].account + "_next";
    }
    /**
     * Set an account to the book (required by IErmesBookRepository)
     */
    async setAccount(account, info) {
        if (info) {
            await this.storeBook({
                peerId: account,
                name: info.name,
                timestamp: Date.now()
            });
        }
    }
    /**
     * Update an account in the book (required by IErmesBookRepository)
     */
    async updateAccount(account, info) {
        const existingBook = await this.retrieveBook(account);
        if (!existingBook) {
            throw new Error(`Account not found: ${account}`);
        }
        // Create updated book data
        const updatedBook = {
            peerId: account,
            name: info.name !== undefined ? info.name : existingBook.name,
            timestamp: Date.now()
        };
        await this.storeBook(updatedBook);
    }
    /**
     * Get the account from the book (required by IErmesBookRepository)
     */
    async getAccount(account) {
        const book = await this.retrieveBook(account);
        if (!book) {
            throw new Error(`Account not found: ${account}`);
        }
        return book;
    }
    /**
     * Get account list with pagination (required by IErmesBookRepository)
     */
    async getAccountList(cursor, limit) {
        // Get and sort all IDs
        const allIds = await this.getAllBookIds();
        const sortedIds = allIds.sort();
        // Find starting point for pagination
        const startIndex = this.findStartIndex(sortedIds, cursor);
        // Get paginated slice of IDs
        const paginatedIds = sortedIds.slice(startIndex, startIndex + limit);
        // Convert IDs to account info items
        const items = await this.createAccountInfoItems(paginatedIds);
        // Calculate pagination metadata
        const hasMore = startIndex + limit < sortedIds.length;
        const nextCursor = this.generateNextCursor(hasMore, items, cursor);
        return {
            cursor,
            pageSize: limit,
            totalItems: sortedIds.length,
            eof: !hasMore,
            items,
            nextCursor
        };
    }
    /**
     * Delete an account from the book (required by IErmesBookRepository)
     */
    async deleteAccount(account) {
        return await this.deleteBook(account);
    }
    /**
     * Destroy the database (required by IErmesBookRepository)
     */
    async destroy() {
        await this._db.clearDatabase();
        this._numberOfElements = 0;
        // Clear references to indicate destruction
        // @ts-expect-error intentional nulling for cleanup
        this._db = null;
        // @ts-expect-error intentional nulling for cleanup
        this._collection = null;
    }
    /**
     * Clear all books (required by IErmesBookRepository)
     */
    async clear() {
        await this._db.deleteCollection(this._collection);
        this._numberOfElements = 0;
    }
    /**
     * Get number of stored books (required by IErmesBookRepository)
     */
    numberOfElements() {
        return this._numberOfElements;
    }
    /**
     * Get list of all account IDs (required by IErmesBookRepository)
     */
    async listOfIds() {
        const peerIds = await this.getAllBookIds();
        return peerIds;
    }
}
//# sourceMappingURL=ErmesBookRepository.js.map