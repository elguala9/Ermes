export class ErmesSignalingService {
    constructor(repo, factory) {
        this.repo = repo;
        this.factory = factory;
    }
    destroy() {
        return this.repo.destroy();
    }
    isConnected() {
        return this.repo.isConnected();
    }
    async onSignal(callback) {
        // to fix
        /*return this.repo.onSignal((signal: SignalType) => {
            callback({
                peer: input.peer,
                ermesService: this.createErmesService(input.signal.signal)
            });
        });*/
    }
    async getSignal(from) {
        return this.repo.getSignal(from);
    }
    getIdAccount() {
        return this.repo.getIdAccount();
    }
    sendSignal(to) {
        return this.repo.sendSignal(to);
    }
    removeAllListeners() {
        return this.repo.removeAllListeners();
    }
    createErmesService(signal) {
        throw new Error("Method not implemented.");
    }
    async getErmes(of) {
        let signal = await this.repo.getSignal(of);
        let ermes = this.createErmesService(signal);
        return ermes;
    }
}
//# sourceMappingURL=ErmesSignalingService.js.map