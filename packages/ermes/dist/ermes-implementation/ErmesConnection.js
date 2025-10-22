/**
 * Implementation of IErmesConnection that manages peer connections through signaling
 * and handles repository creation and reconnection
 */
export class ErmesConnection {
    constructor(signalingHandler, factory, repository, connectionId) {
        this.isConnectionClosed = false;
        this.isReconnecting = false;
        this.MAX_RECONNECT_ATTEMPTS = 3;
        this.reconnectAttempts = 0;
        this.signalingHandler = signalingHandler;
        this.factory = factory;
        this.repository = repository;
        this.connectionId = connectionId;
    }
    getIErmesRepository() {
        return this.repository;
    }
    async reconnect() {
        if (this.isReconnecting) {
            throw new Error('Reconnection already in progress');
        }
        if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
            throw new Error(`Maximum reconnection attempts exceeded`);
        }
        this.isReconnecting = true;
        this.reconnectAttempts++;
        await this.signalingHandler.clearConnection(this.connectionId);
        this.repository = await this.factory.createRepository(this.connectionId, this.signalingHandler);
        this.reconnectAttempts = 0;
        this.isReconnecting = false;
        return this.repository;
    }
    async close() {
        if (this.isConnectionClosed)
            return;
        this.isConnectionClosed = true;
        this.stopMonitoring();
        await this.signalingHandler.clearConnection(this.connectionId);
        this.closeCallback?.();
    }
    setCloseCallback(callback) {
        this.closeCallback = callback;
    }
    async isClosed() {
        return this.isConnectionClosed;
    }
    async ping() {
        if (this.isConnectionClosed)
            return false;
        return await this.signalingHandler.isSocketReady(this.connectionId);
    }
    getIdConnection() {
        return this.connectionId;
    }
    async saveState() {
        throw new Error('ErmesConnection.saveState() is not implemented. This method should persist the connection state to storage but is currently a placeholder.');
    }
    async loadState() {
        throw new Error('ErmesConnection.loadState() is not implemented. This method should restore the connection state from storage but is currently a placeholder.');
    }
    async destroyConnection(close = true) {
        if (close)
            await this.close();
        this.stopMonitoring();
        this.closeCallback = undefined;
        await this.signalingHandler.softClearConnection(this.connectionId);
    }
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
        }
    }
}
//# sourceMappingURL=ErmesConnection.js.map