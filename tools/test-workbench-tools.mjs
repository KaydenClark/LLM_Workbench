#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { RECEIPT_NAME, RUNTIME_TOOLS, sourceIdentity } from './workbench-tools.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
const installer = path.join(root, 'tools', 'workbench-tools.mjs');
const layout = path.join(root, 'workbench', 'tools', 'workbench-layout.mjs');

function fixture(prefix = 'workbench-tools-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function run(tool, ...args) {
  const result = spawnSync(process.execPath, [tool, ...args], { cwd: root, encoding: 'utf8' });
  return { ...result, report: result.stdout ? JSON.parse(result.stdout) : null };
}

function project() {
  const dir = fixture();
  assert.equal(run(layout, 'init', '--project', dir, '--provenance', 'genesis', '--version', VERSION).status, 0);
  fs.mkdirSync(path.join(dir, 'tools'));
  fs.writeFileSync(path.join(dir, 'tools', 'app.mjs'), 'export const app = true;\n');
  fs.writeFileSync(path.join(dir, 'BLUEPRINT.md'), '# Blueprint\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
  fs.writeFileSync(path.join(dir, 'TASKBOARD.md'), '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
  return dir;
}

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function selectedSnapshot(rootDir, paths) {
  return paths.map((relative) => `${relative}:${hash(fs.readFileSync(path.join(rootDir, relative)))}`).join('\n');
}

test('source identity requires a clean Git checkout with a concrete origin and commit', () => {
  const dir = fixture('workbench-source-identity-');
  try {
    fs.mkdirSync(path.join(dir, 'workbench', 'tools'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'workbench', 'manifest.json'), `${JSON.stringify({ workbenchVersion: VERSION })}\n`);
    fs.writeFileSync(path.join(dir, 'workbench', 'tools', 'proof.mjs'), 'export const proof = true;\n');
    assert.throws(() => sourceIdentity({ root: dir, managedPaths: ['workbench/tools'] }), /Git checkout/);
    assert.equal(spawnSync('git', ['init', '-q'], { cwd: dir }).status, 0);
    assert.equal(spawnSync('git', ['add', '.'], { cwd: dir }).status, 0);
    assert.equal(spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'source fixture'], { cwd: dir }).status, 0);
    assert.throws(() => sourceIdentity({ root: dir, managedPaths: ['workbench/tools'] }), /origin/);
    assert.equal(spawnSync('git', ['remote', 'add', 'origin', 'https://example.invalid/workbench.git'], { cwd: dir }).status, 0);
    const identity = sourceIdentity({ root: dir, managedPaths: ['workbench/tools'] });
    assert.match(identity.commit, /^[0-9a-f]{40}$/);
    assert.equal(identity.repository, 'https://example.invalid/workbench.git');
    assert.equal(identity.release, VERSION);
    fs.writeFileSync(path.join(dir, 'workbench', 'tools', 'proof.mjs'), 'export const proof = false;\n');
    assert.throws(() => sourceIdentity({ root: dir, managedPaths: ['workbench/tools'] }), /uncommitted/);
    fs.writeFileSync(path.join(dir, 'workbench', 'tools', 'proof.mjs'), 'export const proof = true;\n');
    fs.writeFileSync(path.join(dir, 'workbench', 'manifest.json'), `${JSON.stringify({ workbenchVersion: 'v9.9.9' })}\n`);
    assert.throws(() => sourceIdentity({ root: dir, managedPaths: ['workbench/tools'] }), /uncommitted/,
      'a dirty release manifest cannot be paired with the previous commit');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('source identity requires the requested root to be the Git checkout root', () => {
  const dir = fixture('workbench-source-root-');
  const nested = path.join(dir, 'nested-release');
  try {
    fs.mkdirSync(path.join(nested, 'workbench', 'tools'), { recursive: true });
    fs.writeFileSync(path.join(nested, 'workbench', 'manifest.json'), `${JSON.stringify({ workbenchVersion: VERSION })}\n`);
    fs.writeFileSync(path.join(nested, 'workbench', 'tools', 'proof.mjs'), 'export const proof = true;\n');
    assert.equal(spawnSync('git', ['init', '-q'], { cwd: dir }).status, 0);
    assert.equal(spawnSync('git', ['remote', 'add', 'origin', 'https://example.invalid/workbench.git'], { cwd: dir }).status, 0);
    assert.equal(spawnSync('git', ['add', '.'], { cwd: dir }).status, 0);
    assert.equal(spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'nested source fixture'], { cwd: dir }).status, 0);
    assert.throws(() => sourceIdentity({ root: nested, managedPaths: ['workbench/tools'] }), /checkout root/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('the product tools lane is the canonical runtime source and holds exactly the runtime tools', () => {
  const lane = fs.readdirSync(path.join(root, 'workbench', 'tools')).filter((name) => name.endsWith('.mjs')).sort();
  assert.deepEqual(lane, [...RUNTIME_TOOLS].sort());
  assert.equal(fs.existsSync(path.join(root, 'workbench', 'tools', RECEIPT_NAME)), false, 'the source lane carries no receipt');
  assert.equal(run(installer, 'verify', '--project', root).report.status, 'source');
});

test('install writes receipt-backed copies with hashes, source identity, and non-executable permissions, leaving root tools untouched', () => {
  const dir = project();
  try {
    const installed = run(installer, 'install', '--project', dir);
    assert.equal(installed.status, 0, installed.stdout);
    assert.equal(installed.report.status, 'installed');
    const receipt = JSON.parse(fs.readFileSync(path.join(dir, 'workbench', 'tools', RECEIPT_NAME), 'utf8'));
    assert.equal(receipt.schemaVersion, 1);
    assert.equal(receipt.source.release, VERSION);
    assert.match(receipt.source.commit, /^[0-9a-f]{40}$/);
    assert.deepEqual(Object.keys(receipt.files).sort(), [...RUNTIME_TOOLS].sort());
    for (const tool of RUNTIME_TOOLS) {
      const target = path.join(dir, 'workbench', 'tools', tool);
      const stat = fs.lstatSync(target);
      assert.equal(stat.isSymbolicLink(), false);
      assert.equal(stat.mode & 0o777, 0o644, `${tool} must be installed with mode 0644`);
      assert.equal(fs.readFileSync(target, 'utf8'), fs.readFileSync(path.join(root, 'workbench', 'tools', tool), 'utf8'));
    }
    assert.equal(fs.readFileSync(path.join(dir, 'tools', 'app.mjs'), 'utf8'), 'export const app = true;\n', 'an application root tools directory is never touched');
    assert.equal(run(installer, 'verify', '--project', dir).report.status, 'valid');
    assert.equal(run(installer, 'install', '--project', dir).report.error.code, 'tools-installed');
    const installedTool = path.join(dir, 'workbench', 'tools', 'spec-workbench.mjs');
    const rendered = spawnSync(process.execPath, [installedTool, 'render'], { cwd: dir, encoding: 'utf8' });
    assert.equal(rendered.status, 0, `${rendered.stdout}${rendered.stderr}`);
    const installedSpecTool = spawnSync(process.execPath, [installedTool, 'doctor'], { cwd: dir, encoding: 'utf8' });
    assert.equal(installedSpecTool.status, 0, `${installedSpecTool.stdout}${installedSpecTool.stderr}`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('verify reports drift, update requires explicit authorization, backs up, and rollback restores the backup', () => {
  const dir = project();
  const home = fixture('workbench-tools-home-');
  try {
    assert.equal(run(installer, 'install', '--project', dir).report.status, 'installed');
    const target = path.join(dir, 'workbench', 'tools', 'markdown-table.mjs');
    fs.writeFileSync(target, '// locally edited\n');
    const drift = run(installer, 'verify', '--project', dir);
    assert.equal(drift.report.error.code, 'tools-receipt-drift');
    assert.deepEqual(drift.report.error.drift.map((entry) => [entry.tool, entry.reason, entry.state]), [['markdown-table.mjs', 'hash', 'runtime-modified']]);

    const refused = run(installer, 'update', '--project', dir, '--home', home);
    assert.equal(refused.report.error.code, 'explicit-update-required');
    assert.equal(fs.readFileSync(target, 'utf8'), '// locally edited\n');

    const updated = run(installer, 'update', '--project', dir, '--home', home, '--explicit-update');
    assert.equal(updated.status, 0, updated.stdout);
    assert.equal(updated.report.status, 'updated');
    assert.deepEqual(updated.report.changed, ['markdown-table.mjs']);
    assert.equal(fs.readFileSync(target, 'utf8'), fs.readFileSync(path.join(root, 'workbench', 'tools', 'markdown-table.mjs'), 'utf8'));
    assert.equal(fs.readFileSync(path.join(updated.report.backup, 'markdown-table.mjs'), 'utf8'), '// locally edited\n');
    assert.ok(updated.report.backup.startsWith(home), 'backups live under the user home');
    assert.equal(run(installer, 'verify', '--project', dir).report.status, 'valid');
    assert.equal(run(installer, 'update', '--project', dir, '--home', home, '--explicit-update').report.status, 'current');

    const rolled = run(installer, 'rollback', '--project', dir, '--backup', updated.report.backup);
    assert.equal(rolled.status, 0, rolled.stdout);
    assert.equal(fs.readFileSync(target, 'utf8'), '// locally edited\n', 'rollback restores the backed-up file');
    const receipt = JSON.parse(fs.readFileSync(path.join(dir, 'workbench', 'tools', RECEIPT_NAME), 'utf8'));
    assert.equal(receipt.rolledBackFrom, updated.report.backup);
    assert.deepEqual(rolled.report.restored, ['markdown-table.mjs']);
    assert.equal(run(installer, 'verify', '--project', dir).report.error.code, 'tools-receipt-drift', 'rollback restores the pre-update drift honestly');
    assert.equal(run(installer, 'rollback', '--project', dir, '--backup', path.join(home, 'nope')).report.error.code, 'invalid-backup');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

// Reporting drift is not enough to act on: a receipt that has gone stale and a
// runtime somebody edited both read as `tools-receipt-drift`, and they take
// opposite remedies. The comparison that separates them is installed bytes
// against the release source, not the receipt against the release source.
test('a drift result separates a stale receipt from a modified runtime and names each remedy', () => {
  const dir = project();
  try {
    assert.equal(run(installer, 'install', '--project', dir).report.status, 'installed');
    const lane = path.join(dir, 'workbench', 'tools');
    const managed = path.join(lane, 'markdown-table.mjs');
    const receiptPath = path.join(lane, RECEIPT_NAME);
    const pristineReceipt = fs.readFileSync(receiptPath, 'utf8');
    const pristineTool = fs.readFileSync(managed);

    // A stale receipt: the installed bytes are still byte-identical to the release.
    const receipt = JSON.parse(pristineReceipt);
    receipt.files['markdown-table.mjs'] = hash('// an earlier release\n');
    fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
    const stale = run(installer, 'verify', '--project', dir);
    assert.equal(stale.report.error.code, 'tools-receipt-drift');
    assert.deepEqual(stale.report.error.drift.map((entry) => [entry.tool, entry.reason, entry.state]),
      [['markdown-table.mjs', 'hash', 'receipt-stale']]);
    assert.match(stale.report.error.drift[0].remedy, /update --explicit-update/,
      'a stale receipt names the command that refreshes it');
    assert.deepEqual(stale.report.updateAvailable, ['markdown-table.mjs'],
      'the receipt-versus-source comparison rides the drift path too, not only the valid path');

    // A modified runtime: the installed bytes match neither the receipt nor the release.
    fs.appendFileSync(managed, '// locally edited\n');
    const modified = run(installer, 'verify', '--project', dir);
    assert.deepEqual(modified.report.error.drift.map((entry) => [entry.tool, entry.reason, entry.state]),
      [['markdown-table.mjs', 'hash', 'runtime-modified']]);
    assert.match(modified.report.error.drift[0].remedy, /rollback/,
      'a modified runtime is restored, not blessed by refreshing the receipt');

    // Mode drift alone is neither: the bytes are the release's and the receipt's.
    fs.writeFileSync(managed, pristineTool);
    fs.writeFileSync(receiptPath, pristineReceipt);
    fs.chmodSync(managed, 0o755);
    const mode = run(installer, 'verify', '--project', dir);
    assert.deepEqual(mode.report.error.drift.map((entry) => [entry.tool, entry.reason, entry.state]),
      [['markdown-table.mjs', 'executable-bit', 'runtime-authentic']]);
    assert.match(mode.report.error.drift[0].remedy, /0644/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('v3.1.1 maintenance preserves project truth and historical provenance while managed tools update and roll back', () => {
  const dir = project();
  const home = fixture('workbench-tools-home-');
  const protectedPaths = [
    'AGENTS.md', 'BLUEPRINT.md', 'TASKBOARD.md', 'README.md', 'src/app.mjs',
    'workbench/specs/S-201-active/SPEC.md',
    'workbench/specs/S-200-complete/evidence.md',
    'workbench/wiki/MEMORY.md'
  ];
  try {
    for (const [relative, content] of [
      ['AGENTS.md', '# Project rules\n'], ['README.md', '# Product\n'], ['src/app.mjs', 'export const app = true;\n'],
      ['workbench/specs/S-201-active/SPEC.md', '# Active project work\n'],
      ['workbench/specs/S-200-complete/evidence.md', '# Completed evidence\n'],
      ['workbench/wiki/MEMORY.md', '# Durable project memory\n']
    ]) {
      fs.mkdirSync(path.dirname(path.join(dir, relative)), { recursive: true });
      fs.writeFileSync(path.join(dir, relative), content);
    }
    assert.equal(run(installer, 'install', '--project', dir).report.status, 'installed');

    const manifestPath = path.join(dir, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.workbenchVersion = 'v3.1.1';
    manifest.provenance.source.release = 'v3.1.1';
    manifest.provenance.source.commit = '1'.repeat(40);
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    const lane = path.join(dir, 'workbench', 'tools');
    const receiptPath = path.join(lane, RECEIPT_NAME);
    const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
    const oldTool = '// managed v3.1.1 markdown table\n';
    fs.writeFileSync(path.join(lane, 'markdown-table.mjs'), oldTool);
    receipt.source = { ...receipt.source, release: 'v3.1.1', commit: '1'.repeat(40) };
    receipt.files['markdown-table.mjs'] = hash(oldTool);
    fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
    const before = selectedSnapshot(dir, protectedPaths);
    const historicalSource = JSON.parse(fs.readFileSync(manifestPath, 'utf8')).provenance.source;

    const updated = run(installer, 'update', '--project', dir, '--home', home, '--explicit-update');
    assert.equal(updated.status, 0, updated.stdout);
    assert.deepEqual(updated.report.changed, ['markdown-table.mjs']);
    assert.equal(selectedSnapshot(dir, protectedPaths), before, 'controls, code, active work, completed evidence, and Wiki content survive byte-for-byte');
    assert.deepEqual(JSON.parse(fs.readFileSync(manifestPath, 'utf8')).provenance.source, historicalSource, 'installed-component maintenance never rewrites historical room provenance');
    assert.equal(updated.report.receipt.source.release, VERSION);
    assert.match(updated.report.receipt.source.commit, /^[0-9a-f]{40}$/);
    assert.equal(fs.readFileSync(path.join(updated.report.backup, 'markdown-table.mjs'), 'utf8'), oldTool);

    const rolled = run(installer, 'rollback', '--project', dir, '--backup', updated.report.backup);
    assert.equal(rolled.status, 0, rolled.stdout);
    assert.equal(fs.readFileSync(path.join(lane, 'markdown-table.mjs'), 'utf8'), oldTool);
    assert.equal(JSON.parse(fs.readFileSync(receiptPath, 'utf8')).source.release, 'v3.1.1');
    assert.equal(selectedSnapshot(dir, protectedPaths), before, 'rollback also leaves project-owned truth untouched');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('install refuses an unreceipted collision and a symlinked lane before mutating anything', () => {
  const dir = project();
  const outside = fixture('workbench-tools-outside-');
  try {
    fs.writeFileSync(path.join(dir, 'workbench', 'tools', 'spec-workbench.mjs'), '// foreign\n');
    const collision = run(installer, 'install', '--project', dir);
    assert.equal(collision.report.error.code, 'tools-collision');
    assert.equal(fs.existsSync(path.join(dir, 'workbench', 'tools', 'markdown-table.mjs')), false);
    fs.rmSync(path.join(dir, 'workbench', 'tools'), { recursive: true, force: true });
    fs.symlinkSync(outside, path.join(dir, 'workbench', 'tools'));
    assert.equal(run(installer, 'install', '--project', dir).report.error.code, 'unsafe-lane');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
});

test('no active root control or template names a root tools path for a runtime tool', () => {
  const runtimePattern = new RegExp(`(?<![\\w/])tools/(${RUNTIME_TOOLS.map((tool) => tool.replace('.', '\\.')).join('|')})`);
  const files = ['AGENTS.md', 'BLUEPRINT.md', 'RUNBOOK.md', 'TASKBOARD.md', 'README.md', 'LEXICON.md']
    .map((name) => path.join(root, name))
    .concat(walk(path.join(root, 'templates')), walk(path.join(root, 'skills')));
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const hit = content.match(runtimePattern);
    assert.equal(hit, null, `${path.relative(root, file)} names a root tools path for runtime tool ${hit?.[1]}`);
  }
});

test('runtime tools import safely when argv has no file and still run their main when invoked directly', () => {
  for (const tool of ['spec-workbench.mjs', 'workbench-layout.mjs']) {
    const imported = spawnSync(process.execPath, ['--input-type=module', '-'], {
      cwd: root,
      encoding: 'utf8',
      input: `await import(${JSON.stringify(path.join(root, 'workbench', 'tools', tool))}); console.log('imported ok');`
    });
    assert.equal(imported.status, 0, `${tool}: ${imported.stderr}`);
    assert.match(imported.stdout, /imported ok/);
  }
});

function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, files);
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(target);
  }
  return files;
}

for (const operation of ['update', 'rollback']) {
  for (const collision of ['file', 'lane', 'ancestor']) {
    test(`${operation} refuses a symlinked ${collision} before any writes`, () => {
      const dir = project(); const home = fixture(); const outside = fixture();
      try {
        assert.equal(run(installer, 'install', '--project', dir).status, 0);
        const lane = path.join(dir, 'workbench', 'tools');
        const target = path.join(lane, 'adr.mjs');
        fs.writeFileSync(target, '// pre-update local version\n');
        const updated = run(installer, 'update', '--project', dir, '--home', home, '--explicit-update');
        assert.equal(updated.status, 0, updated.stdout);
        const beforeReceipt = fs.readFileSync(path.join(lane, RECEIPT_NAME), 'utf8');
        const beforeBackups = fs.readdirSync(home);
        let external;
        if (collision === 'file') {
          external = path.join(outside, 'unrelated.txt');
          fs.writeFileSync(external, 'keep this external data\n');
          fs.unlinkSync(target); fs.symlinkSync(external, target);
        } else {
          const replaced = collision === 'lane' ? lane : path.join(dir, 'workbench');
          const moved = path.join(outside, 'moved');
          fs.renameSync(replaced, moved); fs.symlinkSync(moved, replaced);
          external = path.join(moved, ...(collision === 'lane' ? [] : ['tools']), 'adr.mjs');
          fs.writeFileSync(external, 'keep this external data\n');
        }
        const result = operation === 'update'
          ? run(installer, 'update', '--project', dir, '--home', home, '--explicit-update')
          : run(installer, 'rollback', '--project', dir, '--backup', updated.report.backup);
        assert.notEqual(result.status, 0, result.stdout);
        assert.equal(result.report.status, 'blocked');
        assert.equal(fs.readFileSync(external, 'utf8'), 'keep this external data\n');
        assert.equal(fs.readFileSync(path.join(lane, RECEIPT_NAME), 'utf8'), beforeReceipt);
        assert.deepEqual(fs.readdirSync(home), beforeBackups, 'refusal must not create backups');
      } finally {
        for (const p of [dir, home, outside]) fs.rmSync(p, { recursive: true, force: true });
      }
    });
  }
}
