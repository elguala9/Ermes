import { IdAccountType, IErmesRepository, IErmesSignalingRepository, IErmesSignalingService, IErmesWebRtcFactory, OnSignalCreateSocketCallback, SignalType } from "iermes/index";
export declare class ErmesSignalingService implements IErmesSignalingService {
    private repo;
    private factory;
    constructor(repo: IErmesSignalingRepository<SignalType>, factory: IErmesWebRtcFactory);
    destroy(): Promise<void>;
    isConnected(): Promise<boolean>;
    onSignal(callback: OnSignalCreateSocketCallback): Promise<void>;
    getSignal(from: IdAccountType): Promise<SignalType>;
    getIdAccount(): Promise<IdAccountType>;
    sendSignal(to: IdAccountType): Promise<void>;
    removeAllListeners(): void;
    private createErmesService;
    getErmes(of: IdAccountType): Promise<IErmesRepository>;
}
