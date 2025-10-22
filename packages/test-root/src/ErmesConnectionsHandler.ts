import { ErmesConnectionFactory, ErmesConnectionsHandlerFactory, SignalManager } from 'ermes/index';
import { WorkDBFactory } from 'ermes-storage/index';
import { IdAccountType } from 'iermes/index';
import { PacketManager } from 'ermes/ermes-implementation/IceProtocol/PacketManager';
// Import compiled JS spec helper from test-ermes dist to avoid ESM/CJS interop
// and ensure Mocha globals are present when the helper registers tests.
import { testErmesConnectionsHandler } from 'test-ermes/dist/standard-test/ErmesConnectionsHandler.spec.js';

// Build real instances and return them to the spec via the provider
async function main(): Promise<{
    handler: ReturnType<typeof ErmesConnectionsHandlerFactory.createConnectionsHandler>;
    connection: any;
    cleanup?: () => Promise<void>;
}> {
    console.log('Starting ErmesConnectionsHandler integration setup in test-root...');

    const signalManager1: SignalManager = new SignalManager();
    const signalManager2: SignalManager = new SignalManager();
    const db: any = WorkDBFactory.forNode();

    const handler = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);

    // Establish WebRTC connection
    const a1: IdAccountType = `runner-${Date.now()}-1`;
    const a2: IdAccountType = `runner-${Date.now()}-2`;

    const offer = await signalManager1.createSignal();
    await signalManager2.processSignal(offer, a1);
    const answer = await signalManager2.createSignal(a1);
    await signalManager1.processSignal(answer, a2);

    const socket = await signalManager1.waitForConnect(a2, 5000);
    const repository = new PacketManager(socket);

    const connection = ErmesConnectionFactory.createConnection(
        signalManager1,
        null as any,
        repository,
        'test-connection-id'
    );

    // Add connection to handler so handler state is consistent for spec
    handler.addConnection(connection);

    // Provide a cleanup function to allow tests to fully release resources
    async function cleanup(): Promise<void> {
        try {
            // destroy connections, signal managers
            await signalManager1.destroy();
        } catch (e) {
            /* ignore */
        }
        try {
            await signalManager2.destroy();
        } catch (e) {
            /* ignore */
        }
        try {
            if (handler && typeof handler.deleteConnection === 'function') {
                handler.deleteConnection(connection, false);
            }
        } catch (e) {
            /* ignore */
        }
    }

    return { handler, connection, cleanup };
}

// Export the provider to the spec (registers tests using the same pattern as ErmesConnection)
testErmesConnectionsHandler(main);
// Note: main returns { handler, connection, cleanup? } optionally. Provide cleanup by
// extending main to include a cleanup function that destroys signal managers and other resources.