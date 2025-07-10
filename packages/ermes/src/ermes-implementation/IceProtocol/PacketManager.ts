import {
  Instance as PeerInstance
} from 'simple-peer';
import { IPacketManager } from './IPacketManager.js';

// -- Class that handles sending/receiving packets over an established peer --

export class PacketManager implements IPacketManager {
  private peer: PeerInstance;
  private connectionId: string;

  /**
   * @param peer          the established SimplePeer instance
   * @param connectionId  your generated connection identifier
   */
  constructor(peer: PeerInstance, connectionId: string) {
    this.peer = peer;
    this.connectionId = connectionId;
  }

  /**
   * Send a message if the peer is connected.
   */
  public send(data: ArrayBuffer): boolean {
    if (this.peer.connected) {
      this.peer.send(data);
      console.log(`📤 [${this.connectionId}] Sent:`, data.toString().slice(0, 50));
      return true;
    }
    console.warn(`⚠️ [${this.connectionId}] Cannot send, peer not connected`);
    return false;
  }

  /**
   * Register a callback to receive incoming data packets.
   */
  public receive(callback: (data: ArrayBuffer) => void): void {
    this.peer.on('data', (data: any) => {
      console.log(`📥 [${this.connectionId}] Received:`, data.toString?.().slice(0, 50) ?? data);
      callback(data);
    });
  }

  /** Close and destroy the peer connection. */
  public close(): void {
    this.peer.destroy();
    console.log(`🔌 Connection ${this.connectionId} closed`);
  }

  /** Check if the peer connection is open. */
  public isConnected(): boolean {
    return this.peer.connected;
  }
}