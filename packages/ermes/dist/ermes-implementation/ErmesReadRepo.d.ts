import { CallbackOnMessageService, CallBackServiceMessage } from "ermes-types";
import { IErmesRepository } from "iermes/index";
export type ErmesReadRepoOptions = {
    maxBufferSize?: number;
    messageCallback?: CallbackOnMessageService;
};
export declare class ErmesReadRepo {
    private messageNotReaded;
    private messageNotMerged;
    private repository;
    private callbackServiceMessage;
    private messageCallback?;
    constructor(repository: IErmesRepository, callbackServiceMessage: CallBackServiceMessage, { maxBufferSize, messageCallback }: ErmesReadRepoOptions);
    setCallbackServiceMessage(callbackServiceMessage: CallBackServiceMessage): void;
    setMessageDataCallback(messageCallback: CallbackOnMessageService): void;
    private handleMessageArrayBuffer;
    private handleMessageType;
    private handleMessage;
    private handleBaseMessage;
    private handleChunkMessage;
    private addChunk;
    private pushInNotReaded;
}
