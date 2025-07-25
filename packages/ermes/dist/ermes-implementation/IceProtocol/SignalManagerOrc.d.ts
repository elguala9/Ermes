import { IErmesSignalingHandler, SocketDTO, SocketReadyCallback } from 'iermes/index';
import { IdAccountType } from 'iermes/signaling-interface/IErmesSignaling';
import SimplePeer from 'simple-peer';
import { AnswerResponse, ISignalInfoAnswer, ISignalInfoOffer, ISignalManager, OfferResponse, Response } from './ISignalManager.js';
export declare const DEFAULT_ICE_CONFIG: RTCConfiguration;
export type PeerType = SimplePeer.Instance;
export declare class SignalManager implements ISignalManager, IErmesSignalingHandler<PeerType> {
    private iceConfig;
    private idAccount;
    private isInitiator;
    private signalManagerMapping;
    /**
     * @param iceConfig configuration of ICE servers
     * @param idAccount the global account ID of the peer, used to identify the peer in the signaling process
     * @param isInitiator true -> you will create the offer, false -> you will answer the offer
     */
    constructor(iceConfig: RTCConfiguration | undefined, idAccount: IdAccountType, isInitiator: boolean);
    getResponse(peerId: IdAccountType): Promise<Response>;
    getSocket(of: IdAccountType): Promise<SocketDTO<PeerType>>;
    isSocketReady(of: IdAccountType): Promise<boolean>;
    onSocketReady(callback: SocketReadyCallback<SocketDTO<PeerType>>): Promise<void>;
    processSignal(signalString: string, from: IdAccountType): Promise<void>;
    createSignal(): Promise<string>;
    createReusableOffer(): Promise<ISignalInfoOffer>;
    processOfferAndCreateAnswer(receivedOffer: ISignalInfoOffer, peerId: IdAccountType): Promise<OfferResponse>;
    processAnswer(receivedAnswer: ISignalInfoAnswer, peerId: IdAccountType): Promise<AnswerResponse>;
}
