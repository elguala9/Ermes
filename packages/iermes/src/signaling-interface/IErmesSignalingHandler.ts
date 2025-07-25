import { IdAccountType } from "./IErmesSignaling.js";
import { SignalType } from "./IErmesSignalingServer.js";
import { AnswerResponse, OfferResponse } from "ermes-types"

export type SocketReadyCallback<SocketType> = (socket: SocketType) => void; 

export type SocketDTO<SocketType> = {
    socket: SocketType;
    connectionId: string;
    remotePeerId: IdAccountType;
};



/**
 * * Interface that create and handle signaling of the peer
 */
export interface IErmesSignalingHandler<SocketType>{
    /**
     * create the signal that will be passed to the other peer
     * @param remotePeerId Optional, will be generated a signal specific for that peer
     */
    createSignal(remotePeerId?: IdAccountType): Promise<SignalType>;

    /**
     *
     * @param signal  signal from the other peer as a string
     */
    processSignal(signalString: SignalType, from: IdAccountType): Promise<void>;

    /**
     * return the socket of the signaling handler, if not ready it will throw an exception
     */
    getSocket(of: IdAccountType): Promise<SocketDTO<SocketType>>;

    /**
     * return true if the obj is ready to return a socket
     * @returns true if the socket is ready
    */
    isSocketReady(of: IdAccountType): Promise<boolean>;

    /**
     * set the callack called when the socket is ready
     * @param callback the callback called when the socket is ready
    */
    onSocketReady(from: IdAccountType, callback: SocketReadyCallback<SocketDTO<SocketType>>): Promise<void>;

    /**
     * clear every reference with the peer in order to create a new connection
     * @param remotePeerId the remote peer id to clear the connection
     */
    clearConnection(remotePeerId: IdAccountType): Promise<void>;

    /**
     * clear every reference with the peer in order to create a new connection
     * also destroy every object related to the peer
     * @param remotePeerId the remote peer id to clear the connection
     */
    softClearConnection(remotePeerId: IdAccountType): Promise<void>;

    /**
     * return all peer IDs that had/have connections (if not cleared)
     */
    getAllPeerIds(): Promise<IdAccountType[]>;

    destroy(): Promise<void>;

}

