export function testSignalingConnection(service_1, service_2, info_example_1, info_example_2) {
    let account_1 = 'account_1';
    let account_2;
    describe('IErmesService Connection Tests', function () {
        before(async function () {
        });
        it('Service 1 Set Account', async () => {
            service_1.setAccount(account_1, info_example_1);
        });
        it('Service 1 Retrive account', () => {
            service_1.getAccount(account_1);
        });
    });
}
;
//# sourceMappingURL=ErmesBook.js.map