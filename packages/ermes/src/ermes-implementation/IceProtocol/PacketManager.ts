import { CallbackOnDataRepository, SerializableDataType } from 'ermes-types';
import { IErmesRepository, SocketDTO } from 'iermes/index';
import { arrayBufferToUint8Array, uint8ArrayToArrayBuffer } from 'serialization-utility/src/Serialization';
import {
  Instance as PeerInstance
} from 'simple-peer';
import { DEFAULT_MAX_SIZE } from '../../utility.js';
import { IPacketManager } from './IPacketManager.js';

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
      throw new Error(`Data size exceeds maximum allowed size of ${DEFAULT_MAX_SIZE}, size:${data.byteLength}`);
    }
    let buffer: ArrayBuffer;
    
    if (data instanceof ArrayBuffer) {
      buffer = data;
    } else if (data instanceof Uint8Array) {
      // Copy the underlying buffer to ensure it's a true ArrayBuffer
      buffer = uint8ArrayToArrayBuffer(data);
    } else {
      // SerializableDataType should only be Uint8Array or ArrayBuffer, never string
      throw new TypeError('Unexpected data type - expected binary data (Uint8Array or ArrayBuffer)');
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
      const uint8Array = arrayBufferToUint8Array(data);
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
      //console.log(`📤 [${this.connectionId}] Sent:`, data.toString().slice(0, 50));
      return true;
    }
    console.warn(`⚠️ [${this.connectionId}] Cannot send, peer not connected`);
    return false;
  }

  /**
   * Register a callback to receive incoming data packets.
   */
  public receive(callback: (data: ArrayBuffer) => void): void {
    this.peer.on('data', (data: ArrayBuffer) => {

      callback(data);
    });
  }
}