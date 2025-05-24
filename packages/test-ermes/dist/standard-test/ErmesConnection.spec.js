import { expect } from "chai";
export function testErmesServiceConnection(f) {
    let service_1;
    let service_2;
    let service_3;
    describe('IErmesService Connection Tests', function () {
        before(async function () {
            this.timeout(20000);
            let x = await f();
            service_1 = x.service_1;
            service_2 = x.service_2;
        });
        it('Service 1 Connected', () => {
            expect(service_1.isConnected()).to.equal(true);
        });
        it('Service 2 Connected', () => {
            expect(service_2.isConnected()).to.equal(true);
        });
        it('Service 1 Not Closed', () => {
            expect(service_1.isClosed()).to.equal(false);
        });
        it('Service 2 Not Closed', () => {
            expect(service_2.isClosed()).to.equal(false);
        });
        it('Service 1 Close', async () => {
            service_1.close();
            await service_1.waitForClose();
            expect(service_1.isClosed()).to.equal(true);
        });
    });
}
;
/**
 *
 * @param service this service should not be connected to any peer
 */
export function testErmesServiceAbsentConnection(service) {
    describe('IErmesService Not Connection Tests', function () {
        it('Service 3 Not Connected', () => {
            expect(service.isConnected()).to.equal(false);
        });
        it('Service 3 Closed', () => {
            expect(service.isClosed()).to.equal(true);
        });
    });
}
;
//# sourceMappingURL=ErmesConnection.spec.js.map