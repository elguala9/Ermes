#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively finds all `index.ts` files under a target directory,
 * excluding directories with names in the `excludedDirs` list.
 *
 * @param dir - the directory to search in
 * @param excludedDirs - array of directory names to exclude
 * @returns array of absolute paths to `index.ts` files
 */
export function findIndexTsPaths(dir: string, excludedDirs: string[] = []): string[] {
  const results: string[] = [];

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    console.warn(`⚠️  Skipping non-existent or unreadable directory: ${dir}`);
    return results;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (excludedDirs.includes(entry.name)) {
        continue;
      }
      results.push(...findIndexTsPaths(fullPath, excludedDirs));
    } else if (entry.isFile() && entry.name === 'index.ts') {
      results.push(fullPath);
    }
  }

  return results;
}

export function processFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  const updated = content
    .replace(/(from\s+['"])(\.\/[^'";]+)(['"];)/g, (all, p1, p2, p3) => {
      if (p2.endsWith('.js')) return all;
      return `${p1}${p2}.js${p3}`;
    })
    .replace(/(require\(['"])(\.\/[^'"]+)(['"]\))/g, (all, p1, p2, p3) => {
      if (p2.endsWith('.js')) return all;
      return `${p1}${p2}.js${p3}`;
    });

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✔ Updated ${filePath}`);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const edIndex = args.indexOf('-ed');

  const targetDir =
    edIndex === -1
      ? args[0] ?? path.join(process.cwd(), 'packages')
      : args[0] === '-ed'
        ? path.join(process.cwd(), 'packages')
        : path.resolve(args[0]);

  const excludedDirs = edIndex !== -1 ? args.slice(edIndex + 1) : [];

  return { targetDir, excludedDirs };
}

function main(): void {
  const { targetDir, excludedDirs } = parseArgs();

  console.log(`Scanning "${targetDir}"`);
  if (excludedDirs.length > 0) {
    console.log(`Excluding directories by name: ${excludedDirs.join(', ')}`);
  }

  const indexPaths: string[] = findIndexTsPaths(targetDir, excludedDirs);
  console.log('Found index.ts files:');
  indexPaths.forEach(p => console.log(p));

  indexPaths.forEach(processFile);
  console.log('Done processing index.ts files.');
}

if (require.main === module) {
  main();
}
