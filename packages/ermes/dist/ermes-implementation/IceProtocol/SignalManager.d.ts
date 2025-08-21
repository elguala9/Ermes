import { AnswerResponse, ISignalInfoOffer, OfferResponse, PeerType, Response } from 'ermes-types';
import { IErmesSignalingHandler, SocketDTO, SocketReadyCallback } from 'iermes/index';
import { IdAccountType } from 'iermes/signaling-interface/IErmesSignaling';
import { ISignalManager } from './ISignalManager.js';
import { SignalInfoAnswer, SignalInfoOffer } from './SignalInfo.js';
export declare const DEFAULT_ICE_CONFIG: RTCConfiguration;
export declare class SignalManager implements ISignalManager, IErmesSignalingHandler<PeerType> {
    private iceConfig;
    private signalManagerMapping;
    /**
     * @param iceConfig configuration of ICE servers
     */
    constructor(iceConfig?: RTCConfiguration);
    getAllPeerIds(): Promise<IdAccountType[]>;
    softClearConnection(remotePeerId: IdAccountType): Promise<void>;
    clearConnection(remotePeerId: IdAccountType): Promise<void>;
    destroy(): Promise<void>;
    getResponse(peerId: IdAccountType): Promise<Response>;
    getSocket(of: IdAccountType): Promise<SocketDTO<PeerType>>;
    isSocketReady(of: IdAccountType): Promise<boolean>;
    /**
     * Waits for a connection to be established with the specified peer
     * @param peerId The remote peer ID to wait for connection
     * @param ms Maximum time to wait in milliseconds
     * @returns Promise that resolves when connection is established or rejects on timeout
     */
    waitForConnect(peerId: IdAccountType, ms: number): Promise<SocketDTO<PeerType>>;
    onSocketReady(from: IdAccountType, callback: SocketReadyCallback<SocketDTO<PeerType>>): Promise<void>;
    processSignal(signalString: string, from: IdAccountType): Promise<void>;
    createSignal(remotePeerId?: IdAccountType): Promise<string>;
    createReusableOffer(): Promise<ISignalInfoOffer>;
    processOfferAndCreateAnswer(receivedOffer: SignalInfoOffer, peerId: IdAccountType): Promise<OfferResponse>;
    processAnswer(receivedAnswer: SignalInfoAnswer, peerId: IdAccountType): Promise<AnswerResponse>;
}
