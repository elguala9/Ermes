import type { MessageData, MessageType } from "ermes-types";
import { IErmesCachingService, IErmesStorageService } from "iermes/index";
/**
 * Function created to avoid duplicated source code
 * @param service the service that need to be tested
 * @param examples an array of example
 * @param eqFunc the function that check if two objects of the type passed are equal
 */
export declare function StoreAndRetrive<Type extends MessageType>(service: IErmesCachingService<Type> | IErmesStorageService<Type>, examples: Type[], eqFunc: (x: Type, y: Type) => boolean): Promise<void>;
/**
 * Genera n MessageData con ID univoci e buffer di dati differenziati.
 *
 * @param n         Numero di MessageData da creare
 * @param startId   Valore iniziale per gli ID (default = 1)
 * @param dataLen   Lunghezza del buffer data (default = 3)
 * @returns         Array di MessageData
 */
export declare function generateUniqueMessageData(n: number, startId?: number, dataLen?: number): MessageData[];
