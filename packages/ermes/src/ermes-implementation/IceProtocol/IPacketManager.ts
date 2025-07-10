export interface IPacketManager {
  /**
   * Send a data packet if the underlying peer is connected.
   */
  send(data: ArrayBuffer): boolean;

  /**
   * Register a callback to handle incoming data packets.
   */
  receive(callback: (data: ArrayBuffer) => void): void;

  /**
   * Close and destroy the peer connection.
   */
  close(): void;

  /**
   * Check whether the peer connection is currently open.
   */
  isConnected(): boolean;
}