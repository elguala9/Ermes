import { IErmesBookRepository, IErmesBookService } from "iermes/index";
import { ClientWorkDB } from "workdb/ClientWorkDB";
import { ErmesBookRepository, BookInput, BookData } from "../ErmesBookRepository.js";
/**
 * Creates a book repository with the specified database and collection
 */
export declare function createErmesBookRepository(db: ClientWorkDB, collection?: string): IErmesBookRepository<BookInput, BookData>;
/**
 * Creates a book service with the specified repository
 */
export declare function createErmesBookService(repo: ErmesBookRepository): IErmesBookService<BookInput, BookData>;
/**
 * Creates a complete book service with database - convenience method
 */
export declare function createErmesBookServiceWithDB(db: ClientWorkDB, collection?: string): IErmesBookService<BookInput, BookData>;
