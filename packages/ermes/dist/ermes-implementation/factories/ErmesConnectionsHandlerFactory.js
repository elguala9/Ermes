import { ErmesConnectionsHandler } from "../ErmesConnectionsHandler.js";
/**
 * Factory for creating ErmesConnectionsHandler instances
 */
export class ErmesConnectionsHandlerFactory {
    /**
     * Create a new ErmesConnectionsHandler instance
     * @param clientWorkDB Database client for persistence
     * @returns New ErmesConnectionsHandler instance
     */
    static createConnectionsHandler(clientWorkDB) {
        return new ErmesConnectionsHandler(clientWorkDB);
    }
}
//# sourceMappingURL=ErmesConnectionsHandlerFactory.js.map