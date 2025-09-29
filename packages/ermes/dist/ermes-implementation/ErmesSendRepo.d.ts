import { CallbackOnMessageSended, CallbackOnMessageSending, MessageRoot, MessageType, TypeOfData } from "ermes-types";
import { IErmesRepository, IIdHandlerService } from "iermes/index";
export type MessageRootErmes = MessageRoot<string>;
export declare class ErmesSendRepo {
    private _repository;
    private _maxByte;
    private _idHandler;
    private callbackOnMessageSending?;
    private callbackOnMessageSended?;
    constructor(repository: IErmesRepository, idHandler: IIdHandlerService, maxByte?: number);
    /**
     * Set callback for when a message is being sent
     */
    setCallbackOnDataSending(callback: CallbackOnMessageSending): void;
    /**
     * Set callback for when a message has been sent
     */
    setCallbackOnDataSended(callback: CallbackOnMessageSended): void;
    send(rawData: TypeOfData): void;
    sendMessageType(array: MessageType[]): void;
    private sendRootMessage;
    private sendWithRepo;
}
