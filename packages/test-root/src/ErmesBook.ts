import * as fs from 'fs';
import * as path from 'path';
import { WorkDBFactory } from "workdb/factories/FactoryClientWorkDB";
import { createErmesBookServiceWithDB } from 'ermes/index';
import { testBook } from "test-ermes/dist/signaling-test/ErmesBook.spec.js";

let databasePath = "./test-db";

async function main() {
    console.log("Starting ErmesBook integration test in test-root...");
    
    try {
        // Create database instance using factory
        const db = WorkDBFactory.forNode(databasePath);
        
        // Create book service using factory (this creates both repository and service)
        const bookService = createErmesBookServiceWithDB(db, "test_books_collection");
        
        console.log("Created ErmesBook service with database:", databasePath);
        
        // Use the comprehensive test suite from test-ermes
        console.log("Running comprehensive test suite...");
        testBook(bookService);
        
        console.log("ErmesBook integration test completed successfully!");
        
    } catch (error) {
        console.error("ErmesBook integration test failed:", error);
        process.exit(1);
    }
}

main();