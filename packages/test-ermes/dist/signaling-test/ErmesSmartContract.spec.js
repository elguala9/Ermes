import { expect } from "chai";
export function testSignalingSmartContract(service_1, service_2) {
    describe('Smart Contract Test', function () {
        let offer = "Ciao Offer";
        let answer = "Ciao Answer";
        let offer2 = "Ciao Offer 2";
        let answer2 = "Ciao Answer 2";
        let offer3 = "Ciao Offer 3";
        let answer3 = "Ciao Answer 3";
        before(async function () {
        });
        it('Set Answer Without Offer', async () => {
            const address = await service_1.getAddressUser();
            await expect(service_1.setAnswer(answer, address)).to.be.rejectedWith(Error);
        });
        it('Set Offer', async () => {
            await service_1.setOffer(offer);
        });
        it('Get Offer', async () => {
            let _offer = service_1.getOffer(await service_1.getAddressUser());
            expect(_offer).to.deep.equal(offer);
        });
        it('Set Answer', async () => {
            await service_2.setAnswer(answer, await service_1.getAddressUser());
        });
        it('Get Answer', async () => {
            let _answer = await service_2.getAnswer(await service_2.getAddressUser(), await service_1.getAddressUser());
            expect(_answer).to.deep.equal(answer);
        });
        it('Set Offer 2', async () => {
            await service_1.setOffer(offer2);
        });
        it('Get Offer 2', async () => {
            let _offer = service_1.getOffer(await service_1.getAddressUser());
            expect(_offer).to.deep.equal(offer2);
        });
        it('Set Answer 2', async () => {
            await service_2.setAnswer(answer2, await service_1.getAddressUser());
        });
        it('Get Answer 2', async () => {
            let _answer = await service_2.getAnswer(await service_2.getAddressUser(), await service_1.getAddressUser());
            expect(_answer).to.deep.equal(answer2);
        });
        it('Callback Answer', async () => {
            service_1.onAnswer(callbackDummy);
            await service_2.setAnswer(answer2, await service_1.getAddressUser());
        });
    });
}
;
function callbackDummy(input) {
    console.log("Callback called: ", input);
}
//# sourceMappingURL=ErmesSmartContract.spec.js.map