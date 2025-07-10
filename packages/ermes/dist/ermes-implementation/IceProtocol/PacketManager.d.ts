import { Instance as PeerInstance } from 'simple-peer';
import { IPacketManager } from './IPacketManager.js';
export declare class PacketManager implements IPacketManager {
    private peer;
    private connectionId;
    /**
     * @param peer          the established SimplePeer instance
     * @param connectionId  your generated connection identifier
     */
    constructor(peer: PeerInstance, connectionId: string);
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
