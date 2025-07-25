// -- Class that handles creating and answering reusable offers --
export class SignalManagerMapping {
    constructor() {
        // Maps to store per-peer data
        this.answerResponses = new Map();
        this.offerResponses = new Map();
        this.socketCallbacks = new Map();
    }
    // --- Methods that return values ---
    /**
     * Get the answer response for a specific peer
     */
    getAnswerResponse(peerId) {
        return this.answerResponses.get(peerId);
    }
    /**
     * Get the offer response for a specific peer
     */
    getOfferResponse(peerId) {
        return this.offerResponses.get(peerId);
    }
    /**
     * Get the callback for a specific peer
     */
    getCallback(peerId) {
        return this.socketCallbacks.get(peerId);
    }
    /**
     * Check if we have an answer response for a peer
     */
    hasAnswerResponse(peerId) {
        return this.answerResponses.has(peerId);
    }
    /**
     * Check if we have an offer response for a peer
     */
    hasOfferResponse(peerId) {
        return this.offerResponses.has(peerId);
    }
    /**
     * Check if we have a callback for a peer
     */
    hasCallback(peerId) {
        return this.socketCallbacks.has(peerId);
    }
    /**
     * Get all peer IDs that have any data
     */
    getAllPeerIds() {
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
    setAnswerResponse(peerId, response) {
        this.answerResponses.set(peerId, response);
    }
    /**
     * Set the offer response for a peer
     */
    setOfferResponse(peerId, response) {
        this.offerResponses.set(peerId, response);
    }
    /**
     * Set the callback for a peer
     */
    setCallback(peerId, callback) {
        this.socketCallbacks.set(peerId, callback);
    }
    /**
     * Remove all data for a specific peer
     */
    removePeer(peerId) {
        this.answerResponses.delete(peerId);
        this.offerResponses.delete(peerId);
        this.socketCallbacks.delete(peerId);
    }
    /**
     * Clear all maps
     */
    clear() {
        this.answerResponses.clear();
        this.offerResponses.clear();
        this.socketCallbacks.clear();
    }
}
//# sourceMappingURL=SignalManagerMapping.js.map