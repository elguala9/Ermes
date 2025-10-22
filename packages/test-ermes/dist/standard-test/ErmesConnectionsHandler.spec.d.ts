import { ErmesConnectionsHandler } from 'ermes/index';
import { IErmesConnection } from 'iermes/index';
/**
 * Test function for ErmesConnectionsHandler
 * @param handler The ErmesConnectionsHandler instance to test (no mocks!)
 * @param connection Real IErmesConnection instance to use for testing
 */
type Provider = () => Promise<{
    handler: ErmesConnectionsHandler;
    connection: IErmesConnection;
}>;
export declare function testErmesConnectionsHandler(provider: Provider): void;
export {};
