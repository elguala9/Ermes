import { MessageRoot, MessageType, TypeOfData } from "ermes-types";
import { IErmesRepository, IIdHandlerService } from "iermes/index";
export type MessageRootErmes = MessageRoot<string>;
export declare class ErmesSendRepo {
    private _repository;
    private _maxByte;
    private _idHandler;
    constructor(repository: IErmesRepository, idHandler: IIdHandlerService, maxByte?: number);
    send(rawData: TypeOfData): void;
    sendMessageType(array: MessageType[]): void;
    private sendRootMessage;
    private sendWithRepo;
}
