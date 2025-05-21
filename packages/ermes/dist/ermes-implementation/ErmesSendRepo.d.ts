import { MessageRoot } from "ermes-types";
import { IErmesRepository, IIdHandlerService } from "iermes/index";
export type MessageRootErmes = MessageRoot<string>;
export declare class ErmesSendRepo {
    private repository;
    private maxByte;
    private idHandlerNumber;
    constructor(repository: IErmesRepository, idHandlerNumber: IIdHandlerService, maxByte?: number);
    private locked;
    send(rawData: Uint8Array): void;
    private sendMessageType;
    private sendRootMessage;
    private sendWithRepo;
}
