import { IdPeer } from "ermes-types";
export type closeCallaback = () => void;
export interface IErmesConnection {
    reconnect(signal: string): Promise<void>;
    close(): Promise<void>;
    setCloseCallback(callback: closeCallaback): void;
    isClosed(): Promise<boolean>;
    ping(): Promise<boolean>;
    getIdConnection(): IdPeer;
}
