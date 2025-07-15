import { expect } from "chai";
import { IErmesSignalingServer, IdAccountType, SignalType } from "iermes/index";
import sinon from "sinon";
import { sleep } from "../utility.js";




export function testSignalingServer(
  service_1: IErmesSignalingServer,
  service_2: IErmesSignalingServer,
  service_3: IErmesSignalingServer
) {

  let account_1: IdAccountType;
  let account_2: IdAccountType;
  let account_3: IdAccountType;
  let signal_of_service_1_general: string = "Ciao1";
  let signal_of_service_2_for_service_1: string = "Ciao2";
  let signal_of_service_2_general: string = "Ciao3";
  let signal_of_service_2_general_test_callback: string = "CiaoCallback1";
  let signal_of_service_3_general_test_callback: string = "CiaoCallback2";
  let signal_of_service_2_test_callback_for_service_3: string = "CiaoCallback3";


  describe('IErmesService Connection Tests', function () {


    before(async function () {
      account_1 = await service_1.getIdAccount();
      account_2 = await service_2.getIdAccount();
      account_3 = await service_3.getIdAccount();
    })

    it('isConnected in normal condition is true', async () => {
      expect(await service_1.isConnected()).to.equal(true);
    });

    it('Service 1 get signal empty', async () => {
      expect(await service_1.getSignal(account_2)).to.equal("");
    });

    it('Service 1 set signal general', async () => {
      await service_1.setSignal(signal_of_service_1_general);
      await sleep(8_000);    
    });

    it('Service 2 get signal of service 1', async () => {
      expect(await service_2.getSignal(account_1)).to.equal(signal_of_service_1_general);
    });

    it('Service 3 get signal of service 1', async () => {
      expect(await service_3.getSignal(account_1)).to.equal(signal_of_service_1_general);
    });

    it('Service 2 set signal for service 1', async () => {
      await service_2.setSignal(signal_of_service_2_for_service_1, account_1);
      await sleep(8_000);    
    });

    it('Service 1 get signal of service 2', async () => {
      expect(await service_1.getSignal(account_2)).to.equal(signal_of_service_2_for_service_1);
    });

    it('Service 3 should not get signal of service 2', async () => {
      expect(await service_3.getSignal(account_2)).to.not.equal(signal_of_service_2_for_service_1);
    });

    it('Service 2 set signal general', async () => {
      await service_2.setSignal(signal_of_service_2_general);
      await sleep(8_000);    
    });

    it('Service 3 get signal of service 2 (the general one)', async () => {
      expect(await service_3.getSignal(account_2)).to.equal(signal_of_service_2_general);
    });

    it('Callback (onSignal) should not be trigger on general signal', async () => {
      const callbackDummy = sinon.stub<[SignalType], void>();
      await service_2.setSignal(signal_of_service_2_general_test_callback);
      service_3.onSignal(callbackDummy);
      expect(callbackDummy.called).to.equal(false);
    });

    it('Callback (onSignal) when signal arrived', async () => {
      const callbackDummy = sinon.stub<[SignalType], void>();
      service_3.onSignal(callbackDummy);
      await service_3.setSignal(signal_of_service_3_general_test_callback);
      await sleep(5_000);    
      await service_2.setSignal(signal_of_service_2_test_callback_for_service_3, account_3);
      await sleep(5_000);    
      expect(callbackDummy.called).to.equal(true);
      const payload = callbackDummy.lastCall.args[0];
      expect(payload).to.equal(signal_of_service_2_test_callback_for_service_3);
    });

  }
)};



