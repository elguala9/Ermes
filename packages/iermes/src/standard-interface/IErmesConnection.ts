import { IdPeer } from "ermes-types";
import { IErmesRepository } from "./IErmes.js";

export type closeCallaback = () => void;

export interface IErmesConnection{
    // try to reconnect with the other peer
    reconnect() : Promise<IErmesRepository>;
    // close connection
    close(): Promise<void>;
    // set the callaback called when the connection is closing
    setCloseCallback(callback: closeCallaback): void;
    // true, the connection is closed
    isClosed(): Promise<boolean>
    // true, the other peer responded
    ping(): Promise<boolean>
    // get the id of the connection
    getIdConnection(): IdPeer;

    saveState(): Promise<void>;
    loadState(): Promise<void>;
    destroyConnection(close?: boolean): Promise<void>;
}
