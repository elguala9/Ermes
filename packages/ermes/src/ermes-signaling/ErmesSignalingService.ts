import { SocketType } from "dgram";
import { IdAccountType, IErmesFactory, IErmesSignalingRepository, IErmesSignalingService, OnSignalCreateSocketCallback, SignalType } from "iermes/index";



export class ErmesSignalingService implements IErmesSignalingService {
    private repo: IErmesSignalingRepository<SignalType>;


    constructor(repo: IErmesSignalingRepository<SignalType>, 
        private ermesFactory: IErmesFactory<SocketType>
    ) {
        this.repo = repo;
    }
    destroy(): Promise<void> {
        return this.repo.destroy();
    }
    isConnected(): Promise<boolean> {
        return this.repo.isConnected();
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
    async getSignal(from: IdAccountType): Promise<SignalType> {
        return this.repo.getSignal(from);
    }
    getIdAccount(): Promise<IdAccountType> {
        return this.repo.getIdAccount();
    }

    sendSignal(to: IdAccountType): Promise<void> {
        return this.repo.sendSignal(to);
    }
    removeAllListeners(): void {
        return this.repo.removeAllListeners();
    }


    
}