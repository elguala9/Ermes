import { Instance as PeerInstance } from 'simple-peer';
import { IPacketManager } from './IPacketManager.js';
import { IErmesRepository, SocketDTO } from 'iermes/index';
import { CallbackOnDataRepository } from 'ermes-types';
export declare class PacketManager implements IPacketManager, IErmesRepository {
    private peer;
    private connectionId;
    /**
     * @param peer          the established SimplePeer instance
     * @param connectionId  your generated connection identifier
     */
    constructor(socketDTO: SocketDTO<PeerInstance>);
    onMessage(callback: CallbackOnDataRepository): void;
    destroy(force: boolean): void;
    isClosed(): boolean;
    waitForConnect(timeoutMs?: unknown): Promise<void>;
    waitForClose(timeoutMs?: number): Promise<void>;
    /**
     * Send a message if the peer is connected.
     */
    send(data: ArrayBuffer): boolean;
    /**
     * Register a callback to receive incoming data packets.
     */
    receive(callback: (data: ArrayBuffer) => void): void;
    /** Close and destroy the peer connection. */
    close(): void;
    /** Check if the peer connection is open. */
    isConnected(): boolean;
}
