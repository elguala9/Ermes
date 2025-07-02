import { IdAccountType, IErmesService, IErmesSignalingRepository, IErmesSignalingService, IErmesWebRtcFactory, IErmesWebRtcService, OnSignalCallback, OnSignalCallbackInput, OnSignalCreateSocketCallback } from "iermes/index";
import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";
import { CallbackSignalInput, OutputStruct } from "signaling-sdk/Types";



export class ErmesSignalingService implements IErmesSignalingService {
    private repo: IErmesSignalingRepository<OutputStruct>;
    private factory: IErmesWebRtcFactory;

    constructor(repo: IErmesSignalingRepository<OutputStruct>, factory: IErmesWebRtcFactory) {
        this.repo = repo;
        this.factory = factory;
    }

    onSignal(callback: OnSignalCreateSocketCallback): Promise<void> {
        return this.repo.onSignal((input: OnSignalCallbackInput<OutputStruct>) => {
            callback({
                peer: input.peer,
                ermesService: this.createErmesService(input.signal.signal)
            });
        });
    }
    connect(): Promise<void> {
        return this.repo.connect();
    }
    disconnect(): Promise<void> {
        return this.repo.disconnect();
    }
    getIdAccount(): Promise<IdAccountType> {
        return this.repo.getIdAccount();
    }
    pingServer(): Promise<boolean> {
        return this.repo.pingServer();
    }
    sendSignal(to: IdAccountType): Promise<void> {
        return this.repo.sendSignal(to);
    }
    removeAllListeners(): void {
        return this.repo.removeAllListeners();
    }

    private createErmesService(signal: string): IErmesService {
        return this.factory.createService(undefined, {
            offer: signal
        });
    }

    async getErmes(of: IdAccountType): Promise<IErmesService>{
        let signal = await this.repo.getSignal(of);
        let ermes = this.createErmesService(signal.signal);
        return ermes;
    }
    
}