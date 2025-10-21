import { IdPeer } from "ermes-types";
import { IErmesConnection, IErmesConnectionsHandler } from "iermes/index";
import { ClientWorkDB } from "workdb/ClientWorkDB";
/**
 * Implementation of IErmesConnectionsHandler that manages IErmesConnection instances
 * through a mapping that is persisted using ClientWorkDB
 */
export declare class ErmesConnectionsHandler implements IErmesConnectionsHandler {
    private readonly connections;
    private readonly clientWorkDB;
    private readonly STORAGE_KEY;
    /**
     * Creates a new ErmesConnectionsHandler
     * @param clientWorkDB Database client for persistence
     */
    constructor(clientWorkDB: ClientWorkDB);
    /**
     * Add a new connection to the handler
     * @param connection The connection to add
     */
    addConnection(connection: IErmesConnection): void;
    /**
     * Delete a connection from the handler
     * @param connection The connection to delete
     * @param close Whether to close the connection before deleting (default: true)
     */
    deleteConnection(connection: IErmesConnection, close?: boolean): void;
    /**
     * Get a connection by peer ID
     * @param id The peer ID to search for
     * @returns The connection associated with the peer ID
     * @throws Error if connection not found
     */
    getConnection(id: IdPeer): IErmesConnection;
    /**
     * Save the current state of connections to persistent storage
     */
    saveState(): Promise<void>;
    /**
     * Load the connections state from persistent storage
     */
    loadState(): Promise<void>;
    /**
     * Extract peer ID from a connection
     * @param connection The connection to extract peer ID from
     * @returns The peer ID
     */
    private extractPeerIdFromConnection;
    /**
     * Serialize connections state for persistence
     * @returns Serializable representation of connections state
     */
    private serializeConnectionsState;
    /**
     * Deserialize connections state from persistence
     * Note: This is a basic implementation. In a real scenario,
     * you might need to recreate connections from persisted data
     * @param state The persisted state
     */
    private deserializeConnectionsState;
}
