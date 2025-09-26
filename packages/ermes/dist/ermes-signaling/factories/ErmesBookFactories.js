import { ErmesBookRepository } from "../ErmesBookRepository.js";
import { ErmesBookService } from "../ErmesBookService.js";
/**
 * Creates a book repository with the specified database and collection
 */
export function createErmesBookRepository(db, collection = "ermes_books") {
    return new ErmesBookRepository(db, collection);
}
/**
 * Creates a book service with the specified repository
 */
export function createErmesBookService(repo) {
    return new ErmesBookService(repo);
}
/**
 * Creates a complete book service with database - convenience method
 */
export function createErmesBookServiceWithDB(db, collection = "ermes_books") {
    const repo = new ErmesBookRepository(db, collection);
    return createErmesBookService(repo);
}
//# sourceMappingURL=ErmesBookFactories.js.map