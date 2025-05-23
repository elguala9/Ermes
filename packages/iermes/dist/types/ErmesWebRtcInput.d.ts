import { CallbackOnMessageService, Signal } from "ermes-types";
import { IErmesRepository } from "../standard-interface/IErmes.js";
import { IErmesWebRtcRepository } from "../standard-interface/IErmesWebRtc.js";
import { IIdHandlerService } from "../standard-interface/IIdHandler.js";
export type ErmesServiceInput = ErmesServiceInputGeneric<IErmesRepository>;
export type ErmesWebRtcServiceInput = ErmesServiceInputGeneric<IErmesWebRtcRepository>;
export type ErmesServiceInputGeneric<RepoType> = {
    repository: RepoType;
    messageCallback?: CallbackOnMessageService;
    idHandler: IIdHandlerService;
    maxByte?: number;
    maxBuffer?: number;
};
export type ErmesWbrtcRepositoryInput = {
    offer?: Signal;
    iceServers?: RTCIceServer[];
};
