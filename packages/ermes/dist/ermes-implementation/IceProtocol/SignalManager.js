import crypto from 'crypto';
import SimplePeer from 'simple-peer';
import { SignalInfoFactory } from './Factories.js';
import { SignalManagerMapping } from './SignalManagerMapping.js';
export const DEFAULT_ICE_CONFIG = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};
export class SignalManager {
    /**
     * @param iceConfig configuration of ICE servers
     * @param idAccount the global account ID of the peer, used to identify the peer in the signaling process
     */
    constructor(iceConfig = DEFAULT_ICE_CONFIG, idAccount) {
        this.iceConfig = iceConfig;
        this.idAccount = idAccount;
        this.signalManagerMapping = new SignalManagerMapping();
    }
    async getAllPeerIds() {
        const peerIds = this.signalManagerMapping.getAllPeerIds();
        return peerIds;
    }
    async softClearConnection(remotePeerId) {
        this.signalManagerMapping.removePeer(remotePeerId);
    }
    async clearConnection(remotePeerId) {
        // Tear down any offer-based peer
        if (this.signalManagerMapping.hasOfferResponse(remotePeerId)) {
            const offerResp = this.signalManagerMapping.getOfferResponse(remotePeerId);
            offerResp.peer.destroy();
        }
        // Tear down any answer-based peer
        if (this.signalManagerMapping.hasAnswerResponse(remotePeerId)) {
            const answerResp = this.signalManagerMapping.getAnswerResponse(remotePeerId);
            answerResp.peer.destroy();
        }
        this.softClearConnection(remotePeerId);
    }
    destroy() {
        // Get all peer IDs that have connections
        const allPeerIds = this.signalManagerMapping.getAllPeerIds();
        // Clear each connection properly (this will destroy peers and remove from mapping)
        for (const peerId of allPeerIds) {
            this.clearConnection(peerId);
        }
        return Promise.resolve();
    }
    async getResponse(peerId) {
        // Get the answer from the mapping for this peer
        const answerResp = this.signalManagerMapping.getAnswerResponse(peerId);
        if (answerResp) {
            return answerResp;
        }
        // If no answer, try to get the offer
        const offerResp = this.signalManagerMapping.getOfferResponse(peerId);
        if (offerResp) {
            return offerResp;
        }
        throw new Error('No response available, you need to create a signal or process an answer');
    }
    async getSocket(of) {
        const answerResp = this.signalManagerMapping.getAnswerResponse(of);
        if (answerResp) {
            return {
                socket: answerResp.peer,
                connectionId: answerResp.connectionId,
                remotePeerId: of
            };
        }
        const offerResp = this.signalManagerMapping.getOfferResponse(of);
        if (offerResp) {
            return {
                socket: offerResp.peer,
                connectionId: offerResp.connectionId,
                remotePeerId: of
            };
        }
        throw new Error('Socket not ready, you need to create a signal or process an answer');
    }
    async isSocketReady(of) {
        return this.signalManagerMapping.hasAnswerResponse(of) ||
            this.signalManagerMapping.hasOfferResponse(of);
    }
    async onSocketReady(from, callback) {
        this.signalManagerMapping.setCallback(from, callback);
    }
    async processSignal(signalString, from) {
        let signal = JSON.parse(signalString);
        if (signal.isOffer())
            await this.processOfferAndCreateAnswer(signal, from);
        if (signal.isAnswer())
            await this.processAnswer(signal, from);
        if (!this.signalManagerMapping.hasOfferResponse(from) &&
            !this.signalManagerMapping.hasAnswerResponse(from)) {
            throw new Error('Not able to process signal');
        }
        const callback = this.signalManagerMapping.getCallback(from);
        if (callback) {
            callback(await this.getSocket(from));
        }
    }
    async createSignal(remotePeerId) {
        let signal = undefined;
        if (remotePeerId == undefined) {
            // I am the initiator, so I create an offer
            signal = await this.createReusableOffer();
        }
        else {
            // I am not the initiator, so I get the offer response and use its answer
            const offerResp = this.signalManagerMapping.getOfferResponse(remotePeerId);
            if (offerResp) {
                signal = offerResp.answer;
            }
        }
        if (signal === undefined)
            throw new Error('Signal is undefined, you are not the initiator and you did not process an answer');
        return JSON.stringify(signal);
    }
    createReusableOffer() {
        // Implementation unchanged
        const opts = {
            initiator: true,
            config: this.iceConfig,
            trickle: false
        };
        const tempPeer = new SimplePeer(opts);
        return new Promise((resolve, reject) => {
            tempPeer.on('signal', (signal) => {
                if (signal.type === 'offer') {
                    const reusableOffer = {
                        sdp: signal.sdp,
                        offerId: crypto.randomBytes(8).toString('hex'),
                        createdAt: Date.now(),
                        createdBy: this.idAccount
                    };
                    tempPeer.destroy();
                    let offer = SignalInfoFactory.createSignalInfoOffer(signal, reusableOffer);
                    resolve(offer);
                }
            });
            tempPeer.on('error', (err) => {
                tempPeer.destroy();
                reject(err);
            });
        });
    }
    processOfferAndCreateAnswer(receivedOffer, peerId) {
        // Implementation unchanged
        const connectionId = crypto.randomBytes(8).toString('hex');
        const opts = {
            initiator: false,
            config: this.iceConfig,
            trickle: false
        };
        const peer = new SimplePeer(opts);
        let infoOffer = receivedOffer.getOfferInfo();
        return new Promise((resolve, reject) => {
            peer.on('signal', (signal) => {
                if (signal.type === 'answer') {
                    const reusableAnswer = {
                        ...signal,
                        answerId: crypto.randomBytes(8).toString('hex'),
                        connectionId,
                        offerId: infoOffer.offerId,
                        createdAt: Date.now(),
                        createdBy: this.idAccount,
                        targetPeer: infoOffer.createdBy
                    };
                    let answer = SignalInfoFactory.createSignalInfoAnswer(signal, reusableAnswer);
                    const response = { answer, peer, connectionId };
                    // Store in mapping before resolving
                    this.signalManagerMapping.setOfferResponse(peerId, response);
                    resolve(response);
                }
            });
            peer.on('error', (err) => reject(err));
            peer.on('close', () => peer.destroy());
            peer.signal(receivedOffer.getSignalData());
        });
    }
    processAnswer(receivedAnswer, peerId) {
        // Implementation unchanged
        const connectionId = receivedAnswer.getAnswerInfo().connectionId;
        const peer = new SimplePeer({
            initiator: true,
            config: this.iceConfig,
            trickle: false
        });
        return new Promise((resolve, reject) => {
            peer.once('signal', () => peer.signal(receivedAnswer.getSignalData()));
            peer.once('connect', () => {
                let answerResp = {
                    peer,
                    connectionId,
                    remotePeerId: receivedAnswer.getAnswerInfo().createdBy
                };
                this.signalManagerMapping.setAnswerResponse(peerId, answerResp);
                resolve(answerResp);
            });
            peer.on('error', (err) => reject(err));
            peer.on('close', () => peer.destroy());
        });
    }
}
//# sourceMappingURL=SignalManager.js.map