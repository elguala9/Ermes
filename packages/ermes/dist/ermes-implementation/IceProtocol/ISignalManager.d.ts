import { SignalData, Instance as PeerInstance } from "simple-peer";
/** An SDP‐offer enriched with metadata for reuse */
export type ReusableOffer = {
    sdp: string;
    offerId: string;
    createdAt: number;
    createdBy: string;
};
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
export type OfferResponse = {
    answer: ISignalInfoAnswer;
    peer: PeerInstance;
    connectionId: string;
};
/** Result of processing an answer to finalize a handshake */
export type AnswerResponse = {
    peer: PeerInstance;
    connectionId: string;
    remotePeerId: string;
};
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
export interface ISignalManager {
    /**
     * Create a one‐off SDP offer wrapped in a ReusableOffer.
     */
    createReusableOffer(peerId?: string): Promise<ISignalInfoOffer>;
    /**
     * Consume a ReusableOffer, produce an answer and return
     * both the answer and the live PeerInstance.
     */
    processOfferAndCreateAnswer(receivedOffer: ISignalInfoOffer, peerId?: string): Promise<OfferResponse>;
    /**
     * Finalize a handshake by consuming the ReusableAnswer.
     */
    processAnswer(receivedAnswer: ISignalInfoAnswer): Promise<AnswerResponse>;
}
