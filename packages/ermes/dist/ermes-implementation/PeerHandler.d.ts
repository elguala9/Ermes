import type { SignalData } from 'simple-peer';
import { CallbackOnData, IErmesRepository, SerializableDataType } from '../../../iermes/dist/index.js';
export declare const defaultStun: string;
export type PeerHandlerInput = {
    offer?: string;
    iceServers?: RTCIceServer[];
};
export declare class PeerHandler implements IErmesRepository {
    private peer;
    private messageBuffer;
    private messageCallback?;
    constructor({ offer, iceServers }: PeerHandlerInput);
    createOffer(): Promise<SignalData>;
    setAnswer(answer: string): void;
    destroy(): void;
    send(data: SerializableDataType): void;
    onMessage(func: CallbackOnData): void;
    onConnect(callback: () => void): void;
    onError(callback: (err: Error) => void): void;
    onClose(callback: () => void): void;
    on(event: 'connect' | 'error' | 'close' | 'signal', callback: (...args: any[]) => void): void;
    private flushAndDestroy;
}
