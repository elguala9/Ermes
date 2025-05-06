import { ChunkMessage, MessageData } from "./ermesUtility/ErmesType.js";
import { IIdHandlerNumber } from "./ermesUtility/IdHandler.js";
import { CallbackOnMessage, IErmesRepository, IErmesService } from "./interfaces/IErmes.js";
export type MessageDataErmes = MessageData;
export type MessageChunkErmes = ChunkMessage;
export type ErmesServiceInput = {
    repository: IErmesRepository;
    messageCallback: CallbackOnMessage;
    idHandlerNumber: IIdHandlerNumber;
    maxByte?: number;
    maxBuffer?: number;
};
export declare class ErmesService implements IErmesService {
    private repository;
    private ermesSendRepo;
    private ermesReadRepo;
    private messageCallback;
    constructor({ maxBuffer, maxByte, repository, idHandlerNumber, messageCallback }: ErmesServiceInput);
    onMessage(messageCallback: CallbackOnMessage): void;
    private handleServiceMessage;
    private sendMissingBaseMessage;
    private sendMissingChunks;
    send(message: Uint8Array): void;
    close(): void;
}
