import { testErmesMessageControlService } from "test-ermes";
import { createMessageControlRepositoryWithState } from "ermes/index";
import { WorkDBFactory } from "workdb/factories/FactoryClientWorkDB";

describe('ErmesMessageControlService Integration Tests', function() {
    this.timeout(60000);

    let repository: any;

    before(async function() {
        // Setup database for testing
        const db = WorkDBFactory.forNode("./test-db/message-control");
        
        // Create repository using factory function
        repository = await createMessageControlRepositoryWithState(db);
    });

    // Run the actual tests only after repository is created
    it('should run all message control service tests', function() {
        console.log('Running message control service tests...');
        testErmesMessageControlService(repository);
    });
});