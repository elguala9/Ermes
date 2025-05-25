import { CallbackOnMessageReceived, CallBackServiceMessage } from "ermes-types";
import { IErmesRepository } from "iermes/index";
export type ErmesReadRepoOptions = {
    maxBufferSize?: number;
    callbackOnMessageReceived?: CallbackOnMessageReceived;
};
export declare class ErmesReadRepo {
    private messageNotReaded;
    private messageNotMerged;
    private repository;
    private callbackServiceMessage;
    private callbackOnMessageReceived?;
    constructor(repository: IErmesRepository, callbackServiceMessage: CallBackServiceMessage, { maxBufferSize, callbackOnMessageReceived }: ErmesReadRepoOptions);
    setCallbackServiceMessage(callbackServiceMessage: CallBackServiceMessage): void;
    setMessageDataCallback(callback: CallbackOnMessageReceived): void;
    private handleMessageArrayBuffer;
    private handleMessageType;
    private handleMessage;
    private handleBaseMessage;
    private handleChunkMessage;
    private addChunk;
    private pushInNotReaded;
}
