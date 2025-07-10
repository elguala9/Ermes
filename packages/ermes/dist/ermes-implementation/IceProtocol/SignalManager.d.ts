import { AnswerResponse, ISignalInfoAnswer, ISignalInfoOffer, ISignalManager, OfferResponse } from './ISignalManager.js';
import { IdAccountType, IErmesSignalingRepository, OnSignalCallback } from 'iermes/signaling-interface/IErmesSignaling';
import { OutputStruct } from 'signaling-sdk/Types';
export declare const DEFAULT_ICE_CONFIG: RTCConfiguration;
export declare class SignalManager implements ISignalManager, IErmesSignalingRepository<OutputStruct> {
    private iceConfig;
    private signals;
    private ownerId;
    private listeners;
    constructor(iceConfig?: RTCConfiguration);
    onSignal(callback: OnSignalCallback<OutputStruct>): Promise<void>;
    getSignal(from: IdAccountType): Promise<OutputStruct>;
    getSignalOwner(): Promise<OutputStruct>;
    compareSignalMessage(signal_1: OutputStruct, signal_2: OutputStruct): boolean;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getIdAccount(): Promise<IdAccountType>;
    pingServer(): Promise<boolean>;
    sendSignal(to: IdAccountType): Promise<void>;
    removeAllListeners(): void;
    /**
     * Create a one‐off SDP offer (trickle ICE disabled), wrap it in a ReusableOffer,
     * then destroy the temporary peer.
     */
    createReusableOffer(peerId?: string): Promise<ISignalInfoOffer>;
    /**
     * Consume a previously generated ReusableOffer, answer it and return
     * both the answer and the live PeerInstance.
     */
    processOfferAndCreateAnswer(receivedOffer: ISignalInfoOffer, peerId?: string): Promise<OfferResponse>;
    /**
     * Consume a ReusableAnswer on the initiator side to finalize the connection.
     */
    processAnswer(receivedAnswer: ISignalInfoAnswer): Promise<AnswerResponse>;
}
