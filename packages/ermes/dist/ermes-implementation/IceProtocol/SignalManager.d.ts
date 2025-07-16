import { IErmesSignalingHandler, SocketReadyCallback } from 'iermes/index';
import { IdAccountType } from 'iermes/signaling-interface/IErmesSignaling';
import SimplePeer from 'simple-peer';
import { AnswerResponse, ISignalInfoAnswer, ISignalInfoOffer, ISignalManager, OfferResponse } from './ISignalManager.js';
export declare const DEFAULT_ICE_CONFIG: RTCConfiguration;
export type PeerType = SimplePeer.Instance;
export declare class SignalManager implements ISignalManager, IErmesSignalingHandler<PeerType> {
    private iceConfig;
    private idAccount;
    private isInitiator;
    private answerResponse?;
    private offerResponse?;
    private callbackSocketReady?;
    /**
     *
     * @param iceConfig condiguratio of ICE servers
     * @param idAccount the global account ID of the peer, used to identify the peer in the signaling process
     * @param isInitiator true -> you will create the offer, false -> you will answer the offer
     */
    constructor(iceConfig: RTCConfiguration | undefined, idAccount: IdAccountType, isInitiator: boolean);
    getSocket(): Promise<PeerType>;
    isSocketReady(): Promise<boolean>;
    onSocketReady(callback: SocketReadyCallback<PeerType>): Promise<void>;
    processSignal(signalString: string): Promise<void>;
    /**
     * Create a real SDP‐offer via SimplePeer and store it as OutputStruct
     */
    createSignal(): Promise<string>;
    /**
     * Create a one‐off SDP offer (trickle ICE disabled), wrap it in a ReusableOffer,
     * then destroy the temporary peer.
     */
    createReusableOffer(): Promise<ISignalInfoOffer>;
    /**
     * Consume a previously generated ReusableOffer, answer it and return
     * both the answer and the live PeerInstance.
     */
    processOfferAndCreateAnswer(receivedOffer: ISignalInfoOffer): Promise<OfferResponse>;
    /**
     * Consume a ReusableAnswer on the initiator side to finalize the connection.
     */
    processAnswer(receivedAnswer: ISignalInfoAnswer): Promise<AnswerResponse>;
}
