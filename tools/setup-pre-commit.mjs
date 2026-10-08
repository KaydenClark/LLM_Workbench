#!/usr/bin/env node
// Install the reviewed hook snapshot into this repository's common Git dir.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
let update = false;
let target = process.cwd();
for (let index = 0; index < args.length; index += 1) {
  if (args[index] === '--update') update = true;
  else if (args[index] === '--repo' && args[index + 1] && !args[index + 1].startsWith('--')) target = args[++index];
  else {
    console.error('Usage: node tools/setup-pre-commit.mjs [--repo LLM_WORKBENCH_PATH] [--update]');
    process.exit(1);
  }
}
const repo = path.resolve(target);

function git(...values) {
  const result = spawnSync('git', ['-C', repo, ...values], { encoding: 'utf8' });
  if (result.error) throw result.error;
  return result;
}

try {
  const root = git('rev-parse', '--show-toplevel');
  if (root.status !== 0) throw new Error('The target is not a Git worktree.');
  const remote = git('remote', 'get-url', 'origin');
  if (remote.status !== 0 || !/^(?:https:\/\/github\.com\/|git@github\.com:)KaydenClark\/LLM_Workbench(?:\.git)?\/?$/i.test(remote.stdout.trim())) {
    throw new Error('Hook installation is scoped to KaydenClark/LLM_Workbench; this target is another repository.');
  }
  const common = git('rev-parse', '--path-format=absolute', '--git-common-dir');
  if (common.status !== 0) throw new Error(common.stderr.trim());
  const commonDir = fs.realpathSync(common.stdout.trim());
  const hookDir = path.join(commonDir, 'workbench-hooks');
  const configured = git('config', '--get', 'core.hooksPath');
  const current = configured.status === 0 ? configured.stdout.trim() : null;
  if (current && current !== hookDir) throw new Error('An existing core.hooksPath is configured; preserve it and resolve the collision first.');
  const native = path.join(commonDir, 'hooks', 'pre-commit');
  try {
    fs.lstatSync(native);
    throw new Error('An existing native pre-commit hook is present; preserve it and resolve the collision first.');
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const names = ['pre-commit', 'pre-commit.mjs'];
  const contents = new Map(names.map(name => [name, fs.readFileSync(path.join(sourceRoot, '.githooks', name))]));
  if (fs.existsSync(hookDir)) {
    if (!fs.lstatSync(hookDir).isDirectory()) throw new Error('The managed hook path is not an ordinary directory.');
    const existing = fs.readdirSync(hookDir).sort();
    if (JSON.stringify(existing) !== JSON.stringify([...names].sort()) || names.some(name => !fs.lstatSync(path.join(hookDir, name)).isFile())) {
      throw new Error('The managed hook directory contains unknown or linked files; preserve it.');
    }
    const different = names.some(name => !fs.readFileSync(path.join(hookDir, name)).equals(contents.get(name)));
    if (different && (!current || !update)) throw new Error('The hook snapshot differs; use --update only for this already-configured Workbench hook.');
  } else fs.mkdirSync(hookDir);
  for (const name of names) {
    const target = path.join(hookDir, name);
    fs.writeFileSync(target, contents.get(name), { mode: name === 'pre-commit' ? 0o755 : 0o644 });
    if (name === 'pre-commit') fs.chmodSync(target, 0o755);
  }
  const set = git('config', '--local', 'core.hooksPath', hookDir);
  if (set.status !== 0) throw new Error(set.stderr.trim());
  console.log(JSON.stringify({ status: 'installed', repository: root.stdout.trim(), scope: 'repository-local; shared by its linked worktrees', hookDir, sourceCommit: spawnSync('git', ['-C', sourceRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim() }, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
