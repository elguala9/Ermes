// src/ErmesRepository.ts
import Peer from 'simple-peer';
import wrtc from '../types/wrtc.js';
export const defaultStun = 'stun:stun.l.google.com:19302';
export class ErmesRepository {
    constructor({ offer, iceServers }) {
        this.messageBuffer = [];
        this.peer = new Peer({
            initiator: !offer,
            trickle: false, // puoi anche mettere true per connessioni più rapide
            wrtc,
            config: {
                iceServers: iceServers ?? [
                    { urls: defaultStun }
                ]
            }
        });
        this.peer.on('data', (data) => {
            if (this.messageCallback) {
                this.messageCallback(data);
            }
            else {
                this.messageBuffer.push(data);
            }
        });
        if (offer) {
            this.peer.signal(offer);
        }
    }
    isClose() {
        return this.peer.closed;
    }
    createSignal() {
        return new Promise((resolve) => {
            this.peer.once('signal', (data) => {
                console.log('[ErmesRepository] Signal emitted!');
                resolve(data);
            });
        });
    }
    setSignal(signal) {
        this.peer.signal(signal);
    }
    destroy() {
        this.peer.destroy();
    }
    send(data) {
        if (this.peer.connected) {
            this.peer.send(data);
        }
        else {
            throw new Error("Connection is not open.");
        }
    }
    onMessage(func) {
        this.messageCallback = func;
        // replay dei messaggi arrivati prima
        while (this.messageBuffer.length > 0) {
            const buffered = this.messageBuffer.shift();
            if (buffered)
                func(buffered);
        }
    }
    onConnect(callback) {
        this.peer.on('connect', callback);
    }
    onError(callback) {
        this.peer.on('error', callback);
    }
    onClose(callback) {
        this.peer.on('close', callback);
    }
    onSignal(callback) {
        this.peer.on('signal', callback);
    }
    on(event, callback) {
        this.peer.on(event, callback);
    }
    flushAndDestroy() {
        return new Promise((resolve) => {
            // grab the raw RTCDataChannel
            const dc = this.peer._channel;
            // if nothing is buffered, destroy immediately
            if (dc.bufferedAmount === 0) {
                this.peer.destroy();
                return resolve();
            }
            // otherwise, wait until it's fully sent
            dc.bufferedAmountLowThreshold = 0;
            const onDrain = () => {
                dc.removeEventListener('bufferedamountlow', onDrain);
                this.peer.destroy();
                resolve();
            };
            dc.addEventListener('bufferedamountlow', onDrain);
        });
    }
}
//# sourceMappingURL=ErmesWebRtcRepository.js.map