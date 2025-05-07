// src/PeerHandler.ts

import type { Instance, SignalData } from 'simple-peer';
import Peer from 'simple-peer';

import { CallbackOnData, IErmesRepository, SerializableDataType } from '../../../iermes/dist/index.js';
import wrtc from 'src/types/wrtc.js';

export const defaultStun: string = 'stun:stun.l.google.com:19302';

export type PeerHandlerInput = {
    offer?: string;
    iceServers?: RTCIceServer[];
}

export class PeerHandler implements IErmesRepository{
    private peer: Instance;
    private messageBuffer: SerializableDataType[] = [];
    private messageCallback?: CallbackOnData;
    
    constructor({ offer, iceServers }: PeerHandlerInput) {
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

        this.peer.on('data', (data: SerializableDataType) => {
            if (this.messageCallback) {
                this.messageCallback(data);
            } else {
                this.messageBuffer.push(data);
            }
        });
    
        if (offer) {
            this.peer.signal(JSON.parse(offer));
        }
        
        
    }

    public createOffer(): Promise<SignalData> {
        return new Promise((resolve) => {
          this.peer.once('signal', (data: SignalData | PromiseLike<SignalData>) => {
            console.log('[PeerHandler] Signal emitted!');
            resolve(data);
          });
        });
    }
    
    public setAnswer(answer: string): void {
        this.peer.signal(JSON.parse(answer));
    }

    public destroy(): void {
        this.peer.destroy();
    }
    
    public send(data: SerializableDataType): void {
        if (this.peer.connected) {
            this.peer.send(data);
        } else {
            throw new Error("Connection is not open.");
        }
    }

    public onMessage(func: CallbackOnData): void {
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
    
}