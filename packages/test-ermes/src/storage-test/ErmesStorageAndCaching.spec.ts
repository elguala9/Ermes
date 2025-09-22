import { expect } from "chai";
import { IErmesCachingService, IErmesStorageAndCaching } from "iermes/index";
import { testService } from "./ErmesCachingStorage.spec.js";
import { examplesMessageData, examplesChunkMessage } from "../var.js";
import { eqMessageData, eqChunkMessage } from "../compare.js";

export function testStorageAndCaching(service: IErmesStorageAndCaching<any>,
    cachingService: IErmesStorageAndCaching<any>,
    storageService: IErmesStorageAndCaching<any>,
    maxCachingSize: number
) {

    describe('IErmesStorageAndCachingService Tests', () => {
        testService(service);

        describe('Flush Tests', () => {
            
            it('should flush cache data to storage', async () => {
                await service.clear();
                await cachingService.clear();
                await storageService.clear();
                
                // Store some test data - this should go to both cache and storage
                const testData = examplesMessageData.slice(0, 3);
                for (const data of testData) {
                    await service.store(data);
                }
                
                // Verify data exists in both cache and storage
                for (const data of testData) {
                    const cachedData = await cachingService.retrieve(data.id);
                    const storedData = await storageService.retrieve(data.id);
                    
                    expect(cachedData).to.not.be.undefined;
                    expect(storedData).to.not.be.undefined;
                    expect(eqMessageData(cachedData!, data)).to.be.true;
                    expect(eqMessageData(storedData!, data)).to.be.true;
                }
                
                // Call flush - this should ensure all cache data is in storage
                await service.flush();
                
                // Verify data is still accessible after flush
                for (const data of testData) {
                    const retrieved = await service.retrieve(data.id);
                    const storedData = await storageService.retrieve(data.id);
                    
                    expect(retrieved).to.not.be.undefined;
                    expect(storedData).to.not.be.undefined;
                    expect(eqMessageData(retrieved!, data)).to.be.true;
                    expect(eqMessageData(storedData!, data)).to.be.true;
                }
            });

            it('should respect cache size limits and overflow to storage', async () => {
                await service.clear();
                await cachingService.clear();
                await storageService.clear();
                
                // Store more data than cache can hold
                const testData = examplesMessageData.slice(0, maxCachingSize + 3);
                
                for (const data of testData) {
                    await service.store(data);
                }
                
                // Check that cache has at most maxCachingSize elements
                const cacheCount = cachingService.numberOfElements();
                expect(cacheCount).to.be.at.most(maxCachingSize);
                
                // Check that storage has all elements
                const storageCount = storageService.numberOfElements();
                expect(storageCount).to.equal(testData.length);
                
                // Verify all data is accessible through the combined service
                for (const data of testData) {
                    const retrieved = await service.retrieve(data.id);
                    expect(retrieved).to.not.be.undefined;
                    expect(eqMessageData(retrieved!, data)).to.be.true;
                }
                
                // The elements beyond cache limit should only be in storage
                const overflowData = testData.slice(maxCachingSize);
                for (const data of overflowData) {
                    const storedData = await storageService.retrieve(data.id);
                    expect(storedData).to.not.be.undefined;
                    expect(eqMessageData(storedData!, data)).to.be.true;
                }
            });

            it('should handle flush with cache overflow scenario', async () => {
                await service.clear();
                await cachingService.clear();
                await storageService.clear();
                
                // Fill cache beyond capacity
                const testData = examplesMessageData.slice(0, maxCachingSize + 2);
                
                for (const data of testData) {
                    await service.store(data);
                }
                
                // Verify initial state: cache limited, storage has all
                expect(cachingService.numberOfElements()).to.be.at.most(maxCachingSize);
                expect(storageService.numberOfElements()).to.equal(testData.length);
                
                // Flush should not change anything since data is already in storage
                await service.flush();
                
                // Verify state after flush
                expect(storageService.numberOfElements()).to.equal(testData.length);
                
                // All data should still be accessible
                for (const data of testData) {
                    const retrieved = await service.retrieve(data.id);
                    expect(retrieved).to.not.be.undefined;
                    expect(eqMessageData(retrieved!, data)).to.be.true;
                }
            });

            it('should handle flush with empty cache', async () => {
                await service.clear();
                await cachingService.clear();
                await storageService.clear();
                
                // Verify both components are empty
                expect(cachingService.numberOfElements()).to.equal(0);
                expect(storageService.numberOfElements()).to.equal(0);
                
                // Call flush on empty cache - should not throw error
                await service.flush();
                
                // Verify both components are still empty
                expect(cachingService.numberOfElements()).to.equal(0);
                expect(storageService.numberOfElements()).to.equal(0);
                expect(service.numberOfElements()).to.equal(0);
                
                const ids = await service.listOfIds();
                expect(ids).to.have.lengthOf(0);
            });

            it('should flush cache-only data to storage', async () => {
                await service.clear();
                await cachingService.clear();
                await storageService.clear();
                
                // Store data directly in cache (simulating cache-only scenario)
                const cacheOnlyData = examplesMessageData.slice(0, 2);
                for (const data of cacheOnlyData) {
                    await cachingService.store(data);
                }
                
                // Store data normally through combined service
                const normalData = examplesMessageData.slice(2, 4);
                for (const data of normalData) {
                    await service.store(data);
                }
                
                // Verify initial state
                expect(cachingService.numberOfElements()).to.be.greaterThan(0);
                expect(storageService.numberOfElements()).to.equal(normalData.length);
                
                // Flush should move cache-only data to storage
                await service.flush();
                
                // Verify all data is now in storage
                const expectedTotalInStorage = cacheOnlyData.length + normalData.length;
                expect(storageService.numberOfElements()).to.equal(expectedTotalInStorage);
                
                // Verify all data is accessible
                const allData = [...cacheOnlyData, ...normalData];
                for (const data of allData) {
                    const retrieved = await service.retrieve(data.id);
                    const storedData = await storageService.retrieve(data.id);
                    
                    expect(retrieved).to.not.be.undefined;
                    expect(storedData).to.not.be.undefined;
                    expect(eqMessageData(retrieved!, data)).to.be.true;
                    expect(eqMessageData(storedData!, data)).to.be.true;
                }
            });

            it('should flush multiple types of data with cache limits', async () => {
                await service.clear();
                await cachingService.clear();
                await storageService.clear();
                
                // Store different types of data that exceed cache capacity
                const messageData = examplesMessageData.slice(0, Math.ceil(maxCachingSize / 2) + 1);
                const chunkData = examplesChunkMessage.slice(0, Math.ceil(maxCachingSize / 2) + 1);
                
                for (const data of messageData) {
                    await service.store(data);
                }
                for (const data of chunkData) {
                    await service.store(data);
                }
                
                const totalData = messageData.length + chunkData.length;
                
                // Verify cache respects limits
                expect(cachingService.numberOfElements()).to.be.at.most(maxCachingSize);
                
                // Verify storage has all data
                expect(storageService.numberOfElements()).to.equal(totalData);
                
                // Flush all data
                await service.flush();
                
                // Verify storage still has all data
                expect(storageService.numberOfElements()).to.equal(totalData);
                
                // Verify all data integrity
                for (const data of messageData) {
                    const retrieved = await service.retrieve(data.id);
                    expect(retrieved).to.not.be.undefined;
                    expect(eqMessageData(retrieved!, data)).to.be.true;
                }
                
                for (const data of chunkData) {
                    const retrieved = await service.retrieve(data.id);
                    expect(retrieved).to.not.be.undefined;
                    expect(eqChunkMessage(retrieved!, data)).to.be.true;
                }
            });
        });
    });
}
