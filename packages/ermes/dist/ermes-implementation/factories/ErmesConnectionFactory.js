import { ErmesConnection } from "../ErmesConnection.js";
/**
 * Factory for creating ErmesConnection instances
 */
export class ErmesConnectionFactory {
    /**
     * Create a new ErmesConnection instance
     * @param signalingHandler Handler for signaling operations with peers
     * @param factory Factory for creating new repositories
     * @param repository Initial repository for communication
     * @param connectionId Unique identifier for this connection
     * @returns New ErmesConnection instance
     */
    static createConnection(signalingHandler, factory, repository, connectionId) {
        return new ErmesConnection(signalingHandler, factory, repository, connectionId);
    }
}
//# sourceMappingURL=ErmesConnectionFactory.js.map