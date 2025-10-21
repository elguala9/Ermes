import { IdPeer, PeerType } from "ermes-types";
import { IErmesFactory, IErmesRepository, IErmesSignalingHandler } from "iermes/index";
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
    static createConnection(
        signalingHandler: IErmesSignalingHandler<PeerType>,
        factory: IErmesFactory<PeerType>,
        repository: IErmesRepository,
        connectionId: IdPeer
    ): ErmesConnection {
        return new ErmesConnection(signalingHandler, factory, repository, connectionId);
    }
}