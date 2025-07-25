import { CallbackOnDataRepository, SerializableDataType, Signal } from "ermes-types";
import { IErmesIceRepository } from "iermes/standard-interface/IErmesIce";
import { SignalData } from "simple-peer";
import { IPacketManager } from "./IPacketManager.js";
import { ISignalManager } from "./ISignalManager.js";


export class ErmesIceRepository implements IErmesIceRepository {
    private signalManager: ISignalManager;
    private packetManager: IPacketManager;

    constructor(signalManager: ISignalManager, packetManager: IPacketManager) {
        this.signalManager = signalManager;
        this.packetManager = packetManager;
    }

    send(data: SerializableDataType): void {
        throw new Error("Method not implemented.");
    }
    onMessage(callback: CallbackOnDataRepository): void {
        throw new Error("Method not implemented.");
    }
    destroy(force: boolean): void {
        throw new Error("Method not implemented.");
    }
    isClosed(): boolean {
        throw new Error("Method not implemented.");
    }
    isConnected(): boolean {
        throw new Error("Method not implemented.");
    }
    waitForConnect(timeoutMs?: unknown): Promise<void> {
        throw new Error("Method not implemented.");
    }
    waitForClose(timeoutMs?: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    createSignal(): Promise<Signal> {
        throw new Error("Method not implemented.");
        //let offer = thissignalManager.createReusableOffer();
    }
    createSignalString(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    parseSignalString(signalString: string): SignalData {
        throw new Error("Method not implemented.");
    }
    setSignal(signal: Signal): void {
        throw new Error("Method not implemented.");
    }
    onConnect(callback: () => void): void {
        throw new Error("Method not implemented.");
    }
    onError(callback: (err: Error) => void): void {
        throw new Error("Method not implemented.");
    }
    onClose(callback: () => void): void {
        throw new Error("Method not implemented.");
    }
    onSignal(callback: (data: SignalData | PromiseLike<SignalData>) => void): void {
        throw new Error("Method not implemented.");
    }

    // Implement other methods as needed...
}