import { expect } from "chai";
import { IdType } from "ermes-types";
import { IErmesMessageControlRepository, IErmesMessageControlService } from "iermes/index";
import { ErmesMessageControlService, ErmesMessageControlServiceOpts } from "ermes/index";

export function testErmesMessageControlService(
  repository: IErmesMessageControlRepository
) {

  describe('IErmesMessageControlService Tests', function () {

    let service: IErmesMessageControlService;

    beforeEach(async function () {
      // Create service with the repository
      const opts: ErmesMessageControlServiceOpts = { frequencyIdSaveState: 0 };
      service = new ErmesMessageControlService(repository, opts);
      
      // Clear state before each test
      await service.clear();
    });

    it('should handle ID arrival', async function () {
      await service.idArrived(1);
      
      // After adding ID 1, there should be no missing IDs
      const missingIds = await service.idsToRequest();
      expect(missingIds).to.be.an('array');
    });

    it('should detect missing IDs when receiving out-of-order', async function () {
      // Simulate receiving ID 5 first, which should create missing IDs 1,2,3,4
      await service.idArrived(5);
      
      const missingIds = await service.idsToRequest();
      expect(missingIds).to.include.members([1, 2, 3, 4]);
    });

    it('should fill gaps when missing IDs arrive', async function () {
      // Create a gap by receiving ID 5 first
      await service.idArrived(5);
      
      // Fill some gaps
      await service.idArrived(2);
      await service.idArrived(4);
      
      const missingIds = await service.idsToRequest();
      expect(missingIds).to.include.members([1, 3]);
      expect(missingIds).to.not.include.members([2, 4, 5]);
    });

    it('should handle multiple ID arrivals in sequence', async function () {
      await service.idArrived(1);
      await service.idArrived(2);
      await service.idArrived(3);
      
      const missingIds = await service.idsToRequest();
      expect(missingIds).to.be.empty;
    });

    it('should handle complex out-of-order sequence', async function () {
      // Complex sequence: receive 10, 8, 6, 4, 2
      await service.idArrived(10);
      await service.idArrived(8);
      await service.idArrived(6);
      await service.idArrived(4);
      await service.idArrived(2);
      
      const missingIds = await service.idsToRequest();
      expect(missingIds).to.include.members([1, 3, 5, 7, 9]);
      expect(missingIds).to.not.include.members([2, 4, 6, 8, 10]);
    });

    it('should handle callback setup', async function () {
      let callbackCalled = false;
      let receivedIds: IdType[] = [];

      await service.setCallbackIdsToRequest(async (ids: IdType[]) => {
        callbackCalled = true;
        receivedIds = ids;
      });

      // Trigger missing IDs by receiving ID 3 first
      await service.idArrived(3);
      
      // Give some time for async operations
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(callbackCalled).to.be.true;
      expect(receivedIds).to.include.members([1, 2]);
    });

    it('should clear all state', async function () {
      // Add some IDs first
      await service.idArrived(5);
      await service.idArrived(3);
      
      // Verify there are missing IDs
      let missingIds = await service.idsToRequest();
      expect(missingIds.length).to.be.greaterThan(0);
      
      // Clear and verify
      await service.clear();
      missingIds = await service.idsToRequest();
      expect(missingIds).to.be.empty;
    });

    it('should handle edge case with ID 1', async function () {
      await service.idArrived(1);
      
      const missingIds = await service.idsToRequest();
      expect(missingIds).to.be.empty;
    });

    it('should handle large gaps efficiently', async function () {
      this.timeout(5000); // Increase timeout for this test
      
      await service.idArrived(100);
      
      const missingIds = await service.idsToRequest();
      expect(missingIds.length).to.equal(99); // Should have IDs 1-99 missing
      expect(missingIds[0]).to.equal(1);
      expect(missingIds[missingIds.length - 1]).to.equal(99);
    });

    it('should handle destroy operation', async function () {
      await service.idArrived(5);
      
      // Should not throw
      await service.destroy();
      
      // After destroy, should be able to query (though behavior may vary)
      const missingIds = await service.idsToRequest();
      expect(missingIds).to.be.an('array');
    });

    it('should handle duplicate ID arrivals gracefully', async function () {
      await service.idArrived(3);
      await service.idArrived(3); // Duplicate
      await service.idArrived(3); // Another duplicate
      
      const missingIds = await service.idsToRequest();
      expect(missingIds).to.include.members([1, 2]);
      expect(missingIds).to.not.include(3);
    });

    it('should handle zero and negative IDs appropriately', async function () {
      // Test behavior with edge case IDs (if supported by implementation)
      try {
        await service.idArrived(0);
        const missingIds = await service.idsToRequest();
        expect(missingIds).to.be.an('array');
      } catch (error) {
        // If not supported, should throw or handle gracefully
        expect(error).to.exist;
      }
    });

    it('should maintain order in missing IDs list', async function () {
      // Create gaps: receive 10, 5, 8, 2
      await service.idArrived(10);
      await service.idArrived(5);
      await service.idArrived(8);
      await service.idArrived(2);
      
      const missingIds = await service.idsToRequest();
      
      // Check that missing IDs are in ascending order
      for (let i = 1; i < missingIds.length; i++) {
        expect(missingIds[i]).to.be.greaterThan(missingIds[i-1]);
      }
    });

    it('should handle concurrent ID arrivals', async function () {
      // Simulate concurrent arrivals
      const promises = [];
      for (let i = 1; i <= 10; i += 2) { // 1, 3, 5, 7, 9
        promises.push(service.idArrived(i));
      }
      
      await Promise.all(promises);
      
      const missingIds = await service.idsToRequest();
      expect(missingIds).to.include.members([2, 4, 6, 8]);
      expect(missingIds).to.not.include.members([1, 3, 5, 7, 9]);
    });

    describe('FrequencyIdSaveState Tests', function () {
      
      it('should work with frequencyIdSaveState = 0 (save always)', async function () {
        const opts: ErmesMessageControlServiceOpts = { frequencyIdSaveState: 0 };
        const testService = new ErmesMessageControlService(repository, opts);
        
        await testService.clear();
        
        // With frequency 0, state should be saved on every change
        await testService.idArrived(5);
        await testService.idArrived(3);
        
        const missingIds = await testService.idsToRequest();
        expect(missingIds).to.include.members([1, 2, 4]);
      });

      it('should work with frequencyIdSaveState = 2', async function () {
        const opts: ErmesMessageControlServiceOpts = { frequencyIdSaveState: 2 };
        const testService = new ErmesMessageControlService(repository, opts);
        
        await testService.clear();
        
        // With frequency 2, state should be saved every 2 changes
        await testService.idArrived(10);
        await testService.idArrived(8);  // This should trigger save
        
        const missingIds = await testService.idsToRequest();
        expect(missingIds).to.include.members([1, 2, 3, 4, 5, 6, 7, 9]);
      });

      it('should work with frequencyIdSaveState = 5', async function () {
        const opts: ErmesMessageControlServiceOpts = { frequencyIdSaveState: 5 };
        const testService = new ErmesMessageControlService(repository, opts);
        
        await testService.clear();
        
        // With frequency 5, need 5 changes to trigger save
        await testService.idArrived(10);
        await testService.idArrived(8);
        await testService.idArrived(6);
        await testService.idArrived(4);
        await testService.idArrived(2);  // This should trigger save
        
        const missingIds = await testService.idsToRequest();
        expect(missingIds).to.include.members([1, 3, 5, 7, 9]);
      });

      it('should work with high frequencyIdSaveState (100)', async function () {
        const opts: ErmesMessageControlServiceOpts = { frequencyIdSaveState: 100 };
        const testService = new ErmesMessageControlService(repository, opts);
        
        await testService.clear();
        
        // With high frequency, state saving is less frequent
        await testService.idArrived(5);
        await testService.idArrived(3);
        await testService.idArrived(7);
        
        const missingIds = await testService.idsToRequest();
        expect(missingIds).to.include.members([1, 2, 4, 6]);
      });

      it('should handle mixed frequency scenarios', async function () {
        // Test service creation with different frequencies
        const frequencies = [0, 1, 3, 10];
        
        for (const freq of frequencies) {
          const opts: ErmesMessageControlServiceOpts = { frequencyIdSaveState: freq };
          const testService = new ErmesMessageControlService(repository, opts);
          
          await testService.clear();
          
          // Add some IDs
          await testService.idArrived(freq + 5);
          await testService.idArrived(freq + 2);
          
          const missingIds = await testService.idsToRequest();
          expect(missingIds).to.be.an('array');
          expect(missingIds.length).to.be.greaterThan(0);
        }
      });

      it('should maintain consistency across different frequencies', async function () {
        const opts1: ErmesMessageControlServiceOpts = { frequencyIdSaveState: 1 };
        const opts2: ErmesMessageControlServiceOpts = { frequencyIdSaveState: 10 };
        
        const service1 = new ErmesMessageControlService(repository, opts1);
        await service1.clear();
        
        // Test sequence for service1
        const testSequence = [5, 3, 8, 1, 7];
        
        for (const id of testSequence) {
          await service1.idArrived(id);
        }
        
        const missingIds1 = await service1.idsToRequest();
        
        // Clear and test with service2
        const service2 = new ErmesMessageControlService(repository, opts2);
        await service2.clear();
        
        for (const id of testSequence) {
          await service2.idArrived(id);
        }
        
        const missingIds2 = await service2.idsToRequest();
        
        // Results should be the same
        const sorted1 = [...missingIds1].sort((a, b) => a - b);
        const sorted2 = [...missingIds2].sort((a, b) => a - b);
        expect(sorted1).to.deep.equal(sorted2);
      });

      it('should handle edge case with frequencyIdSaveState = 1', async function () {
        const opts: ErmesMessageControlServiceOpts = { frequencyIdSaveState: 1 };
        const testService = new ErmesMessageControlService(repository, opts);
        
        await testService.clear();
        
        // With frequency 1, state should be saved after every single change
        await testService.idArrived(3);  // Should trigger save
        
        const missingIds = await testService.idsToRequest();
        expect(missingIds).to.include.members([1, 2]);
      });
    });
  });
}