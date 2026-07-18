#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultRoot = fileURLToPath(new URL('..', import.meta.url));
const rootFiles = [
  'AGENTS.md',
  'BLUEPRINT.md',
  'CLAUDE.md',
  'LEXICON.md',
  'LICENSE',
  'README.md',
  'RUNBOOK.md',
  'THIRD_PARTY_NOTICES.md'
];
const packageDirectories = [
  'benchmarks',
  'docs',
  'evals',
  'outcomes',
  'research templates',
  'team templates',
  'templates',
  'tools'
];
const verificationCommands = [
  'node tools/test-release-manifest.mjs',
  'node tools/spec-workbench.mjs doctor',
  'node tools/evaluate-workbench.mjs --path templates --include-controls'
];

const fail = (message) => {
  throw new Error(`release-manifest: ${message}`);
};

const parseArgs = (argv) => {
  const options = { root: defaultRoot, sourceRef: 'HEAD', skillComponent: null };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === '--root' || flag === '--source-ref' || flag === '--skill-component') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) fail(`${flag} requires a value`);
      options[flag === '--root' ? 'root' : flag === '--source-ref' ? 'sourceRef' : 'skillComponent'] = value;
      index += 1;
      continue;
    }
    fail(`unknown argument ${flag}`);
  }
  return options;
};

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const relativePath = (root, file) => path.relative(root, file).split(path.sep).join('/');

const collectDirectory = (root, relative, files, trackedPaths) => {
  const directory = path.join(root, relative);
  if (!fs.existsSync(directory)) fail(`missing shipped directory ${relative}`);
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
    const childRelative = path.join(relative, entry.name);
    const child = path.join(root, childRelative);
    if (entry.isSymbolicLink()) {
      if (trackedPaths.has(relativePath(root, child))) {
        fail(`shipped path must not be a symlink: ${relativePath(root, child)}`);
      }
      continue;
    }
    if (entry.isDirectory()) collectDirectory(root, childRelative, files, trackedPaths);
    else if (entry.isFile() && trackedPaths.has(relativePath(root, child))) {
      files.push(relativePath(root, child));
    }
  }
};

const componentIdentity = (root, suppliedPath) => {
  if (!suppliedPath) {
    return {
      ownerSpec: 'S-011',
      ticket: 'TK-016',
      status: 'pending',
      identity: null
    };
  }
  if (path.isAbsolute(suppliedPath)) fail('skill component must stay within the repository');
  const resolved = path.resolve(root, suppliedPath);
  const relative = relativePath(root, resolved);
  if (relative === '..' || relative.startsWith('../') || !relative.startsWith('skills/')) {
    fail('skill component must stay within the repository skills directory');
  }
  const stat = fs.lstatSync(resolved, { throwIfNoEntry: false });
  if (!stat?.isFile() || stat.isSymbolicLink()) fail(`skill component must be a regular file: ${relative}`);
  return {
    ownerSpec: 'S-011',
    ticket: 'TK-016',
    status: 'declared',
    identity: {
      path: relative,
      sha256: sha256(resolved)
    }
  };
};

const resolveCommit = (root, sourceRef) => {
  try {
    return execFileSync('git', ['-C', root, 'rev-parse', '--verify', `${sourceRef}^{commit}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    }).trim();
  } catch {
    fail(`source ref does not resolve to a commit: ${sourceRef}`);
  }
};

const trackedPaths = (root) => new Set(execFileSync('git', ['-C', root, 'ls-files', '-z'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe']
}).split('\0').filter(Boolean));

const harnessVersion = (root) => {
  const blueprint = fs.readFileSync(path.join(root, 'BLUEPRINT.md'), 'utf8');
  const match = blueprint.match(/^\*\*Harness version:\*\*\s+(.+)$/m);
  if (!match) fail('BLUEPRINT.md must declare the harness version');
  return match[1].trim();
};

const main = () => {
  const options = parseArgs(process.argv.slice(2));
  const root = fs.realpathSync(options.root);
  const tracked = trackedPaths(root);
  const files = [...rootFiles];
  for (const relative of rootFiles) {
    if (!tracked.has(relative)) fail(`shipped root file must be tracked: ${relative}`);
  }
  for (const directory of packageDirectories) collectDirectory(root, directory, files, tracked);
  const uniqueFiles = [...new Set(files)].sort();
  if (uniqueFiles.length !== files.length) fail('shipped package paths must be unique');
  for (const relative of uniqueFiles) {
    const stat = fs.lstatSync(path.join(root, relative));
    if (!stat.isFile() || stat.isSymbolicLink()) fail(`shipped path must be a regular file: ${relative}`);
  }

  const manifest = {
    schemaVersion: 'release-manifest-v1',
    harnessVersion: harnessVersion(root),
    source: {
      ref: options.sourceRef,
      sha: resolveCommit(root, options.sourceRef)
    },
    license: {
      spdx: 'MIT',
      path: 'LICENSE',
      sha256: sha256(path.join(root, 'LICENSE'))
    },
    skillComponent: componentIdentity(root, options.skillComponent),
    verificationCommands,
    files: uniqueFiles.map((relative) => ({
      path: relative,
      sha256: sha256(path.join(root, relative))
    }))
  };
  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
};

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
