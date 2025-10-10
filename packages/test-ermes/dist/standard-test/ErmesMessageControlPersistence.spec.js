import { expect } from "chai";
import { ErmesMessageControlService, createMessageControlRepositoryWithState } from "ermes/index";
export function testErmesMessageControlPersistence(createRepo, getDatabase) {
    describe('ErmesMessageControl Persistence Tests', function () {
        it('should persist and reload state correctly', async function () {
            const repository1 = await createRepo();
            const opts = { frequencyIdSaveState: 0 };
            const service1 = new ErmesMessageControlService(repository1, opts);
            // Ensure clean start
            await service1.clear();
            // Add some IDs to create specific gaps
            await service1.idArrived(5);
            await service1.idArrived(3);
            // After adding 5 and 3, missing should be: 1, 2, 4
            const missingIds1 = await service1.idsToRequest();
            expect(missingIds1).to.include.members([1, 2, 4]);
            expect(missingIds1).to.not.include.members([3, 5]); // These were added
            await repository1.saveState();
            await service1.destroy();
            const repository2 = await createMessageControlRepositoryWithState(getDatabase());
            const service2 = new ErmesMessageControlService(repository2, opts);
            // State should be loaded correctly - same missing IDs
            const missingIds2 = await service2.idsToRequest();
            expect(missingIds2).to.include.members([1, 2, 4]);
            expect(missingIds2).to.not.include.members([3, 5]);
            await service2.destroy();
        });
        it('should persist empty state and reload correctly', async function () {
            const repository1 = await createRepo();
            const opts = { frequencyIdSaveState: 0 };
            const service1 = new ErmesMessageControlService(repository1, opts);
            // Start clean and save empty state
            await service1.clear();
            await repository1.saveState();
            await service1.destroy();
            // Load empty state
            const repository2 = await createMessageControlRepositoryWithState(getDatabase());
            const service2 = new ErmesMessageControlService(repository2, opts);
            const missingIds = await service2.idsToRequest();
            expect(missingIds).to.be.empty;
            await service2.destroy();
        });
        it('should persist sequential IDs without gaps', async function () {
            const repository1 = await createRepo();
            const opts = { frequencyIdSaveState: 0 };
            const service1 = new ErmesMessageControlService(repository1, opts);
            await service1.clear();
            // Add sequential IDs 1,2,3,4,5 - no gaps
            for (let i = 1; i <= 5; i++) {
                await service1.idArrived(i);
            }
            const missingIds1 = await service1.idsToRequest();
            expect(missingIds1).to.be.empty; // No missing IDs
            await repository1.saveState();
            await service1.destroy();
            const repository2 = await createMessageControlRepositoryWithState(getDatabase());
            const service2 = new ErmesMessageControlService(repository2, opts);
            const missingIds2 = await service2.idsToRequest();
            expect(missingIds2).to.be.empty; // Should still be empty
            await service2.destroy();
        });
        it('should persist large gaps and reload correctly', async function () {
            const repository1 = await createRepo();
            const opts = { frequencyIdSaveState: 0 };
            const service1 = new ErmesMessageControlService(repository1, opts);
            await service1.clear();
            // Add IDs with large gaps: 1, 10, 20
            await service1.idArrived(1);
            await service1.idArrived(10);
            await service1.idArrived(20);
            const missingIds1 = await service1.idsToRequest();
            expect(missingIds1).to.include.members([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
            expect(missingIds1).to.not.include.members([1, 10, 20]);
            await repository1.saveState();
            await service1.destroy();
            const repository2 = await createMessageControlRepositoryWithState(getDatabase());
            const service2 = new ErmesMessageControlService(repository2, opts);
            const missingIds2 = await service2.idsToRequest();
            expect(missingIds2).to.include.members([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
            expect(missingIds2).to.not.include.members([1, 10, 20]);
            await service2.destroy();
        });
        it('should persist and continue processing after reload', async function () {
            const repository1 = await createRepo();
            const opts = { frequencyIdSaveState: 0 };
            const service1 = new ErmesMessageControlService(repository1, opts);
            await service1.clear();
            // Add IDs: 1, 3, 5 (missing: 2, 4)
            await service1.idArrived(1);
            await service1.idArrived(3);
            await service1.idArrived(5);
            await repository1.saveState();
            await service1.destroy();
            // Reload and add missing ID 2
            const repository2 = await createMessageControlRepositoryWithState(getDatabase());
            const service2 = new ErmesMessageControlService(repository2, opts);
            // Before adding 2, should have [2, 4] missing
            let missingIds = await service2.idsToRequest();
            expect(missingIds).to.include.members([2, 4]);
            // Add the missing ID 2
            await service2.idArrived(2);
            // Now should only have [4] missing
            missingIds = await service2.idsToRequest();
            expect(missingIds).to.include.members([4]);
            expect(missingIds).to.not.include.members([2]);
            await service2.destroy();
        });
        it('should handle state persistence with multiple save/load cycles', async function () {
            const repository1 = await createRepo();
            const opts = { frequencyIdSaveState: 0 };
            const service1 = new ErmesMessageControlService(repository1, opts);
            await service1.clear();
            // First cycle: Add 1, 3
            await service1.idArrived(1);
            await service1.idArrived(3);
            await repository1.saveState();
            await service1.destroy();
            // Second cycle: Reload and add 5
            const repository2 = await createMessageControlRepositoryWithState(getDatabase());
            const service2 = new ErmesMessageControlService(repository2, opts);
            await service2.idArrived(5);
            await repository2.saveState();
            await service2.destroy();
            // Third cycle: Reload and verify all missing IDs
            const repository3 = await createMessageControlRepositoryWithState(getDatabase());
            const service3 = new ErmesMessageControlService(repository3, opts);
            const missingIds = await service3.idsToRequest();
            expect(missingIds).to.include.members([2, 4]); // Should have 2, 4 missing
            expect(missingIds).to.not.include.members([1, 3, 5]); // These were added
            await service3.destroy();
        });
    });
}
//# sourceMappingURL=ErmesMessageControlPersistence.spec.js.map