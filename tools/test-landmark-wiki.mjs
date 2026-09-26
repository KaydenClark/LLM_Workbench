#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { validateWiki } from '../workbench/tools/wiki.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'workbench/tools/landmark-wiki.mjs');
const article = 'workbench/wiki/landmark.md';
const readable = '# Evolving direction\n\nA readable pillar with overlapping ideas and durable knowledge.\n';

function room(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'landmark-wiki-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'workbench/wiki'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'workbench/landmark-tracker'), { recursive: true });
  fs.writeFileSync(path.join(dir, article), readable);
  fs.writeFileSync(path.join(dir, 'workbench/wiki/MEMORY.md'), '# Router\n');
  fs.writeFileSync(path.join(dir, 'workbench/landmark-tracker/TRACKER.json'), '{"fixture":true}\n');
  fs.writeFileSync(path.join(dir, 'workbench/landmark-tracker/provenance.json'), '{"specs":["S-001","S-002A"],"landmark":"LMK-000A"}\n');
  return dir;
}

function snapshot(dir) {
  const result = {};
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      const relative = path.relative(dir, file);
      result[relative] = entry.isSymbolicLink() ? `link:${fs.readlinkSync(file)}` : entry.isDirectory() ? 'directory' : fs.readFileSync(file).toString('base64');
      if (entry.isDirectory()) walk(file);
    }
  }
  walk(dir);
  return result;
}

function cli(dir, ...args) {
  const result = spawnSync(process.execPath, [tool, ...args], { cwd: dir, encoding: 'utf8' });
  assert.equal(result.signal, null, result.stderr);
  assert.ok(result.stdout.trim(), `public CLI must return JSON: ${result.stderr}`);
  return { ...result, report: JSON.parse(result.stdout) };
}

test('valid explicitly designated article passes CLI/API without touching article, index or structured provenance', async t => {
  const dir = room(t);
  const before = snapshot(dir);
  const result = cli(dir, 'validate', article, '--path', dir, '--json');
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.report, { status: 'valid', article, findings: [] });
  const { validateLandmarkArticle } = await import('../workbench/tools/landmark-wiki.mjs');
  assert.deepEqual(validateLandmarkArticle(dir, article), result.report);
  assert.deepEqual(snapshot(dir), before);
});

test('human-readable CLI output identifies refusals and absolute in-root paths work', t => {
  const dir = room(t);
  const before = snapshot(dir);
  const valid = spawnSync(process.execPath, [tool, 'validate', path.join(dir, article), '--path', dir], { encoding: 'utf8' });
  assert.equal(valid.status, 0);
  assert.equal(valid.stdout, `valid: ${article}\n`);
  fs.writeFileSync(path.join(dir, article), `${readable}S-001\n`);
  const invalid = spawnSync(process.execPath, [tool, 'validate', article, '--path', dir], { encoding: 'utf8' });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stdout, /landmark-wbid: S-001 at workbench\/wiki\/landmark.md:4:1/);
  fs.writeFileSync(path.join(dir, article), readable);
  assert.deepEqual(snapshot(dir), before);
});

test('explicit custom namespaces cover metadata and links without inventory reads or writes', async t => {
  const dir = room(t);
  fs.writeFileSync(path.join(dir, article), `---\nsource_paths: [CUSTOM-00a]\n---\n${readable}[More](../ROOM2-000B.md)\n`);
  const before = snapshot(dir);
  const result = cli(dir, 'validate', article, '--prefix', 'CUSTOM', '--prefix', 'ROOM2', '--json');
  assert.equal(result.status, 1);
  assert.equal(result.report.status, 'invalid');
  assert.deepEqual(result.report.findings.map(hit => hit.id), ['CUSTOM-00a', 'ROOM2-000B']);
  const { validateLandmarkArticle } = await import('../workbench/tools/landmark-wiki.mjs');
  assert.deepEqual(validateLandmarkArticle(dir, article, { extraPrefixes: ['CUSTOM', 'ROOM2'] }), result.report);
  for (const prefix of ['', 'custom', 'X-Y', '1ABC', 'ABCDEFGHIJKLMNOPQ', 'A B']) {
    const refused = cli(dir, 'validate', article, '--prefix', prefix, '--json');
    assert.equal(refused.report.error.code, 'invalid-invocation');
    assert.throws(() => validateLandmarkArticle(dir, article, { extraPrefixes: [prefix] }), error => error.code === 'invalid-invocation');
  }
  for (const extraPrefixes of [null, 'CUSTOM', [42]]) assert.throws(() => validateLandmarkArticle(dir, article, { extraPrefixes }), error => error.code === 'invalid-invocation');
  fs.writeFileSync(path.join(dir, article), `${readable}S-curve and HTTP-API.\n`);
  assert.deepEqual(cli(dir, 'validate', article, '--json').report.findings.map(hit => hit.id), ['S-curve']);
  fs.writeFileSync(path.join(dir, article), Buffer.from(before[article], 'base64'));
  assert.deepEqual(snapshot(dir), before);
});

