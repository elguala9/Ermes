import { expect } from "chai";
import { IErmesService } from "iermes/index";


export function testErmesServiceConnection(

  f: () => Promise<{service_1: IErmesService, service_2: IErmesService}>
) {

  let service_1: IErmesService;
  let service_2: IErmesService;
  let service_3: IErmesService;



  describe('IErmesService Connection Tests', function () {

    before(async function () {
      this.timeout(20000); 
      let x = await f();
      service_1 = x.service_1;
      service_2 = x.service_2;

    })



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
      service_1.close()
      await service_1.waitForClose();
      expect(service_1.isClosed()).to.equal(true);
    });

  }
)};


/**
 * 
 * @param service this service should not be connected to any peer
 */
export function testErmesServiceAbsentConnection(

  service: IErmesService
) {

  describe('IErmesService Not Connection Tests', function () {
    
    it('Service 3 Not Connected', () => {
      expect(service.isConnected()).to.equal(false);
    });

    it('Service 3 Closed', () => {
      expect(service.isClosed()).to.equal(true);
    });
  }
)};
