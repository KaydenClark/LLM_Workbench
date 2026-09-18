#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { ADR_LIFECYCLE_FOLDERS, ID_PATTERN, REGISTER_NAME, listAdrs, localLinks, migrateLifecycleFolders, newAdr, normalizeAdrs, renderRegister, stripFrontmatterKey, validateAdrs, writeRegister } from '../workbench/tools/adr.mjs';
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

// S-00I TK-002: `migrate-folders` must show the reviewer renames, not
// delete-plus-add, and must refuse a dirty tree - both only observable
// against a real Git working tree, not the plain fixture() above.
function gitFixture() {
  const dir = fixture();
  spawnSync('git', ['init', '--quiet', dir]);
  spawnSync('git', ['-C', dir, 'config', 'user.email', 'fixture@example.com']);
  spawnSync('git', ['-C', dir, 'config', 'user.name', 'Fixture']);
  return dir;
}

function gitCommitAll(dir, message) {
  spawnSync('git', ['-C', dir, 'add', '-A']);
  const result = spawnSync('git', ['-C', dir, 'commit', '--quiet', '-m', message], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
}

function gitStatus(dir) {
  return spawnSync('git', ['-C', dir, 'status', '--porcelain'], { encoding: 'utf8' }).stdout;
}

test('a valid corpus validates, registers deterministically, and reports a stale register as attention', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench', 'docs', 'adr');
    fs.writeFileSync(path.join(collection, '0001-first.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
    const stale = validateAdrs(dir);
    assert.deepEqual(stale.map((item) => [item.code, item.severity, item.blocks]), [['stale-register', 'attention', 'none'], ['stale-register', 'attention', 'none']]);
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

test('new allocates an unused letter-bearing label as a proposed record with a canonicalization slot', () => {
  const dir = fixture();
  try {
    fs.writeFileSync(path.join(dir, 'workbench', 'docs', 'adr', '0007-gap.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
    const created = newAdr(dir, { title: 'Checkpoints are the durable session record', date: '2026-09-04' });
    assert.equal(created.number, '000A');
    assert.equal(path.basename(created.filePath), '000A-checkpoints-are-the-durable-session-record.md');
    const content = fs.readFileSync(created.filePath, 'utf8');
    assert.match(content, /^---\nstatus: proposed\ndate: 2026-09-04\ncanonicalized_in:\n  - AGENTS\.md\n---/);
    assert.match(content, /^# Checkpoints are the durable session record$/m);
    const cli = spawnSync(process.execPath, [adrTool, 'new', '--path', dir, '--title', 'Another decision'], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    assert.equal(JSON.parse(cli.stdout).number, '000B');
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

// S-00A: lifecycle is semantic; the default projection must not revive history.
test('active register excludes historical decisions while explicit history preserves all records', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench/docs/adr');
    const inputs = {
      '0001-active.md': adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'),
      '0002-old.md': adr('superseded', 'superseded_by: 0001-active.md\n'),
      '0003-retired.md': adr('deprecated', 'deprecation_reason: The requirement is withdrawn.\n'),
      '0004-draft.md': adr('proposed'),
      '0005-rejected.md': adr('rejected')
    };
    for (const [name, content] of Object.entries(inputs)) fs.writeFileSync(path.join(collection, name), content);
    writeRegister(dir);
    assert.deepEqual(validateAdrs(dir), []);
    const active = fs.readFileSync(path.join(collection, REGISTER_NAME), 'utf8');
    assert.match(active, /0001-active/);
    assert.doesNotMatch(active, /0002-old|0003-retired|0004-draft|0005-rejected/);
    assert.match(active, /HISTORY\.md/);
    const history = fs.readFileSync(path.join(collection, 'HISTORY.md'), 'utf8');
    for (const [name, content] of Object.entries(inputs)) {
      assert.ok(history.includes(name));
      assert.equal(fs.readFileSync(path.join(collection, name), 'utf8'), content);
    }
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('lifecycle rejects missing, cyclic, partial and nonaccepted successor targets', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench/docs/adr');
    const file = path.join(collection, '0001-old.md');
    for (const target of ['missing.md', '0001-old.md', '0002-next.md#partial', '../0002-next.md', '0003-proposed.md']) {
      fs.writeFileSync(file, adr('superseded', `superseded_by: ${target}\n`));
      fs.writeFileSync(path.join(collection, '0002-next.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
      fs.writeFileSync(path.join(collection, '0003-proposed.md'), adr('proposed'));
      writeRegister(dir);
      assert.ok(validateAdrs(dir).some(x => x.code === 'invalid-adr' && x.adr === '0001-old.md'), target);
    }
    fs.writeFileSync(file, adr('superseded', 'superseded_by: 0002-next.md\n'));
    fs.writeFileSync(path.join(collection, '0002-next.md'), adr('superseded', 'superseded_by: 0001-old.md\n'));
    writeRegister(dir);
    assert.ok(validateAdrs(dir).some(x => /cycle/.test(x.message)));
    fs.writeFileSync(file, adr('deprecated'));
    writeRegister(dir);
    assert.ok(validateAdrs(dir).some(x => /deprecation_reason/.test(x.message)));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

// S-00I TK-001: a successor is named by identity (a bare record filename),
// never by location, so it must resolve wherever the record actually lives.
// `listAdrs` becomes folder-aware over the closed `ADR_LIFECYCLE_FOLDERS` set,
// and a record's own register/history row must link to its real relative path.
test('a superseded record resolves a successor that lives in a lifecycle subfolder, and its row links to the real relative path', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench/docs/adr');
    fs.mkdirSync(path.join(collection, 'archive'), { recursive: true });
    fs.writeFileSync(path.join(collection, 'archive', '0002-next.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
    fs.writeFileSync(path.join(collection, '0001-old.md'), adr('superseded', 'superseded_by: 0002-next.md\n'));
    const records = listAdrs(dir);
    assert.equal(records.length, 2, 'listAdrs must enumerate the top level and its lifecycle subfolders');
    const successor = records.find((record) => record.name === '0002-next.md');
    assert.equal(successor.folder, 'archive', 'a record read from a lifecycle subfolder must be tagged with that folder');
    assert.deepEqual(validateAdrs(dir).filter((item) => item.code === 'invalid-adr'), [], 'a cross-folder successor must resolve without an invalid-adr finding');
    writeRegister(dir);
    const register = fs.readFileSync(path.join(collection, REGISTER_NAME), 'utf8');
    const history = fs.readFileSync(path.join(collection, 'HISTORY.md'), 'utf8');
    assert.match(register, /\[0002\]\(archive\/0002-next\.md\)/, 'REGISTER.md must link to the successor by its real relative path, not its bare name');
    assert.match(history, /\[0002\]\(archive\/0002-next\.md\)/, 'HISTORY.md must link to the successor by its real relative path, not its bare name');
    assert.deepEqual(validateAdrs(dir), [], 'the register and history projections must not be stale after writeRegister');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('a successor named by a path or a fragment is still refused, never resolved', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench/docs/adr');
    fs.mkdirSync(path.join(collection, 'archive'), { recursive: true });
    fs.writeFileSync(path.join(collection, 'archive', '0002-next.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
    fs.writeFileSync(path.join(collection, '0001-old.md'), adr('superseded', 'superseded_by: archive/0002-next.md\n'));
    assert.ok(validateAdrs(dir).some((item) => item.code === 'invalid-adr' && item.adr === '0001-old.md' && /whole-record superseded_by filename/.test(item.message)));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('flat collections list identically to before: every record is untagged and listing order is unchanged', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench/docs/adr');
    fs.writeFileSync(path.join(collection, '0001-first.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
    fs.writeFileSync(path.join(collection, '0002-second.md'), adr('proposed'));
    const records = listAdrs(dir);
    assert.deepEqual(records.map((record) => record.name), ['0001-first.md', '0002-second.md']);
    assert.ok(records.every((record) => record.folder === null), 'a flat collection tags nothing, so nothing here changes shape');
    assert.deepEqual(ADR_LIFECYCLE_FOLDERS, ['proposed', 'archive'], 'TK-002 reuses this exact closed set');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

// The Spec's own count (30 files at an earlier anchor) is a floor, not a
// pin: the build re-counts the real corpus at the candidate under test so a
// silently dropped link is visible instead of trusting a stale prose number.
// A Markdown link is for a reader, so it is checked literally: identity-based
// fallback belongs to `superseded_by` only, never to a body link. Falling
// back to identity here would let a genuinely wrong relative path pass as
// long as some record with that basename exists anywhere in the collection.
test('every intra-ADR link in the real corpus resolves literally, and the re-counted totals are asserted', () => {
  const records = listAdrs(root);
  let totalLinks = 0;
  let filesWithLink = 0;
  for (const record of records) {
    let countForRecord = 0;
    for (const link of localLinks(record.body)) {
      const base = path.basename(link.split('?')[0]);
      if (!ID_PATTERN.test(base)) continue;
      countForRecord += 1;
      const literal = path.resolve(path.dirname(record.filePath), link);
      assert.ok(fs.existsSync(literal), `${record.relativePath} links to unresolved ${link}`);
    }
    totalLinks += countForRecord;
    if (countForRecord > 0) filesWithLink += 1;
  }
  assert.equal(filesWithLink, 33, 're-count of ADR files carrying an intra-ADR link at this candidate');
  assert.equal(totalLinks, 58, 're-count of total intra-ADR link edges at this candidate');
});

// S-00I TK-001 review correction: a link is validated literally, never
// resolved by identity. A record moving into a lifecycle subfolder without
// its incoming links being rewritten is exactly the case `validateAdrs` must
// now catch as `invalid-adr`, not silently accept.
test('an intra-ADR link whose literal relative path does not match where the target lives is reported unresolved, not accepted by identity', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench/docs/adr');
    fs.mkdirSync(path.join(collection, 'proposed'), { recursive: true });
    fs.writeFileSync(path.join(collection, 'proposed', '0002-second.md'), adr('proposed'));
    fs.writeFileSync(path.join(collection, '0001-first.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n', 'See [the follow-up](0002-second.md).\n\n'));
    const records = listAdrs(dir);
    const record = records.find((item) => item.name === '0001-first.md');
    const [link] = localLinks(record.body);
    const literal = path.resolve(path.dirname(record.filePath), link);
    assert.ok(!fs.existsSync(literal), 'the literal relative path must not exist once the target lives in a subfolder');
    const findings = validateAdrs(dir).filter((item) => item.code === 'invalid-adr');
    assert.ok(findings.some((item) => item.adr === '0001-first.md' && /0002-second\.md/.test(item.message)), 'a link that does not literally resolve must be reported, never silently accepted because a same-named record exists elsewhere');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

// Red at the pre anchor 956c6a4: this exact fixture (a record whose link
// points at a wrong relative path) produced no invalid-adr finding there,
// proven separately in a throwaway detached worktree. At this candidate it
// must, and it must not be confused with a link into an ignored collection.
test('a link across lifecycle folders (archive linking up to the top level) still resolves literally when it is correct', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench/docs/adr');
    fs.mkdirSync(path.join(collection, 'archive'), { recursive: true });
    fs.writeFileSync(path.join(collection, '0001-top.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
    fs.writeFileSync(path.join(collection, 'archive', '0002-archived.md'), adr('deprecated', 'deprecation_reason: superseded content.\n', 'See [0001-top.md](../0001-top.md).\n\n'));
    assert.deepEqual(validateAdrs(dir).filter((item) => item.code === 'invalid-adr'), [], 'a correct cross-folder relative link must not be reported');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('history output safety is preflighted before either projection changes', () => {
  const dir = fixture(); const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'adr-history-'));
  try {
    const collection = path.join(dir, 'workbench/docs/adr');
    const target = path.join(outside, 'target'); fs.writeFileSync(target, 'retain');
    fs.writeFileSync(path.join(collection, REGISTER_NAME), 'old register');
    fs.symlinkSync(target, path.join(collection, 'HISTORY.md'));
    assert.throws(() => writeRegister(dir));
    assert.equal(fs.readFileSync(path.join(collection, REGISTER_NAME), 'utf8'), 'old register');
    assert.equal(fs.readFileSync(target, 'utf8'), 'retain');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); fs.rmSync(outside, { recursive: true, force: true }); }
});

// S-00I TK-002: lifecycle moves from frontmatter `status` to folder location.
// An accepted record stays at the top level, a proposed record lives in
// `proposed/`, and a superseded/deprecated record lives in `archive/` - all
// with their `status` key removed, since the folder now carries it. Register
// and History are rendered purely from location (and, inside `archive/`,
// from the `superseded_by`/`deprecation_reason` facts that distinguish
// superseded from deprecated), so a migrated collection must render
// identically to the flat, frontmatter-carrying collection it replaces, and
// `validateAdrs`/`doctor` must report nothing for it.
test('a collection with lifecycle expressed by folder location, not frontmatter status, renders the same register and history as the flat frontmatter collection, and validates clean', () => {
  const flat = fixture();
  const foldered = fixture();
  try {
    const flatCollection = path.join(flat, 'workbench/docs/adr');
    fs.writeFileSync(path.join(flatCollection, '0001-active.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
    fs.writeFileSync(path.join(flatCollection, '0002-draft.md'), adr('proposed'));
    fs.writeFileSync(path.join(flatCollection, '0003-old.md'), adr('superseded', 'superseded_by: 0001-active.md\n'));
    writeRegister(flat);
    assert.deepEqual(validateAdrs(flat), []);
    const flatRegister = fs.readFileSync(path.join(flatCollection, REGISTER_NAME), 'utf8');
    const flatHistory = fs.readFileSync(path.join(flatCollection, 'HISTORY.md'), 'utf8');

    const folderedCollection = path.join(foldered, 'workbench/docs/adr');
    fs.mkdirSync(path.join(folderedCollection, 'proposed'), { recursive: true });
    fs.mkdirSync(path.join(folderedCollection, 'archive'), { recursive: true });
    // Same three records, same content minus the now folder-carried `status`
    // key: an accepted record needs no frontmatter beyond date and title.
    fs.writeFileSync(path.join(folderedCollection, '0001-active.md'), '---\ndate: 2026-09-04\ncanonicalized_in:\n  - AGENTS.md\n---\n\n# A decision\n\nThe decision.\n\nProvenance: owner decision.\n');
    fs.writeFileSync(path.join(folderedCollection, 'proposed', '0002-draft.md'), '---\ndate: 2026-09-04\n---\n\n# A decision\n\nThe decision.\n\nProvenance: owner decision.\n');
    fs.writeFileSync(path.join(folderedCollection, 'archive', '0003-old.md'), '---\ndate: 2026-09-04\nsuperseded_by: 0001-active.md\n---\n\n# A decision\n\nThe decision.\n\nProvenance: owner decision.\n');
    writeRegister(foldered);
    assert.deepEqual(validateAdrs(foldered), [], 'a fully folder-migrated collection must validate with no findings at all, not even attention');

    const folderedRegister = fs.readFileSync(path.join(folderedCollection, REGISTER_NAME), 'utf8');
    const folderedHistory = fs.readFileSync(path.join(folderedCollection, 'HISTORY.md'), 'utf8');
    // REGISTER.md holds only the accepted record, which never moves, so it is
    // fully byte-identical - the proof that the projection reads location,
    // not coincidence, for every record whose lifecycle does not change.
    assert.equal(folderedRegister, flatRegister, 'REGISTER.md must be byte-identical for every record whose lifecycle does not change');
    // HISTORY.md carries the two moved records too. Their status/title/date/
    // owner cells stay identical either way; only their link legitimately
    // gains the folder prefix a reader now needs to actually reach them -
    // the opposite would mean the projection ships a link that 404s.
    assert.equal(folderedHistory, flatHistory.replace('(0002-draft.md)', '(proposed/0002-draft.md)').replace('(0003-old.md)', '(archive/0003-old.md)'), 'HISTORY.md must be identical apart from the moved records\' hrefs gaining their real folder prefix');
  } finally {
    fs.rmSync(flat, { recursive: true, force: true });
    fs.rmSync(foldered, { recursive: true, force: true });
  }
});

// A record inside a lifecycle folder that still carries a leftover `status`
// key is a half-migrated room: visible as a new, non-blocking finding, never
// silently reinterpreted in either direction.
test('a leftover status frontmatter that disagrees with its lifecycle folder is a visible, non-blocking finding', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench/docs/adr');
    fs.mkdirSync(path.join(collection, 'proposed'), { recursive: true });
    fs.writeFileSync(path.join(collection, 'proposed', '0001-half-migrated.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
    writeRegister(dir);
    const findings = validateAdrs(dir);
    assert.ok(findings.some((item) => item.code === 'disagreeing-status' && item.adr === '0001-half-migrated.md'), 'a record physically moved to proposed/ that still says accepted must be flagged');
    assert.ok(findings.every((item) => item.code !== 'disagreeing-status' || item.severity === 'attention'), 'a disagreeing status never blocks');
    assert.equal(doctor(dir).some((item) => item.blocks !== 'none'), false, 'doctor is not blocked by a disagreeing status');

    // A record at the top level carries no folder-mandated status, so an
    // explicit non-accepted status there is not itself a disagreement - a
    // flat, unmigrated corpus (or one that keeps `rejected`, which has no
    // dedicated folder) must not be flagged just for sitting at top level.
    fs.writeFileSync(path.join(collection, '0002-flat.md'), adr('proposed'));
    writeRegister(dir);
    assert.deepEqual(validateAdrs(dir).filter((item) => item.code === 'disagreeing-status' && item.adr === '0002-flat.md'), []);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

// S-00I TK-002: the one-shot migration itself. It must show the reviewer
// renames (git mv), strip the now folder-carried `status` key, rewrite every
// live intra-collection and external Markdown link a move invalidates, and
// leave an append-only evidence-table reference alone as counted history.
test('migrate-folders moves records by git mv, strips status, rewrites intra-collection and external references, and leaves an append-only evidence reference as counted history', () => {
  const dir = gitFixture();
  try {
    const collection = path.join(dir, 'workbench/docs/adr');
    fs.writeFileSync(path.join(collection, '0001-active.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
    // 0002 links to 0001 (unmoved) - once 0002 itself moves into proposed/,
    // that link must gain a `../` prefix even though 0001 never moves.
    fs.writeFileSync(path.join(collection, '0002-draft.md'), adr('proposed', '', 'See [ADR-0001](0001-active.md).\n\n'));
    fs.writeFileSync(path.join(collection, '0003-old.md'), adr('superseded', 'superseded_by: 0001-active.md\n'));
    writeRegister(dir);

    const specDir = path.join(dir, 'workbench/specs/S-901-demo');
    fs.mkdirSync(specDir, { recursive: true });
    const specFile = path.join(specDir, 'SPEC.md');
    fs.writeFileSync(specFile, [
      '# S-901 - Demo',
      '',
      '## Decisions And Contracts',
      '',
      '- See [ADR-0002](../../docs/adr/0002-draft.md).',
      '',
      '## Append-Only Evidence And Execution Log',
      '',
      '| Date | Commit | Claim | Method | Result |',
      '|---|---|---|---|---|',
      '| 2026-01-01 | abc123 | mentions [ADR-0002](../../docs/adr/0002-draft.md) | test | historical |',
      '',
      '## Completion Result',
      '',
      'Not started.',
      ''
    ].join('\n'));
    gitCommitAll(dir, 'initial corpus');

    const result = migrateLifecycleFolders(dir);
    assert.equal(result.usesGit, true);
    assert.deepEqual(result.moved.proposed, ['workbench/docs/adr/0002-draft.md']);
    assert.deepEqual(result.moved.archive, ['workbench/docs/adr/0003-old.md']);
    assert.deepEqual(result.stripped.sort(), ['workbench/docs/adr/0001-active.md', 'workbench/docs/adr/0002-draft.md', 'workbench/docs/adr/0003-old.md'].sort());

    // git mv, not delete-plus-add: the candidate must show renames.
    const status = gitStatus(dir);
    assert.match(status, /^R  workbench\/docs\/adr\/0002-draft\.md -> workbench\/docs\/adr\/proposed\/0002-draft\.md$/m);
    assert.match(status, /^R  workbench\/docs\/adr\/0003-old\.md -> workbench\/docs\/adr\/archive\/0003-old\.md$/m);

    const movedDraft = fs.readFileSync(path.join(collection, 'proposed', '0002-draft.md'), 'utf8');
    assert.doesNotMatch(movedDraft, /^status:/m, 'the folder-carried status key must be stripped');
    assert.match(movedDraft, /\[ADR-0001\]\(\.\.\/0001-active\.md\)/, 'an outgoing link must gain the ../ its mover needs, even though the target itself never moved');

    const movedOld = fs.readFileSync(path.join(collection, 'archive', '0003-old.md'), 'utf8');
    assert.doesNotMatch(movedOld, /^status:/m);
    assert.match(movedOld, /superseded_by: 0001-active\.md/, 'superseded_by is a fact, not lifecycle, and stays');

    const active = fs.readFileSync(path.join(collection, '0001-active.md'), 'utf8');
    assert.doesNotMatch(active, /^status:/m, 'an unmoved accepted record is also stripped');

    assert.deepEqual(validateAdrs(dir), [], 'a fully migrated collection must validate with no findings at all');

    const specContent = fs.readFileSync(specFile, 'utf8');
    assert.match(specContent, /## Decisions And Contracts\n\n- See \[ADR-0002\]\(\.\.\/\.\.\/docs\/adr\/proposed\/0002-draft\.md\)\./, 'a live reference outside the collection must be rewritten to the moved record\'s real path');
    assert.match(specContent, /mentions \[ADR-0002\]\(\.\.\/\.\.\/docs\/adr\/0002-draft\.md\)/, 'the append-only evidence row must keep its historical, now-stale path untouched');

    const specRelative = 'workbench/specs/S-901-demo/SPEC.md';
    assert.equal(result.referencesRewritten[specRelative], 1);
    assert.equal(result.historicalReferencesLeft[specRelative], 1);
    assert.ok(result.referencesRewritten['workbench/docs/adr/proposed/0002-draft.md'] >= 1);

    assert.equal(fs.readFileSync(path.join(collection, REGISTER_NAME), 'utf8'), renderRegister(listAdrs(dir)), 'register must be regenerated by the migration itself');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('migrate-folders refuses a dirty working tree', () => {
  const dir = gitFixture();
  try {
    const collection = path.join(dir, 'workbench/docs/adr');
    fs.writeFileSync(path.join(collection, '0001-draft.md'), adr('proposed'));
    writeRegister(dir);
    gitCommitAll(dir, 'initial corpus');
    fs.appendFileSync(path.join(collection, '0001-draft.md'), '\n');
    assert.throws(() => migrateLifecycleFolders(dir), /dirty working tree/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('migrate-folders refuses a second run once the collection already reflects folder lifecycle', () => {
  const dir = gitFixture();
  try {
    const collection = path.join(dir, 'workbench/docs/adr');
    fs.writeFileSync(path.join(collection, '0001-draft.md'), adr('proposed'));
    writeRegister(dir);
    gitCommitAll(dir, 'initial corpus');
    migrateLifecycleFolders(dir);
    gitCommitAll(dir, 'migrate');
    assert.throws(() => migrateLifecycleFolders(dir), /nothing to migrate/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

// The command must still work by ordinary file move outside a Git checkout -
// a fixture with no `.git` at all, as opposed to every test above.
test('migrate-folders moves records without git when the collection is not inside a Git working tree', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench/docs/adr');
    fs.writeFileSync(path.join(collection, '0001-draft.md'), adr('proposed'));
    writeRegister(dir);
    const result = migrateLifecycleFolders(dir);
    assert.equal(result.usesGit, false);
    assert.deepEqual(result.moved.proposed, ['workbench/docs/adr/0001-draft.md']);
    assert.ok(fs.existsSync(path.join(collection, 'proposed', '0001-draft.md')));
    assert.ok(!fs.existsSync(path.join(collection, '0001-draft.md')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('stripFrontmatterKey removes only the named scalar key and preserves a CRLF record\'s terminator', () => {
  const crlf = '---\r\nstatus: proposed\r\ndate: 2026-09-04\r\n---\r\n\r\n# A decision\r\n';
  const result = stripFrontmatterKey(crlf, 'status');
  assert.equal(result.removed, true);
  assert.equal(result.content, '---\r\ndate: 2026-09-04\r\n---\r\n\r\n# A decision\r\n');
  assert.doesNotMatch(result.content, /(?<!\r)\n/);
  const again = stripFrontmatterKey(result.content, 'status');
  assert.equal(again.removed, false);
  assert.equal(again.content, result.content);
});

test('missing and stale history are reported without rewriting history',()=>{
 const dir=fixture();try{
  const file=path.join(dir,'workbench/docs/adr/0001-decision.md');fs.writeFileSync(file,adr('accepted','canonicalized_in:\n  - AGENTS.md\n'));writeRegister(dir);
  const history=path.join(dir,'workbench/docs/adr/HISTORY.md');
  for(const state of ['missing','stale']){
   if(state==='missing')fs.rmSync(history);else fs.writeFileSync(history,'stale history');
   assert.ok(validateAdrs(dir).some(x=>x.code==='stale-register'&&x.message.includes('HISTORY.md')));
   if(state==='stale')assert.equal(fs.readFileSync(history,'utf8'),'stale history');
  }
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
