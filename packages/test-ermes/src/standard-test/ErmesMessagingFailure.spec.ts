import { expect } from "chai";
import type { IdType, MessageData } from "ermes-types";
import { IErmesService, IErmesStorageService, IIdHandlerService } from "iermes/index";
import { Console } from "node:console";


export function testErmesMessagingFailure(

  f: () => Promise<{
    service_1: IErmesService, 
    service_2: IErmesService,
    storageService_1:  IErmesStorageService<MessageData>,
  }>
) {

  let service_1: IErmesService;
  let service_2: IErmesService;



  describe('IErmesService Tests', function () {

    before(async function () {
      this.timeout(20000); 
      let x = await f();
      service_1 = x.service_1;
      service_2 = x.service_2;
    })

    

  });
}
