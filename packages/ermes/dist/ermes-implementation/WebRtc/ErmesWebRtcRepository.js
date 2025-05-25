// src/ErmesRepository.ts
import Peer from 'simple-peer';
import wrtc from '../../types/wrtc.js';
export const defaultStun = 'stun:stun.l.google.com:19302';
export class ErmesWebRtcRepository {
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
            const ab = Buffer.isBuffer(data)
                ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
                : data instanceof ArrayBuffer
                    ? data
                    : data.buffer;
            console.dir(ab, { depth: null, maxArrayLength: null, maxStringLength: null });
            if (this.messageCallback) {
                this.messageCallback(ab);
            }
            else {
                this.messageBuffer.push(ab);
            }
        });
        if (offer) {
            this.peer.signal(offer);
        }
    }
    isClosed() {
        return !this.isConnected();
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
        console.dir(data, { depth: null, maxArrayLength: null, maxStringLength: null });
        if (this.isConnected()) {
            // ensure Uint8Array
            const u8 = data instanceof Uint8Array ? data : new Uint8Array(data);
            this.peer.send(u8);
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