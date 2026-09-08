#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { REGISTER_NAME, listAdrs, newAdr, normalizeAdrs, renderRegister, validateAdrs, writeRegister } from '../workbench/tools/adr.mjs';
import { doctor, render } from '../workbench/tools/spec-workbench.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const layout = path.join(root, 'workbench', 'tools', 'workbench-layout.mjs');
const adrTool = path.join(root, 'workbench', 'tools', 'adr.mjs');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-adr-'));
  const init = spawnSync(process.execPath, [layout, 'init', '--project', dir, '--provenance', 'genesis', '--version', VERSION], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout);
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# Agents\n\n## Rules\n\nCarries the rule.\n');
  fs.writeFileSync(path.join(dir, 'BLUEPRINT.md'), '# Blueprint\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
  fs.writeFileSync(path.join(dir, 'TASKBOARD.md'), '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
  render(dir);
  return dir;
}

function adr(status, extraFront = '', body = '') {
  return `---\nstatus: ${status}\ndate: 2026-09-04\n${extraFront}---\n\n# A decision\n\nThe decision.\n\n${body}Provenance: owner decision.\n`;
}

test('a valid corpus validates, registers deterministically, and reports a stale register as attention', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench', 'docs', 'adr');
    fs.writeFileSync(path.join(collection, '0001-first.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
    const stale = validateAdrs(dir);
    assert.deepEqual(stale.map((item) => [item.code, item.severity, item.blocks]), [['stale-register', 'attention', 'none']]);
    const written = writeRegister(dir);
    assert.equal(written.count, 1);
    assert.equal(fs.readFileSync(path.join(collection, REGISTER_NAME), 'utf8'), renderRegister(listAdrs(dir)));
    assert.deepEqual(validateAdrs(dir), []);
    assert.match(fs.readFileSync(path.join(collection, REGISTER_NAME), 'utf8'), /\| \[0001\]\(0001-first\.md\) \| A decision \| accepted \| 2026-09-04 \| AGENTS\.md \|/);
    const cli = spawnSync(process.execPath, [adrTool, 'validate', '--path', dir, '--json'], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    assert.deepEqual(JSON.parse(cli.stdout), []);
    assert.equal(doctor(dir).filter((item) => item.scope === 'adr').length, 0, 'doctor carries ADR findings for schema 2 projects');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('records checked out with CRLF line endings parse, validate, and register', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench', 'docs', 'adr');
    const crlf = (value) => value.replace(/\r?\n/g, '\r\n');
    fs.writeFileSync(path.join(collection, '0001-first.md'), crlf(adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n')));
    const records = listAdrs(dir);
    assert.equal(records.length, 1);
    assert.equal(records[0].data.status, 'accepted', 'CRLF frontmatter must parse its fields');
    assert.deepEqual(records[0].data.canonicalized_in, ['AGENTS.md'], 'CRLF list items must parse without a trailing carriage return');
    assert.equal(records[0].title, 'A decision', 'the CRLF body must still yield the title');
    writeRegister(dir);
    assert.deepEqual(validateAdrs(dir), [], 'a CRLF corpus must not report invalid-adr or stale-register');
    assert.equal(doctor(dir).filter((item) => item.scope === 'adr').length, 0, 'doctor must not report CRLF records as broken');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('validation rejects unknown canonicalization targets, untracked provenance, missing frontmatter, and duplicate numbers', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench', 'docs', 'adr');
    fs.writeFileSync(path.join(collection, '0001-first.md'), adr('accepted', 'canonicalized_in:\n  - CONTRACT.md\n'));
    fs.writeFileSync(path.join(collection, '0002-second.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n', 'See the [notepad](../../sessions/grilling/topic-2026-09-04.md).\n\n'));
    fs.writeFileSync(path.join(collection, '0003-third.md'), '# No frontmatter\n');
    fs.writeFileSync(path.join(collection, '0003-clash.md'), adr('proposed'));
    fs.writeFileSync(path.join(collection, '0004-superseded.md'), adr('superseded'));
    writeRegister(dir);
    const codes = validateAdrs(dir).map((item) => `${item.code}:${item.adr ?? item.number ?? ''}`).sort();
    assert.deepEqual(codes, [
      'invalid-adr:0001-first.md',
      'invalid-adr:0003',
      'invalid-adr:0003-third.md',
      'invalid-adr:0004-superseded.md',
      'untracked-provenance:0002-second.md'
    ]);
    const findings = validateAdrs(dir);
    assert.ok(findings.every((item) => item.blocks === 'none'), 'ADR findings never block selection');
    assert.ok(findings.some((item) => item.code === 'untracked-provenance' && item.target === 'workbench/sessions/grilling/topic-2026-09-04.md'));
    const cli = spawnSync(process.execPath, [adrTool, 'validate', '--path', dir], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 1, 'error findings fail the ADR command itself');
    const doctored = doctor(dir);
    assert.ok(doctored.some((item) => item.code === 'untracked-provenance'), 'doctor reports ADR findings');
    assert.ok(!doctored.some((item) => item.blocks === 'all' || item.blocks === 'selection'), 'ADR findings do not block doctor');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('new allocates the next number as a proposed record with a canonicalization slot', () => {
  const dir = fixture();
  try {
    fs.writeFileSync(path.join(dir, 'workbench', 'docs', 'adr', '0007-gap.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
    const created = newAdr(dir, { title: 'Checkpoints are the durable session record', date: '2026-09-04' });
    assert.equal(created.number, '0008');
    assert.equal(path.basename(created.filePath), '0008-checkpoints-are-the-durable-session-record.md');
    const content = fs.readFileSync(created.filePath, 'utf8');
    assert.match(content, /^---\nstatus: proposed\ndate: 2026-09-04\ncanonicalized_in:\n  - AGENTS\.md\n---/);
    assert.match(content, /^# Checkpoints are the durable session record$/m);
    const cli = spawnSync(process.execPath, [adrTool, 'new', '--path', dir, '--title', 'Another decision'], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    assert.equal(JSON.parse(cli.stdout).number, '0009');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the product corpus validates with a current register and no error findings', () => {
  const findings = validateAdrs(root);
  assert.deepEqual(findings.filter((item) => item.severity === 'error'), []);
  assert.deepEqual(findings.filter((item) => item.code === 'stale-register'), [], 'the committed register must be current');
  assert.ok(listAdrs(root).length >= 19);
});

for (const command of ['register', 'new']) test(`ADR ${command} refuses linked collection before writing`, () => {
  const dir = fixture(); const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'adr-outside-'));
  try {
    const collection = path.join(dir, 'workbench', 'docs', 'adr');
    fs.rmSync(collection, { recursive: true }); fs.symlinkSync(outside, collection);
    fs.writeFileSync(path.join(outside, 'REGISTER.md'), 'keep original\n');
    const result = spawnSync(process.execPath, [adrTool, command, '--path', dir, '--title', 'Example'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.equal(fs.readFileSync(path.join(outside, 'REGISTER.md'), 'utf8'), 'keep original\n');
    assert.deepEqual(fs.readdirSync(outside), ['REGISTER.md']);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); fs.rmSync(outside, { recursive: true, force: true }); }
});

test('register never follows a pre-existing predictable temporary symlink', () => {
  const dir = fixture(); const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'adr-temp-'));
  try {
    const target = path.join(outside, 'data'); fs.writeFileSync(target, 'keep original\n');
    fs.symlinkSync(target, path.join(dir, 'workbench', 'docs', 'adr', `REGISTER.md.tmp-${process.pid}`));
    writeRegister(dir);
    assert.equal(fs.readFileSync(target, 'utf8'), 'keep original\n');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); fs.rmSync(outside, { recursive: true, force: true }); }
});

// S-042 TK-002: the harness can repair its own historical output. Normalize is
// explicit, inserts only the missing required keys, and never touches a body -
// including on a CRLF checkout, where an LF-terminated splice would corrupt it.
test('normalize inserts only the missing required frontmatter keys and leaves every body byte alone', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench', 'docs', 'adr');
    const bare = '# A bare decision\n\nThe decision.\n\nProvenance: owner decision.\n';
    const partial = '---\nstatus: accepted\ncanonicalized_in:\n  - AGENTS.md\n---\n\n# A partial decision\n\nThe decision.\n';
    const crlf = '---\r\nstatus: proposed\r\n---\r\n\r\n# A CRLF decision\r\n\r\nThe decision.\r\n';
    fs.writeFileSync(path.join(collection, '0001-bare.md'), bare);
    fs.writeFileSync(path.join(collection, '0002-partial.md'), partial);
    fs.writeFileSync(path.join(collection, '0003-crlf.md'), crlf);

    assert.ok(validateAdrs(dir).filter((item) => item.code === 'invalid-adr').length >= 3, 'all three records are invalid before normalize');
    assert.equal(fs.readFileSync(path.join(collection, '0001-bare.md'), 'utf8'), bare, 'validate alone writes nothing');
    assert.equal(fs.readFileSync(path.join(collection, '0002-partial.md'), 'utf8'), partial, 'validate alone writes nothing');
    assert.equal(fs.readFileSync(path.join(collection, '0003-crlf.md'), 'utf8'), crlf, 'validate alone writes nothing');

    const result = normalizeAdrs(dir, { date: '2026-09-06' });
    assert.deepEqual(result.changed.map((entry) => `${path.basename(entry.record)}:${entry.inserted.join(',')}`).sort(), [
      '0001-bare.md:status,date',
      '0002-partial.md:date',
      '0003-crlf.md:date'
    ], 'normalize reports every file it changed and the keys it inserted');

    assert.equal(fs.readFileSync(path.join(collection, '0001-bare.md'), 'utf8'), `---\nstatus: proposed\ndate: 2026-09-06\n---\n\n${bare}`);
    assert.equal(fs.readFileSync(path.join(collection, '0002-partial.md'), 'utf8'), '---\nstatus: accepted\ncanonicalized_in:\n  - AGENTS.md\ndate: 2026-09-06\n---\n\n# A partial decision\n\nThe decision.\n');
    const normalizedCrlf = fs.readFileSync(path.join(collection, '0003-crlf.md'), 'utf8');
    assert.equal(normalizedCrlf, '---\r\nstatus: proposed\r\ndate: 2026-09-06\r\n---\r\n\r\n# A CRLF decision\r\n\r\nThe decision.\r\n');
    assert.doesNotMatch(normalizedCrlf, /(?<!\r)\n/, 'a CRLF record must not gain an LF-terminated key');

    writeRegister(dir);
    assert.deepEqual(validateAdrs(dir), [], 'every normalized record validates');
    assert.deepEqual(normalizeAdrs(dir, { date: '2026-09-06' }).changed, [], 'normalize is idempotent');

    const cli = spawnSync(process.execPath, [adrTool, 'normalize', '--path', dir, '--date', '2026-09-06', '--json'], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    assert.deepEqual(JSON.parse(cli.stdout).changed, []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('durable references distinguish tracked notepad templates from ignored live records', () => {
  const dir = fixture();
  try {
    const file = path.join(dir, 'workbench/docs/adr/0001-notepad.md');
    fs.writeFileSync(file, adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n', '[Schema](../../sessions/notepads/templates/notepad.schema.json)\n'));
    writeRegister(dir);
    assert.deepEqual(validateAdrs(dir).filter(item => item.code === 'untracked-provenance'), []);
    fs.appendFileSync(file, '[Live](../../sessions/notepads/work/live.json)\n');
    assert.equal(validateAdrs(dir).filter(item => item.code === 'untracked-provenance').length, 1);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
