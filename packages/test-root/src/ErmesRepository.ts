import { testErmesRepository } from "test-ermes";
import { SignalManager } from "ermes/index";
import { IdAccountType } from "iermes/index";
import { PacketManager } from "ermes/ermes-implementation/IceProtocol/PacketManager";
import { factoryRepo } from "./utility/ErmesRepositoryFatory";

describe('ErmesRepository Integration Tests', function() {
    this.timeout(60000); // Set a longer timeout for the entire suite

    let repository1: PacketManager;
    let repository2: PacketManager;


    before(async function() {
        // This runs once before all tests
        const { repository1: repo1, repository2: repo2 } = await factoryRepo();
        repository1 = repo1;
        repository2 = repo2;
         });


    // Run the actual tests only after connection is established
    it('should run all repository tests', function() {
        console.log('Running repository tests...');
        testErmesRepository(repository1, repository2);
    });


    
});