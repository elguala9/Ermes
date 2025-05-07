import { MessageRoot } from "ermes-types";
import { IIdHandlerNumber } from "src/ermes-utility/IdHandler.js";
import { IErmesRepository } from "../../../iermes/dist/index.js";
export type MessageRootErmes = MessageRoot<string>;
export declare class ErmesSendRepo {
    private repository;
    private maxByte;
    private idHandlerNumber;
    constructor(repository: IErmesRepository, idHandlerNumber: IIdHandlerNumber, maxByte?: number);
    private locked;
    send(rawData: Uint8Array): void;
    private sendMessageType;
    private sendRootMessage;
    private sendWithRepo;
}
