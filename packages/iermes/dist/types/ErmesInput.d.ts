import { CallbackOnDataArrived, MessageType, Signal } from "ermes-types";
import { IErmesRepository } from "../standard-interface/IErmes.js";
import { IErmesWebRtcRepository } from "../standard-interface/IErmesWebRtc.js";
import { IIdHandlerService } from "../standard-interface/IIdHandler.js";
import { IErmesStorageAndCaching } from "../storage-interface/IErmesStorageAndCaching.js";
export type ErmesServiceInput = ErmesServiceInputGeneric<IErmesRepository>;
export type ErmesWebRtcServiceInput = ErmesServiceInputGeneric<IErmesWebRtcRepository>;
export type ErmesServiceInputGeneric<RepoType> = {
    repository: RepoType;
    callbackOnDataArrived?: CallbackOnDataArrived;
    idHandler: IIdHandlerService;
    maxByte?: number;
    maxBuffer?: number;
    ermesStorageAndCaching?: IErmesStorageAndCaching<MessageType>;
};
export type ErmesWbrtcRepositoryInput = {
    offer?: Signal;
    iceServers?: RTCIceServer[];
};
