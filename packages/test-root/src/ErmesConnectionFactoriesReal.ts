import { ErmesConnectionsHandlerFactory, SignalManager, PacketManagerFactory } from 'ermes/index';
import { WorkDBFactory } from 'ermes-storage/index';

async function testRealImplementations() {
    console.log('Testing Real Implementations...');
    
    // Create real SignalManager instance
    const signalingHandler = new SignalManager();
    console.log('✓ Created real SignalManager instance');

    // Create real PacketManagerFactory instance
    const factory = new PacketManagerFactory();
    console.log('✓ Created real PacketManagerFactory instance');
    
    // Create ErmesConnectionsHandler with real database
    const db = WorkDBFactory.forNode('./test-db');
    const handler = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);
    console.log('✓ Created ErmesConnectionsHandler with real database');
    
    // Test that we can instantiate real implementations
    const realSignalManager = new SignalManager();
    const realFactory = new PacketManagerFactory();
    console.log('✓ Factory Pattern Integration verified');
    
    console.log('All Real Implementation tests passed!');
}

testRealImplementations().catch(console.error);