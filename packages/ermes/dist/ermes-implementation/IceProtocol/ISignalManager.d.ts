import { AnswerResponse, ISignalInfoAnswer, ISignalInfoOffer, OfferResponse, Response } from "ermes-types";
import { IdAccountType } from "iermes/signaling-interface/IErmesSignaling";
export interface ISignalManager {
    /**
     * Create a one‐off SDP offer wrapped in a ReusableOffer.
     */
    createReusableOffer(peerId?: string): Promise<ISignalInfoOffer>;
    /**
     * Consume a ReusableOffer, produce an answer and return
     * both the answer and the live PeerInstance.
     */
    processOfferAndCreateAnswer(receivedOffer: ISignalInfoOffer, peerId: string): Promise<OfferResponse>;
    /**
     * Finalize a handshake by consuming the ReusableAnswer.
     */
    processAnswer(receivedAnswer: ISignalInfoAnswer, peerId: IdAccountType): Promise<AnswerResponse>;
    /**
     * Finalize a handshake by consuming the ReusableAnswer.
     */
    getResponse(peerId: IdAccountType): Promise<Response>;
}
