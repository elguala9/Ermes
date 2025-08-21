import { testErmesRepository } from "test-ermes";
import { SignalManager } from "ermes/index";
import { IdAccountType } from "iermes/index";
import { PacketManager } from "ermes/ermes-implementation/IceProtocol/PacketManager";

describe('ErmesRepository Integration Tests', function() {
    this.timeout(60000); // Set a longer timeout for the entire suite

    let repository1: PacketManager;
    let repository2: PacketManager;
    let signalManager1: SignalManager;
    let signalManager2: SignalManager;

    before(async function() {
        // This runs once before all tests
        console.log('Setting up WebRTC connection...');
        
        // Create two separate SignalManager instances for testing
        signalManager1 = new SignalManager();
        signalManager2 = new SignalManager();

        // Create two different account IDs for testing
        const account1: IdAccountType = "test-account-1";
        const account2: IdAccountType = "test-account-2";

        try {
            // Establish WebRTC connection between the two signal managers
            console.log('Creating offer...');
            const offer = await signalManager1.createSignal();
            
            console.log('Processing offer...');
            await signalManager2.processSignal(offer, account1);
            
            console.log('Creating answer...');
            const answer = await signalManager2.createSignal(account1);
            
            console.log('Processing answer...');
            await signalManager1.processSignal(answer, account2);

            // Wait for connections to be ready
            console.log('Waiting for connections...');
            const socket1 = await signalManager1.waitForConnect(account2, 5000);
            const socket2 = await signalManager2.waitForConnect(account1, 5000);

            

            // Create PacketManager instances with the connected peers
            repository1 = new PacketManager(socket1);
            repository2 = new PacketManager(socket2);

            console.log('WebRTC connection established successfully!');

        } catch (error) {
            console.error('Failed to establish connection:', error);
            throw error;
        }
    });

    // Run the actual tests only after connection is established
    it('should run all repository tests', function() {
        console.log('Running repository tests...');
        testErmesRepository(repository1, repository2);
    });


    
});