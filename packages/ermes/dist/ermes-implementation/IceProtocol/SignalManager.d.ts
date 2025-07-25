import { IErmesSignalingHandler, SocketDTO, SocketReadyCallback } from 'iermes/index';
import { IdAccountType } from 'iermes/signaling-interface/IErmesSignaling';
import { AnswerResponse, ISignalInfoAnswer, ISignalInfoOffer, OfferResponse, Response } from 'ermes-types';
import { PeerType } from 'ermes-types';
import { ISignalManager } from './ISignalManager.js';
export declare const DEFAULT_ICE_CONFIG: RTCConfiguration;
export declare class SignalManager implements ISignalManager, IErmesSignalingHandler<PeerType> {
    private iceConfig;
    private idAccount;
    private signalManagerMapping;
    /**
     * @param iceConfig configuration of ICE servers
     * @param idAccount the global account ID of the peer, used to identify the peer in the signaling process
     */
    constructor(iceConfig: RTCConfiguration | undefined, idAccount: IdAccountType);
    getAllPeerIds(): Promise<IdAccountType[]>;
    softClearConnection(remotePeerId: IdAccountType): Promise<void>;
    clearConnection(remotePeerId: IdAccountType): Promise<void>;
    destroy(): Promise<void>;
    getResponse(peerId: IdAccountType): Promise<Response>;
    getSocket(of: IdAccountType): Promise<SocketDTO<PeerType>>;
    isSocketReady(of: IdAccountType): Promise<boolean>;
    onSocketReady(from: IdAccountType, callback: SocketReadyCallback<SocketDTO<PeerType>>): Promise<void>;
    processSignal(signalString: string, from: IdAccountType): Promise<void>;
    createSignal(remotePeerId?: IdAccountType): Promise<string>;
    createReusableOffer(): Promise<ISignalInfoOffer>;
    processOfferAndCreateAnswer(receivedOffer: ISignalInfoOffer, peerId: IdAccountType): Promise<OfferResponse>;
    processAnswer(receivedAnswer: ISignalInfoAnswer, peerId: IdAccountType): Promise<AnswerResponse>;
}
