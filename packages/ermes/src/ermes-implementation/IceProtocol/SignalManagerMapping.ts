import { AnswerResponse, OfferResponse, PeerType } from 'ermes-types';
import { SocketDTO, SocketReadyCallback } from 'iermes/index';
import { IdAccountType } from 'iermes/signaling-interface/IErmesSignaling';


// -- Class that handles creating and answering reusable offers --

export class SignalManagerMapping {
  // Maps to store per-peer data
  private answerResponses = new Map<IdAccountType, AnswerResponse>();
  private offerResponses = new Map<IdAccountType, OfferResponse>();
  private socketCallbacks = new Map<IdAccountType, SocketReadyCallback<SocketDTO<PeerType>>>();
  
  // --- Methods that return values ---
  
  /**
   * Get the answer response for a specific peer
   */
  public getAnswerResponse(peerId: IdAccountType): AnswerResponse | undefined {
    return this.answerResponses.get(peerId);
  }
  
  /**
   * Get the offer response for a specific peer
   */
  public getOfferResponse(peerId: IdAccountType): OfferResponse | undefined {
    return this.offerResponses.get(peerId);
  }
  
  /**
   * Get the callback for a specific peer
   */
  public getCallback(peerId: IdAccountType): SocketReadyCallback<SocketDTO<PeerType>> | undefined {
    return this.socketCallbacks.get(peerId);
  }
  
  /**
   * Check if we have an answer response for a peer
   */
  public hasAnswerResponse(peerId: IdAccountType): boolean {
    return this.answerResponses.has(peerId);
  }
  
  /**
   * Check if we have an offer response for a peer
   */
  public hasOfferResponse(peerId: IdAccountType): boolean {
    return this.offerResponses.has(peerId);
  }
  
  /**
   * Check if we have a callback for a peer
   */
  public hasCallback(peerId: IdAccountType): boolean {
    return this.socketCallbacks.has(peerId);
  }
  
  /**
   * Get all peer IDs that have any data
   */
  public getAllPeerIds(): IdAccountType[] {
    return [...new Set([
      ...this.answerResponses.keys(),
      ...this.offerResponses.keys(),
      ...this.socketCallbacks.keys()
    ])];
  }
  
  // --- Void methods ---
  
  /**
   * Set the answer response for a peer
   */
  public setAnswerResponse(peerId: IdAccountType, response: AnswerResponse): void {
    this.answerResponses.set(peerId, response);
  }
  
  /**
   * Set the offer response for a peer
   */
  public setOfferResponse(peerId: IdAccountType, response: OfferResponse): void {
    this.offerResponses.set(peerId, response);
  }
  
  /**
   * Set the callback for a peer
   */
  public setCallback(peerId: IdAccountType, callback: SocketReadyCallback<SocketDTO<PeerType>>): void {
    this.socketCallbacks.set(peerId, callback);
  }
  
  /**
   * Remove all data for a specific peer
   */
  public removePeer(peerId: IdAccountType): void {
    this.answerResponses.delete(peerId);
    this.offerResponses.delete(peerId);
    this.socketCallbacks.delete(peerId);
  }
  
  /**
   * Clear all maps
   */
  public clear(): void {
    this.answerResponses.clear();
    this.offerResponses.clear();
    this.socketCallbacks.clear();
  }
}
