import { IdPeer, PeerType } from "ermes-types";
import { 
    IErmesConnection, 
    closeCallaback, 
    IErmesRepository, 
    IErmesSignalingHandler,
    IErmesFactory 
} from "iermes/index";

/**
 * Implementation of IErmesConnection that manages peer connections through signaling
 * and handles repository creation and reconnection
 */
export class ErmesConnection implements IErmesConnection {
    private readonly signalingHandler: IErmesSignalingHandler<PeerType>;
    private readonly factory: IErmesFactory<PeerType>;
    private repository: IErmesRepository;
    private readonly connectionId: IdPeer;
    private closeCallback?: closeCallaback;
    private isConnectionClosed: boolean = false;
    private isReconnecting: boolean = false;
    private monitoringInterval?: NodeJS.Timeout;
    private readonly MAX_RECONNECT_ATTEMPTS = 3;
    private reconnectAttempts: number = 0;

    constructor(
        signalingHandler: IErmesSignalingHandler<PeerType>,
        factory: IErmesFactory<PeerType>,
        repository: IErmesRepository,
        connectionId: IdPeer
    ) {
        this.signalingHandler = signalingHandler;
        this.factory = factory;
        this.repository = repository;
        this.connectionId = connectionId;
    }
    getIErmesRepository(): IErmesRepository {
        return this.repository;
    }

    async reconnect(): Promise<IErmesRepository> {
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

    async close(): Promise<void> {
        if (this.isConnectionClosed) return;

        this.isConnectionClosed = true;
        this.stopMonitoring();
        await this.signalingHandler.clearConnection(this.connectionId);
        this.closeCallback?.();
    }

    setCloseCallback(callback: closeCallaback): void {
        this.closeCallback = callback;
    }

    async isClosed(): Promise<boolean> {
        return this.isConnectionClosed;
    }

    async ping(): Promise<boolean> {
        if (this.isConnectionClosed) return false;
        return await this.signalingHandler.isSocketReady(this.connectionId);
    }

    getIdConnection(): IdPeer {
        return this.connectionId;
    }

    async saveState(): Promise<void> {
        throw new Error('ErmesConnection.saveState() is not implemented. This method should persist the connection state to storage but is currently a placeholder.');
    }

    async loadState(): Promise<void> {
        throw new Error('ErmesConnection.loadState() is not implemented. This method should restore the connection state from storage but is currently a placeholder.');
    }

    async destroyConnection(close: boolean = true): Promise<void> {
        if (close) await this.close();
        this.stopMonitoring();
        this.closeCallback = undefined;
        await this.signalingHandler.softClearConnection(this.connectionId);
    }

    private stopMonitoring(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
        }
    }
}