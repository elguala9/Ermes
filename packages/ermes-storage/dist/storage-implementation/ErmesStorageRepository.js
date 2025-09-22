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
            // Convert Uint8Array to regular array for JSON serialization (like in your test)
            const serializedData = { ...data };
            if ('data' in serializedData && serializedData.data instanceof Uint8Array) {
                // TO DO: verify that Array.from is the correct way to do it
                serializedData.data = Array.from(serializedData.data);
            }
            const item = {
                item: serializedData
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
                // Reconstruct Uint8Array from regular array (like in your test)
                const deserializedData = { ...result.item };
                if ('data' in deserializedData && Array.isArray(deserializedData.data)) {
                    deserializedData.data = new Uint8Array(deserializedData.data);
                }
                return deserializedData;
            }
            return undefined;
        }
        catch (error) {
            throw new Error(`Failed to retrieve data: ${error}`);
        }
    }
    async delete(id) {
        const itemId = {
            id: id.toString(),
            collection: this._collection
        };
        // First check if the item exists
        const existingItem = await this._db.retrieve(itemId);
        if (existingItem) {
            // Item exists, delete it
            await this._db.delete(itemId);
            this._numberOfElements = Math.max(0, this._numberOfElements - 1);
            // Verify the deletion was successful
            const verifyDeleted = await this._db.retrieve(itemId);
            if (verifyDeleted) {
                throw new Error(`Failed to delete item ${id}: item still exists after deletion`);
            }
            return true;
        }
        return false;
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
            // Destroy the object by nulling its internal references
            // @ts-expect-error we want to null the reference to indicate destruction
            this._db = null;
            // @ts-expect-error we want to null the reference to indicate destruction  
            this._collection = null;
        }
        catch (error) {
            throw new Error(`Failed to destroy database: ${error}`);
        }
    }
}
//# sourceMappingURL=ErmesStorageRepository.js.map