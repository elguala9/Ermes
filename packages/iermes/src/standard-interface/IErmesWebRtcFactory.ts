import { Signal } from "ermes-types";
import { ErmesWbrtcRepositoryInput, ErmesWebRtcServiceInput, IErmesWebRtcRepository, IErmesWebRtcService } from "../index.js";

 
export interface IErmesWebRtcFactory {
    /**
     * 
     * @param input same input as ErmesWbrtcRepository
     */
    createRepository(input: ErmesWbrtcRepositoryInput): IErmesWebRtcRepository;
    
    /**
     * Create the service
     * @param input same input as ErmesServiceWebRtc
     * @param inputForRepo only used if the repo inside input is undefined
     */
    //// I use Partial because in this way everything is optional.
    createService(input?: Partial<ErmesWebRtcServiceInput>, inputForRepo?: ErmesWbrtcRepositoryInput): IErmesWebRtcService;
    connectRepository(repo: IErmesWebRtcRepository, answer: Signal): IErmesWebRtcRepository;
    connectService(service: IErmesWebRtcService, answer: Signal): IErmesWebRtcService;
}
