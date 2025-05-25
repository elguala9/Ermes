import { MessageRoot, TypeOfData } from "ermes-types";
import { IErmesRepository, IIdHandlerService } from "iermes/index";
export type MessageRootErmes = MessageRoot<string>;
export declare class ErmesSendRepo {
    private _repository;
    private _maxByte;
    private _idHandler;
    constructor(repository: IErmesRepository, idHandler: IIdHandlerService, maxByte?: number);
    send(rawData: TypeOfData): void;
    private sendMessageType;
    private sendRootMessage;
    private sendWithRepo;
}
