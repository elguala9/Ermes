import { expect } from "chai";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
export function testSignalingSmartContractCallback(service_1, service_2) {
    describe('Smart Contract Test', function () {
        let offer = "Ciao Offer";
        let answer = "Ciao Answer";
        before(async function () {
            chai.use(chaiAsPromised);
        });
        it('Set Offer', async () => {
            await service_1.setOffer(offer);
        });
        it('Callback Answer', async () => {
            const callbackDummy = sinon.stub();
            await service_1.onAnswer(callbackDummy);
            await service_2.setAnswer(answer, await service_1.getAddressUser());
            await sleep(5000);
            expect(callbackDummy.calledOnce).to.be.true;
            const payload = callbackDummy.lastCall.args[0];
            expect(payload.offerer).to.equal(await service_1.getAddressUser());
            expect(payload.answerer).to.equal(await service_2.getAddressUser());
            expect(payload.outputStruct.signal).to.equal(answer);
        });
    });
}
;
/** Attende (delay) un certo numero di millisecondi */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=ErmesSmartContractCallback.spec.js.map