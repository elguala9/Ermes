// src/ErmesRepository.ts
import Peer from 'simple-peer';
import wrtc from '../../types/wrtc.js';
export const defaultStun = 'stun:stun.l.google.com:19302';
export class ErmesWebRtcRepository {
    constructor({ offer, iceServers }) {
        this.messageBuffer = [];
        this.needsSignal = true;
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
        // 1) Se sei initiator, _channel esiste subito
        const maybeDC = this.peer._channel;
        if (maybeDC) {
            maybeDC.binaryType = 'arraybuffer';
        }
        // 2) Se sei answerer (ricevi il channel tramite RTCDataChannelEvent)
        const rawPc = this.peer._pc;
        rawPc.addEventListener('datachannel', (evt) => {
            evt.channel.binaryType = 'arraybuffer';
        });
        // 3) Come fallback, anche sul 'connect'
        this.peer.on('connect', () => {
            const dc = this.peer._channel;
            dc.binaryType = 'arraybuffer';
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
        // intercetto i cambi di stato ICE
        rawPc.addEventListener('iceconnectionstatechange', async () => {
            console.log('[ErmesRepository] ICE state:', rawPc.iceConnectionState);
            if (rawPc.iceConnectionState === 'disconnected' || rawPc.iceConnectionState === 'failed') {
                console.log('[ErmesRepository] Forzo ICE‐restart');
                this.restartIce();
            }
        });
    }
    isClosed() {
        return !this.isConnected();
    }
    /** forza una ICE‐restart */
    restartIce() {
        this.needsSignal = true; // <-- segnalo che serve un nuovo signal
        const p = this.peer;
        if (typeof p.negotiate === 'function') {
            p.negotiate();
        }
        else {
            const rawPc = this.peer._pc;
            rawPc.createOffer({ iceRestart: true })
                .then(o => rawPc.setLocalDescription(o))
                .catch(err => console.error('[Ermes] ICE‐restart failed', err));
        }
    }
    async createSignal() {
        // se non serve un nuovo signal, restituisco quello in cache
        if (!this.needsSignal && this.lastSignal) {
            return this.lastSignal;
        }
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.peer.off('signal', onSig);
                reject(new Error('Timeout waiting for signal'));
            }, 10000);
            const onSig = (data) => {
                clearTimeout(timer);
                this.peer.off('signal', onSig);
                this.lastSignal = data; // <-- memorizzo per la prossima volta
                this.needsSignal = false; // <-- niente nuova negoziazione finché non richiesta
                resolve(data);
            };
            this.peer.once('signal', onSig);
        });
    }
    async createSignalString() {
        let signal = await this.createSignal();
        return JSON.stringify(signal);
    }
    setSignal(signal) {
        this.peer.signal(signal);
    }
    parseSignalString(signalString) {
        return JSON.parse(signalString);
    }
    destroy() {
        this.peer.destroy();
    }
    send(data) {
        if (this.isConnected()) {
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
    isConnected() {
        return this.peer.connected;
    }
    waitForEvent(successEvent, timeoutMs = 30000) {
        return new Promise((resolve, reject) => {
            // setTimeout could return number o NodeJS.Timeout
            const timer = setTimeout(() => {
                cleanup();
                reject(new Error(`Timed out after ${timeoutMs}ms waiting for ${successEvent}`));
            }, timeoutMs);
            const onSuccess = () => {
                cleanup();
                resolve();
            };
            const onError = (err) => {
                cleanup();
                reject(err);
            };
            // iin case of connect close need to be checked
            const onClose = () => {
                if (successEvent === 'connect') {
                    cleanup();
                    reject(new Error('Peer closed before connect'));
                }
            };
            const cleanup = () => {
                clearTimeout(timer);
                this.peer.removeListener(successEvent, onSuccess);
                this.peer.removeListener('error', onError);
                if (successEvent === 'connect') {
                    this.peer.removeListener('close', onClose);
                }
            };
            this.peer.once(successEvent, onSuccess);
            this.peer.once('error', onError);
            if (successEvent === 'connect') {
                this.peer.once('close', onClose);
            }
        });
    }
    waitForConnect(timeoutMs) {
        return this.waitForEvent('connect', timeoutMs);
    }
    waitForClose(timeoutMs) {
        return this.waitForEvent('close', timeoutMs);
    }
}
//# sourceMappingURL=ErmesWebRtcRepository.js.map