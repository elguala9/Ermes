import { expect } from "chai";
export function testErmesService(f) {
    let service_1;
    let service_2;
    describe('IErmesService Tests', function () {
        before(async function () {
            this.timeout(20000);
            let x = await f();
            service_1 = x.service_1;
            service_2 = x.service_2;
        });
        it('Send & Receive Test', async () => {
            this.timeout(20000);
            const payload = new Uint8Array([1, 2, 3, 4]);
            // Promessa che si risolve al primo messaggio ricevuto
            const received = new Promise((resolve) => {
                service_2.onMessage({
                    callbackOnData: (data) => {
                        resolve(data);
                    },
                    callbackonMessage: () => {
                    }
                });
            });
            service_1.send(payload);
            const result = await received;
            expect(result).to.equal(payload);
        });
        /*it('Multiple Messages Test', async () => {
          const messages = [
            new Uint8Array([5]),
            new Uint8Array([6, 7]),
            new Uint8Array([8, 9, 10]),
          ];
          const received: Uint8Array[] = [];
    
          service_2.onMessage((data: Uint8Array) => {
            received.push(data);
          });
    
          for (const msg of messages) {
            service_1.send(msg);
          }
    
          // do un attimo di margine per ricevere tutti i messaggi
          await new Promise((r) => setTimeout(r, 10));
          expect(received).to.equal(messages);
        });*/
    });
    /*it('Close Connection Test', async () => {
        let wasCalled = false;
        service_2.onMessage(() => {
          wasCalled = true;
        });
  
        service_2.close();
        await service_2.waitForClose();
        // Provo a inviare un messaggio dopo la close
        service_1.send(new Uint8Array([9, 9, 9]));
  
        // aspetto un tick di event loop
        await new Promise((r) => setTimeout(r, 10));
        expect(wasCalled).to.equal(false);
      });*/
}
//# sourceMappingURL=Ermes.spec.js.map