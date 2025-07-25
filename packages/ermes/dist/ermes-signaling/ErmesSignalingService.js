export class ErmesSignalingService {
    constructor(repo, ermesFactory) {
        this.ermesFactory = ermesFactory;
        this.repo = repo;
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
}
//# sourceMappingURL=ErmesSignalingService.js.map