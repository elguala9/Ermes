import { IErmesBookRepository, IErmesBookService } from "iermes/index";
import { ClientWorkDB } from "workdb/ClientWorkDB";
import { ErmesBookRepository, BookInput, BookData } from "../ErmesBookRepository.js";
import { ErmesBookService } from "../ErmesBookService.js";

/**
 * Creates a book repository with the specified database and collection
 */
export function createErmesBookRepository(
  db: ClientWorkDB,
  collection: string = "ermes_books"
): IErmesBookRepository<BookInput, BookData> {
  return new ErmesBookRepository(db, collection);
}

/**
 * Creates a book service with the specified repository
 */
export function createErmesBookService(
  repo: ErmesBookRepository
): IErmesBookService<BookInput, BookData> {
  return new ErmesBookService(repo);
}

/**
 * Creates a complete book service with database - convenience method
 */
export function createErmesBookServiceWithDB(
  db: ClientWorkDB,
  collection: string = "ermes_books"
): IErmesBookService<BookInput, BookData> {
  const repo = new ErmesBookRepository(db, collection);
  return createErmesBookService(repo);
}