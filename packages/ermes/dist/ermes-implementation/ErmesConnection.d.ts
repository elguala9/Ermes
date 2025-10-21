import { IdPeer, PeerType } from "ermes-types";
import { IErmesConnection, closeCallaback, IErmesRepository, IErmesSignalingHandler, IErmesFactory } from "iermes/index";
/**
 * Implementation of IErmesConnection that manages peer connections through signaling
 * and handles repository creation and reconnection
 */
export declare class ErmesConnection implements IErmesConnection {
    private readonly signalingHandler;
    private readonly factory;
    private repository;
    private readonly connectionId;
    private closeCallback?;
    private isConnectionClosed;
    private isReconnecting;
    private monitoringInterval?;
    private readonly MAX_RECONNECT_ATTEMPTS;
    private reconnectAttempts;
    constructor(signalingHandler: IErmesSignalingHandler<PeerType>, factory: IErmesFactory<PeerType>, repository: IErmesRepository, connectionId: IdPeer);
    reconnect(): Promise<IErmesRepository>;
    close(): Promise<void>;
    setCloseCallback(callback: closeCallaback): void;
    isClosed(): Promise<boolean>;
    ping(): Promise<boolean>;
    getIdConnection(): IdPeer;
    saveState(): Promise<void>;
    loadState(): Promise<void>;
    destroyConnection(close?: boolean): Promise<void>;
    private stopMonitoring;
}
