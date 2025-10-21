import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { ErmesConnectionFactory, SignalManager } from 'ermes/index';
import { IdAccountType } from 'iermes/index';
import { PacketManager } from 'ermes/ermes-implementation/IceProtocol/PacketManager';

describe('ErmesConnection Integration Tests', () => {
    let signalManager1: SignalManager;
    let signalManager2: SignalManager;
    
    beforeEach(() => {
        signalManager1 = new SignalManager();
        signalManager2 = new SignalManager();
    });

    async function createConnectedRepository(connectionId: string): Promise<PacketManager> {
        // Create a real WebRTC connection like in ErmesRepository tests
        const account1: IdAccountType = "test-account-1";
        const account2: IdAccountType = "test-account-2";
        
        // Establish WebRTC connection
        const offer = await signalManager1.createSignal();
        await signalManager2.processSignal(offer, account1);
        const answer = await signalManager2.createSignal(account1);
        await signalManager1.processSignal(answer, account2);
        
        // Wait for connections
        const socket1 = await signalManager1.waitForConnect(account2, 5000);
        
        // Create real repository with established socket
        return new PacketManager(socket1);
    }

    it('should create an ErmesConnection instance', async () => {
        const repository = await createConnectedRepository('test-connection-id');
        const connection = ErmesConnectionFactory.createConnection(
            signalManager1, 
            null as any, // We don't need the factory since we have the repository
            repository, 
            'test-connection-id'
        );
        
        expect(connection).to.not.be.undefined;
        expect(connection.getIdConnection()).to.not.be.undefined;
    });

    it('should handle connection state changes', async () => {
        const repository = await createConnectedRepository('test-connection-id');
        const connection = ErmesConnectionFactory.createConnection(
            signalManager1, 
            null as any,
            repository, 
            'test-connection-id'
        );
        
        // Test ping functionality
        const pingResult = await connection.ping();
        expect(pingResult).to.be.a('boolean');
    });
    
    it('should handle close gracefully', async () => {
        const repository = await createConnectedRepository('test-connection-id-2');
        const connection = ErmesConnectionFactory.createConnection(
            signalManager1, 
            null as any,
            repository, 
            'test-connection-id-2'
        );
        await connection.close();
        const isClosed = await connection.isClosed();
        expect(isClosed).to.be.true;
    });

    it('should handle reconnection', async () => {
        const repository = await createConnectedRepository('test-connection-id-3');
        const connection = ErmesConnectionFactory.createConnection(
            signalManager1, 
            null as any,
            repository, 
            'test-connection-id-3'
        );
        const reconnectedRepository = await connection.reconnect();
        expect(reconnectedRepository).to.not.be.undefined;
    });
});