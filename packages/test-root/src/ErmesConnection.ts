import { ErmesConnectionFactory, SignalManager, PacketManagerFactory, PacketManager } from 'ermes/index';
import { IdAccountType, IErmesConnection, IErmesSignalingHandler } from 'iermes/index';
import { WorkDBFactory } from 'ermes-storage/index';
import { PeerType } from 'ermes-types';
// Import the compiled JS test helper directly from test-ermes 'dist' to avoid
// ESM/CommonJS interop issues when loaded by ts-mocha. This mirrors the
// approach used in `ErmesBook.ts` which imports the compiled spec JS.
import { testErmesConnection } from 'test-ermes/dist/standard-test/ErmesConnection.spec.js';

let databasePath = "./test-db-ermes-connection";


async function main(): Promise<{
    db: any;
    ermesConnections: IErmesConnection[];
    cleanup?: () => Promise<void>;
}> {
    console.log("Starting integration test in test-root...");
    

    
    const db = WorkDBFactory.forNode(databasePath);
    
   
    // create a signaling handler and a packet-manager factory
    const signalingHandler: IErmesSignalingHandler<PeerType> = new SignalManager();
    const pmFactory = new PacketManagerFactory();

    // helper: create a connected PacketManager by doing a real signaling handshake
    async function createConnectedRepository(): Promise<PacketManager> {
        const s1 = new SignalManager();
        const s2 = new SignalManager();

        const a1: IdAccountType = `runner-${Date.now()}-1`;
        const a2: IdAccountType = `runner-${Date.now()}-2`;

        const offer = await s1.createSignal();
        await s2.processSignal(offer, a1);
        const answer = await s2.createSignal(a1);
        await s1.processSignal(answer, a2);

        const socket = await s1.waitForConnect(a2, 5000);
        return new PacketManager(socket);
    }

    // create two real connections (no mocks)
    const ermesConnections: IErmesConnection[] = [];
    const createdSignalManagers: SignalManager[] = [];
    const createdRepositories: PacketManager[] = [];

    for (let i = 0; i < 2; i++) {
        const repo = await createConnectedRepository();
        createdRepositories.push(repo);
        const conn = ErmesConnectionFactory.createConnection(signalingHandler, pmFactory, repo, `test-connection-${i}`);
        ermesConnections.push(conn);
    }

    // Provide a cleanup function to destroy created native resources
    const cleanup = async () => {
        // Close and wait for repositories to gracefully shutdown, then destroy
        for (const r of createdRepositories) {
            try {
                try {
                    r.close();
                } catch (e) {
                    console.debug('Ignored error on close():', e);
                }
                try {
                    if (typeof (r as any).waitForClose === 'function') {
                        await (r as any).waitForClose(2000);
                    }
                } catch (e) {
                    console.debug('Ignored error on waitForClose():', e);
                }
                try {
                    r.destroy(true);
                } catch (e) {
                    console.error('Error destroying repository during cleanup', e);
                }
            } catch (e) {
                console.error('Unexpected error during repository cleanup', e);
            }
        }

        // SignalManager: ensure any managed peers are destroyed
        try {
            await signalingHandler.destroy();
        } catch (e) {
            console.error('Error destroying signalingHandler during cleanup', e);
        }
    };

    return {
        db,
        ermesConnections,
        cleanup
    };



}

testErmesConnection(main);
