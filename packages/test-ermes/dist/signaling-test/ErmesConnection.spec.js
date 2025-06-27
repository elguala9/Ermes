import { expect } from "chai";
export function testSignaling(service_1, service_2, account_1, account_2) {
    describe('IErmesService Connection Tests', function () {
        before(async function () {
        });
        it('Service 1 Connected', () => {
            service_1.connect(account_2);
        });
        it('Service 1 Connected', async () => {
            let signal = await service_1.getSignal();
            let signalRetrived = await service_2.getSignal(account_1);
            expect(signal).to.equal(signal);
        });
    });
}
;
//# sourceMappingURL=ErmesConnection.spec.js.map