#!/usr/bin/env ts-node

/**
 * Script: add-js-extension-to-index.ts
 *
 * 1. findIndexTsPaths(dir): returns an array of full paths to every `index.ts` under `dir`.
 * 2. CLI mode: when executed directly, it will print all `index.ts` paths and append `.js` to imports.
 * 3. processFile: appends `.js` to import/export paths in each `index.ts`.
 *
 * Usage:
 *   # As CLI (with ts-node):
 *   ts-node scripts/add-js-extension-to-index.ts [targetDirectory]
 *
 *   If no directory is given, defaults to '<current_working_directory>/packages'.
 *
 *   # As module:
 *   import { findIndexTsPaths } from './add-js-extension-to-index';
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively finds all `index.ts` files under a target directory.
 *
 * @param dir - the directory to search in
 * @returns array of absolute paths to `index.ts` files
 */
export function findIndexTsPaths(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findIndexTsPaths(fullPath));
    } else if (entry.isFile() && entry.name === 'index.ts') {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Read and update an `index.ts` file, appending `.js` to import/export paths without extensions.
 *
 * @param filePath - full path to the `index.ts` file
 */
export function processFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  const updated = content
    // ES module imports/exports
    .replace(/(from\s+['"])(\.\/[^'";]+)(['"];)/g, (all, p1, p2, p3) => {
      // ignora solo se finisce con .js
      if (p2.endsWith('.js')) return all;
      return `${p1}${p2}.js${p3}`;
    })
    // CommonJS require()
    .replace(/(require\(['"])(\.\/[^'"]+)(['"]\))/g, (all, p1, p2, p3) => {
      if (p2.endsWith('.js')) return all;
      return `${p1}${p2}.js${p3}`;
    });

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✔ Updated ${filePath}`);
  }
}


/**
 * CLI entry point: finds all index.ts files and processes each.
 */
function main(): void {
  const defaultDir: string = path.join(process.cwd(), 'packages');
  const targetDir: string = process.argv[2]
    ? path.resolve(process.argv[2])
    : defaultDir;

  const indexPaths: string[] = findIndexTsPaths(targetDir);
  console.log('Found index.ts files:');
  indexPaths.forEach(p => console.log(p));

  indexPaths.forEach(processFile);
  console.log('Done processing index.ts files.');
}

if (require.main === module) {
  main();
}