// src/ErmesRepository.ts

import type { Instance, SignalData } from 'simple-peer';
import Peer from 'simple-peer';

import { ErmesWbrtcRepositoryInput, IErmesWebRtcRepository } from 'iermes/index';
import wrtc from '../../types/wrtc.js';
import { CallbackOnDataRepository, SerializableDataType, Signal } from 'ermes-types';
import { toArrayBuffer } from './NormalizationUtility.js';


type simpleFunc = () => {};
export const defaultStun: string = 'stun:stun.l.google.com:19302';


export class ErmesWebRtcRepository implements IErmesWebRtcRepository{
    private peer: Instance;
    private messageBuffer: SerializableDataType[] = [];
    private messageCallback?: CallbackOnDataRepository;
    
    constructor({ offer, iceServers }: ErmesWbrtcRepositoryInput) {
        this.peer = new Peer({
            initiator: !offer,
            trickle: false, // puoi anche mettere true per connessioni più rapide
            wrtc,
            config: {
                iceServers: iceServers ?? [ // fallback a STUN Google se nulla è passato
                    { urls: defaultStun }
                ]
            }
        });

          // 1) Se sei initiator, _channel esiste subito
        const maybeDC = (this.peer as any)._channel as RTCDataChannel | undefined;
        if (maybeDC) {
            maybeDC.binaryType = 'arraybuffer';
        }

        // 2) Se sei answerer (ricevi il channel tramite RTCDataChannelEvent)
        const rawPc = (this.peer as any)._pc as RTCPeerConnection;
        rawPc.addEventListener('datachannel', (evt: RTCDataChannelEvent) => {
            evt.channel.binaryType = 'arraybuffer';
        });

        // 3) Come fallback, anche sul 'connect'
        this.peer.on('connect', () => {
            const dc = (this.peer as any)._channel as RTCDataChannel;
            dc.binaryType = 'arraybuffer';
        });

        this.peer.on('data', (data: SerializableDataType) => {
            const ab = Buffer.isBuffer(data)
                ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
                : data instanceof ArrayBuffer
                    ? data
                    : (data as Uint8Array).buffer
                    
            console.log("Array buffer arrived");
            console.dir(ab, { depth: null, maxArrayLength: null, maxStringLength: null });
            if (this.messageCallback) {
                this.messageCallback(ab);
            } else {
                this.messageBuffer.push(ab);
            }
        });
    
        if (offer) {
            this.peer.signal(offer)
        }
        
        
    }

    isClosed(): boolean {
        return !this.isConnected();
    }


    public createSignal(): Promise<SignalData> {
        return new Promise((resolve) => {
          this.peer.once('signal', (data: SignalData | PromiseLike<SignalData>) => {
            console.log('[ErmesRepository] Signal emitted!');
            resolve(data);
          });
        });
    }
    
    public setSignal(signal: Signal): void {
        this.peer.signal(signal);
    }



    public destroy(): void {
        this.peer.destroy();
    }
    
    public send(data: SerializableDataType): void {
        console.log("Array buffer sended");
        console.dir(data, { depth: null, maxArrayLength: null, maxStringLength: null });
        if (this.isConnected()) {
            // ensure Uint8Array
            const u8 = data instanceof Uint8Array ? data : new Uint8Array(data);
            this.peer.send(u8);
        } else {
            throw new Error("Connection is not open.");
        }
    }

    public onMessage(func: CallbackOnDataRepository): void {
        this.messageCallback = func;
    
        // replay dei messaggi arrivati prima
        while (this.messageBuffer.length > 0) {
            const buffered = this.messageBuffer.shift();
            if (buffered) func(buffered);
        }
    }

    
    public onConnect(callback: () => void) {
        this.peer.on('connect', callback);
    }
    
    public onError(callback: (err: Error) => void) {
        this.peer.on('error', callback);
    }
    
    public onClose(callback: () => void) {
        this.peer.on('close', callback);
    }

    public onSignal(callback: (data: SignalData | PromiseLike<SignalData>) => void): void {
        this.peer.on('signal', callback);
    }

    public on(event: 'connect' | 'error' | 'close' | 'signal', callback: (...args: any[]) => void) {
        this.peer.on(event, callback);
    }

    private flushAndDestroy(): Promise<void> {
        return new Promise((resolve) => {
          // grab the raw RTCDataChannel
          const dc = (this.peer as any)._channel as RTCDataChannel;
      
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
    
    isConnected(): boolean{
        return this.peer.connected;
    }

    private waitForEvent(
        successEvent: 'connect' | 'close',
        timeoutMs = 30_000
    ): Promise<void> {
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
            const onError = (err: Error) => {
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
    

    public waitForConnect(timeoutMs?: number) {
        return this.waitForEvent('connect', timeoutMs);
    }

    public waitForClose(timeoutMs?: number) {
        return this.waitForEvent('close', timeoutMs);
    }

    // TO DO: NEED TO VERIFY THE FOLLOWING SOURCE CODE IF IT IS USEFULL

      // —— Now grab the raw RTCPeerConnection and add rich logging ——  
  /*const rawPc = (this.peer as any)._pc as RTCPeerConnection;

  rawPc.addEventListener('icegatheringstatechange', () => {
    console.log('[Ermes][ICE] gathering:', rawPc.iceGatheringState);
  });

  rawPc.addEventListener('iceconnectionstatechange', () => {
    console.log('[Ermes][ICE] connection:', rawPc.iceConnectionState);
    if (rawPc.iceConnectionState === 'failed') {
      console.error('[Ermes][ICE] connectivity failure detected');
    }
  });

  rawPc.addEventListener('signalingstatechange', () => {
    console.log('[Ermes][SDP] signaling:', rawPc.signalingState);
  });

  // Catch STUN/TURN failures:
  rawPc.addEventListener('icecandidateerror', (evt) => {
    console.error(
      `[Ermes][ICE] candidate error code=${evt.errorCode}`,
      `text="${evt.errorText}" url=${evt.url}`,
      'candidate=', evt.hostCandidate
    );
  });*/
}