import { SocketType } from "dgram";
import { IdAccountType, IErmesFactory, IErmesSignalingRepository, IErmesSignalingService, OnSignalCreateSocketCallback, SignalType } from "iermes/index";
export declare class ErmesSignalingService implements IErmesSignalingService {
    private ermesFactory;
    private repo;
    constructor(repo: IErmesSignalingRepository<SignalType>, ermesFactory: IErmesFactory<SocketType>);
    destroy(): Promise<void>;
    isConnected(): Promise<boolean>;
    onSignal(callback: OnSignalCreateSocketCallback): Promise<void>;
    getSignal(from: IdAccountType): Promise<SignalType>;
    getIdAccount(): Promise<IdAccountType>;
    sendSignal(to: IdAccountType): Promise<void>;
    removeAllListeners(): void;
}
