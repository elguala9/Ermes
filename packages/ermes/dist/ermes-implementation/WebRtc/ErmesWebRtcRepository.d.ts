import type { SignalData } from 'simple-peer';
import { ErmesWbrtcRepositoryInput, IErmesWebRtcRepository } from 'iermes/index';
import { CallbackOnDataRepository, SerializableDataType, Signal } from 'ermes-types';
export declare const defaultStun: string;
export declare class ErmesWebRtcRepository implements IErmesWebRtcRepository {
    private peer;
    private messageBuffer;
    private messageCallback?;
    private lastSignal?;
    private needsSignal;
    constructor({ offer, iceServers }: ErmesWbrtcRepositoryInput);
    isClosed(): boolean;
    /** forza una ICE‐restart */
    private restartIce;
    createSignal(): Promise<SignalData>;
    createSignalString(): Promise<string>;
    setSignal(signal: Signal): void;
    parseSignalString(signalString: string): SignalData;
    destroy(): void;
    send(data: SerializableDataType): void;
    onMessage(func: CallbackOnDataRepository): void;
    onConnect(callback: () => void): void;
    onError(callback: (err: Error) => void): void;
    onClose(callback: () => void): void;
    onSignal(callback: (data: SignalData | PromiseLike<SignalData>) => void): void;
    on(event: 'connect' | 'error' | 'close' | 'signal', callback: (...args: any[]) => void): void;
    private flushAndDestroy;
    isConnected(): boolean;
    private waitForEvent;
    waitForConnect(timeoutMs?: number): Promise<void>;
    waitForClose(timeoutMs?: number): Promise<void>;
}
