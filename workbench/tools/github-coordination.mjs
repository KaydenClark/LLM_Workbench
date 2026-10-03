#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { isWorkbenchId } from './visible-ids.mjs';
import { isMainModule } from './workbench-paths.mjs';

function refuse(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

function git(root, args, code, message) {
  // Discover the selected root's own .git, including linked worktrees, without
  // inheriting repository, object-store or configuration selectors from callers.
  const environment = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));
  // A replacement object must not change what an immutable source SHA means.
  const result = spawnSync('git', ['--no-lazy-fetch', '--no-optional-locks', '-C', root, ...args], {
    encoding: 'utf8', timeout: 10000, maxBuffer: 2 * 1024 * 1024,
    env: { ...environment, GIT_NO_REPLACE_OBJECTS: '1', GIT_TERMINAL_PROMPT: '0' }
  });
  if (result.status !== 0) refuse(code, message);
  return result.stdout;
}

export function inspectGithubCoordination(project, revision) {
  if (typeof revision !== 'string' || !/^[0-9a-f]{40}$/.test(revision)) {
    refuse('invalid-source-revision', 'An exact lowercase 40-character commit SHA is required.');
  }
  let root;
  try { root = fs.realpathSync(path.resolve(project)); }
  catch { refuse('invalid-project-root', 'The project must be an existing Git checkout root.'); }
  const top = git(root, ['rev-parse', '--show-toplevel'], 'invalid-project-root', 'The project must be a Git checkout root.').trim();
  if (fs.realpathSync(top) !== root) refuse('invalid-project-root', 'The project must name the Git checkout root.');
  const type = git(root, ['cat-file', '-t', revision], 'invalid-source-revision', 'The source commit is unavailable.').trim();
  if (type !== 'commit') refuse('invalid-source-revision', 'The source revision must be a commit object.');
  const file = 'workbench/manifest.json';
  const entry = git(root, ['ls-tree', revision, '--', file], 'invalid-source-manifest', 'The source manifest is unavailable.');
  if (!/^100(?:644|755) blob [0-9a-f]{40}\tworkbench\/manifest\.json\n$/.test(entry)) {
    refuse('invalid-source-manifest', 'The source manifest must be an ordinary tracked blob.');
  }
  let manifest;
  try {
    manifest = JSON.parse(git(root, ['show', `${revision}:${file}`], 'invalid-source-manifest', 'The source manifest is unreadable.'));
  } catch { refuse('invalid-source-manifest', 'The source manifest must contain valid JSON.'); }
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest) || manifest.schemaVersion !== 2) {
    refuse('invalid-source-manifest', 'The inspector requires a schema-2 room manifest.');
  }
  if (!isWorkbenchId(manifest.workbenchId)) refuse('invalid-room-identity', 'The source must declare a valid Workbench room identity.');
  if (!Object.hasOwn(manifest, 'githubCoordination')) {
    refuse('coordination-unconfigured', 'The source has no explicit GitHub coordination binding.');
  }
  const binding = manifest.githubCoordination;
  if (!binding || typeof binding !== 'object' || Array.isArray(binding) || binding.schemaVersion !== 1
      || Object.keys(binding).some(key => !['schemaVersion', 'repository'].includes(key))
      || typeof binding.repository !== 'string'
      || !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?\/[A-Za-z0-9_.-]{1,100}$/.test(binding.repository)
      || ['.', '..'].includes(binding.repository.split('/')[1])) {
    // Do not echo a malformed declaration; it may contain private configuration.
    refuse('invalid-coordination-binding', 'Binding must contain only schemaVersion 1 and a portable owner/repository name.');
  }
  return { status: 'resolved', workbenchId: manifest.workbenchId, repository: binding.repository,
    source: { commit: revision, path: file }, access: 'unverified' };
}

function argumentsFor(argv) {
  if (argv[0] !== 'inspect') refuse('invalid-invocation', 'Usage: github-coordination.mjs inspect --project ROOT --revision COMMIT_SHA');
  const options = {};
  for (let index = 1; index < argv.length; index += 2) {
    const flag = argv[index], value = argv[index + 1];
    if (!['--project', '--revision'].includes(flag) || Object.hasOwn(options, flag) || !value || value.startsWith('--')) {
      refuse('invalid-invocation', 'Specify --project and --revision exactly once, with values.');
    }
    options[flag] = value;
  }
  if (!options['--project'] || !options['--revision']) refuse('invalid-invocation', 'Both --project and --revision are required.');
  return options;
}

if (isMainModule(import.meta.url)) {
  try {
    const options = argumentsFor(process.argv.slice(2));
    console.log(JSON.stringify(inspectGithubCoordination(options['--project'], options['--revision']), null, 2));
  } catch (error) {
    console.log(JSON.stringify({ status: 'refused', error: { code: error.code ?? 'inspection-failed', message: error.code ? error.message : 'Binding inspection failed.' } }, null, 2));
    process.exitCode = 1;
  }
}
