#!/usr/bin/env node
// Fast, offline checks of exactly the staged bytes; never run the full suite.
import { spawnSync } from 'node:child_process';

function git(...args) {
  const result = spawnSync('git', args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (result.error) throw result.error;
  return result;
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
    const staged = git('show', `:${file}`);
    if (staged.status !== 0) throw new Error(`Cannot read staged ${file}: ${staged.stderr.trim()}`);
    const mode = /\.cjs$/i.test(file) ? 'commonjs' : 'module';
    const syntax = spawnSync(process.execPath, ['--check', `--input-type=${mode}`], { input: staged.stdout, encoding: 'utf8' });
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
