#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import { validateWiki } from '../workbench/tools/wiki.mjs';
import { validateLandmarkArticle } from '../workbench/tools/landmark-wiki.mjs';
import { install, verify, RECEIPT_NAME } from './workbench-tools.mjs';

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

// Name-and-context rule (S-003W TK-003): an identifier is welcome when the
// artifact's name sits beside it; only a bare identifier is reported.
const NAMED_FORMS = [
  ['name then parenthesized identifier', 'The Landmark Records Spec (S-002A) owns the validator.'],
  ['identifier then parenthesized name', 'S-002A (Landmark Records Spec) owns the validator.'],
  ['title-case name beside identifier', 'The Landmark Records Spec S-002A owns the validator.'],
  ['identifier, colon, name', 'TK-003: Name and context identifier validator.'],
  ['identifier, dash, name', 'ADR-000R - The Wiki is the evolving synthesis.'],
  ['link text names the identifier in its target', '[Landmark Records Spec](../specs/S-002A/SPEC.md)'],
  ['path slug names the identifier', '[records](../specs/S-002A-landmark-records/SPEC.md)'],
  ['reference definition names its target', '[Landmark Records Spec]: ../landmarks/LMK-000A.json'],
  ['slug whose later segments start with a digit', 'workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md'],
  ['slug with a version-like first segment', 'workbench/specs/S-036-v3-2-evidence-corrections/SPEC.md'],
  ['metadata path with a slug', '---\nsource_paths:\n  - workbench/specs/S-002A-landmark-records/SPEC.md\n---'],
  ['name with a dotted version token', 'S-00O (Workbench v4.0.0 Release Spec) is the release.'],
  ['name with a short version token', 'Workbench v4 Release Spec (S-00O) is the release.'],
  ['two named identifiers on one line', 'Landmark Records Spec (S-002A) and Landmark Tracker Foundation Spec (S-01T).'],
  ['bold name with identifier', '**Wiki Routing And Version Stamps** (S-00X) is delivered.'],
  ['connection identity with its name', 'Workbench connection identity (WB-0123456789ABCDEFGHIJKL) names this room.']
];
for (const [label, text] of NAMED_FORMS) {
  test(`name-and-context: ${label} passes without writes`, t => {
    const dir = room(t);
    fs.writeFileSync(path.join(dir, article), `${readable}\n${text}\n`);
    const before = snapshot(dir);
    const result = cli(dir, 'validate', article, '--json');
    assert.equal(result.status, 0, JSON.stringify(result.report));
    assert.deepEqual(result.report, { status: 'valid', article, findings: [] });
    assert.deepEqual(snapshot(dir), before);
  });
}

