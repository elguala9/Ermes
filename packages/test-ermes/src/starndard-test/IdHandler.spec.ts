import { expect } from "chai";
import type { IdType, MessageData } from "ermes-types";
import { IErmesStorageAndCaching, IIdHandlerService } from "iermes/index";
import { eqChunkMessage, eqMessageData, eqServiceMessage } from "../compare.js";
import { generateUniqueMessageData, StoreAndRetrive } from "../utility.js";
import { examplesChunkMessage, examplesMessageData, examplesServiceMessage } from "../var.js";



export function testIIdHandler(service: IIdHandlerService, startIndex: IdType, maxIndex: IdType) {

    describe('IIdHandler Tests', () => {


        it('Get first index', async () => {
            service.reset();
            let res = service.getNewId() ;
            expect(res).to.equal(startIndex);
        });

        it('Reset', async () => {
            service.getNewId();
            service.getNewId()
            service.getNewId()
            service.getNewId()
            service.reset();
            expect(service.getNewId()).to.equal(startIndex);
        });

        it('Reset', async () => {
            service.getNewId();
            service.getNewId()
            service.getNewId()
            service.getNewId()
            service.reset();
            expect(service.getNewId()).to.equal(startIndex);
        });

        it('Test Max', async () => {
            service.reset();
            let index = service.getNewId();
            while(index < maxIndex)
                index = service.getNewId();
            expect(service.getNewId()).to.equal(maxIndex);
            expect(service.getNewId()).to.equal(startIndex);
        });

    });
}
