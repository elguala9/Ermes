import { Signal } from "ermes-types"
import { IErmesRepository, CallbackOnMessage } from "../standard-interface/IErmes.js"
import { IIdHandlerService } from "../standard-interface/IIdHandler.js"
import { IErmesWebRtcRepository } from "../standard-interface/IErmesWebRtc.js"



export type ErmesServiceInput = ErmesServiceInputGeneric<IErmesRepository>
export type ErmesWebRtcServiceInput = ErmesServiceInputGeneric<IErmesWebRtcRepository>

export type ErmesServiceInputGeneric<RepoType> = {
    repository: RepoType, 
    messageCallback: CallbackOnMessage
    idHandler: IIdHandlerService,
    maxByte?: number,
    maxBuffer?: number
}


export type ErmesWbrtcRepositoryInput = {
    offer?: Signal;
    iceServers?: RTCIceServer[];
}