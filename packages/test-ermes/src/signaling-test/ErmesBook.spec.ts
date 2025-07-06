import { expect } from "chai";
import { IErmesBookService, IErmesSignalingService, IdAccountType, OnSignalCallbackInput, OnSignalCreateSocketCallback } from "iermes/index";
import sinon from "sinon";
import { sleep } from "src/utility.js";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";


/**
 * 
 * @param service_1 
 * @param service_2 
 * @param info_example_1 
 * @param info_example_2 
 */
export function testBook<InfoJsonType>(
  service_1: IErmesBookService<InfoJsonType>,
  service_2: IErmesBookService<InfoJsonType>,
  info_example_1: InfoJsonType,
  info_example_2: InfoJsonType,
  info_example_array: [
    InfoJsonType, InfoJsonType, InfoJsonType, InfoJsonType, InfoJsonType,
    InfoJsonType, InfoJsonType, InfoJsonType, InfoJsonType, InfoJsonType,
    InfoJsonType, InfoJsonType, InfoJsonType, InfoJsonType, InfoJsonType,
    InfoJsonType, InfoJsonType, InfoJsonType, InfoJsonType, InfoJsonType
  ]
) {

  let account_1: IdAccountType = 'account_1'
  let account_2: IdAccountType = 'account_2'
  let account_list: IdAccountType[] = Array.from({length: 20}, (_, i) => `account_${i}`);
  

  describe('IErmesBook Tests', function () {


    before(async function () {
        chai.use(chaiAsPromised);
    })


    it('Service 1 Set Account', async () => {
      await service_1.setAccount(account_1, info_example_1);
    });

    it('Service 1 Retrive account', async () => {
      let res = await service_1.getAccount(account_1);
      expect(res).to.equal(info_example_1);
    });

    it('Service 1 Set Account', async () => {
      await service_1.setAccount(account_2, undefined);
    });

    it('Service 1 Retrive account', async () => {
      let res = await service_1.getAccount(account_1);
      expect(res).to.equal(info_example_1);
      let res2 = await service_1.getAccount(account_2);
      expect(res2).to.equal(undefined);
    });

    it('Service 2 Retrive account (ERROR)', async () => {
      expect(await service_2.getAccount(account_1)).to.be.rejectedWith(Error);
    });

    it('Service 2 Set All Accounts from account_list', async () => {
      for (let i = 0; i < account_list.length; i++) {
        await service_2.setAccount(account_list[i], info_example_array[i]);
      }
    });

    function checkAccountListResult(res: any, res2: any, expected: InfoJsonType[]) {
      const allItems = [...res.items, ...res2.items];
      expect(allItems).to.deep.equal(expected);
    }

    it('Service 2 getAccountList', async () => {
      let requestedItem = 15;
      let res = await service_2.getAccountList(account_list[0], requestedItem);
      expect(res.pageSize).to.equal(requestedItem);
      expect(res.eof).to.equal(false);
      expect(res.totalItems).to.equal(20);
      let res2 = await service_2.getAccountList(res.nextCursor, requestedItem);
      expect(res2.pageSize).to.equal(5);
      expect(res2.eof).to.equal(true);
      checkAccountListResult(res, res2, info_example_array);
    });
    
  }
)};



