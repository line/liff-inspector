import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';

const SCRIPT = path.resolve(__dirname, './update-internal-deps.ts');

function writeJSON(file: string, obj: any, indent = 2, trailingNl = true) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const text = JSON.stringify(obj, null, indent) + (trailingNl ? '\n' : '');
  fs.writeFileSync(file, text, 'utf8');
}

function read(file: string) {
  return fs.readFileSync(file, 'utf8');
}

function run(
  newVersion: string,
  opts: {
    cwd: string;
    env?: Record<string, string>;
  }
) {
  const args = ['--experimental-strip-types', SCRIPT, newVersion];
  const env = { ...process.env, ...(opts.env ?? {}) };
  return cp.spawnSync(process.execPath, args, {
    cwd: opts.cwd,
    env,
    encoding: 'utf8',
  });
}

let tmpRoot: string;

beforeEach(() => {
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'upd-internal-deps-'));
});

afterEach(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

describe('update-internal-deps CLI', () => {
  it('fails when no workspaces are found', () => {
    // no WS_DIRS and no actual npm workspaces here -> should error
    writeJSON(path.join(tmpRoot, 'package.json'), { private: true });
    const out = run('1.2.3', { cwd: tmpRoot, env: {} });
    expect(out.status).not.toBe(0);
    expect(out.stderr).toMatch(/No workspaces found/i);
  });

  it('updates ONLY internal deps; preserves ^ and ~; ignores externals', () => {
    const aDir = path.join(tmpRoot, 'packages/a');
    const bDir = path.join(tmpRoot, 'packages/b');

    // packages/a
    writeJSON(
      path.join(aDir, 'package.json'),
      {
        name: '@repo/a',
        version: '0.1.0',
        dependencies: {
          '@repo/b': '^0.1.0', // internal → becomes ^1.2.3
          react: '^18.3.1', // external → unchanged
          exact: '0.1.0', // external → unchanged
          tilde: '~0.1.0', // external → unchanged
        },
        devDependencies: {
          '@repo/b': '^0.1.0', // untouched (only "dependencies" section is handled)
        },
      },
      2,
      true
    );

    // packages/b
    writeJSON(
      path.join(bDir, 'package.json'),
      {
        name: '@repo/b',
        version: '0.1.0',
        dependencies: {
          '@repo/a': '0.1.0', // internal exact → becomes 1.2.3
          '@repo/b': '^0.1.0',
          rangeLike: '>=0.1.0 <2.0.0', // external → unchanged
        },
      },
      4, // indent=4
      false // no trailing newline
    );

    // root (not used because WS_DIRS is set, but nice to have)
    writeJSON(path.join(tmpRoot, 'package.json'), {
      private: true,
      workspaces: ['packages/*'],
    });

    const env = { WS_DIRS: `${aDir} ${bDir}` };
    const out = run('1.2.3', { cwd: tmpRoot, env });

    expect(out.status).toBe(0);
    expect(out.stdout).toMatch(/New version:\s+1\.2\.3/);
    expect(out.stdout).toMatch(
      /Done\. Updated \d+ dependency entr(?:y|ies) in \d+ package(?:|s)\. → 1\.2\.3/
    );

    // Validate a
    const aRaw = read(path.join(aDir, 'package.json'));
    const aJson = JSON.parse(aRaw);

    // indent and trailing newline retained
    expect(aRaw.endsWith('\n')).toBe(true);
    expect(aRaw).toMatch(/\n {2}"dependencies": \{\n/);

    expect(aJson.dependencies['@repo/b']).toBe('1.2.3'); // internal dep updated to exact version
    expect(aJson.dependencies['react']).toBe('^18.3.1'); // external unchanged
    expect(aJson.devDependencies['@repo/b']).toBe('^0.1.0'); // devDependencies untouched

    // Validate b
    const bRaw = read(path.join(bDir, 'package.json'));
    const bJson = JSON.parse(bRaw);

    // indent and "no trailing newline" retained
    expect(bRaw.endsWith('\n')).toBe(false);
    expect(bRaw).toMatch(/\n {4}"dependencies": \{\n/);

    expect(bJson.dependencies['@repo/a']).toBe('1.2.3');
    expect(bJson.dependencies['@repo/b']).toBe('1.2.3');
    expect(bJson.dependencies['rangeLike']).toBe('>=0.1.0 <2.0.0'); // external unchanged
  });

  it('rejects invalid version format', () => {
    const aDir = path.join(tmpRoot, 'packages/a');
    writeJSON(path.join(aDir, 'package.json'), {
      name: '@repo/a',
      version: '0.1.0',
    });

    const env = { WS_DIRS: `${aDir}` };
    const out = run('v1.2.3', { cwd: tmpRoot, env }); // invalid per script rule
    expect(out.status).not.toBe(0);
    expect(out.stderr).toMatch(/Invalid <newVersion>/);
  });

  it('summary shows zeroes when nothing changed', () => {
    const aDir = path.join(tmpRoot, 'packages/a');
    writeJSON(path.join(aDir, 'package.json'), {
      name: '@repo/a',
      version: '0.1.0',
      dependencies: { react: '^18.3.1' }, // external only
    });

    writeJSON(path.join(tmpRoot, 'package.json'), {
      private: true,
      workspaces: ['packages/*'],
    });

    const env = { WS_DIRS: `${aDir}` };
    const out = run('1.2.3', { cwd: tmpRoot, env });

    expect(out.status).toBe(0);
    expect(out.stdout).toMatch(
      /Done\. Updated 0 dependency entr(?:y|ies) in 0 package(?:|s)\. → 1\.2\.3/
    );
  });
});
