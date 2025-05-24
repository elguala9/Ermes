import { Signal } from "ermes-types";
import { ErmesWbrtcRepositoryInput, ErmesWebRtcServiceInput, IErmesWebRtcFactory, IErmesWebRtcRepository, IErmesWebRtcService } from "iermes/index";
export declare class ErmesWebRtcFactory implements IErmesWebRtcFactory {
    createRepository(input: ErmesWbrtcRepositoryInput): IErmesWebRtcRepository;
    createService(input: Partial<ErmesWebRtcServiceInput>, inputForRepo?: ErmesWbrtcRepositoryInput): IErmesWebRtcService;
    connectRepository(repo: IErmesWebRtcRepository, answer: Signal): IErmesWebRtcRepository;
    connectService(service: IErmesWebRtcService, answer: Signal): IErmesWebRtcService;
}
