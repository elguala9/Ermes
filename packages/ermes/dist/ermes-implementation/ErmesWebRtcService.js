import { ErmesService } from "./ErmesService.js";
export class ErmesWebRtcService extends ErmesService {
    constructor(input) {
        super(input);
        this._repositoryWebRtc = input.repository;
    }
    setRepository(repository) {
        this._repositoryWebRtc = repository;
        // i also need to set the repo of the base class
        super.setRepository(repository);
    }
    createSignal() {
        return this._repositoryWebRtc.createSignal();
    }
    setSignal(signal) {
        return this._repositoryWebRtc.setSignal(signal);
    }
    onConnect(callback) {
        return this._repositoryWebRtc.onConnect(callback);
    }
    onError(callback) {
        return this._repositoryWebRtc.onError(callback);
    }
    onClose(callback) {
        return this._repositoryWebRtc.onClose(callback);
    }
    onSignal(callback) {
        return this._repositoryWebRtc.onSignal(callback);
    }
}
//# sourceMappingURL=ErmesWebRtcService.js.map