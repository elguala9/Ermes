import { IdPeer } from "ermes-types";

export type closeCallaback = () => void;

export interface IErmesConnection{
    // try to est
    reconnect(signal: string) : Promise<void>;
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
}
