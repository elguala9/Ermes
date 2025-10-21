import { CallbackOnDataArrived, MessageType, Signal } from "ermes-types"
import { IErmesRepository } from "../standard-interface/IErmes.js"
import { IIdHandlerService } from "../standard-interface/IIdHandler.js"
import { IErmesStorageAndCaching } from "../storage-interface/IErmesStorageAndCaching.js"
import { IErmesMessageControlService } from "src/standard-interface/IErmesMessageControl.js"



export type ErmesServiceInput = ErmesServiceInputGeneric<IErmesRepository>

export type ErmesServiceInputGeneric<RepoType> = {
    repository: RepoType;
    callbackOnDataArrived?: CallbackOnDataArrived;
    idHandler: IIdHandlerService;
    maxByte?: number;
    maxBuffer?: number;
    ermesStorageAndCaching?: IErmesStorageAndCaching<MessageType>;
    ermesMessageControlService?: IErmesMessageControlService;
    missingMessagesCheckIntervalMs?: number;
    missingMessagesThreshold?: number;
}


export type ErmesWbrtcRepositoryInput = {
    offer?: Signal;
    iceServers?: RTCIceServer[];
}