#!/usr/bin/env node
// Fast, offline checks of exactly the staged bytes; never run the full suite.
import { spawnSync } from 'node:child_process';
import path from 'node:path';

function git(...args) {
  const result = spawnSync('git', args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (result.error) throw result.error;
  return result;
}


// Node gives .mjs/.cjs explicit modes. For .js, use the nearest package
// scope from the index. Ambiguous source is checked as CommonJS first,
// then as a module, matching Node's syntax-detection order without executing.
const packageTypes = new Map();
function javascriptMode(file) {
  if (file.endsWith('.mjs')) return 'module';
  if (file.endsWith('.cjs')) return 'commonjs';
  let directory = path.posix.dirname(file);
  while (path.posix.basename(directory) !== 'node_modules') {
    if (packageTypes.has(directory)) return packageTypes.get(directory);
    const packageFile = directory === '.' ? 'package.json' : `${directory}/package.json`;
    const index = git('ls-files', '--stage', '-z', '--', `:(literal)${packageFile}`);
    if (index.status !== 0) throw new Error(`Cannot read staged package scope for ${file}: ${index.stderr.trim()}`);
    if (index.stdout) {
      if (!/^(?:100644|100755) [0-9a-f]+ 0\t/.test(index.stdout)) throw new Error(`Unsupported staged package scope: ${packageFile}`);
      const staged = git('show', `:${packageFile}`);
      if (staged.status !== 0) throw new Error(`Cannot read staged ${packageFile}: ${staged.stderr.trim()}`);
      let metadata;
      try { metadata = JSON.parse(staged.stdout); }
      catch { throw new Error(`Invalid staged package metadata: ${packageFile}`); }
      const mode = ['module', 'commonjs'].includes(metadata?.type) ? metadata.type : null;
      packageTypes.set(directory, mode);
      return mode;
    }
    if (directory === '.') break;
    directory = path.posix.dirname(directory);
  }
  return null;
}

try {
  const whitespace = git('diff', '--cached', '--check');
  if (whitespace.status !== 0) {
    process.stderr.write(whitespace.stdout + whitespace.stderr);
    process.exit(1);
  }
  const changed = git('diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z');
  if (changed.status !== 0) throw new Error(changed.stderr.trim());
  let checked = 0;
  for (const file of changed.stdout.split('\0').filter(Boolean)) {
    if (!/\.(?:mjs|cjs|js)$/i.test(file)) continue;
    const index = git('ls-files', '--stage', '-z', '--', `:(literal)${file}`);
    if (index.status !== 0) throw new Error(`Cannot read index mode for ${file}: ${index.stderr.trim()}`);
    // Symlink blobs contain the target path, not script source. Submodules
    // likewise contain no ordinary file bytes to syntax-check.
    if (!/^(?:100644|100755) [0-9a-f]+ 0\t/.test(index.stdout)) continue;
    const staged = git('show', `:${file}`);
    if (staged.status !== 0) throw new Error(`Cannot read staged ${file}: ${staged.stderr.trim()}`);
    const mode = javascriptMode(file);
    const check = type => spawnSync(process.execPath, ['--check', `--input-type=${type}`], { input: staged.stdout, encoding: 'utf8' });
    let syntax = check(mode ?? 'commonjs');
    if (!mode && !syntax.error && syntax.status !== 0) syntax = check('module');
    if (syntax.error || syntax.status !== 0) {
      process.stderr.write(`Workbench pre-commit: staged syntax failed in ${file}\n${syntax.stderr || syntax.error?.message || ''}`);
      process.exit(1);
    }
    checked += 1;
  }
  console.log(`Workbench pre-commit: staged whitespace and ${checked} JavaScript syntax check(s) passed.`);
} catch (error) {
  console.error(`Workbench pre-commit: ${error.message}`);
  process.exitCode = 1;
}
