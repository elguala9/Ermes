import { expect } from "chai";
import sinon from "sinon";
import { sleep } from "src/utility.js";
export function testSignalingSmartContractCallback(service_1, service_2) {
    describe('Smart Contract Test', function () {
        let offer = "Ciao Offer";
        let answer = "Ciao Answer";
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
        it('Remove Listner', async () => {
            const callbackDummy = sinon.stub();
            await service_1.onAnswer(callbackDummy);
            await service_1.removeListerProposeAnswer();
            await service_2.setAnswer(answer, await service_1.getAddressUser());
            await sleep(5000);
            expect(callbackDummy.called).to.be.false;
        });
        it('Remove listner and set another', async () => {
            await sleep(5000);
            const callbackDummy1 = sinon.stub();
            const callbackDummy2 = sinon.stub();
            await service_1.onAnswer(callbackDummy1);
            await service_1.removeListerProposeAnswer();
            await service_1.onAnswer(callbackDummy2);
            await service_2.setAnswer(answer, await service_1.getAddressUser());
            await sleep(5000);
            expect(callbackDummy1.called).to.be.false;
            expect(callbackDummy2.called).to.be.true;
        });
        it('Overwrite Listner', async () => {
            await sleep(5000);
            const callbackDummy1 = sinon.stub();
            const callbackDummy2 = sinon.stub();
            await service_1.onAnswer(callbackDummy1);
            await service_1.onAnswer(callbackDummy2);
            await service_2.setAnswer(answer, await service_1.getAddressUser());
            await sleep(5000);
            expect(callbackDummy1.called).to.be.false;
            expect(callbackDummy2.calledOnce).to.be.true;
        });
    });
}
;
//# sourceMappingURL=ErmesSmartContractCallback.spec.js.map