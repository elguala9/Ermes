export function testErmesMessagingFailure(f) {
    let service_1;
    let service_2;
    describe('IErmesService Tests', function () {
        before(async function () {
            this.timeout(20000);
            let x = await f();
            service_1 = x.service_1;
            service_2 = x.service_2;
        });
    });
}
//# sourceMappingURL=ErmesMessagingFailure.spec.js.map