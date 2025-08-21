import {
  Instance as PeerInstance,
  SignalData
} from 'simple-peer';
import { IPacketManager } from './IPacketManager.js';
import { IErmesRepository, IErmesWebRtcRepository, SocketDTO } from 'iermes/index';
import { CallbackOnDataRepository, SerializableDataType, Signal } from 'ermes-types';
import { DEFAULT_MAX_SIZE } from '../../Utility.js';

// -- Class that handles sending/receiving packets over an established peer --

export class PacketManager implements IPacketManager, IErmesRepository {
  private peer: PeerInstance;
  private connectionId: string;


  /**
   * @param peer          the established SimplePeer instance
   * @param connectionId  your generated connection identifier
   */
  constructor(socketDTO: SocketDTO<PeerInstance>) {
    this.peer = socketDTO.socket;
    this.connectionId = socketDTO.connectionId;
  }
  
  send(data: SerializableDataType): void {
    // Convert SerializableDataType to ArrayBuffer and use existing sendData
    if (data.byteLength > DEFAULT_MAX_SIZE) {
      throw new Error(`Data size exceeds maximum allowed size of ${DEFAULT_MAX_SIZE}`);
    }
    let buffer: ArrayBuffer;
    
    if (data instanceof ArrayBuffer) {
      buffer = data;
    } else if (typeof data === 'string') {
      buffer = new TextEncoder().encode(data).buffer;
    } else if (data instanceof Uint8Array) {
      // Copy the underlying buffer to ensure it's a true ArrayBuffer
      buffer = data.slice().buffer;
    } else {
      // If it's truly always bytes, this shouldn't happen
      throw new Error('Unexpected data type - expected binary data');
    }
    
    const success = this.sendData(buffer);
    if (!success) {
      throw new Error('Failed to send data - peer not connected');
    }
  }
  
  onMessage(callback: CallbackOnDataRepository): void {
    // Use existing receive method and adapt the callback
    this.receive((data: ArrayBuffer) => {
      // Since data is always bytes, just pass it directly as Uint8Array
      const uint8Array = new Uint8Array(data);
      callback(uint8Array);
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

  destroy(force: boolean): void {
    // Use existing close method
    this.close();
    
    // If force is true, you might want to do additional cleanup
    if (force) {
      // Remove all event listeners
      this.peer.removeAllListeners();
    }
  }

  isClosed(): boolean {
    // Use existing isConnected method (inverted)
    return !this.isConnected();
  }

  waitForConnect(timeoutMs?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      // If already connected, resolve immediately
      if (this.isConnected()) {
        resolve();
        return;
      }
      
      // Set up timeout if provided
      let timeout: NodeJS.Timeout | undefined;
      if (timeoutMs) {
        timeout = setTimeout(() => {
          reject(new Error(`Connection timeout after ${timeoutMs}ms`));
        }, timeoutMs);
      }
      
      // Listen for connect event
      this.peer.once('connect', () => {
        if (timeout) clearTimeout(timeout);
        resolve();
      });
      
      // Listen for error event
      this.peer.once('error', (error) => {
        if (timeout) clearTimeout(timeout);
        reject(error);
      });
    });
  }

  waitForClose(timeoutMs?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      // If already closed, resolve immediately
      if (this.isClosed()) {
        resolve();
        return;
      }
      
      // Set up timeout if provided
      let timeout: NodeJS.Timeout | undefined;
      if (timeoutMs) {
        timeout = setTimeout(() => {
          reject(new Error(`Close timeout after ${timeoutMs}ms`));
        }, timeoutMs);
      }
      
      // Listen for close event
      this.peer.once('close', () => {
        if (timeout) clearTimeout(timeout);
        resolve();
      });
      
      // Listen for error event (which might also indicate closure)
      this.peer.once('error', () => {
        if (timeout) clearTimeout(timeout);
        resolve(); // Resolve on error as it indicates the connection is closed
      });
    });
  }

  /**
   * Send a message if the peer is connected.
   */
  public sendData(data: ArrayBuffer): boolean {
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
}