import { IdAccountType, IErmesService, IErmesSignalingRepository, IErmesSignalingService, IErmesWebRtcFactory, IErmesWebRtcService, OnSignalCallback, OnSignalCreateSocketCallback, SignalType } from "iermes/index";
import { ISignalingSdk } from "signaling-sdk/ISignalingSdk";
import { CallbackSignalInput, OutputStruct } from "signaling-sdk/Types";



export class ErmesSignalingService implements IErmesSignalingService {
    private repo: IErmesSignalingRepository<SignalType>;
    private factory: IErmesWebRtcFactory;

    constructor(repo: IErmesSignalingRepository<SignalType>, factory: IErmesWebRtcFactory) {
        this.repo = repo;
        this.factory = factory;
    }

    async onSignal(callback: OnSignalCreateSocketCallback): Promise<void> {
        // to fix
        /*return this.repo.onSignal((signal: SignalType) => {
            callback({
                peer: input.peer,
                ermesService: this.createErmesService(input.signal.signal)
            });
        });*/
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
        let ermes = this.createErmesService(signal);
        return ermes;
    }
    
}