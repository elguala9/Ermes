// -- Class that handles sending/receiving packets over an established peer --
export class PacketManager {
    /**
     * @param peer          the established SimplePeer instance
     * @param connectionId  your generated connection identifier
     */
    constructor(peer, connectionId) {
        this.peer = peer;
        this.connectionId = connectionId;
    }
    /**
     * Send a message if the peer is connected.
     */
    send(data) {
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
    receive(callback) {
        this.peer.on('data', (data) => {
            console.log(`📥 [${this.connectionId}] Received:`, data.toString?.().slice(0, 50) ?? data);
            callback(data);
        });
    }
    /** Close and destroy the peer connection. */
    close() {
        this.peer.destroy();
        console.log(`🔌 Connection ${this.connectionId} closed`);
    }
    /** Check if the peer connection is open. */
    isConnected() {
        return this.peer.connected;
    }
}
//# sourceMappingURL=PacketManager.js.map