for (const [area, text, id] of [
  ['metadata', '---\nsource_paths: [S-001]\n---\n', 'S-001'],
  ['prose', 'Built through TK-002T.\n', 'TK-002T'],
  ['comment', '<!-- hidden N-00a -->\n', 'N-00a'],
  ['URL', 'https://example.invalid/ADR-0041-history\n', 'ADR-0041'],
  ['link target', '[records](../landmarks/LMK-000A.json)\n', 'LMK-000A'],
  ['reference target', '[card]: ../destination-questions/DQC-00A.json\n', 'DQC-00A'],
  ['code fence', '```\nS-000a\n```\n', 'S-000a'],
  ['connection namespace', 'WB-0123456789ABCDEFGHIJKL\n', 'WB-0123456789ABCDEFGHIJKL']
]) {
  test(`rejects actual ${area} bytes with useful location and no writes`, async t => {
    const dir = room(t);
    const content = `# Direction\n\né ${text}`;
    fs.writeFileSync(path.join(dir, article), content);
    const before = snapshot(dir);
    const result = cli(dir, 'validate', article, '--path', dir, '--json');
    assert.equal(result.status, 1);
    assert.equal(result.report.status, 'invalid');
    assert.equal(result.report.findings.length, 1);
    const hit = result.report.findings[0];
    assert.equal(hit.code, 'landmark-wbid');
    assert.equal(hit.id, id);
    assert.equal(hit.article, article);
    const offset = Buffer.from(content).indexOf(Buffer.from(id));
    assert.equal(hit.byteOffset, offset);
    assert.equal(hit.line, content.slice(0, content.indexOf(id)).split('\n').length);
    assert.ok(hit.column >= 1);
    assert.match(hit.message, new RegExp(`${id}.*${hit.line}:${hit.column}`));
    const { validateLandmarkArticle } = await import('../workbench/tools/landmark-wiki.mjs');
    assert.deepEqual(validateLandmarkArticle(dir, article), result.report);
    assert.deepEqual(snapshot(dir), before);
  });
}

test('all legacy/current type identities and widened suffixes are found, ordinary hyphenated words pass', t => {
  const dir = room(t);
  const ids = ['S-1', 'S-001', 'S-01T', 'S-000a', 'S-000000A', 'TK-001', 'ADR-00a', 'N-001', 'DQC-000B', 'LMK-000C'];
  fs.writeFileSync(path.join(dir, article), `${readable}${ids.join(' / ')}\n`);
  const result = cli(dir, 'validate', article, '--json');
  assert.equal(result.status, 1);
  assert.deepEqual(result.report.findings.map(hit => hit.id), ids);
  fs.writeFileSync(path.join(dir, article), `${readable}source-path, human-readable and LMKish-001.\n`);
  assert.equal(cli(dir, 'validate', article, '--json').status, 0);
});

test('default generic namespace candidates refuse as incomplete rather than silently pass', t => {
  const dir = room(t);
  for (const id of ['XS-001', 'CUSTOM-000A', 'HTTP-API', 'UTF-8']) {
    fs.writeFileSync(path.join(dir, article), `${readable}${id}\n`);
    const before = snapshot(dir);
    const result = cli(dir, 'validate', article, '--json');
    assert.equal(result.status, 1);
    assert.equal(result.report.status, 'incomplete');
    assert.equal(result.report.findings[0].code, 'landmark-ambiguous');
    assert.equal(result.report.findings[0].id, id);
    assert.deepEqual(snapshot(dir), before);
  }
});

test('percent-encoded URL and link identities retain original-byte locations', async t => {
  const dir = room(t);
  const content = `${readable}[More](https://example.invalid/%53%2D%30%30%31)\n[Card](../%44QC-000A.json)\n`;
  fs.writeFileSync(path.join(dir, article), content);
  const before = snapshot(dir);
  const result = cli(dir, 'validate', article, '--json');
  assert.equal(result.status, 1);
  assert.equal(result.report.status, 'invalid');
  assert.deepEqual(result.report.findings.map(hit => hit.id), ['S-001', 'DQC-000A']);
  for (const [index, token] of ['%53', '%44'].entries()) {
    const offset = content.indexOf(token);
    assert.equal(result.report.findings[index].byteOffset, Buffer.byteLength(content.slice(0, offset)));
    assert.equal(result.report.findings[index].line, content.slice(0, offset).split('\n').length);
    assert.equal(result.report.findings[index].column, Array.from(content.slice(content.lastIndexOf('\n', offset) + 1, offset)).length + 1);
  }
  const { validateLandmarkArticle } = await import('../workbench/tools/landmark-wiki.mjs');
  assert.deepEqual(validateLandmarkArticle(dir, article), result.report);
  assert.deepEqual(snapshot(dir), before);
});

