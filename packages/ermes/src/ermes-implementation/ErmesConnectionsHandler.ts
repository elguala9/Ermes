import { IdPeer } from "ermes-types";
import { IErmesConnection, IErmesConnectionsHandler } from "iermes/index";
import { ClientWorkDB } from "workdb/ClientWorkDB";

/**
 * Implementation of IErmesConnectionsHandler that manages IErmesConnection instances
 * through a mapping that is persisted using ClientWorkDB
 */
export class ErmesConnectionsHandler implements IErmesConnectionsHandler {
    private readonly connections: Map<IdPeer, IErmesConnection>;
    private readonly clientWorkDB: ClientWorkDB;
    private readonly STORAGE_KEY = 'ermes_connections_state';

    /**
     * Creates a new ErmesConnectionsHandler
     * @param clientWorkDB Database client for persistence
     */
    constructor(clientWorkDB: ClientWorkDB) {
        this.connections = new Map<IdPeer, IErmesConnection>();
        this.clientWorkDB = clientWorkDB;
    }

    /**
     * Add a new connection to the handler
     * @param connection The connection to add
     */
    addConnection(connection: IErmesConnection): void {
        const peerId = this.extractPeerIdFromConnection(connection);
        this.connections.set(peerId, connection);
    }

    /**
     * Delete a connection from the handler
     * @param connection The connection to delete
     * @param close Whether to close the connection before deleting (default: true)
     */
    deleteConnection(connection: IErmesConnection, close: boolean = true): void {
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
    getConnection(id: IdPeer): IErmesConnection {
        const connection = this.connections.get(id);
        if (!connection) {
            throw new Error(`Connection not found for peer ID: ${id}`);
        }
        return connection;
    }

    /**
     * Save the current state of connections to persistent storage
     */
    async saveState(): Promise<void> {
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
        } catch (error) {
            console.error('Failed to save connections state:', error);
            throw new Error('Failed to save connections state to database');
        }
    }

    /**
     * Load the connections state from persistent storage
     */
    async loadState(): Promise<void> {
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
        } catch (error) {
            // If item doesn't exist, that's okay - we'll start with empty state
            if (error instanceof Error && error.message.includes('not found')) {
                console.log('No previous connections state found, starting fresh');
            } else {
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
    private extractPeerIdFromConnection(connection: IErmesConnection): IdPeer {
        return connection.getIdConnection();
    }

    /**
     * Serialize connections state for persistence
     * @returns Serializable representation of connections state
     */
    private serializeConnectionsState(): any {
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
    private deserializeConnectionsState(state: any): void {
        try {
            // `state` may be the stored item or an ItemOutput { item: ... }
            const item = state && (state as any).item ? (state as any).item : state;
            const parsedState = item && item.data ? JSON.parse(item.data) : item;
            if (parsedState?.connectionIds && Array.isArray(parsedState.connectionIds)) {
                // Note: We can only restore the structure, not the actual connections
                // Real connections would need to be re-established
                console.log(`Loaded connection state with ${parsedState.connectionIds.length} connection IDs`);
                console.log('Note: Actual connections need to be re-established manually');
            }
        } catch (error) {
            console.error('Failed to deserialize connection state:', error);
        }
    }
}