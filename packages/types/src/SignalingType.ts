import {
    Instance as PeerInstance,
    SignalData,
} from "simple-peer";


/** An SDP‐offer enriched with metadata for reuse */
export type ReusableOffer = {
  sdp: string;
  offerId: string;
  createdAt: number;
  createdBy: string;
}

/** An SDP‐answer enriched with metadata tying it back to an offer */
export type ReusableAnswer = {
  answerId: string;
  connectionId: string;
  offerId: string;
  createdAt: number;
  createdBy: string;
  targetPeer: string;
};

/** Result of processing an offer and creating an answer */
export type Response = {
  peer: PeerInstance;
  connectionId: string;
}


/** Result of processing an offer and creating an answer */
export type OfferResponse = Response & {
  answer: ISignalInfoAnswer;
}

/** Result of processing an answer to finalize a handshake */
export type AnswerResponse = Response & {
  remotePeerId: string;
}


export interface ISignalInfo {
    signalData: SignalData; 

    isOffer(): boolean;
    isAnswer(): boolean;
    getSignalData(): SignalData;
}

export interface ISignalInfoOffer extends ISignalInfo {
    reusableOffer: ReusableOffer;  
    getOfferInfo(): ReusableOffer;
}

export interface ISignalInfoAnswer extends ISignalInfo {
    reusableAnswer: ReusableAnswer;  
    getAnswerInfo(): ReusableAnswer;
}