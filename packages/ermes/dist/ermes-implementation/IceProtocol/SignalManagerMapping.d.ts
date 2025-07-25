import { AnswerResponse, OfferResponse, PeerType } from 'ermes-types';
import { SocketDTO, SocketReadyCallback } from 'iermes/index';
import { IdAccountType } from 'iermes/signaling-interface/IErmesSignaling';
export declare class SignalManagerMapping {
    private answerResponses;
    private offerResponses;
    private socketCallbacks;
    /**
     * Get the answer response for a specific peer
     */
    getAnswerResponse(peerId: IdAccountType): AnswerResponse | undefined;
    /**
     * Get the offer response for a specific peer
     */
    getOfferResponse(peerId: IdAccountType): OfferResponse | undefined;
    /**
     * Get the callback for a specific peer
     */
    getCallback(peerId: IdAccountType): SocketReadyCallback<SocketDTO<PeerType>> | undefined;
    /**
     * Check if we have an answer response for a peer
     */
    hasAnswerResponse(peerId: IdAccountType): boolean;
    /**
     * Check if we have an offer response for a peer
     */
    hasOfferResponse(peerId: IdAccountType): boolean;
    /**
     * Check if we have a callback for a peer
     */
    hasCallback(peerId: IdAccountType): boolean;
    /**
     * Get all peer IDs that have any data
     */
    getAllPeerIds(): IdAccountType[];
    /**
     * Set the answer response for a peer
     */
    setAnswerResponse(peerId: IdAccountType, response: AnswerResponse): void;
    /**
     * Set the offer response for a peer
     */
    setOfferResponse(peerId: IdAccountType, response: OfferResponse): void;
    /**
     * Set the callback for a peer
     */
    setCallback(peerId: IdAccountType, callback: SocketReadyCallback<SocketDTO<PeerType>>): void;
    /**
     * Remove all data for a specific peer
     */
    removePeer(peerId: IdAccountType): void;
    /**
     * Clear all maps
     */
    clear(): void;
}
