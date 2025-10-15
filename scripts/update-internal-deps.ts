#!/usr/bin/env node
/**
 * A script to batch-update dependency versions **only within the same monorepo (workspaces)**.
 *
 * Usage:
 *   node --experimental-strip-types scripts/update-internal-deps.ts <newVersion>
 *
 * Example:
 *   npm version patch            # decide the new version first
 *   node --experimental-strip-types scripts/update-internal-deps.ts 1.2.3
 *
 * Notes:
 * - To let npm handle workspace resolution, this script internally uses `npm --workspaces ... exec` to list workspace directories.
 * - In tests/CI, you can bypass this listing by setting the environment variable WS_DIRS="packages/a packages/b".
 * - The package-lock file is not modified. If needed, run `npm i` afterward to update it.
 */

import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';

const argv = process.argv.slice(2);
if (argv.length === 0 || argv[0].startsWith('-')) {
  console.error(
    'Usage: node --experimental-strip-types scripts/update-internal-deps.ts <newVersion>'
  );
  process.exit(1);
}
const NEW_VERSION: string = argv[0];
console.log('New version:', NEW_VERSION);

// validate newVersion format
if (!/^\d+\.\d+\.\d/.test(NEW_VERSION)) {
  console.error(
    `Invalid <newVersion>: "${NEW_VERSION}". Expected format like 1.2.3`
  );
  process.exit(1);
}

function readJSON(file: string): { json: any; raw: string } {
  const raw = fs.readFileSync(file, 'utf8');
  return { json: JSON.parse(raw), raw };
}

function detectIndent(raw: string): number {
  const m = raw.match(/\n(\s+)\S/);
  return m ? m[1].length : 2;
}

function writeJSON(file: string, obj: any, originalRaw: string): void {
  const indent = detectIndent(originalRaw);
  const trailingNl = originalRaw.endsWith('\n') ? '\n' : '';
  fs.writeFileSync(
    file,
    JSON.stringify(obj, null, indent) + trailingNl,
    'utf8'
  );
}

function listWorkspaceDirs(): string[] {
  if (process.env.WS_DIRS) {
    return process.env.WS_DIRS.split(/\s+/)
      .filter(Boolean)
      .map((p) => path.resolve(p));
  }
  const cmd =
    'npm --workspaces --include-workspace-root=false exec -- node -p "process.cwd()"';
  const out = cp.execSync(cmd, { encoding: 'utf8' });
  const lines = out
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set(lines));
}

function buildInternalNameSet(wsDirs: string[]): Set<string> {
  const names = new Set<string>();
  for (const d of wsDirs) {
    const pkgPath = path.join(d, 'package.json');
    try {
      const { json } = readJSON(pkgPath);
      if (json && typeof json.name === 'string') names.add(json.name);
    } catch {
      // pass
    }
  }
  return names;
}

type UpdateResult = { file: string; changed: number };

function updateOnePackageDependencies(
  pkgDir: string,
  internalNames: Set<string>
): UpdateResult {
  const pkgPath = path.join(pkgDir, 'package.json');
  const { json, raw } = readJSON(pkgPath);
  let changed = 0;

  const deps = json['dependencies'];
  if (deps && typeof deps == 'object') {
    for (const depName of Object.keys(deps)) {
      if (!internalNames.has(depName)) continue; // ignore external deps

      const before = deps[depName];
      const after = NEW_VERSION;
      if (after !== before) {
        deps[depName] = after;
        changed++;
        console.log(
          `${pkgPath}: ${'dependencies'}.${depName} ${before} -> ${after}`
        );
      }
    }
  }

  if (changed > 0) {
    writeJSON(pkgPath, json, raw);
  }
  return { file: pkgPath, changed };
}

function main(): void {
  const wsDirs = listWorkspaceDirs();
  if (wsDirs.length === 0) {
    console.error(
      'No workspaces found. Ensure package.json has a valid "workspaces" and you run from repo root.'
    );
    process.exit(1);
  }

  const internalNames = buildInternalNameSet(wsDirs);

  let totalFiles = 0;
  let totalChanges = 0;

  for (const d of wsDirs) {
    const res = updateOnePackageDependencies(d, internalNames);
    if (res.changed > 0) totalFiles++;
    totalChanges += res.changed;
  }

  console.log(
    `Done. Updated ${totalChanges} dependency entr${
      totalChanges === 1 ? 'y' : 'ies'
    } in ${totalFiles} package${totalFiles === 1 ? '' : 's'}. → ${NEW_VERSION}`
  );
}

try {
  main();
} catch (e) {
  console.error((e && (e as any).stack) || e);
  process.exit(1);
}
