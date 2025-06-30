import { expect } from "chai";
import { ErmesWebRtcFactory } from "ermes/index";
import { IErmesService, IErmesSignalingService } from "iermes/index";
import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";
import { CallbackSignalInput } from "signaling-sdk/Types";

import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import { sleep } from "src/utility.js";


export function testSignalingSmartContractCallback(
  service_1: ISignalingSdk,
  service_2: ISignalingSdk
) {




  describe('Smart Contract Test', function () {
    let offer: string = "Ciao Offer";
    let answer: string = "Ciao Answer";

      it('Set Offer', async () => {
        await service_1.setOffer(offer);
    });

    it('Callback Answer', async () => {
        const callbackDummy = sinon.stub<[CallbackSignalInput], void>();
        await service_1.onAnswer(callbackDummy);
        await service_2.setAnswer(answer, await service_1.getAddressUser());
        await sleep(5_000);  
        expect(callbackDummy.calledOnce).to.be.true;
        const payload = callbackDummy.lastCall.args[0];
        expect(payload.offerer).to.equal(await service_1.getAddressUser());
        expect(payload.answerer).to.equal(await service_2.getAddressUser());
        expect(payload.outputStruct.signal).to.equal(answer);
        
    });

    it('Remove Listner', async () => {
        const callbackDummy = sinon.stub<[CallbackSignalInput], void>();
        await service_1.onAnswer(callbackDummy);
        await service_1.removeListnerProposeAnswer();
        await service_2.setAnswer(answer, await service_1.getAddressUser());
        await sleep(5_000);  
        expect(callbackDummy.called).to.be.false;      
    });

    it('Remove listner and set another', async () => {
        await sleep(5_000);    
        const callbackDummy1 = sinon.stub<[CallbackSignalInput], void>();
        const callbackDummy2 = sinon.stub<[CallbackSignalInput], void>();
        await service_1.onAnswer(callbackDummy1);
        await service_1.removeListnerProposeAnswer();
        await service_1.onAnswer(callbackDummy2);
        await service_2.setAnswer(answer, await service_1.getAddressUser());
        await sleep(5_000);  
        expect(callbackDummy1.called).to.be.false; 
        expect(callbackDummy2.called).to.be.true;      
    });

    it('Overwrite Listner', async () => {
        await sleep(5_000);    
        const callbackDummy1 = sinon.stub<[CallbackSignalInput], void>();
        const callbackDummy2 = sinon.stub<[CallbackSignalInput], void>();
        await service_1.onAnswer(callbackDummy1);
        await service_1.onAnswer(callbackDummy2);
        await service_2.setAnswer(answer, await service_1.getAddressUser());
        await sleep(5_000);  
        expect(callbackDummy1.called).to.be.false; 
        expect(callbackDummy2.calledOnce).to.be.true;      
    });

  }
)};






