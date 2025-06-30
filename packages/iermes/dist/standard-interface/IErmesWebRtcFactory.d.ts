import { Signal } from "ermes-types";
import { ErmesWbrtcRepositoryInput, ErmesWebRtcServiceInput } from "src/types/ErmesWebRtcInput.js";
import { IErmesWebRtcRepository, IErmesWebRtcService } from "./IErmesWebRtc.js";
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
    createService(input?: Partial<ErmesWebRtcServiceInput>, inputForRepo?: ErmesWbrtcRepositoryInput): IErmesWebRtcService;
    connectRepository(repo: IErmesWebRtcRepository, answer: Signal): IErmesWebRtcRepository;
    connectService(service: IErmesWebRtcService, answer: Signal): IErmesWebRtcService;
}
