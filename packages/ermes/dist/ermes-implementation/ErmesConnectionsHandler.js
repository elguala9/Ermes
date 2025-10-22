/**
 * Implementation of IErmesConnectionsHandler that manages IErmesConnection instances
 * through a mapping that is persisted using ClientWorkDB
 */
export class ErmesConnectionsHandler {
    /**
     * Creates a new ErmesConnectionsHandler
     * @param clientWorkDB Database client for persistence
     */
    constructor(clientWorkDB) {
        this.STORAGE_KEY = 'ermes_connections_state';
        this.connections = new Map();
        this.clientWorkDB = clientWorkDB;
    }
    /**
     * Add a new connection to the handler
     * @param connection The connection to add
     */
    addConnection(connection) {
        const peerId = this.extractPeerIdFromConnection(connection);
        this.connections.set(peerId, connection);
    }
    /**
     * Delete a connection from the handler
     * @param connection The connection to delete
     * @param close Whether to close the connection before deleting (default: true)
     */
    deleteConnection(connection, close = true) {
        const peerId = this.extractPeerIdFromConnection(connection);
        if (close) {
            connection.close();
        }
        this.connections.delete(peerId);
    }
    /**
     * Get a connection by peer ID
     * @param id The peer ID to search for
     * @returns The connection associated with the peer ID
     * @throws Error if connection not found
     */
    getConnection(id) {
        const connection = this.connections.get(id);
        if (!connection) {
            throw new Error(`Connection not found for peer ID: ${id}`);
        }
        return connection;
    }
    /**
     * Save the current state of connections to persistent storage
     */
    async saveState() {
        try {
            // Create a serializable representation of the connections state
            const connectionsState = this.serializeConnectionsState();
            const itemId = {
                id: this.STORAGE_KEY,
                collection: 'ermes_connections'
            };
            // Try to update if exists, otherwise create
            const payload = { ...itemId, item: connectionsState };
            // Debug log to inspect payload shape if something goes wrong
            // (kept minimal; can be removed after diagnosing)
            // eslint-disable-next-line no-console
            console.log('Saving connections state payload:', payload);
            // Use createOrUpdate to simplify: it will write whether or not the item exists
            await this.clientWorkDB.createOrUpdate(payload);
        }
        catch (error) {
            console.error('Failed to save connections state:', error);
            throw new Error('Failed to save connections state to database');
        }
    }
    /**
     * Load the connections state from persistent storage
     */
    async loadState() {
        try {
            const itemId = {
                id: this.STORAGE_KEY,
                collection: 'ermes_connections'
            };
            // Load from ClientWorkDB
            const result = await this.clientWorkDB.retrieve(itemId);
            if (result) {
                this.deserializeConnectionsState(result);
            }
        }
        catch (error) {
            // If item doesn't exist, that's okay - we'll start with empty state
            if (error instanceof Error && error.message.includes('not found')) {
                console.log('No previous connections state found, starting fresh');
            }
            else {
                console.error('Failed to load connections state:', error);
                throw new Error('Failed to load connections state from database');
            }
        }
    }
    /**
     * Extract peer ID from a connection
     * @param connection The connection to extract peer ID from
     * @returns The peer ID
     */
    extractPeerIdFromConnection(connection) {
        return connection.getIdConnection();
    }
    /**
     * Serialize connections state for persistence
     * @returns Serializable representation of connections state
     */
    serializeConnectionsState() {
        const state = {
            connectionIds: Array.from(this.connections.keys()),
            timestamp: Date.now(),
            version: '1.0'
        };
        return {
            data: JSON.stringify(state)
        };
    }
    /**
     * Deserialize connections state from persistence
     * Note: This is a basic implementation. In a real scenario,
     * you might need to recreate connections from persisted data
     * @param state The persisted state
     */
    deserializeConnectionsState(state) {
        try {
            // `state` may be the stored item or an ItemOutput { item: ... }
            const item = state && state.item ? state.item : state;
            const parsedState = item && item.data ? JSON.parse(item.data) : item;
            if (parsedState?.connectionIds && Array.isArray(parsedState.connectionIds)) {
                // Note: We can only restore the structure, not the actual connections
                // Real connections would need to be re-established
                console.log(`Loaded connection state with ${parsedState.connectionIds.length} connection IDs`);
                console.log('Note: Actual connections need to be re-established manually');
            }
        }
        catch (error) {
            console.error('Failed to deserialize connection state:', error);
        }
    }
}
//# sourceMappingURL=ErmesConnectionsHandler.js.map