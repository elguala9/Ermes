export class IdHandlerService {
    /**
     * @param repo
     * @param storage where data will be stored permanently
     */
    constructor(repo) {
        this._repo = repo;
    }
    getNewId() {
        return this._repo.getNewId();
    }
    reset() {
        return this._repo.reset();
    }
}
//# sourceMappingURL=IdHandlerService.js.map