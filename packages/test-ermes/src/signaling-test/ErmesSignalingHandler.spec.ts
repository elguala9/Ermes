import { expect } from "chai";
import { IErmesSignalingHandler, IErmesSignalingServer, IdAccountType, SignalType } from "iermes/index";





export function testSignalingServer<SocketType>(
  service_1: IErmesSignalingHandler<SocketType>,

) {




  describe('IErmesSignalingHandler Tests', function () {


    it('isConnected in normal condition is true', async () => {
      let signal = await service_1.createSignal()
      expect().to.equal(true);
    });

    
  }
)};



