export class IdHandlerService {
    /**
     * @param repo
     * @param storage where data will be stored permanently
     */
    constructor(repo, storage) {
        this._repo = repo;
        this._storage = storage;
    }
    storeNewId(newId) {
        if (this._storage)
            this._storage.update(newId);
    }
    getNewId() {
        let newId = this._repo.getNewId();
        this.storeNewId(newId);
        return newId;
    }
    reset() {
        this._repo.reset();
        let res = this._repo.getCurrent();
        this.storeNewId(res);
    }
}
//# sourceMappingURL=IdHandlerService.js.map