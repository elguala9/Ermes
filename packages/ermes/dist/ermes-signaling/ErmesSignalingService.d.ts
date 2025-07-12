import { IdAccountType, IErmesService, IErmesSignalingRepository, IErmesSignalingService, IErmesWebRtcFactory, OnSignalCreateSocketCallback, SignalType } from "iermes/index";
export declare class ErmesSignalingService implements IErmesSignalingService {
    private repo;
    private factory;
    constructor(repo: IErmesSignalingRepository<SignalType>, factory: IErmesWebRtcFactory);
    onSignal(callback: OnSignalCreateSocketCallback): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getIdAccount(): Promise<IdAccountType>;
    pingServer(): Promise<boolean>;
    sendSignal(to: IdAccountType): Promise<void>;
    removeAllListeners(): void;
    private createErmesService;
    getErmes(of: IdAccountType): Promise<IErmesService>;
}
