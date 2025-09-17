export class ErmesStorageService {
    constructor(repo) {
        this.repo = repo;
    }
    destroy() {
        return this.repo.destroy();
    }
    clear() {
        return this.repo.clear();
    }
    numberOfElements() {
        return this.repo.numberOfElements();
    }
    listOfIds() {
        return this.repo.listOfIds();
    }
    async store(data) {
        return this.repo.store(data);
    }
    async retrieve(id) {
        return this.repo.retrieve(id);
    }
    async delete(id) {
        return this.repo.delete(id);
    }
}
//# sourceMappingURL=ErmesStorageService.js.map