import crypto from 'crypto';
import SimplePeer from 'simple-peer';
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
    /**
     *
     * @param iceConfig condiguratio of ICE servers
     * @param idAccount the global account ID of the peer, used to identify the peer in the signaling process
     * @param isInitiator true -> you will create the offer, false -> you will answer the offer
     */
    constructor(iceConfig = DEFAULT_ICE_CONFIG, idAccount, isInitiator) {
        this.iceConfig = iceConfig;
        this.idAccount = idAccount;
        this.isInitiator = isInitiator;
    }
    async getSocket() {
        if (this.answerResponse)
            return this.answerResponse.peer;
        if (this.offerResponse)
            return this.offerResponse.peer;
        throw new Error('Socket not ready, you need to create a signal or process an answer');
    }
    async isSocketReady() {
        if (this.answerResponse)
            return true;
        if (this.offerResponse)
            return true;
        return false;
    }
    async onSocketReady(callback) {
        this.callbackSocketReady = callback;
    }
    async processSignal(signalString) {
        let signal = JSON.parse(signalString);
        if (this.isInitiator === true && signal.isOffer() === true)
            throw new Error('Initiator but processing an offer');
        if (this.isInitiator === false && signal.isAnswer() === true)
            throw new Error('Not initiator but processing an answer');
        // i want to find a wat to delete the "as"
        if (signal.isOffer())
            this.offerResponse = await this.processOfferAndCreateAnswer(signal);
        if (signal.isAnswer())
            this.answerResponse = await this.processAnswer(signal);
        if (this.offerResponse === undefined && this.answerResponse === undefined)
            throw new Error('Not able to process signal');
        if (this.callbackSocketReady !== undefined) {
            this.callbackSocketReady(await this.getSocket());
        }
    }
    /**
     * Create a real SDP‐offer via SimplePeer and store it as OutputStruct
     */
    async createSignal() {
        let signal = undefined;
        // I need to chose if create an offer or an answer
        if (this.isInitiator == true)
            // I am the initiator, so I create an offer
            signal = await this.createReusableOffer();
        if (this.offerResponse !== undefined)
            signal = this.offerResponse.answer;
        if (signal === undefined)
            throw new Error('Signal is undefined, you are not the initiator and you did not parocess an answer');
        return JSON.stringify(signal);
    }
    /**
     * Create a one‐off SDP offer (trickle ICE disabled), wrap it in a ReusableOffer,
     * then destroy the temporary peer.
     */
    createReusableOffer() {
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
    /**
     * Consume a previously generated ReusableOffer, answer it and return
     * both the answer and the live PeerInstance.
     */
    processOfferAndCreateAnswer(receivedOffer) {
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