import { expect } from 'chai';
import { ErmesConnectionsHandler } from 'ermes/index';
import { IErmesConnection } from 'iermes/index';

/**
 * Test function for ErmesConnectionsHandler
 * @param handler The ErmesConnectionsHandler instance to test (no mocks!)
 * @param connection Real IErmesConnection instance to use for testing
 */
type Provider = () => Promise<{ handler: ErmesConnectionsHandler; connection: IErmesConnection; cleanup?: () => Promise<void> }>;

export function testErmesConnectionsHandler(provider: Provider) {
    describe('ErmesConnectionsHandler Standard Tests (input-driven)', function () {
        let handler: ErmesConnectionsHandler;
        let connection: IErmesConnection;

        let _cleanup: (() => Promise<void>) | undefined;
        before('setup instances', async function () {
            const input = await provider();
            handler = input.handler;
            connection = input.connection;
            _cleanup = input.cleanup;
        });

            after('cleanup connections', async function () {
                // Attempt to close/destroy the connection to release SimplePeer resources
                try {
                    if (connection && typeof (connection as any).destroyConnection === 'function') {
                        await (connection as any).destroyConnection(true);
                    } else if (connection && typeof (connection as any).close === 'function') {
                        await (connection as any).close();
                    }
                } catch (err) {
                    // swallow errors during cleanup
                }

                try {
                    // Ensure the handler removes the connection
                    if (handler && typeof handler.deleteConnection === 'function') {
                        handler.deleteConnection(connection, false);
                    }
                } catch (err) {
                    // ignore cleanup errors
                }

                // call provider-provided cleanup if exists (e.g., destroy SignalManager instances)
                if (_cleanup) {
                    try {
                        await _cleanup();
                    } catch (e) {
                        // ignore cleanup errors
                    }
                }
            });

        it('should add a connection successfully', function () {
            handler.addConnection(connection);
            const id = connection.getIdConnection();
            const retrieved = handler.getConnection(id);
            expect(retrieved).to.equal(connection);
        });

        it('should delete a connection and no longer retrieve it', function () {
            handler.addConnection(connection);
            const id = connection.getIdConnection();
            handler.deleteConnection(connection, false);
            let threw = false;
            try {
                handler.getConnection(id);
            } catch (err) {
                threw = true;
            }
            if (!threw) throw new Error('Expected getConnection to throw after deletion');
        });

        it('should throw when getting non-existent connection', function () {
            let threw = false;
            try {
                handler.getConnection('non-existent-peer');
            } catch (err) {
                threw = true;
            }
            if (!threw) throw new Error('Expected getConnection to throw for non-existent peer');
        });

        it('should save and load state without throwing', async function () {
            handler.addConnection(connection);
            await handler.saveState();
            await handler.loadState();
        });

        it('should handle loadState when no previous state exists', async function () {
            await handler.loadState();
        });
    });
}