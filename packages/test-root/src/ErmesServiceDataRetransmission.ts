import { testErmesServiceDataRetransmission, testErmesService } from "test-ermes";
import { factoryService } from "./utility/ErmesServiceFatory";

/**
 * ErmesService Data Retransmission Tests
 * 
 * This file orchestrates comprehensive testing of ErmesService data retransmission capabilities
 * including missing message detection, automatic retransmission, and dual-path control.
 */

// Test basic ErmesService functionality
testErmesService(factoryService);

// Test advanced data retransmission features
testErmesServiceDataRetransmission(async () => {
  const services = await factoryService();
  
  // Extract services from the factory result
  const service1 = services.service_1;
  const service2 = services.service_2;
  
  // Get message control services if available (cast to access internal properties)
  const ermesService1 = service1 as any;
  const ermesService2 = service2 as any;
  
  const messageControl1 = ermesService1.ermesMessageControlService;
  const messageControl2 = ermesService2.ermesMessageControlService;
  
  // Get storage services if available
  const storage1 = ermesService1.ermesStorageAndCaching;
  const storage2 = ermesService2.ermesStorageAndCaching;
  
  return {
    service1,
    service2,
    messageControl1,
    messageControl2,
    storage1,
    storage2
  };
});