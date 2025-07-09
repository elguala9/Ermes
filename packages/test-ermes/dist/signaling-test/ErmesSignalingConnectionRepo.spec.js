import { expect } from "chai";
import sinon from "sinon";
import { sleep } from "../utility.js";
export function testSignalingConnectionRepo(service_1, service_2) {
    let account_1;
    let account_2;
    describe('IErmesService Connection Tests', function () {
        before(async function () {
            account_1 = await service_1.getIdAccount();
            account_2 = await service_2.getIdAccount();
        });
        it('Service 1 Ping Before connection', async () => {
            expect(await service_1.pingServer()).to.equal(false);
        });
        it('Service 1 Connect', async () => {
            await service_1.connect();
        });
        it('Service 1 Ping', async () => {
            expect(await service_1.pingServer()).to.equal(true);
        });
        it('Service 2 Get signal', async () => {
            let signalOwner = await service_1.getSignalOwner();
            let signalRetrived = await service_2.getSignal(account_1);
            let isEqual = service_1.compareSignalMessage(signalOwner, signalRetrived);
            expect(isEqual).to.equal(true);
        });
        it('Service 2 Send Signal', () => {
            service_2.sendSignal(account_1);
        });
        it('Service 1 Get signal', async () => {
            let signalOwner = await service_2.getSignalOwner();
            let signalRetrived = await service_1.getSignal(account_2);
            let isEqual = service_1.compareSignalMessage(signalOwner, signalRetrived);
            expect(isEqual).to.equal(true);
        });
        it('Service 2 On Signal', async () => {
            const callbackDummy = sinon.stub();
            await service_1.onSignal(callbackDummy);
            await service_2.sendSignal(account_1);
            sleep(5000);
            expect(callbackDummy.calledOnce).to.equal(true);
        });
    });
}
;
//# sourceMappingURL=ErmesSignalingConnectionRepo.spec.js.map