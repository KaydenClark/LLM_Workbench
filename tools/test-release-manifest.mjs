#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const manifestTool = path.join(repoRoot, 'tools/release-manifest.mjs');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-release-manifest-'));
const firstCloneRoot = path.join(tempRoot, 'first-clone');
const secondCloneRoot = path.join(tempRoot, 'second-clone');

const run = (root, extra = []) => JSON.parse(execFileSync('node', [
  manifestTool,
  '--root', root,
  '--source-ref', 'HEAD',
  ...extra
], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));

const cleanClone = (destination) => execFileSync('git', [
  'clone', '--no-local', '--quiet', repoRoot, destination
], { encoding: 'utf8' });

try {
  assert.equal(fs.existsSync(manifestTool), true,
    'release-manifest must provide the deterministic release-manifest seam');

  const current = run(repoRoot);
  assert.equal(current.schemaVersion, 'release-manifest-v1');
  assert.equal(current.source.ref, 'HEAD');
  assert.match(current.source.sha, /^[0-9a-f]{40}$/);
  assert.equal(current.license.spdx, 'MIT');
  assert.deepEqual(current.skillComponent, {
    ownerSpec: 'S-011',
    ticket: 'TK-016',
    status: 'pending',
    identity: null
  });
  assert.ok(current.files.some((file) => file.path === 'templates/AGENTS.md'));
  assert.ok(current.files.some((file) => file.path === 'tools/spec-workbench.mjs'));
  assert.ok(current.files.every((file) => !file.path.startsWith('skills/')),
    'the non-skill package must not absorb S-011-owned skill contents');

  cleanClone(firstCloneRoot);
  cleanClone(secondCloneRoot);
  assert.deepEqual(run(firstCloneRoot), run(secondCloneRoot),
    'clean clones of the same commit must emit byte-for-byte equivalent manifests');

  fs.writeFileSync(path.join(firstCloneRoot, 'private.env'), 'TOKEN=not-for-release\n');
  fs.mkdirSync(path.join(firstCloneRoot, 'logs'), { recursive: true });
  fs.writeFileSync(path.join(firstCloneRoot, 'logs/run.log'), 'not-for-release\n');
  fs.symlinkSync('/tmp', path.join(firstCloneRoot, 'tools/local-release-link'));
  const withPrivateFiles = run(firstCloneRoot);
  assert.ok(withPrivateFiles.files.every((file) => !/^(private\.env|logs\/|tools\/local-release-link)/.test(file.path)),
    'private, log, and local symlink paths must be absent by construction');

  const templatePath = path.join(firstCloneRoot, 'templates/AGENTS.md');
  fs.appendFileSync(templatePath, '\n<!-- release-manifest fixture -->\n');
  const changedFile = run(firstCloneRoot);
  assert.notDeepEqual(changedFile.files, withPrivateFiles.files,
    'a shipped non-skill file must change the manifest');

  const componentPath = path.join(firstCloneRoot, 'skills/component-reference.json');
  fs.writeFileSync(componentPath, '{"identity":"first"}\n');
  const firstComponent = run(firstCloneRoot, ['--skill-component', 'skills/component-reference.json']);
  fs.writeFileSync(componentPath, '{"identity":"second"}\n');
  const secondComponent = run(firstCloneRoot, ['--skill-component', 'skills/component-reference.json']);
  assert.notDeepEqual(secondComponent.skillComponent, firstComponent.skillComponent,
    'a declared S-011 component identity must change the envelope without defining its schema');
  assert.throws(() => run(firstCloneRoot, ['--skill-component', '../private.env']));

  console.log('ok - release manifest self-test passed');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
