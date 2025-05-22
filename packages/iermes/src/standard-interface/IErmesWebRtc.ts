import { IErmesRepository, IErmesService } from "./IErmes.js";
import type { SignalData } from 'simple-peer';


interface IErmesWebRtcPrivate {
    /**
     * create the offer that will be passed to the other peer
     */
    createOffer(): Promise<SignalData>


    /**
     * 
     * @param answer answer from the other peer
     */
    setAnswer(answer: SignalData): void

    onConnect(callback: () => void) : void;
    
    onError(callback: (err: Error) => void)  : void;
    
    onClose(callback: () => void)  : void;

    onSignal(callback: (data: SignalData | PromiseLike<SignalData>) => void)  : void;
}

/**
 * extension of ermes with some methods for webrtc
 */
export interface IErmesWebRtcRepository extends IErmesRepository, IErmesWebRtcPrivate {

}



/**
 * extension of ermes with some methods for webrtc
 */
export interface IErmesWebRtcService extends IErmesService, IErmesWebRtcPrivate {
    /**
     * try to simplify the exhange of the offer by making it a string
     */
    createOfferString(): Promise<string>
    /**
     * 
     * @param answer answer from the other peer
     */
    setAnswerString(answer: string): void
    /**
     * change the repo, this will retain all the information in the service
     * @param repository new repository that the service is going to use
     */
    setRepository(repository: IErmesWebRtcRepository): void;
}



