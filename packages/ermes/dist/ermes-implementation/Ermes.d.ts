import { ChunkMessage, MessageData } from "ermes-types";
import { IIdHandlerNumber } from "src/ermes-utility/IdHandler.js";
import { CallbackOnMessage, IErmesRepository, IErmesService } from "iermes/standard-interface/IErmes";
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
