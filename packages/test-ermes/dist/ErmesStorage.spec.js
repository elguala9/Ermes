"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teststorageService = teststorageService;
const var_1 = require("./var");
const chai_1 = require("chai");
const compare_1 = require("./compare");
function teststorageService(storageService) {
    describe('IErmeStorageService Tests', () => {
        before('Event API Tests', () => {
        });
        it('Get trail', async () => {
            var_1.examplesMessageData.forEach(element => {
                storageService.store(element);
            });
            // for each want a funciont, that in this case need to be asyn because of the await
            for (let i = 0; i < var_1.examplesMessageData.length; i++) {
                let res = await storageService.retrieve(var_1.examplesMessageData[i].id);
                let isEqual = (0, compare_1.eqMessageData)(res, var_1.examplesMessageData[i]);
                (0, chai_1.expect)(isEqual).to.equal(true);
            }
        });
    });
}
//# sourceMappingURL=ErmesStorage.spec.js.map