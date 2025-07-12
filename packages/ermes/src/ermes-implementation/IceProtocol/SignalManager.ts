import SimplePeer, {
  Instance as PeerInstance,
  SignalData,
  Options as PeerOptions
} from 'simple-peer';
import crypto from 'crypto';
import { AnswerResponse, ISignalInfo, ISignalInfoAnswer, ISignalInfoOffer, ISignalManager, OfferResponse, ReusableAnswer, ReusableOffer } from './ISignalManager.js';
import { SignalInfoFactory } from './Factories.js';
import { IdAccountType, IErmesSignalingRepository, OnSignalCallback } from 'iermes/signaling-interface/IErmesSignaling';
import { OutputStruct } from 'signaling-sdk/Types';
import { IErmesRepository, IErmesSignalingHandler } from 'iermes/index';

// -- Default ICE configuration you can override --

export const DEFAULT_ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

// -- Class that handles creating and answering reusable offers --

export class SignalManager implements ISignalManager, IErmesSignalingHandler {

  private answerResponse?: AnswerResponse
  private offerResponse?: OfferResponse;

  /**
   * 
   * @param iceConfig condiguratio of ICE servers
   * @param idAccount the global account ID of the peer, used to identify the peer in the signaling process 
   * @param isInitiator true -> you will create the offer, false -> you will answer the offer
   */
  constructor(
    private iceConfig: RTCConfiguration = DEFAULT_ICE_CONFIG,
    private idAccount: IdAccountType,
    private isInitiator: boolean
  ) {}



  async processSignal(signalString: string): Promise<void> {
    let signal: ISignalInfo = JSON.parse(signalString) as ISignalInfo;
    
    if(this.isInitiator === true && signal.isOffer() === true) 
      throw new Error('Initiator but processing an offer');

    if(this.isInitiator === false && signal.isAnswer() === true) 
      throw new Error('Not initiator but processing an answer');
    
    // i want to find a wat to delete the "as"
    if(signal.isOffer()) 
      this.offerResponse = await this.processOfferAndCreateAnswer(signal as ISignalInfoOffer);
    
    if(signal.isAnswer()) 
      this.answerResponse = await this.processAnswer(signal as ISignalInfoAnswer);
      


    throw new Error('Not able to process signal');
    
  }
  


  /**  
   * Create a real SDP‐offer via SimplePeer and store it as OutputStruct  
   */
  async createSignal(): Promise<string> {
    let signal: ISignalInfo | undefined = undefined;
    // I need to chose if create an offer or an answer
    if(this.isInitiator == true) 
      // I am the initiator, so I create an offer
      signal = await this.createReusableOffer();
    if(this.offerResponse !== undefined)
      signal = this.offerResponse.answer;
    
    if(signal === undefined)
      throw new Error('Signal is undefined, you are not the initiator and you did not parocess an answer');

    return JSON.stringify(signal);
      
  }


  

  /**
   * Create a one‐off SDP offer (trickle ICE disabled), wrap it in a ReusableOffer,
   * then destroy the temporary peer.
   */
  public createReusableOffer(
  ): Promise<ISignalInfoOffer> {

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

  /**
   * Consume a previously generated ReusableOffer, answer it and return
   * both the answer and the live PeerInstance.
   */
  public processOfferAndCreateAnswer(
    receivedOffer: ISignalInfoOffer
  ): Promise<OfferResponse> {
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
          resolve({ answer, peer, connectionId });
        }
      });

      peer.on('error', (err: Error) => reject(err));
      peer.on('close', () => peer.destroy());

      // kick off the handshake
      peer.signal(receivedOffer.getSignalData());
    });
  }

  /**
   * Consume a ReusableAnswer on the initiator side to finalize the connection.
   */
  public processAnswer(
    receivedAnswer: ISignalInfoAnswer
  ): Promise<AnswerResponse> {
    const connectionId = receivedAnswer.getAnswerInfo().connectionId;
    const peer = new SimplePeer({
      initiator: true,
      config:    this.iceConfig,
      trickle:   false
    });

    return new Promise<AnswerResponse>((resolve, reject) => {
      // first signal to get our local offer SDP out, then feed the answer back in
      peer.once('signal', () => peer.signal(receivedAnswer.getSignalData()));

      peer.once('connect', () => {
        resolve({
          peer,
          connectionId,
          remotePeerId: receivedAnswer.getAnswerInfo().createdBy
        });
      });

      peer.on('error', (err: Error) => reject(err));
      peer.on('close', () => peer.destroy());
    });
  }
}
