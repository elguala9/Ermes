import SimplePeer from 'simple-peer';
import crypto from 'crypto';
import { SignalInfoFactory } from './Factories.js';
// -- Default ICE configuration you can override --
export const DEFAULT_ICE_CONFIG = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};
// -- Class that handles creating and answering reusable offers --
export class SignalManager {
    constructor(iceConfig = DEFAULT_ICE_CONFIG) {
        this.iceConfig = iceConfig;
        this.signals = new Map();
        this.ownerId = null;
        this.listeners = new Set();
    }
    async onSignal(callback) {
        this.listeners.add(callback);
    }
    async getSignal(from) {
        const signal = this.signals.get(from);
        if (!signal)
            throw new Error('Signal not found');
        return signal;
    }
    async getSignalOwner() {
        if (!this.ownerId)
            throw new Error('Owner not set');
        const signal = this.signals.get(this.ownerId);
        if (!signal)
            throw new Error('Owner signal not found');
        return signal;
    }
    compareSignalMessage(signal_1, signal_2) {
        return JSON.stringify(signal_1) === JSON.stringify(signal_2);
    }
    async connect() {
        // Simulate connection logic
        // In a real implementation, connect to signaling server here
        return;
    }
    async disconnect() {
        // Simulate disconnect logic
        this.listeners.clear();
        return;
    }
    async getIdAccount() {
        if (!this.ownerId)
            throw new Error('Owner not set');
        return this.ownerId;
    }
    async pingServer() {
        // Simulate ping logic
        return true;
    }
    async sendSignal(to) {
        const signal = this.signals.get(to);
        if (!signal)
            throw new Error('Signal not found');
        for (const cb of this.listeners) {
            await cb(signal);
        }
    }
    removeAllListeners() {
        this.listeners.clear();
    }
    /**
     * Create a one‐off SDP offer (trickle ICE disabled), wrap it in a ReusableOffer,
     * then destroy the temporary peer.
     */
    createReusableOffer(peerId) {
        const id = peerId ?? `peer-${crypto.randomBytes(4).toString('hex')}`;
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
                        createdBy: id
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
    /**
     * Consume a previously generated ReusableOffer, answer it and return
     * both the answer and the live PeerInstance.
     */
    processOfferAndCreateAnswer(receivedOffer, peerId) {
        const id = peerId ?? `peer-${crypto.randomBytes(4).toString('hex')}`;
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
                        createdBy: id,
                        targetPeer: infoOffer.createdBy
                    };
                    let answer = SignalInfoFactory.createSignalInfoAnswer(signal, reusableAnswer);
                    resolve({ answer, peer, connectionId });
                }
            });
            peer.on('error', (err) => reject(err));
            peer.on('close', () => peer.destroy());
            // kick off the handshake
            peer.signal(receivedOffer.getSignalData());
        });
    }
    /**
     * Consume a ReusableAnswer on the initiator side to finalize the connection.
     */
    processAnswer(receivedAnswer) {
        const connectionId = receivedAnswer.getAnswerInfo().connectionId;
        const peer = new SimplePeer({
            initiator: true,
            config: this.iceConfig,
            trickle: false
        });
        return new Promise((resolve, reject) => {
            // first signal to get our local offer SDP out, then feed the answer back in
            peer.once('signal', () => peer.signal(receivedAnswer.getSignalData()));
            peer.once('connect', () => {
                resolve({
                    peer,
                    connectionId,
                    remotePeerId: receivedAnswer.getAnswerInfo().createdBy
                });
            });
            peer.on('error', (err) => reject(err));
            peer.on('close', () => peer.destroy());
        });
    }
}
//# sourceMappingURL=SignalManager.js.map