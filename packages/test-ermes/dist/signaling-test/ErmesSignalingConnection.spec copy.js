import { expect } from "chai";
import sinon from "sinon";
import { sleep } from "src/utility.js";
export function testSignalingConnection(service_1, service_2, signal_example) {
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
        it('Service 1 Connect', () => {
            service_1.connect();
        });
        it('Service 1 Ping', async () => {
            expect(await service_1.pingServer()).to.equal(true);
        });
        it('Service 1 Send Signal', () => {
            service_1.sendSignal(account_2, signal_example);
        });
        it('Service 2 Get signal', async () => {
            let signalRetrived = await service_2.getSignal(account_1);
            expect(signalRetrived).to.equal(signal_example);
        });
        it('Service 2', async () => {
            const callbackDummy = sinon.stub();
            await service_1.onSignal(callbackDummy);
            await service_2.sendSignal(account_1, signal_example);
            sleep(5000);
            expect(callbackDummy.calledOnce).to.equal(true);
        });
    });
}
;
//# sourceMappingURL=ErmesSignalingConnection.spec%20copy.js.map