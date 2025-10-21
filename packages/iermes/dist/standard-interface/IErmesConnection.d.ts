import { IdPeer } from "ermes-types";
import { IErmesRepository } from "./IErmes.js";
export type closeCallaback = () => void;
export interface IErmesConnection {
    reconnect(): Promise<IErmesRepository>;
    close(): Promise<void>;
    setCloseCallback(callback: closeCallaback): void;
    isClosed(): Promise<boolean>;
    ping(): Promise<boolean>;
    getIdConnection(): IdPeer;
    saveState(): Promise<void>;
    loadState(): Promise<void>;
    destroyConnection(close?: boolean): Promise<void>;
}
