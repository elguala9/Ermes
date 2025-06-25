import { expect } from "chai";
import { ErmesWebRtcFactory } from "ermes/index";
import { IErmesService, IErmesSignalingService } from "iermes/index";
import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";
import { CallbackSignalInput } from "signaling-sdk/Types";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";



export function testSignalingSmartContract(
  service_1: ISignalingSdk,
  service_2: ISignalingSdk
) {




  describe('Smart Contract Test', function () {

    let offer: string = "Ciao Offer";
    let answer: string = "Ciao Answer";
    let offer2: string = "Ciao Offer 2";
    let answer2: string = "Ciao Answer 2";
    let offer3: string = "Ciao Offer 3";
    let answer3: string = "Ciao Answer 3";
    let snapshotId: string;

    before(async function () {
        chai.use(chaiAsPromised);
    })

    it('Set Answer Without Offer', async () => {
        const address = await service_1.getAddressUser();   
        await expect(service_1.setAnswer(answer, address)).to.be.rejectedWith(Error);
        /*        const address = await service_1.getAddressUser();   
        try {
            await service_1.setAnswer(answer, address);
        }
        catch(e: any){
            return;
        }
        throw new Error("setAnswer should throw an exception");*/
    });


    it('Set Offer', async () => {
        await service_1.setOffer(offer);
    });

    it('Get Offer', async () => {
        let _offer = await service_1.getOffer(await service_1.getAddressUser());
        expect(_offer.signal).to.deep.equal(offer);
    });

    it('Set Answer', async () => {
        await service_2.setAnswer(answer, await service_1.getAddressUser());
    });

    it('Get Answer', async () => {
        let _answer = await service_2.getAnswer(await service_2.getAddressUser(), await service_1.getAddressUser());
        expect(_answer.signal).to.deep.equal(answer);
    });

    it('Set Offer 2', async () => {
        await service_1.setOffer(offer2);
    });

    it('Get Offer 2', async () => {
        let _offer = await service_1.getOffer(await service_1.getAddressUser());
        expect(_offer.signal).to.deep.equal(offer2);
    });

    it('Set Answer 2', async () => {
        await service_2.setAnswer(answer2, await service_1.getAddressUser());
    });

    it('Get Answer 2', async () => {
        let _answer = await service_2.getAnswer(await service_2.getAddressUser(), await service_1.getAddressUser());
        expect(_answer.signal).to.deep.equal(answer2);
    });

    it('Callback Answer 1', async () => {
        await service_2.onAnswer(callbackDummy);

    });

    it('Callback Answer 2', async () => {
          await sleep(5_000);    
        await service_2.setAnswer(answer3, await service_1.getAddressUser());
    });

  }
)};


function callbackDummy(input: CallbackSignalInput){
    console.log("Callback called: ", input);
}


/** Attende (delay) un certo numero di millisecondi */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

