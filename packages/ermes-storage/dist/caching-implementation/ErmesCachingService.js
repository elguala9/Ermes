export class ErmesCachingService {
    constructor(repo) {
        this._repo = repo;
    }
    async destroy() {
        await this._repo.destroy();
        //    @ts-expect-error vogliamo nullare
        this._repo = null;
    }
    clear() {
        return this._repo.clear();
    }
    numberOfElements() {
        return this._repo.numberOfElements();
    }
    listOfIds() {
        return this._repo.listOfIds();
    }
    async store(data) {
        return this._repo.store(data);
    }
    async retrieve(id) {
        return this._repo.retrieve(id);
    }
    async delete(id) {
        return this._repo.delete(id);
    }
}
//# sourceMappingURL=ErmesCachingService.js.map