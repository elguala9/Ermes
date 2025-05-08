import { IErmesCachingService } from "iermes/index";
import { examplesChunkMessage, examplesMessageData, examplesServiceMessage } from "../var";
import { expect } from "chai";
import { eqChunkMessage, eqMessageData, eqServiceMessage } from "../compare";
import { generateUniqueMessageData, StoreAndRetrive } from "./utility";
import { MessageData } from "ermes-types";

export function testCachingService(cachingService: IErmesCachingService<any>) {

    describe('IErmesCachingService Tests', () => {


        it('Message Data', async () => {
            examplesMessageData.forEach(element => {
                cachingService.store(element);  
            });

            // for each want a funciont, that in this case need to be asyn because of the await
            for(let i = 0; i<examplesMessageData.length; i++ ){
                let res = await cachingService.retrieve(examplesMessageData[i].id);  
                let isEqual = eqMessageData(res, examplesMessageData[i]);
                expect(isEqual).to.equal(true)
            }
        });

        it('Chunk Message', async () => {
            await StoreAndRetrive(cachingService, examplesChunkMessage, eqChunkMessage);
        });

        it('Chunk Message', async () => {
            await StoreAndRetrive(cachingService, examplesServiceMessage, eqServiceMessage);
        });

        it('Massive insert and retrive', async () => {
            let n = 1000;
            let array: MessageData[] = generateUniqueMessageData(n);
            const t0 = performance.now();

            await StoreAndRetrive(cachingService, array, eqMessageData);

            const t1 = performance.now();
            const total = t1 - t0;
            console.log(
                `✅ ${n} inserimenti+retrieval in ${total.toFixed(3)} ms` +
                ` (media ${(total / n).toFixed(6)} ms/op)`
            );
        });

        it('Clear', async () => {
            await cachingService.clear();
            cachingService.store(examplesMessageData[0]);
            await cachingService.clear();
            expect(cachingService.numberOfElements()).to.equal(0);
            let shouldBeUndefined = await cachingService.retrieve(examplesMessageData[0].id);
            expect(shouldBeUndefined).to.equal(undefined);
        });

        it('List of ids', async () => {
            await cachingService.clear();
            await StoreAndRetrive(cachingService, examplesChunkMessage, eqChunkMessage);
            let idList = await cachingService.listOfIds();
            examplesChunkMessage.forEach((element)=>{
                let isInList = idList.includes(element.id);
                expect(isInList).to.equal(true);
            })
        });

        it('Retrive undefined', async () => {
            await cachingService.clear();
            await StoreAndRetrive(cachingService, examplesChunkMessage, eqChunkMessage);
            expect(await cachingService.retrieve(9999999999)).to.equal(undefined);
        });

        it('Delete', async () => {
            await cachingService.clear();
            await StoreAndRetrive(cachingService, examplesChunkMessage, eqChunkMessage);
            let testId = examplesChunkMessage[0].id;
            await cachingService.delete(testId);
            expect(testId).to.equal(undefined);
        });

    });
}
