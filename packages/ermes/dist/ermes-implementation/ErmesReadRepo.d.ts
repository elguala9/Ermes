import { MessageDataErmes, ServiceMessage } from "ermes-types";
import { IErmesRepository } from "iermes/index";
export type CallBackServiceMessage = (serviceMessage: ServiceMessage) => void;
export type CallbackOnMessageData = (serviceMessage: MessageDataErmes) => void;
export type ErmesReadRepoOptions = {
    maxBufferSize?: number;
    messageDataCallback?: CallbackOnMessageData;
};
export declare class ErmesReadRepo {
    private messageNotReaded;
    private messageNotMerged;
    private repository;
    private callbackServiceMessage;
    private messageDataCallback?;
    constructor(repository: IErmesRepository, callbackServiceMessage: CallBackServiceMessage, { maxBufferSize, messageDataCallback }: ErmesReadRepoOptions);
    setCallbackServiceMessage(callbackServiceMessage: CallBackServiceMessage): void;
    setMessageDataCallback(messageDataCallback: CallbackOnMessageData): void;
    private handleMessageArrayBuffer;
    private handleMessageType;
    private handleMessage;
    private handleBaseMessage;
    private handleChunkMessage;
    private pushInNotReaded;
}
