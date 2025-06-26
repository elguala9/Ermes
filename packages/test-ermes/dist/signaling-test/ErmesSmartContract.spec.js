import { expect } from "chai";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
export function testSignalingSmartContract(service_1, service_2) {
    describe('Smart Contract Test', function () {
        let offer = "Ciao Offer";
        let answer = "Ciao Answer";
        let offer2 = "Ciao Offer 2";
        let answer2 = "Ciao Answer 2";
        let offer3 = "Ciao Offer 3";
        let answer3 = "Ciao Answer 3";
        before(async function () {
            chai.use(chaiAsPromised);
        });
        it('Set Answer Without Offer', async () => {
            const address = await service_1.getAddressUser();
            await expect(service_1.setAnswer(answer, address)).to.be.rejectedWith(Error);
            /*        const address = await service_1.getAddressUser();
            try {
                await service_1.setAnswer(answer, address);
            }
            catch(e: any){
                return;
            }
            throw new Error("setAnswer should throw an exception");*/
        });
        it('Set Offer', async () => {
            await service_1.setOffer(offer);
        });
        it('Get Offer', async () => {
            let _offer = await service_1.getOffer(await service_1.getAddressUser());
            expect(_offer.signal).to.deep.equal(offer);
        });
        it('Set Answer', async () => {
            await service_2.setAnswer(answer, await service_1.getAddressUser());
        });
        it('Get Answer', async () => {
            let _answer = await service_2.getAnswer(await service_2.getAddressUser(), await service_1.getAddressUser());
            expect(_answer.signal).to.deep.equal(answer);
        });
        it('Set Offer 2', async () => {
            await service_1.setOffer(offer2);
        });
        it('Get Offer 2', async () => {
            let _offer = await service_1.getOffer(await service_1.getAddressUser());
            expect(_offer.signal).to.deep.equal(offer2);
        });
        it('Set Answer 2', async () => {
            await service_2.setAnswer(answer2, await service_1.getAddressUser());
        });
        it('Get Answer 2', async () => {
            let _answer = await service_2.getAnswer(await service_2.getAddressUser(), await service_1.getAddressUser());
            expect(_answer.signal).to.deep.equal(answer2);
        });
        it('Callback Answer 1', async () => {
            await service_2.onAnswer(callbackDummy);
        });
        it('Callback Answer 2', async () => {
            await sleep(1000);
            await service_2.setAnswer(answer3, await service_1.getAddressUser());
        });
    });
}
;
function callbackDummy(input) {
    console.log("Callback called: ", input);
}
/** Attende (delay) un certo numero di millisecondi */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=ErmesSmartContract.spec.js.map