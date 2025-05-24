import type { SignalData } from 'simple-peer';
import { ErmesWbrtcRepositoryInput, IErmesWebRtcRepository } from 'iermes/index';
import { CallbackOnDataRepository, SerializableDataType, Signal } from 'ermes-types';
export declare const defaultStun: string;
export declare class ErmesWebRtcRepository implements IErmesWebRtcRepository {
    private peer;
    private messageBuffer;
    private messageCallback?;
    constructor({ offer, iceServers }: ErmesWbrtcRepositoryInput);
    isClosed(): boolean;
    createSignal(): Promise<SignalData>;
    setSignal(signal: Signal): void;
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
