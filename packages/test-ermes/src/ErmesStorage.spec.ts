import { IErmesStorageService } from "iermes/index";
import { examplesMessageData } from "./var";
import { expect } from "chai";
import { eqMessageData } from "./compare";

export function teststorageService(storageService: IErmesStorageService<any>) {

    describe('IErmeStorageService Tests', () => {

        before('Event API Tests', () => {

        })

        it('Get trail', async () => {
            examplesMessageData.forEach(element => {
                storageService.store(element);  
            });

            // for each want a funciont, that in this case need to be asyn because of the await
            for(let i = 0; i<examplesMessageData.length; i++ ){
                let res = await storageService.retrieve(examplesMessageData[i].id);  
                let isEqual = eqMessageData(res, examplesMessageData[i]);
                expect(isEqual).to.equal(true)
            }

            
        });



    });
}
