import { Signal } from "ermes-types";
import { ErmesWbrtcRepositoryInput, ErmesWebRtcServiceInput } from "src/types/ErmesWebRtcInput.js";
import { IErmesRepository, IErmesService } from "./IErmes.js";
import { IErmesWebRtcRepository, IErmesWebRtcService } from "./IErmesWebRtc.js";
export interface IErmesWebRtcFactory {
    /**
     * Create the repository
     * Everything is optional
     * @param input same input as ErmesWbrtcRepository
     */
    createRepository(input: ErmesWbrtcRepositoryInput): IErmesRepository;
    /**
     * Create the service
     * Everything is optional, you can pass only the second parameter
     * @param input same input as ErmesServiceWebRtc
     * @param inputForRepo only used if the repo inside input is undefined
     */
    createService(input?: Partial<ErmesWebRtcServiceInput>, inputForRepo?: ErmesWbrtcRepositoryInput): IErmesService;
    /**
     * connect to the other peer via signaling (answer)
     * @param repo repository to connect
     * @param answer answer of the other peer
     * @returns the connected repository
     */
    connectRepository(repo: IErmesWebRtcRepository, answer: Signal): IErmesRepository;
    /**
     * connect to the other peer via signaling (answer)
     * @param service service to connect
     * @param answer answer of the other peer
     * @returns the connected service
     */
    connectService(service: IErmesWebRtcService, answer: Signal): IErmesService;
}
