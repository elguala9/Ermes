import { IErmesIceRepository } from "iermes/standard-interface/IErmesIce";
import { SerializableDataType, CallbackOnDataRepository, Signal } from "ermes-types";
import { SignalData } from "simple-peer";
import { ISignalManager } from "./ISignalManager.js";
import { IPacketManager } from "./IPacketManager.js";
export declare class ErmesIceRepository implements IErmesIceRepository {
    private signalManager;
    private packetManager;
    constructor(signalManager: ISignalManager, packetManager: IPacketManager);
    send(data: SerializableDataType): void;
    onMessage(callback: CallbackOnDataRepository): void;
    destroy(force: boolean): void;
    isClosed(): boolean;
    isConnected(): boolean;
    waitForConnect(timeoutMs?: unknown): Promise<void>;
    waitForClose(timeoutMs?: number): Promise<void>;
    createSignal(): Promise<Signal>;
    createSignalString(): Promise<string>;
    parseSignalString(signalString: string): SignalData;
    setSignal(signal: Signal): void;
    onConnect(callback: () => void): void;
    onError(callback: (err: Error) => void): void;
    onClose(callback: () => void): void;
    onSignal(callback: (data: SignalData | PromiseLike<SignalData>) => void): void;
}
