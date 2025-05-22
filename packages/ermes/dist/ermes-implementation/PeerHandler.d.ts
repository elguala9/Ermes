import type { SignalData } from 'simple-peer';
import { CallbackOnData, IErmesWebRtcRepository, SerializableDataType } from 'iermes/index';
import { Signal } from 'ermes-types';
export declare const defaultStun: string;
export type PeerHandlerInput = {
    offer?: Signal;
    iceServers?: RTCIceServer[];
};
export declare class PeerHandler implements IErmesWebRtcRepository {
    private peer;
    private messageBuffer;
    private messageCallback?;
    constructor({ offer, iceServers }: PeerHandlerInput);
    isClose(): boolean;
    createSignal(): Promise<SignalData>;
    setSignal(signal: Signal): void;
    destroy(): void;
    send(data: SerializableDataType): void;
    onMessage(func: CallbackOnData): void;
    onConnect(callback: () => void): void;
    onError(callback: (err: Error) => void): void;
    onClose(callback: () => void): void;
    onSignal(callback: (data: SignalData | PromiseLike<SignalData>) => void): void;
    on(event: 'connect' | 'error' | 'close' | 'signal', callback: (...args: any[]) => void): void;
    private flushAndDestroy;
}
