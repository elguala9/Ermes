export class ErmesSignalingService {
    constructor(repo, factory) {
        this.repo = repo;
        this.factory = factory;
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
    connect() {
        return this.repo.connect();
    }
    disconnect() {
        return this.repo.disconnect();
    }
    getIdAccount() {
        return this.repo.getIdAccount();
    }
    pingServer() {
        return this.repo.pingServer();
    }
    sendSignal(to) {
        return this.repo.sendSignal(to);
    }
    removeAllListeners() {
        return this.repo.removeAllListeners();
    }
    createErmesService(signal) {
        return this.factory.createService(undefined, {
            offer: signal
        });
    }
    async getErmes(of) {
        let signal = await this.repo.getSignal(of);
        let ermes = this.createErmesService(signal);
        return ermes;
    }
}
//# sourceMappingURL=ErmesSignalingService.js.map