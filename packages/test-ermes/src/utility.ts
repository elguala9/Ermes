import type { IdType, MessageData, MessageType } from "ermes-types";
import { IErmesCachingService, IErmesStorageService } from "iermes/index";
import { expect } from "chai";

/**
 * Function created to avoid duplicated source code
 * @param service the service that need to be tested
 * @param examples an array of example
 * @param eqFunc the function that check if two objects of the type passed are equal
 */
export async function StoreAndRetrive<Type extends MessageType>(
    service: IErmesCachingService<Type> | IErmesStorageService<Type>, 
    examples: Type[],
    eqFunc: (x: Type, y: Type) => boolean){
    examples.forEach(element => {
        service.store(element);  
    });

    // for each want a funciont, that in this case need to be asyn because of the await
    for(let i = 0; i<examples.length; i++ ){
        let res = await service.retrieve(examples[i].id);  
        if(res === undefined)
            throw new Error("Not found id" + examples[i].id);
        let isEqual = eqFunc(examples[i], res);
        expect(isEqual).to.equal(true)
    }
}

/**
 * Genera n MessageData con ID univoci e buffer di dati differenziati.
 *
 * @param n         Numero di MessageData da creare
 * @param startId   Valore iniziale per gli ID (default = 1)
 * @param dataLen   Lunghezza del buffer data (default = 3)
 * @returns         Array di MessageData
 */
export function generateUniqueMessageData(
    n: number,
    startId: number = 1,
    dataLen: number = 3
  ): MessageData[] {
    return Array.from({ length: n }, (_, idx) => {
      const id = (startId + idx) as IdType;
  
      // Crea un Uint8Array di lunghezza `dataLen` con valori diversi
      const data = new Uint8Array(dataLen);
      for (let j = 0; j < dataLen; j++) {
        // esempio di diversificazione: (id + j) modulo 256
        data[j] = (id + j) & 0xff;
      }
  
      return { id, data };
    });
  }