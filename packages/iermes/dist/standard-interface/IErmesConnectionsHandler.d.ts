import { IdPeer } from "ermes-types";
import { IErmesConnection } from "./IErmesConnection.js";
export interface IErmesConnectionsHandler {
    addConnection(connection: IErmesConnection): void;
    /**
     *
     * @param connection the connection to delete
     * @param close close before delete
     */
    deleteConnection(connection: IErmesConnection, close?: boolean): void;
    getConnection(id: IdPeer): IErmesConnection;
    saveState(): Promise<void>;
    loadState(): Promise<void>;
}
