import { CallbackOnDataArrived, CallBackServiceMessage } from "ermes-types";
import { IErmesRepository } from "iermes/index";
export type ErmesReadRepoOptions = {
    maxBufferSize?: number;
    callbackOnDataArrived?: CallbackOnDataArrived;
};
export declare class ErmesReadRepo {
    private messageNotReaded;
    private messageNotMerged;
    private repository;
    private callbackServiceMessage;
    private callbackOnDataArrived?;
    constructor(repository: IErmesRepository, callbackServiceMessage: CallBackServiceMessage, { maxBufferSize, callbackOnDataArrived }: ErmesReadRepoOptions);
    setCallbackServiceMessage(callbackServiceMessage: CallBackServiceMessage): void;
    setMessageDataCallback(callback: CallbackOnDataArrived): void;
    private handleMessageArrayBuffer;
    private handleMessageType;
    private handleMessage;
    private handleBaseMessage;
    private handleChunkMessage;
    private addChunk;
    private pushInNotReaded;
}