test('missing, unsafe, linked, non-file and unreadable article inputs visibly refuse without writes', async t => {
  const dir = room(t);
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'landmark-outside-'));
  t.after(() => fs.rmSync(outside, { recursive: true, force: true }));
  fs.writeFileSync(path.join(outside, 'outside.md'), 'S-001');
  fs.symlinkSync(path.join(outside, 'outside.md'), path.join(dir, 'workbench/wiki/linked.md'));
  fs.symlinkSync(outside, path.join(dir, 'workbench/wiki/escape'));
  fs.mkdirSync(path.join(dir, 'workbench/wiki/directory.md'));
  fs.writeFileSync(path.join(dir, 'workbench/wiki/empty.md'), ' \n');
  fs.writeFileSync(path.join(dir, 'workbench/wiki/invalid.md'), Buffer.from([0xff, 0x53, 0x2d, 0x31]));
  fs.writeFileSync(path.join(dir, 'workbench/wiki/not.txt'), readable);
  const before = snapshot(dir);
  const { validateLandmarkArticle } = await import('../workbench/tools/landmark-wiki.mjs');
  for (const [input, code] of [
    ['workbench/wiki/missing.md', 'missing-article'],
    [path.join(outside, 'outside.md'), 'unsafe-article'],
    ['../outside.md', 'unsafe-article'],
    ['..\\outside.md', 'unsafe-article'],
    ['workbench/wiki/linked.md', 'unsafe-article'],
    ['workbench/wiki/escape/outside.md', 'unsafe-article'],
    ['workbench/wiki/directory.md', 'invalid-article'],
    ['workbench/wiki/not.txt', 'invalid-article'],
    ['workbench/wiki/empty.md', 'invalid-article'],
    ['workbench/wiki/invalid.md', 'unreadable-article']
  ]) {
    const result = cli(dir, 'validate', input, '--json');
    assert.equal(result.status, 1, input);
    assert.equal(result.report.error.code, code, input);
    assert.throws(() => validateLandmarkArticle(dir, input), error => error.code === code);
  }
  for (const args of [[], ['validate'], ['validate', article, '--unknown'], ['validate', article, '--path'], ['validate', article, '--json', '--json']]) {
    const result = cli(dir, ...args, ...(args.includes('--json') ? [] : ['--json']));
    assert.equal(result.status, 1);
    assert.equal(result.report.error.code, 'invalid-invocation');
  }
  for (const input of [undefined, null, 42, '', 'a\0.md']) assert.throws(() => validateLandmarkArticle(dir, input), error => error.code === 'invalid-invocation');
  assert.deepEqual(snapshot(dir), before);
  assert.equal(fs.readFileSync(path.join(outside, 'outside.md'), 'utf8'), 'S-001');
});

test('unrelated retirement feature provenance retains its existing Wiki validation rules', t => {
  const dir = room(t);
  const properties = '---\ntype: project\nstatus: active\nsensitivity: normal\nknowledge_role: historical\nprovenance: fixture\nsource_paths: [workbench/specs/retired/S-001-example/SPEC.md]\nlast_verified: 2026-09-26\n---\n';
  fs.writeFileSync(path.join(dir, 'workbench/manifest.json'), JSON.stringify({ schemaVersion: 2, wiki: { profile: 'project' } }));
  for (const name of ['design-concepts', 'guidebooks', 'archive']) fs.mkdirSync(path.join(dir, 'workbench/wiki', name));
  fs.mkdirSync(path.join(dir, 'workbench/specs/retired/S-001-example'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'workbench/specs/retired/S-001-example/SPEC.md'), '# Historical fixture\n');
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), 'Wiki: workbench/wiki\n');
  fs.writeFileSync(path.join(dir, 'README.md'), 'Wiki: workbench/wiki/MEMORY.md\n');
  fs.writeFileSync(path.join(dir, 'workbench/wiki/MEMORY.md'), `${properties}# Router\n`);
  fs.writeFileSync(path.join(dir, article), `${properties}${readable}`);
  fs.writeFileSync(path.join(dir, 'workbench/wiki/feature.md'), `${properties}# Retired feature\n\n[Provenance](../specs/retired/S-001-example/SPEC.md).\n`);
  const before = snapshot(dir);
  assert.deepEqual(validateWiki(dir), []);
  fs.writeFileSync(path.join(dir, article), readable);
  const afterArticle = snapshot(dir);
  assert.equal(cli(dir, 'validate', article, '--json').status, 0);
  assert.deepEqual(snapshot(dir), afterArticle);
  assert.equal(afterArticle['workbench/wiki/feature.md'], before['workbench/wiki/feature.md']);
});
