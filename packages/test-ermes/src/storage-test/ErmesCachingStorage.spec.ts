import { expect } from "chai";
import type { MessageData } from "ermes-types";
import { IErmesStorageAndCaching } from "iermes/index";
import { eqChunkMessage, eqMessageData, eqServiceMessage } from "../compare.js";
import { generateUniqueMessageData, StoreAndRetrive } from "../utility.js";
import { examplesChunkMessage, examplesMessageData, examplesServiceMessage } from "../var.js";

export function testService(service: IErmesStorageAndCaching<any>) {

    describe('Service Tests', () => {


        it('Message Data', async () => {
            for (const element of examplesMessageData) {
                await service.store(element);
            }

            // for each want a funciont, that in this case need to be asyn because of the await
            for(let i = 0; i<examplesMessageData.length; i++ ){
                let res = await service.retrieve(examplesMessageData[i].id);  
                let isEqual = eqMessageData(res, examplesMessageData[i]);
                expect(isEqual).to.equal(true)
            }
        });

        it('Chunk Message', async () => {
            await StoreAndRetrive(service, examplesChunkMessage, eqChunkMessage);
        });

        it('Service Message', async () => {
            await StoreAndRetrive(service, examplesServiceMessage, eqServiceMessage);
        });

        it('Massive insert and retrive', async () => {
            let n = 1000;
            let array: MessageData[] = generateUniqueMessageData(n);
            const t0 = performance.now();

            await StoreAndRetrive(service, array, eqMessageData);

            const t1 = performance.now();
            const total = t1 - t0;
            console.log(
                `✅ ${n} insert+retrieval in ${total.toFixed(3)} ms` +
                ` (avg ${(total / n).toFixed(6)} ms/op)`
            );
        });

        it('Clear', async () => {
            await service.clear();
            await service.store(examplesMessageData[0]);
            let shouldNotBeUndefined = await service.retrieve(examplesMessageData[0].id);
            expect(shouldNotBeUndefined).to.not.equal(undefined);
            await service.clear();
            expect(service.numberOfElements()).to.equal(0);
            let shouldBeUndefined = await service.retrieve(examplesMessageData[0].id);
            expect(shouldBeUndefined).to.equal(undefined);
        });

        it('List of ids', async () => {
            await service.clear();
            await StoreAndRetrive(service, examplesChunkMessage, eqChunkMessage);
            let idList = await service.listOfIds();
            examplesChunkMessage.forEach((element)=>{
                let isInList = idList.includes(element.id);
                expect(isInList).to.equal(true);
            })
        });

        it('Retrive undefined', async () => {
            await service.clear();
            await StoreAndRetrive(service, examplesChunkMessage, eqChunkMessage);
            expect(await service.retrieve(9999999999)).to.equal(undefined);
        });

        it('Delete', async () => {
            await service.clear();
            await StoreAndRetrive(service, examplesChunkMessage, eqChunkMessage);
            let testId = examplesChunkMessage[0].id;
            await service.delete(testId);
            let res = await service.retrieve(testId);
            expect(res).to.equal(undefined);
        });

        it('Destroy', async () => {
            await service.destroy();
            try{
                await service.store(examplesChunkMessage[0])
            }
            catch(e){
                return;
            }
            throw new Error("Obj not destroyed")
        });

    });
}
