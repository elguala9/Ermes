// Default collection name constant
const DEFAULT_COLLECTION = "ermes_messages";
// Generic repository backed by PouchDB through WorkDB
export class ErmesStorageRepository {
    constructor(db, collection = DEFAULT_COLLECTION) {
        this._numberOfElements = 0;
        this._db = db;
        this._collection = collection;
        // Initialize the count - this will be updated during usage
        this._loadElementCount();
    }
    async _loadElementCount() {
        try {
            // Try to count existing documents to initialize the counter
            const ids = await this.listOfIds();
            this._numberOfElements = ids.length;
        }
        catch (error) {
            console.warn('Failed to load element count:', error);
            this._numberOfElements = 0;
        }
    }
    async store(data) {
        if (!data.id) {
            throw new Error('Data must have an id property');
        }
        try {
            const itemId = {
                id: data.id.toString(),
                collection: this._collection
            };
            const item = {
                item: data // Cast needed since workdb expects JsonObject
            };
            // Try to retrieve existing document first to handle updates
            const existingItem = await this._db.retrieve(itemId);
            if (existingItem) {
                // Update existing document
                await this._db.update({ ...itemId, ...item });
            }
            else {
                // Create new document
                await this._db.create({ ...itemId, ...item });
                this._numberOfElements++;
            }
        }
        catch (error) {
            throw new Error(`Failed to store data: ${error}`);
        }
    }
    async retrieve(id) {
        try {
            const itemId = {
                id: id.toString(),
                collection: this._collection
            };
            const result = await this._db.retrieve(itemId);
            if (result && result.item) {
                return result.item;
            }
            return undefined;
        }
        catch (error) {
            throw new Error(`Failed to retrieve data: ${error}`);
        }
    }
    async delete(id) {
        try {
            const itemId = {
                id: id.toString(),
                collection: this._collection
            };
            // Check if the element exists before deleting it
            const existingItem = await this._db.retrieve(itemId);
            if (existingItem) {
                await this._db.delete(itemId);
                this._numberOfElements = Math.max(0, this._numberOfElements - 1);
            }
            // If it doesn't exist, it's not an error (idempotent delete)
        }
        catch (error) {
            throw new Error(`Failed to delete data: ${error}`);
        }
    }
    async clear() {
        await this._db.deleteCollection(this._collection);
        this._numberOfElements = 0;
    }
    numberOfElements() {
        return this._numberOfElements;
    }
    async listOfIds() {
        try {
            const itemIds = await this._db.getItemsInCollection(this._collection);
            // Convert string IDs back to numbers
            return itemIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
        }
        catch (error) {
            throw new Error(`Failed to list IDs: ${error}`);
        }
    }
    async destroy() {
        try {
            await this._db.clearDatabase();
            this._numberOfElements = 0;
        }
        catch (error) {
            throw new Error(`Failed to destroy database: ${error}`);
        }
    }
}
//# sourceMappingURL=ErmesStorageRepository.js.map