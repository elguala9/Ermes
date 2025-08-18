import { plainToInstance } from 'class-transformer';
import crypto from 'crypto';
import SimplePeer from 'simple-peer';
import wrtc from 'wrtc';
import { SignalInfoFactory } from './Factories.js';
import { SignalInfo, SignalInfoAnswer, SignalInfoOffer } from './SignalInfo.js';
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
     */
    constructor(iceConfig = DEFAULT_ICE_CONFIG) {
        this.iceConfig = iceConfig;
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
        let signal = plainToInstance(SignalInfo, JSON.parse(signalString));
        //let signal: SignalInfo = new SignalInfo(parsedSignal);
        if (!signal.isOffer() && !signal.isAnswer()) {
            throw new Error('Not able to process signal, it is neither an offer nor an answer');
        }
        if (signal.isOffer()) {
            // Crea un'istanza SignalInfoOffer usando il costruttore
            let signalInfoOffer = plainToInstance(SignalInfoOffer, signal);
            await this.processOfferAndCreateAnswer(signalInfoOffer, from);
        }
        if (signal.isAnswer()) {
            // Crea un'istanza SignalInfoAnswer usando il costruttore
            let signalInfoAnswer = plainToInstance(SignalInfoAnswer, signal);
            await this.processAnswer(signalInfoAnswer, from);
        }
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
        const opts = {
            initiator: true,
            config: this.iceConfig,
            trickle: false
        };
        const peer = new SimplePeer({ ...opts, wrtc });
        return new Promise((resolve, reject) => {
            peer.on('signal', (signal) => {
                if (signal.type === 'offer') {
                    const reusableOffer = {
                        sdp: signal.sdp,
                        offerId: crypto.randomBytes(8).toString('hex')
                    };
                    // NON distruggere il peer, salvalo per dopo!
                    const tempResponse = {
                        peer,
                        connectionId: reusableOffer.offerId,
                        remotePeerId: 'pending' // Verrà aggiornato quando ricevi l'answer
                    };
                    // Salva il peer in attesa dell'answer
                    this.signalManagerMapping.setAnswerResponse('pending-' + reusableOffer.offerId, tempResponse);
                    let offer = SignalInfoFactory.createSignalInfoOffer(signal, reusableOffer);
                    resolve(offer);
                }
            });
            peer.on('error', (err) => {
                peer.destroy();
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
        const peer = new SimplePeer({
            ...opts,
            wrtc
        });
        let infoOffer = receivedOffer.getOfferInfo();
        return new Promise((resolve, reject) => {
            peer.on('signal', (signal) => {
                if (signal.type === 'answer') {
                    const reusableAnswer = {
                        ...signal,
                        answerId: crypto.randomBytes(8).toString('hex'),
                        connectionId,
                        offerId: infoOffer.offerId,
                        targetPeer: peerId
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
        const answerInfo = receivedAnswer.getAnswerInfo();
        // Trova il peer originale che ha creato l'offer
        const pendingKey = 'pending-' + answerInfo.offerId;
        const pendingResponse = this.signalManagerMapping.getAnswerResponse(pendingKey);
        if (!pendingResponse) {
            throw new Error('No pending offer found for this answer');
        }
        const peer = pendingResponse.peer;
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                console.error('Timeout in processAnswer');
                peer.destroy();
                reject(new Error('Connection timeout'));
            }, 10000);
            // Ora usa il peer originale per processare l'answer
            peer.signal(receivedAnswer.getSignalData());
            peer.once('connect', () => {
                console.log('Peer connected successfully');
                clearTimeout(timeout);
                // Rimuovi il pending e salva il definitivo
                this.signalManagerMapping.removePeer(pendingKey);
                const answerResp = {
                    peer,
                    connectionId: answerInfo.connectionId,
                    remotePeerId: peerId
                };
                this.signalManagerMapping.setAnswerResponse(peerId, answerResp);
                resolve(answerResp);
            });
            peer.on('error', (err) => {
                console.error('Peer error:', err);
                clearTimeout(timeout);
                reject(err);
            });
        });
    }
}
//# sourceMappingURL=SignalManager.js.map