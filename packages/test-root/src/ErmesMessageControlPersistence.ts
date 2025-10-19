import { WorkDBFactory } from "ermes-storage/index";
import { testErmesMessageControlPersistence } from "test-ermes";
import { createMessageControlRepository } from "ermes/index";

describe('ErmesMessageControlPersistence Integration Tests', function () {
  console.log('Running message control persistence tests...');
  
  // Create a single database instance with fixed path for persistence
  const sharedDB = WorkDBFactory.forNode("./test-db/message-control-persistence");
  
  // Create factory function for repositories using the shared database
  async function createRepo() {
    return createMessageControlRepository(sharedDB);
  }
  
  // Create factory function to get the shared database
  function getDatabase() {
    return sharedDB;
  }
  
  // Run all persistence tests using the factory
  testErmesMessageControlPersistence(createRepo, getDatabase);
});