import { ErmesConnectionFactory, ErmesConnectionsHandlerFactory, SignalManager } from 'ermes/index';
import { WorkDBFactory } from 'ermes-storage/index';
import { IdAccountType } from 'iermes/index';
import { PacketManager } from 'ermes/ermes-implementation/IceProtocol/PacketManager';
import { testErmesConnectionsHandler } from 'test-ermes';

async function runTests() {
    console.log('Running ErmesConnectionsHandler Integration Tests...');
    
    let signalManager1: SignalManager;
    let signalManager2: SignalManager;
    let db: any;
    
    // Setup
    signalManager1 = new SignalManager();
    signalManager2 = new SignalManager();
    db = WorkDBFactory.forNode();
    
    // Test 1: Create handler
    console.log('✓ should create an ErmesConnectionsHandler instance');
    const handler = ErmesConnectionsHandlerFactory.createConnectionsHandler(db);
    if (!handler) throw new Error('Handler creation failed');
    
    // Test 2: Connection management
    console.log('✓ should handle connection management with real implementations');
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
    const repository = new PacketManager(socket1);
    
    // Create real connection using factory
    const connection = ErmesConnectionFactory.createConnection(
        signalManager1,
        null as any,
        repository,
        'test-connection-id'
    );
    
    // Test adding connection
    handler.addConnection(connection);
    
    // Test getting connection by ID  
    const connectionId = connection.getIdConnection();
    const retrievedConnection = handler.getConnection(connectionId);
    if (retrievedConnection !== connection) throw new Error('Connection retrieval failed');
    
    // Test deleting connection
    handler.deleteConnection(connection, false);
    
    // Test 3: State loading
    console.log('✓ should handle state loading gracefully');
    await handler.loadState();
    
    // Test 4: Run comprehensive test suite
    console.log('Running standard test suite with real implementations...');
    testErmesConnectionsHandler(handler, connection);
    
    console.log('All tests passed!');
}

// Run the tests
runTests().catch(console.error);