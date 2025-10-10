import { IErmesMessageControlRepository } from "iermes/index";
import { ClientWorkDB } from "workdb/ClientWorkDB";
export declare function testErmesMessageControlPersistence(createRepo: () => Promise<IErmesMessageControlRepository>, getDatabase: () => ClientWorkDB): void;