const BARE_FORMS = [
  ['unqualified prose', 'Built through TK-002T.'],
  ['kind word only', 'See Spec S-002A.'],
  ['bare identifier list', 'Related: S-002A / S-01T / TK-003.'],
  ['identifier as its own link text', '[S-002A](../records/overview.md)'],
  ['link text of one word without a slug', '[records](../landmarks/LMK-000A.json)'],
  ['bare metadata value', '---\nsource_paths: [S-001]\n---'],
  ['version-like slug with one word segment', 'https://example.invalid/ADR-0041-v3-1'],
  ['one-word slug', 'https://example.invalid/ADR-0041-history'],
  ['name-less identifier after a closing bracket', '(TK-002T) is done.'],
  ['bare code span', 'Run `S-002A` now.']
];
for (const [label, text] of BARE_FORMS) {
  test(`name-and-context: ${label} is reported with a repair message`, t => {
    const dir = room(t);
    fs.writeFileSync(path.join(dir, article), `${readable}\n${text}\n`);
    const before = snapshot(dir);
    const result = cli(dir, 'validate', article, '--json');
    assert.equal(result.status, 1, text);
    assert.equal(result.report.status, 'invalid');
    assert.ok(result.report.findings.length >= 1);
    for (const hit of result.report.findings) {
      assert.equal(hit.code, 'landmark-bare-id');
      assert.match(hit.message, new RegExp(hit.id));
      assert.match(hit.message, /add the artifact's name and context/);
      assert.match(hit.message, /keep the identifier/);
      assert.doesNotMatch(hit.message, /remove the identifier|outside readable/);
    }
    assert.deepEqual(snapshot(dir), before);
  });
}

test('name-and-context: only the bare identifier of a mixed line is reported', t => {
  const dir = room(t);
  fs.writeFileSync(path.join(dir, article), `${readable}\nLandmark Records Spec (S-002A) and then S-01T.\n`);
  const result = cli(dir, 'validate', article, '--json');
  assert.equal(result.status, 1);
  assert.deepEqual(result.report.findings.map(hit => hit.id), ['S-01T']);
});

test('name-and-context: an ambiguous undesignated token passes only with its name beside it', t => {
  const dir = room(t);
  fs.writeFileSync(path.join(dir, article), `${readable}\nThe Custom Records Spec (CUSTOM-000A) is a room type.\n`);
  assert.equal(cli(dir, 'validate', article, '--json').status, 0);
  fs.writeFileSync(path.join(dir, article), `${readable}\nSee CUSTOM-000A.\n`);
  const result = cli(dir, 'validate', article, '--json');
  assert.equal(result.status, 1);
  assert.equal(result.report.status, 'incomplete');
  assert.equal(result.report.findings[0].code, 'landmark-ambiguous');
  assert.match(result.report.findings[0].message, /--prefix/);
  assert.match(result.report.findings[0].message, /name and context/);
});

// Non-identifier escape (S-003W TK-006Q): placeholders, algorithm names and
// word-shaped tokens merely fit the identity grammar; real identifiers do not
// get an escape.
const NOT_IDENTIFIERS = ['YYYY-MM', 'YYYY-MM-DD', 'MM-DD', 'HH-MM', 'SHA-1', 'SHA-256', 'SHA-512', 'UTF-8', 'ISO-8601',
  'PRD-shaped', 'CSV-export', 'PDF-statement', 'TASK-ID', 'GLOSSARY-MAP', 'CONTEXT-MAP', 'SCR-reconciled', 'HTTP-API'];
for (const token of NOT_IDENTIFIERS) {
  test(`non-identifier escape: ${token} is not reported`, t => {
    const dir = room(t);
    fs.writeFileSync(path.join(dir, article), `${readable}\nUse ${token}.\n`);
    const before = snapshot(dir);
    const result = cli(dir, 'validate', article, '--json');
    assert.equal(result.status, 0, JSON.stringify(result.report));
    assert.deepEqual(result.report, { status: 'valid', article, findings: [] });
    assert.deepEqual(snapshot(dir), before);
  });
}

test('non-identifier escape never hides a real or ID-looking identifier', t => {
  const dir = room(t);
  const expected = [
    ['S-002A', 'landmark-bare-id'], ['TK-003', 'landmark-bare-id'], ['ADR-000P', 'landmark-bare-id'], ['DQC-004L', 'landmark-bare-id'],
    ['LMK-000A', 'landmark-bare-id'], ['N-000A', 'landmark-bare-id'], ['WB-0123456789ABCDEFGHIJKL', 'landmark-bare-id'],
    ['S-curve', 'landmark-bare-id'], ['ADR-FORMAT', 'landmark-bare-id'],
    ['XS-001', 'landmark-ambiguous'], ['CUSTOM-000A', 'landmark-ambiguous'], ['E-4B', 'landmark-ambiguous'], ['ROLE-1', 'landmark-ambiguous'],
    ['TT-Q10', 'landmark-ambiguous'], ['SHA-2560', 'landmark-ambiguous'], ['SHA-3', 'landmark-ambiguous'], ['MM-DD1', 'landmark-ambiguous']
  ];
  fs.writeFileSync(path.join(dir, article), `${readable}\n${expected.map(([id]) => `Next ${id}\n`).join('')}`);
  const report = cli(dir, 'validate', article, '--json').report;
  assert.deepEqual(report.findings.map(hit => [hit.id, hit.code]), expected);
});

test('non-identifier escape yields to an explicit designation', t => {
  const dir = room(t);
  fs.writeFileSync(path.join(dir, article), `${readable}\nUse HTTP-API and SHA-256.\n`);
  assert.equal(cli(dir, 'validate', article, '--json').status, 0);
  const designated = cli(dir, 'validate', article, '--prefix', 'HTTP', '--prefix', 'SHA', '--json');
  assert.equal(designated.status, 1);
  assert.deepEqual(designated.report.findings.map(hit => [hit.id, hit.code]), [['HTTP-API', 'landmark-bare-id'], ['SHA-256', 'landmark-bare-id']]);
});

// Link-text classes (S-003W TK-006Q): an identifier inside link text passes when
// the text names the artifact beside it, or when the link target's slug does.
const LINK_NAMED = [
  ['name with a version token around the identifier', '- [Workbench v4.0.0 Release (S-00O)](../specs/S-00O/SPEC.md) - the release'],
  ['identifier, comma, title', '- [ADR-000S, Destination Decision Records are decision records](../docs/adr/000S/ADR.md):'],
  ['identifier-only text with the identifier and a naming slug in its target', '[S-01R](../specs/S-01R-reviewer-skill-rebuild/SPEC.md#delivery)'],
  ['identifier-only text with the suffix and a naming slug in its target', '[ADR-000P](../docs/adr/000P-roles-scope-work-and-stances-define-the-job.md)'],
  ['code-wrapped identifier text with a naming slug', '[`S-00H`](../../specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md)']
];
for (const [label, text] of LINK_NAMED) {
  test(`link-text rule: ${label} passes`, t => {
    const dir = room(t);
    fs.writeFileSync(path.join(dir, article), `${readable}\n${text}\n`);
    const result = cli(dir, 'validate', article, '--json');
    assert.equal(result.status, 0, JSON.stringify(result.report));
    assert.deepEqual(result.report, { status: 'valid', article, findings: [] });
  });
}

const LINK_BARE = [
  ['identifier plus one word of text and an unnamed target', '[S-00H (retired)](../specs/retired/other/SPEC.md)'],
  ['kind word and identifier', '[see S-00O](../specs/SPEC.md)'],
  ['two identifiers as link text', '[S-00O, S-00P](../specs/SPEC.md)'],
  ['one-word slug in the target', '[ADR-000P](../docs/adr/000P-history.md)'],
  ['a different identifier names the target', '[ADR-000P](../docs/adr/0041-roles-scope-work-and-stances.md)'],
  ['naming slug beside the suffix only inside a longer word', '[ADR-000P](../docs/adr/x000P-roles-scope-work-and-stances.md)']
];
for (const [label, text] of LINK_BARE) {
  test(`link-text rule: ${label} is still reported`, t => {
    const dir = room(t);
    fs.writeFileSync(path.join(dir, article), `${readable}\n${text}\n`);
    const result = cli(dir, 'validate', article, '--json');
    assert.equal(result.status, 1, text);
    assert.ok(result.report.findings.length >= 1);
    assert.ok(result.report.findings.every(hit => hit.code === 'landmark-bare-id'));
  });
}

test('the usage note states the name-and-context rule and its finding code', () => {
  const note = fs.readFileSync(path.join(root, 'workbench/landmark-tracker/LANDMARK-WIKI.md'), 'utf8');
  assert.match(note, /name-and-context/i);
  assert.match(note, /landmark-bare-id/);
  assert.match(note, /replaced that ban/);
  assert.match(note, /Tokens that are not identifiers/);
  for (const token of NOT_IDENTIFIERS.filter(token => /^(YYYY-MM|MM-DD|SHA-256|UTF-8)$/.test(token))) assert.ok(note.includes(`\`${token}\``), `${token} documented`);
  assert.match(note, /identifier-only link text passes only through rule 2/i);
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
  assert.match(invalid.stdout, /landmark-bare-id: S-001 at workbench\/wiki\/landmark.md:4:1/);
  fs.writeFileSync(path.join(dir, article), readable);
  assert.deepEqual(snapshot(dir), before);
});

test('success and refusals preserve a real staged Git index and working tree', t => {
  const dir = room(t);
  for (const args of [['init', '--quiet', '--template=', dir], ['-C', dir, 'add', '.']]) {
    const result = spawnSync('git', args, { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  }
  assert.ok(fs.existsSync(path.join(dir, '.git/index')));
  for (const content of [readable, `${readable}<!-- N-000A -->\n`, `${readable}[Origin](../CUSTOM%2D000A.json)\n`]) {
    fs.writeFileSync(path.join(dir, article), content);
    const before = snapshot(dir);
    const result = cli(dir, 'validate', article, '--json');
    assert.equal(result.report.status, content === readable ? 'valid' : content.includes('N-000A') ? 'invalid' : 'incomplete');
    assert.deepEqual(snapshot(dir), before);
  }
  const before = snapshot(dir);
  assert.equal(cli(dir, 'validate', '../outside.md', '--json').report.error.code, 'unsafe-article');
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
  fs.writeFileSync(path.join(dir, article), `${readable}S-curve and XS-001.\n`);
  assert.deepEqual(cli(dir, 'validate', article, '--json').report.findings.map(hit => [hit.id, hit.code]), [['S-curve', 'landmark-bare-id'], ['XS-001', 'landmark-ambiguous']]);
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
    assert.equal(hit.code, 'landmark-bare-id');
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
  for (const id of ['XS-001', 'CUSTOM-000A', 'E-4B', 'TT-Q10']) {
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

test('managed installation exposes the actual receipt-backed validator CLI and API', async t => {
  const dir = room(t);
  fs.copyFileSync(path.join(root, 'workbench/manifest.json'), path.join(dir, 'workbench/manifest.json'));
  const result = install(dir);
  assert.equal(result.status, 'installed', JSON.stringify(result));
  const installed = path.join(dir, 'workbench/tools/landmark-wiki.mjs');
  assert.ok(fs.existsSync(installed), 'managed installation must include the new public validator');
  const receipt = JSON.parse(fs.readFileSync(path.join(dir, 'workbench/tools', RECEIPT_NAME), 'utf8'));
  assert.equal(receipt.files['landmark-wiki.mjs'], createHash('sha256').update(fs.readFileSync(installed)).digest('hex'));
  assert.equal(verify(dir).status, 'valid');
  let before = snapshot(dir);
  const valid = spawnSync(process.execPath, [installed, 'validate', article, '--json'], { cwd: dir, encoding: 'utf8' });
  assert.equal(valid.status, 0, valid.stderr);
  assert.deepEqual(JSON.parse(valid.stdout), { status: 'valid', article, findings: [] });
  assert.deepEqual(snapshot(dir), before);
  fs.writeFileSync(path.join(dir, article), `${readable}[Origin](../CUSTOM%2D000A.json)\n`);
  before = snapshot(dir);
  const refused = spawnSync(process.execPath, [installed, 'validate', article, '--prefix', 'CUSTOM', '--json'], { cwd: dir, encoding: 'utf8' });
  assert.equal(refused.status, 1, refused.stderr);
  const report = JSON.parse(refused.stdout);
  assert.equal(report.findings[0].id, 'CUSTOM-000A');
  const { validateLandmarkArticle } = await import(pathToFileURL(installed).href);
  assert.deepEqual(validateLandmarkArticle(dir, article, { extraPrefixes: ['CUSTOM'] }), report);
  assert.deepEqual(snapshot(dir), before);
});

// Wiki Evolving-Synthesis Migration (S-003W) Task TK-004: every landmark record
// has one routed synthesis page in the design-concepts collection that names
// its own record and passes the name-and-context identifier rule.
test('every landmark has one routed synthesis page that passes the identifier rule', () => {
  const landmarkDir = path.join(root, 'workbench/landmark-tracker/landmarks');
  const conceptDir = path.join(root, 'workbench/wiki/design-concepts');
  const ids = fs.readdirSync(landmarkDir).filter(name => /^LMK-[0-9A-Z]+\.json$/.test(name)).map(name => name.replace(/\.json$/, ''));
  assert.ok(ids.length >= 24, `expected the 24 landmark records, found ${ids.length}`);
  // A synthesis page is a `landmark-*.md` whose first heading is `# Landmark: <Title>`; the
  // Landmark Tracker concept article keeps its own shape and is not one.
  const pages = fs.readdirSync(conceptDir).filter(name => /^landmark-.+\.md$/.test(name) && /^# Landmark: /m.test(fs.readFileSync(path.join(conceptDir, name), 'utf8')));
  const router = fs.readFileSync(path.join(root, 'workbench/wiki/MEMORY.md'), 'utf8');
  const section = router.split(/^## Landmark Synthesis Pages\s*$/m)[1]?.split(/^## /m)[0] ?? '';
  assert.ok(section, 'the router needs a "## Landmark Synthesis Pages" section');
  const missing = [];
  for (const id of ids) {
    const record = JSON.parse(fs.readFileSync(path.join(landmarkDir, `${id}.json`), 'utf8'));
    const owners = pages.filter(name => fs.readFileSync(path.join(conceptDir, name), 'utf8').includes(`landmarks/${id}.json`));
    if (owners.length !== 1) { missing.push(`${id} "${record.title}": ${owners.length} synthesis pages`); continue; }
    const relative = `workbench/wiki/design-concepts/${owners[0]}`;
    const text = fs.readFileSync(path.join(root, relative), 'utf8');
    assert.match(text, /^type: design-concept$/m, `${relative} must be a design-concept`);
    assert.match(text, /^authorized_by: .*Wiki Evolving-Synthesis Migration/m, `${relative} must name its authorizing operation`);
    const line = section.split('\n').find(row => row.includes(`design-concepts/${owners[0]})`));
    if (!line || !/\) - \S/.test(line)) missing.push(`${id} "${record.title}": ${owners[0]} is not routed with a summary line in the Landmark Synthesis Pages section`);
    const result = validateLandmarkArticle(root, relative);
    assert.deepEqual(result.findings, [], `${relative} must carry every identifier with its name and context`);
  }
  assert.deepEqual(missing, []);
});

// LANDMARK.md Artifact And Lane Runtime (S-003Z) Task TK-008I: a reached
// landmark retires into its Landmark Wiki page through `retire-landmark`, and
// that page must keep the name-and-context identifier rule. A page carrying a
// bare landmark identifier is refused by its finding code before anything
// moves; once named, the landmark retires and the page stays a valid Landmark
// Wiki page and Wiki note whose recorded source, the landmark's historical
// LANDMARK.md route, exists. The owner here is a simulated fixture actor.
test('retire-landmark refuses a Landmark Wiki page with a bare identifier and retires into a valid one', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'landmark-wiki-retire-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const layout = path.join(root, 'workbench/tools/workbench-layout.mjs');
  const version = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'), 'utf8')).workbenchVersion;
  const init = spawnSync(process.execPath, [layout, 'init', '--project', dir, '--provenance', 'genesis', '--version', version], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout + init.stderr);
  const git = (...args) => spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
  const write = (relative, content) => { fs.mkdirSync(path.dirname(path.join(dir, relative)), { recursive: true }); fs.writeFileSync(path.join(dir, relative), content); };
  const commit = message => { git('add', '-A'); assert.equal(git('commit', '--quiet', '-m', message).status, 0); return git('rev-parse', 'HEAD').stdout.trim(); };
  write('BLUEPRINT.md', '# Blueprint\n');
  write('TASKBOARD.md', '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
  write('README.md', '# Fixture room\n\nSee MEMORY.md.\n');
  write('AGENTS.md', '# Agents\n\nRoutes to workbench/wiki.\n');
  git('init', '--quiet');
  git('config', 'user.email', 'fixture@example.com');
  git('config', 'user.name', 'Fixture');
  git('commit', '--quiet', '--allow-empty', '-m', 'init');
  const branch = git('rev-parse', '--abbrev-ref', 'HEAD').stdout.trim();
  const manifestFile = path.join(dir, 'workbench/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  manifest.collections.landmarks = 'workbench/landmarks';
  manifest.git = { defaultBranch: branch, integrationBranch: branch };
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
  const historicalRoute = 'workbench/landmarks/retired/LMK-0EA-wiki-bound-direction/LANDMARK.md';
  write('workbench/landmarks/LMK-0EA-wiki-bound-direction/LANDMARK.md', [
    '# LMK-0EA - Wiki Bound Direction', '',
    '**Landmark ID:** LMK-0EA', '**Status:** active', '**Priority:** 1', '**Owner:** lane-director', '**Updated:** 2026-10-06',
    '**Catalog description:** Proves retirement into a Landmark Wiki page.', '**Blockers:** none',
    '**Latest event:** Landmark captured.', '**Next gate:** Run the whole-landmark review.', '',
    '## Direction', '', 'Toward a retired landmark.', '',
    '## What Success Looks Like', '', '- [x] The direction is delivered.', '',
    '## Decision Records', '', '- none', '',
    '## Append-Only Evidence And Execution Log', '', '| Date | Task | Event | Verification | Docs | Remaining gap |', '|---|---|---|---|---|---|', '',
    '## Reached Result', '', 'Delivered.', ''
  ].join('\n'));
  const page = 'workbench/wiki/design-concepts/landmark-wiki-bound-direction.md';
  const landmarkPage = body => ['---', 'type: design-concept', 'status: active', 'sensitivity: normal', 'knowledge_role: curated',
    'provenance:', '  - fixture', 'source_paths:', `  - ${historicalRoute}`, 'last_verified: 2026-10-06',
    'authorized_by: the LANDMARK.md Artifact And Lane Runtime Spec (S-003Z) retirement fixture', 'parent: none', '---', '',
    '# Landmark: Wiki Bound Direction', '', body, ''].join('\n');
  write(page, landmarkPage('Reached as LMK-0EA.'));
  write('workbench/wiki/MEMORY.md', '# Fixture Room Brain\n\nSee [Landmark: Wiki Bound Direction](design-concepts/landmark-wiki-bound-direction.md).\n');
  const specTool = path.join(root, 'workbench/tools/spec-workbench.mjs');
  const spec = (...args) => spawnSync(process.execPath, [specTool, ...args, '--path', dir], { encoding: 'utf8' });
  assert.equal(spec('render').status, 0);
  const reviewed = commit('fixture room');
  const verdict = spec('verdict', 'LMK-0EA', '--candidate', reviewed, '--result', 'pass', '--findings', 'none', '--reviewer', 'Simulated independent landmark reviewer', '--json');
  assert.equal(verdict.status, 0, verdict.stdout + verdict.stderr);
  assert.equal(JSON.parse(verdict.stdout).reached, true);
  const approvedAt = commit('record the passing review');
  const approval = spec('approve', 'LMK-0EA', '--candidate', approvedAt, '--owner', 'Simulated fixture owner (LMK-0EA only; not Kayden Human QA)', '--json');
  assert.equal(approval.status, 0, approval.stdout + approval.stderr);
  commit('record the simulated owner approval');

  // The bare identifier is refused by its finding code; nothing moves.
  const files = () => Object.fromEntries(Object.entries(snapshot(dir)).filter(([key]) => key !== '.git' && !key.startsWith(`.git${path.sep}`)));
  const before = files();
  const refused = spec('retire-landmark', 'LMK-0EA', '--wiki', page, '--json');
  assert.notEqual(refused.status, 0, refused.stdout);
  assert.match(refused.stderr, /landmark-bare-id: LMK-0EA at workbench\/wiki\/design-concepts\/landmark-wiki-bound-direction\.md/, refused.stderr);
  assert.deepEqual(files(), before, 'a refused retirement writes nothing');

  // Named beside its identifier, the page receives the retired landmark.
  write(page, landmarkPage('The Wiki Bound Direction landmark (LMK-0EA) reached its destination.'));
  commit('name the landmark beside its identifier');
  const retired = spec('retire-landmark', 'LMK-0EA', '--wiki', page, '--json');
  assert.equal(retired.status, 0, retired.stdout + retired.stderr);
  assert.equal(JSON.parse(retired.stdout).route, historicalRoute);
  assert.ok(fs.existsSync(path.join(dir, historicalRoute)), 'the page names a recorded source that exists');
  assert.deepEqual(validateLandmarkArticle(dir, page), { status: 'valid', article: page, findings: [] });
  assert.deepEqual(validateWiki(dir).filter(item => item.note === page), []);
});
