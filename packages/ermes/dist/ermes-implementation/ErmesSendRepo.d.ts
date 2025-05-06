import { ChunkMessage, MessageData, MessageRoot } from "./ermesUtility/ErmesType.js";
import { IIdHandlerNumber } from "./ermesUtility/IdHandler.js";
import { IErmesRepository } from "./interfaces/IErmes.js";
export type MessageRootErmes = MessageRoot<string>;
export type MessageDataErmes = MessageData;
export type MessageChunkErmes = ChunkMessage;
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
