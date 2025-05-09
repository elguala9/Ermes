"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCachingService = testCachingService;
const var_1 = require("./var");
const chai_1 = require("chai");
const compare_1 = require("./compare");
const utility_1 = require("./utility");
function testCachingService(cachingService) {
    describe('IErmesCachingService Tests', () => {
        it('Message Data', async () => {
            var_1.examplesMessageData.forEach(element => {
                cachingService.store(element);
            });
            // for each want a funciont, that in this case need to be asyn because of the await
            for (let i = 0; i < var_1.examplesMessageData.length; i++) {
                let res = await cachingService.retrieve(var_1.examplesMessageData[i].id);
                let isEqual = (0, compare_1.eqMessageData)(res, var_1.examplesMessageData[i]);
                (0, chai_1.expect)(isEqual).to.equal(true);
            }
        });
        it('Chunk Message', async () => {
            await (0, utility_1.StoreAndRetrive)(cachingService, var_1.examplesChunkMessage, compare_1.eqChunkMessage);
        });
        it('Chunk Message', async () => {
            await (0, utility_1.StoreAndRetrive)(cachingService, var_1.examplesServiceMessage, compare_1.eqServiceMessage);
        });
        it('Massive insert and retrive', async () => {
            let n = 1000;
            let array = (0, utility_1.generateUniqueMessageData)(n);
            const t0 = performance.now();
            await (0, utility_1.StoreAndRetrive)(cachingService, array, compare_1.eqMessageData);
            const t1 = performance.now();
            const total = t1 - t0;
            console.log(`✅ ${n} inserimenti+retrieval in ${total.toFixed(3)} ms` +
                ` (media ${(total / n).toFixed(6)} ms/op)`);
        });
        it('Clear', async () => {
            await cachingService.clear();
            cachingService.store(var_1.examplesMessageData[0]);
            await cachingService.clear();
            (0, chai_1.expect)(cachingService.numberOfElements()).to.equal(0);
            let shouldBeUndefined = await cachingService.retrieve(var_1.examplesMessageData[0].id);
            (0, chai_1.expect)(shouldBeUndefined).to.equal(undefined);
        });
        it('List of ids', async () => {
            await cachingService.clear();
            await (0, utility_1.StoreAndRetrive)(cachingService, var_1.examplesChunkMessage, compare_1.eqChunkMessage);
            let idList = await cachingService.listOfIds();
            var_1.examplesChunkMessage.forEach((element) => {
                let isInList = idList.includes(element.id);
                (0, chai_1.expect)(isInList).to.equal(true);
            });
        });
        it('Retrive undefined', async () => {
            await cachingService.clear();
            await (0, utility_1.StoreAndRetrive)(cachingService, var_1.examplesChunkMessage, compare_1.eqChunkMessage);
            (0, chai_1.expect)(await cachingService.retrieve(9999999999)).to.equal(undefined);
        });
        it('Delete', async () => {
            await cachingService.clear();
            await (0, utility_1.StoreAndRetrive)(cachingService, var_1.examplesChunkMessage, compare_1.eqChunkMessage);
            let testId = var_1.examplesChunkMessage[0].id;
            await cachingService.delete(testId);
            (0, chai_1.expect)(testId).to.equal(undefined);
        });
    });
}
//# sourceMappingURL=ErmesCaching.spec.js.map