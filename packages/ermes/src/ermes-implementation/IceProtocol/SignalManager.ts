import crypto from 'crypto';
import { IErmesSignalingHandler, SocketDTO, SocketReadyCallback } from 'iermes/index';
import { IdAccountType } from 'iermes/signaling-interface/IErmesSignaling';
import SimplePeer, {
  Options as PeerOptions,
  SignalData
} from 'simple-peer';
import { SignalInfoFactory } from './Factories.js';
import { AnswerResponse, ISignalInfo, ISignalInfoAnswer, ISignalInfoOffer, OfferResponse, Response, ReusableAnswer, ReusableOffer } from 'ermes-types';
import { SignalManagerMapping } from './SignalManagerMapping.js';
import { PeerType } from 'ermes-types';
import { ISignalManager } from './ISignalManager.js';

export const DEFAULT_ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export class SignalManager implements ISignalManager, IErmesSignalingHandler<PeerType> {
  private signalManagerMapping: SignalManagerMapping;
  
  /**
   * @param iceConfig configuration of ICE servers
   * @param idAccount the global account ID of the peer, used to identify the peer in the signaling process 
   */
  constructor(
    private iceConfig: RTCConfiguration = DEFAULT_ICE_CONFIG,
    private idAccount: IdAccountType
  ) {
    this.signalManagerMapping = new SignalManagerMapping();
  }


  public async getAllPeerIds(): Promise<IdAccountType[]> {
    const peerIds = this.signalManagerMapping.getAllPeerIds()
    return peerIds;
  }



  public async softClearConnection(remotePeerId: IdAccountType): Promise<void> {
    
    this.signalManagerMapping.removePeer(remotePeerId);
  }

   public async clearConnection(remotePeerId: IdAccountType): Promise<void> {
    // Tear down any offer-based peer
    if (this.signalManagerMapping.hasOfferResponse(remotePeerId)) {
      const offerResp = this.signalManagerMapping.getOfferResponse(remotePeerId)!;
      offerResp.peer.destroy(); 
      
    }

    // Tear down any answer-based peer
    if (this.signalManagerMapping.hasAnswerResponse(remotePeerId)) {
      const answerResp = this.signalManagerMapping.getAnswerResponse(remotePeerId)!;
      answerResp.peer.destroy();
    }

    this.softClearConnection(remotePeerId);

  }

  destroy(): Promise<void> {
    // Get all peer IDs that have connections
    const allPeerIds = this.signalManagerMapping.getAllPeerIds();
    
    // Clear each connection properly (this will destroy peers and remove from mapping)
    for (const peerId of allPeerIds) {
      this.clearConnection(peerId);
    }
    
    return Promise.resolve();
  }

  async getResponse(peerId: IdAccountType): Promise<Response> {
    // Get the answer from the mapping for this peer
    const answerResp = this.signalManagerMapping.getAnswerResponse(peerId);
    if(answerResp) {
      return answerResp;
    }
    
    // If no answer, try to get the offer
    const offerResp = this.signalManagerMapping.getOfferResponse(peerId);
    if(offerResp) {
      return offerResp;
    }
    
    throw new Error('No response available, you need to create a signal or process an answer');
  }

  async getSocket(of: IdAccountType): Promise<SocketDTO<PeerType>> {
    const answerResp = this.signalManagerMapping.getAnswerResponse(of);
    if(answerResp) {
      return {
        socket: answerResp.peer,
        connectionId: answerResp.connectionId,
        remotePeerId: of
      };
    }
    
    const offerResp = this.signalManagerMapping.getOfferResponse(of);
    if(offerResp) {
      return {
        socket: offerResp.peer,
        connectionId: offerResp.connectionId,
        remotePeerId: of
      };
    }
    
    throw new Error('Socket not ready, you need to create a signal or process an answer');
  }
  
  async isSocketReady(of: IdAccountType): Promise<boolean> {
    return this.signalManagerMapping.hasAnswerResponse(of) || 
           this.signalManagerMapping.hasOfferResponse(of);
  }

  async onSocketReady(from: IdAccountType, callback: SocketReadyCallback<SocketDTO<PeerType>>): Promise<void> {
    this.signalManagerMapping.setCallback(from, callback);
  }

  async processSignal(signalString: string, from: IdAccountType): Promise<void> {
    let signal: ISignalInfo = JSON.parse(signalString) as ISignalInfo;
    
    if(signal.isOffer()) 
      await this.processOfferAndCreateAnswer(signal as ISignalInfoOffer, from);
    
    
    if(signal.isAnswer()) 
      await this.processAnswer(signal as ISignalInfoAnswer, from);

    if(!this.signalManagerMapping.hasOfferResponse(from) && 
       !this.signalManagerMapping.hasAnswerResponse(from)) {
      throw new Error('Not able to process signal');
    }

    const callback = this.signalManagerMapping.getCallback(from);
    if(callback) {
      callback(await this.getSocket(from));
    }
  }

  async createSignal(remotePeerId?: IdAccountType): Promise<string> {
    let signal: ISignalInfo | undefined = undefined;
    
    if(remotePeerId == undefined) {
      // I am the initiator, so I create an offer
      signal = await this.createReusableOffer();
    } else {
      // I am not the initiator, so I get the offer response and use its answer
      const offerResp = this.signalManagerMapping.getOfferResponse(remotePeerId); 
      if(offerResp) {
        signal = offerResp.answer;
      }
    }
    
    if(signal === undefined)
      throw new Error('Signal is undefined, you are not the initiator and you did not process an answer');

    return JSON.stringify(signal);
  }

  public createReusableOffer(): Promise<ISignalInfoOffer> {
    // Implementation unchanged
    const opts: PeerOptions = {
      initiator: true,
      config:    this.iceConfig,
      trickle:   false
    };
    const tempPeer = new SimplePeer(opts);

    return new Promise<ISignalInfoOffer>((resolve, reject) => {
      tempPeer.on('signal', (signal: SignalData) => {
        if (signal.type === 'offer') {
          const reusableOffer: ReusableOffer = {
            sdp: signal.sdp!,
            offerId:   crypto.randomBytes(8).toString('hex'),
            createdAt: Date.now(),
            createdBy: this.idAccount
          };
          tempPeer.destroy();
          let offer: ISignalInfoOffer = SignalInfoFactory.createSignalInfoOffer(signal, reusableOffer);
          resolve(offer);
        }
      });

      tempPeer.on('error', (err: Error) => {
        tempPeer.destroy();
        reject(err);
      });
    });
  }

  public processOfferAndCreateAnswer(
    receivedOffer: ISignalInfoOffer,
    peerId: IdAccountType
  ): Promise<OfferResponse> {
    // Implementation unchanged
    const connectionId = crypto.randomBytes(8).toString('hex');
    const opts: PeerOptions = {
      initiator: false,
      config:    this.iceConfig,
      trickle:   false
    };
    const peer = new SimplePeer(opts);
    let infoOffer = receivedOffer.getOfferInfo()

    return new Promise<OfferResponse>((resolve, reject) => {
      peer.on('signal', (signal: SignalData) => {
        if (signal.type === 'answer') {
          const reusableAnswer: ReusableAnswer = {
            ...signal,
            answerId:     crypto.randomBytes(8).toString('hex'),
            connectionId,
            offerId:      infoOffer.offerId,
            createdAt:    Date.now(),
            createdBy:    this.idAccount,
            targetPeer:   infoOffer.createdBy
          };
          let answer: ISignalInfoAnswer = SignalInfoFactory.createSignalInfoAnswer(signal, reusableAnswer);
          const response = { answer, peer, connectionId };
        
        // Store in mapping before resolving
        this.signalManagerMapping.setOfferResponse(peerId, response);
        resolve(response);
        }
      });

      peer.on('error', (err: Error) => reject(err));
      peer.on('close', () => peer.destroy());

      peer.signal(receivedOffer.getSignalData());


    });
  }

  public processAnswer(
    receivedAnswer: ISignalInfoAnswer,
    peerId: IdAccountType
  ): Promise<AnswerResponse> {
    // Implementation unchanged
    const connectionId = receivedAnswer.getAnswerInfo().connectionId;
    const peer = new SimplePeer({
      initiator: true,
      config:    this.iceConfig,
      trickle:   false
    });

    return new Promise<AnswerResponse>((resolve, reject) => {
      peer.once('signal', () => peer.signal(receivedAnswer.getSignalData()));

      peer.once('connect', () => {
        let answerResp: AnswerResponse = {
          peer,
          connectionId,
          remotePeerId: receivedAnswer.getAnswerInfo().createdBy
        };
        this.signalManagerMapping.setAnswerResponse(peerId, answerResp);
        resolve(answerResp);
      });

      peer.on('error', (err: Error) => reject(err));
      peer.on('close', () => peer.destroy());
    });
  }
}
