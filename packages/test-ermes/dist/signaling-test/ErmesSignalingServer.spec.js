import { expect } from "chai";
import sinon from "sinon";
import { sleep } from "../utility.js";
export function testSignalingServer(service_1, service_2, service_3) {
    let account_1;
    let account_2;
    let account_3;
    let signal_of_service_1_general = "Ciao1";
    let signal_of_service_2_for_service_1 = "Ciao2";
    let signal_of_service_2_general = "Ciao3";
    let signal_of_service_2_general_test_callback = "CiaoCallback1";
    let signal_of_service_3_general_test_callback = "CiaoCallback2";
    let signal_of_service_2_test_callback_for_service_3 = "CiaoCallback3";
    describe('IErmesService Connection Tests', function () {
        before(async function () {
            account_1 = await service_1.getIdAccount();
            account_2 = await service_2.getIdAccount();
            account_3 = await service_3.getIdAccount();
        });
        it('isConnected in normal condition is true', async () => {
            expect(await service_1.isConnected()).to.equal(true);
        });
        it('Service 1 get signal empty', async () => {
            expect(await service_1.getSignal(account_2)).to.equal("");
        });
        it('Service 1 set signal general', async () => {
            await service_1.setSignal(signal_of_service_1_general);
            await sleep(8000);
        });
        it('Service 2 get signal of service 1', async () => {
            expect(await service_2.getSignal(account_1)).to.equal(signal_of_service_1_general);
        });
        it('Service 3 get signal of service 1', async () => {
            expect(await service_3.getSignal(account_1)).to.equal(signal_of_service_1_general);
        });
        it('Service 2 set signal for service 1', async () => {
            await service_2.setSignal(signal_of_service_2_for_service_1, account_1);
            await sleep(8000);
        });
        it('Service 1 get signal of service 2', async () => {
            expect(await service_1.getSignal(account_2)).to.equal(signal_of_service_2_for_service_1);
        });
        it('Service 3 should not get signal of service 2', async () => {
            expect(await service_3.getSignal(account_2)).to.not.equal(signal_of_service_2_for_service_1);
        });
        it('Service 2 set signal general', async () => {
            await service_2.setSignal(signal_of_service_2_general);
            await sleep(8000);
        });
        it('Service 3 get signal of service 2 (the general one)', async () => {
            expect(await service_3.getSignal(account_2)).to.equal(signal_of_service_2_general);
        });
        it('Callback (onSignal) should not be trigger on general signal', async () => {
            const callbackDummy = sinon.stub();
            await service_2.setSignal(signal_of_service_2_general_test_callback);
            service_3.onSignal(callbackDummy);
            expect(callbackDummy.called).to.equal(false);
        });
        it('Callback (onSignal) when signal arrived', async () => {
            const callbackDummy = sinon.stub();
            service_3.onSignal(callbackDummy);
            await service_3.setSignal(signal_of_service_3_general_test_callback);
            await sleep(5000);
            await service_2.setSignal(signal_of_service_2_test_callback_for_service_3, account_3);
            await sleep(5000);
            expect(callbackDummy.called).to.equal(true);
            const payload = callbackDummy.lastCall.args[0];
            expect(payload).to.equal(signal_of_service_2_test_callback_for_service_3);
        });
    });
}
;
//# sourceMappingURL=ErmesSignalingServer.spec.js.map