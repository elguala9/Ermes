import { TypeOfDataExternal, IdPeer, CallbackOnDataArrivedFrom } from "ermes-types";
export interface IOrcErmes {
    send(data: TypeOfDataExternal, peer: IdPeer): Promise<void>;
    onMessage(callbackOnData: CallbackOnDataArrivedFrom): Promise<void>;
    openConnection(peer: IdPeer): Promise<void>;
    closeConnection(peer: IdPeer): Promise<void>;
    destroy(force?: boolean): Promise<void>;
    save(): Promise<void>;
    getConnections(): Promise<IdPeer>;
}
