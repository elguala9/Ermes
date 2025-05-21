import { expect } from "chai";
export function testIIdHandler(service, maxIndex, startIndex) {
    describe('IIdHandler Tests', () => {
        it('Get first index', async () => {
            service.reset();
            let res = service.getNewId();
            expect(res).to.equal(startIndex);
        });
        it('Reset', async () => {
            service.getNewId();
            service.getNewId();
            service.getNewId();
            service.getNewId();
            service.reset();
            expect(service.getNewId()).to.equal(startIndex);
        });
        it('Reset', async () => {
            service.getNewId();
            service.getNewId();
            service.getNewId();
            service.getNewId();
            service.reset();
            expect(service.getNewId()).to.equal(startIndex);
        });
        it('Test Max', async () => {
            service.reset();
            let index = service.getNewId();
            while (index < maxIndex)
                index = service.getNewId();
            expect(service.getNewId()).to.equal(startIndex);
        });
    });
}
//# sourceMappingURL=IdHandler.spec.js.map