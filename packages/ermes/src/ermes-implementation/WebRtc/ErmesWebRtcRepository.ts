// src/ErmesRepository.ts

import type { Instance, SignalData } from 'simple-peer';
import Peer from 'simple-peer';

import { ErmesWbrtcRepositoryInput, IErmesWebRtcRepository } from 'iermes/index';
import wrtc from '../../types/wrtc.js';
import { CallbackOnDataRepository, SerializableDataType, Signal } from 'ermes-types';



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

        this.peer.on('data', (data: SerializableDataType) => {
            if (this.messageCallback) {
                this.messageCallback(data);
            } else {
                this.messageBuffer.push(data);
            }
        });
    
        if (offer) {
            this.peer.signal(offer)
        }
        
        
    }
    isClose(): boolean {
        return this.peer.closed;
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
        if (this.peer.connected) {
            this.peer.send(data);
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

    onSignal(callback: (data: SignalData | PromiseLike<SignalData>) => void): void {
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
    
}