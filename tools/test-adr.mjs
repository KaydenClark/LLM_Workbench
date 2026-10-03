#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { ADR_LIFECYCLE_FOLDERS, ID_PATTERN, REGISTER_NAME, acceptRecord, deprecateRecord, inspectRecord, listAdrs, listRecords, localLinks, migrateLifecycleFolders, newAdr, normalizeAdrs, parseFrontmatter, recordHistory, renderRegister, searchRecords, showRecord, stripFrontmatterKey, supersedeRecord, validateAdrs, validateDecisionRecords, writeDecisionRegisters, writeRegister } from '../workbench/tools/adr.mjs';
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

// S-00I TK-002 corrective: folder is lifecycle, so a newly created record
// must land in the folder its status implies (`proposed/`) and must not
// carry a `status` key at all - a fresh `adr new` re-introducing that key
// is exactly the one-record-at-a-time drift back toward mixed state that
// `migrate-folders` (a one-shot command) does not repeatedly correct.
test('new allocates an unused letter-bearing label, lands in the folder its status implies, and carries no status key', () => {
  const dir = fixture();
  try {
    fs.writeFileSync(path.join(dir, 'workbench', 'docs', 'adr', '0007-gap.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
    const created = newAdr(dir, { title: 'Checkpoints are the durable session record', date: '2026-09-04' });
    assert.equal(created.number, '000A');
    assert.equal(path.basename(created.filePath), '000A-checkpoints-are-the-durable-session-record.md');
    assert.equal(path.dirname(created.filePath), path.join(dir, 'workbench', 'docs', 'adr', 'proposed'), 'a new record must be created inside the proposed/ folder its own default status implies');
    const content = fs.readFileSync(created.filePath, 'utf8');
    assert.match(content, /^---\ndate: 2026-09-04\ncanonicalized_in:\n  - AGENTS\.md\n---/);
    assert.doesNotMatch(content, /^status:/m, 'the folder already carries the lifecycle a status key would only duplicate');
    assert.match(content, /^# Checkpoints are the durable session record$/m);
    const record = listAdrs(dir).find((item) => item.name === '000A-checkpoints-are-the-durable-session-record.md');
    assert.equal(record.status, 'proposed', 'the folder alone must still resolve the correct effective lifecycle');
    assert.deepEqual(validateAdrs(dir).filter((item) => item.adr === record.name), [], 'a freshly created record must validate clean with no status key');
    const cli = spawnSync(process.execPath, [adrTool, 'new', '--path', dir, '--title', 'Another decision'], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    const cliCreated = JSON.parse(cli.stdout);
    assert.equal(cliCreated.number, '000B');
    assert.equal(path.dirname(cliCreated.filePath), path.join(dir, 'workbench', 'docs', 'adr', 'proposed'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// S-01W TK-002Q: ADR labels follow the one artifact policy (uppercase
// `0-9A-Z`, minimum width four, letter-bearing). The case-folded base62
// allocator ADRs used before could never emit a lowercase label - every
// lowercase candidate shares its collision key with an earlier uppercase
// one - so this is a characterization of the delivered sequence past `000Z`,
// not a red case: legacy files keep their names and bytes and still reserve
// their identities.
test('new continues past 000Z to an uppercase width-four label and leaves legacy files byte-identical', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench', 'docs', 'adr');
    const body = adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n');
    const legacy = [];
    for (const ordinal of '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ') legacy.push(ordinal === 'Q' ? '00Q' : `000${ordinal}`);
    for (const label of legacy) fs.writeFileSync(path.join(collection, `${label}-legacy.md`), body);
    const before = new Map(legacy.map((label) => [label, fs.readFileSync(path.join(collection, `${label}-legacy.md`))]));
    const created = newAdr(dir, { title: 'Past the single letters', date: '2026-09-26' });
    assert.equal(created.number, '001A', 'the next letter-bearing uppercase label after 000Z; the short 00Q reserves 000Q');
    assert.match(created.number, /^[0-9A-Z]{4,}$/);
    for (const [label, bytes] of before) assert.deepEqual(fs.readFileSync(path.join(collection, `${label}-legacy.md`)), bytes, `${label} keeps its name and bytes`);
    writeRegister(dir);
    assert.match(fs.readFileSync(path.join(collection, 'HISTORY.md'), 'utf8'), /\[00Q\]\(00Q-legacy\.md\)/, 'the register still lists a short legacy label as written');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Lane F observed `adr new` proposing a label another pushed branch already
// held, because ADR allocation read only the local tree. `next-id` reads every
// remote tip (ADR-000O); ADR allocation now reserves the same way.
test('new reserves ADR labels held only at a remote tip, in every spelling, without touching the local tree', () => {
  const dir = gitFixture();
  const remote = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-adr-remote-'));
  const git = (...args) => {
    const result = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
    assert.equal(result.status, 0, `git ${args.join(' ')}: ${result.stderr}`);
    return result.stdout;
  };
  try {
    const collection = path.join(dir, 'workbench', 'docs', 'adr');
    fs.writeFileSync(path.join(collection, '0001-local.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
    git('checkout', '--quiet', '-b', 'main');
    gitCommitAll(dir, 'Seed the room');
    assert.equal(spawnSync('git', ['init', '--quiet', '--bare', remote]).status, 0);
    git('remote', 'add', 'origin', remote);
    git('push', '--quiet', 'origin', 'main');
    git('checkout', '--quiet', '-b', 'claude/other-lane');
    for (const folder of ['proposed', 'archive']) fs.mkdirSync(path.join(collection, folder), { recursive: true });
    fs.writeFileSync(path.join(collection, 'proposed', '000A-held-on-another-branch.md'), adr('proposed'));
    fs.writeFileSync(path.join(collection, 'archive', '00b-short-lowercase-legacy.md'), adr('deprecated', 'deprecation_reason: fixture\n'));
    gitCommitAll(dir, 'Another lane adds two ADRs');
    git('push', '--quiet', 'origin', 'claude/other-lane');
    git('checkout', '--quiet', 'main');
    git('branch', '--quiet', '-D', 'claude/other-lane');
    git('fetch', '--quiet', 'origin');
    assert.equal(fs.existsSync(path.join(collection, 'proposed', '000A-held-on-another-branch.md')), false, 'the local tree lacks the remote-only record');
    const created = newAdr(dir, { title: 'Local decision', date: '2026-09-26' });
    assert.equal(created.number, '000C', 'ADR-000A and the short lowercase ADR-00b at origin/claude/other-lane are occupied');
    const cli = spawnSync(process.execPath, [adrTool, 'new', '--path', dir, '--title', 'Second local decision'], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    assert.equal(JSON.parse(cli.stdout).number, '000D');
    assert.deepEqual(fs.readdirSync(path.join(collection, 'proposed')).sort(), ['000C-local-decision.md', '000D-second-local-decision.md'], 'nothing from the remote tip is written locally');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(remote, { recursive: true, force: true });
  }
});

// TK-002Q review corrective: a remote tip's declared `adr` collection is
// held to the same `isSafeRelative` rule the local manifest uses, and an
// unreadable tip refuses, so allocation never scans the wrong tree or
// under-reserves. Each refusal writes nothing.
function remoteRoom() {
  const dir = gitFixture();
  const remote = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-adr-remote-'));
  const git = (...args) => {
    const result = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
    assert.equal(result.status, 0, `git ${args.join(' ')}: ${result.stderr}`);
    return result.stdout.trim();
  };
  fs.writeFileSync(path.join(dir, 'workbench', 'docs', 'adr', '0001-local.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
  git('checkout', '--quiet', '-b', 'main');
  gitCommitAll(dir, 'Seed the room');
  assert.equal(spawnSync('git', ['init', '--quiet', '--bare', remote]).status, 0);
  git('remote', 'add', 'origin', remote);
  git('push', '--quiet', 'origin', 'main');
  const cleanup = () => { fs.rmSync(dir, { recursive: true, force: true }); fs.rmSync(remote, { recursive: true, force: true }); };
  return { dir, git, cleanup };
}

function publishRemoteBranch({ dir, git }, change) {
  git('checkout', '--quiet', '-b', 'claude/other-lane');
  change();
  gitCommitAll(dir, 'Another lane changes its tree');
  git('push', '--quiet', 'origin', 'claude/other-lane');
  git('checkout', '--quiet', 'main');
  git('branch', '--quiet', '-D', 'claude/other-lane');
  git('fetch', '--quiet', 'origin');
}

function assertAdrNewRefuses(dir, pattern) {
  const collection = path.join(dir, 'workbench', 'docs', 'adr');
  const before = fs.readdirSync(collection, { recursive: true }).sort();
  assert.throws(() => newAdr(dir, { title: 'Must refuse', date: '2026-09-26' }), pattern);
  const cli = spawnSync(process.execPath, [adrTool, 'new', '--path', dir, '--title', 'Must refuse'], { cwd: dir, encoding: 'utf8' });
  assert.notEqual(cli.status, 0, cli.stdout);
  assert.match(cli.stderr + cli.stdout, pattern);
  assert.deepEqual(fs.readdirSync(collection, { recursive: true }).sort(), before, 'a refusal writes nothing');
  assert.equal(gitStatus(dir), '', 'the working tree stays clean');
}

for (const [label, declared] of [['dot', '.'], ['dot-prefixed', './workbench/docs/adr'], ['backslash', 'workbench\\docs\\adr'], ['whitespace', 'workbench/docs/my adr'], ['non-workbench', 'docs/adr']]) {
  test(`new refuses a remote tip whose manifest declares an unsafe adr collection (${label})`, () => {
    const room = remoteRoom();
    try {
      publishRemoteBranch(room, () => {
        const manifestFile = path.join(room.dir, 'workbench', 'manifest.json');
        const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
        manifest.collections.adr = declared;
        fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
      });
      assertAdrNewRefuses(room.dir, /unsafe adr collection at refs\/remotes\/origin\/claude\/other-lane/);
    } finally { room.cleanup(); }
  });
}

test('new refuses a remote tip whose manifest is malformed JSON', () => {
  const room = remoteRoom();
  try {
    publishRemoteBranch(room, () => fs.writeFileSync(path.join(room.dir, 'workbench', 'manifest.json'), '{ "collections": '));
    assertAdrNewRefuses(room.dir, /malformed manifest at refs\/remotes\/origin\/claude\/other-lane/);
  } finally { room.cleanup(); }
});

test('new refuses an unreadable remote tip: a tip that is not a commit and a commit whose tree is missing', () => {
  const room = remoteRoom();
  try {
    const blob = spawnSync('git', ['-C', room.dir, 'hash-object', '-w', '--stdin'], { input: 'not a tree\n', encoding: 'utf8' }).stdout.trim();
    room.git('update-ref', 'refs/remotes/origin/blob-tip', blob);
    assertAdrNewRefuses(room.dir, /Cannot reserve ADR labels from refs\/remotes\/origin\/blob-tip/);
    room.git('update-ref', '-d', 'refs/remotes/origin/blob-tip');
    const tree = spawnSync('git', ['-C', room.dir, 'mktree'], { input: `100644 blob ${blob}\tstray.md\n`, encoding: 'utf8' }).stdout.trim();
    const commit = room.git('commit-tree', tree, '-m', 'Tip with a missing tree');
    room.git('update-ref', 'refs/remotes/origin/missing-tree', commit);
    fs.rmSync(path.join(room.dir, '.git', 'objects', tree.slice(0, 2), tree.slice(2)));
    assertAdrNewRefuses(room.dir, /Cannot reserve ADR labels from refs\/remotes\/origin\/missing-tree/);
  } finally { room.cleanup(); }
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
      '0001-bare.md:date',
      '0002-partial.md:date',
      '0003-crlf.md:date'
    ], 'S-00I TK-003: normalize inserts only date now - status is folder-derived (ADR-000I) and a status key normalize invented would silently drift a migrated corpus');

    assert.equal(fs.readFileSync(path.join(collection, '0001-bare.md'), 'utf8'), `---\ndate: 2026-09-06\n---\n\n${bare}`);
    assert.equal(fs.readFileSync(path.join(collection, '0002-partial.md'), 'utf8'), '---\nstatus: accepted\ncanonicalized_in:\n  - AGENTS.md\ndate: 2026-09-06\n---\n\n# A partial decision\n\nThe decision.\n');
    const normalizedCrlf = fs.readFileSync(path.join(collection, '0003-crlf.md'), 'utf8');
    assert.equal(normalizedCrlf, '---\r\nstatus: proposed\r\ndate: 2026-09-06\r\n---\r\n\r\n# A CRLF decision\r\n\r\nThe decision.\r\n');
    assert.doesNotMatch(normalizedCrlf, /(?<!\r)\n/, 'a CRLF record must not gain an LF-terminated key');

    writeRegister(dir);
    // 0001-bare never declared a status and lives at the top level, so it is
    // now an ordinary implicitly-`accepted` record (folder-derived, ADR-000I)
    // with no canonicalized_in owner - a decision only its author can make,
    // which normalize must never invent. 0002 and 0003 already declared their
    // own status and validate cleanly.
    const remaining = validateAdrs(dir);
    assert.deepEqual(remaining.map((item) => item.code), ['invalid-adr']);
    assert.match(remaining[0].message, /0001-bare\.md is accepted but names no canonicalized_in owner/);
    assert.deepEqual(normalizeAdrs(dir, { date: '2026-09-06' }).changed, [], 'normalize is idempotent');

    const cli = spawnSync(process.execPath, [adrTool, 'normalize', '--path', dir, '--date', '2026-09-06', '--json'], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    assert.deepEqual(JSON.parse(cli.stdout).changed, []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// S-00I TK-003, in passing: red before the fix above - a record already
// migrated to folder lifecycle (S-00I TK-002) declares no `status` key at
// all, by design (the folder, or the top-level default, carries it). The old
// `normalizeAdrs` treated that absence as "missing" and would have inserted
// `status: proposed` into it, silently asserting a lifecycle the folder
// already contradicts. The fixed version inserts only `date`, so running
// normalize on an already-migrated corpus changes nothing.
test('normalize on an already folder-migrated corpus inserts no status key and changes nothing once dated', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench/docs/adr');
    // Top-level, implicitly accepted (ADR-000I default), already dated, no
    // status key - exactly the shape TK-002's migration leaves behind.
    fs.writeFileSync(path.join(collection, '0001-migrated.md'), '---\ndate: 2026-09-04\ncanonicalized_in:\n  - AGENTS.md\n---\n\n# A migrated decision\n\nThe decision.\n\nProvenance: owner decision.\n');
    fs.mkdirSync(path.join(collection, 'proposed'), { recursive: true });
    fs.writeFileSync(path.join(collection, 'proposed', '0002-migrated-proposed.md'), '---\ndate: 2026-09-04\n---\n\n# A migrated proposal\n\nThe decision.\n\nProvenance: owner decision.\n');
    writeRegister(dir);
    assert.deepEqual(validateAdrs(dir), [], 'a folder-migrated corpus with dates already present validates with nothing to repair');

    assert.deepEqual(normalizeAdrs(dir, { date: '2026-09-06' }).changed, [], 'normalize must change nothing: both records already carry a date and neither is missing a status key any more, because folder is lifecycle now');
    assert.doesNotMatch(fs.readFileSync(path.join(collection, '0001-migrated.md'), 'utf8'), /^status:/m, 'normalize must never reintroduce a status key into a folder-migrated record');
    assert.doesNotMatch(fs.readFileSync(path.join(collection, 'proposed', '0002-migrated-proposed.md'), 'utf8'), /^status:/m);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

// S-00I TK-003: every accepted ADR naming a live Spec path (the Decisions
// And Contracts direction of ADR-to-spec reference) must still resolve once
// Spec directories can move between lifecycle folders. The Spec's own text
// names 19 accepted records at an earlier anchor; re-counted here at the
// candidate under test so a silently broken reference is caught rather than
// trusted to stale prose - the same discipline the intra-ADR link corpus
// test above already applies.
test('every accepted-ADR-to-spec reference in the real corpus resolves literally, and the re-counted totals are asserted', () => {
  const records = listAdrs(root).filter((record) => record.status === 'accepted');
  let totalLinks = 0;
  let filesWithLink = 0;
  for (const record of records) {
    let countForRecord = 0;
    for (const link of localLinks(record.body)) {
      const literal = path.resolve(path.dirname(record.filePath), link.split('#')[0]);
      const relative = path.relative(root, literal).split(path.sep).join('/');
      if (!relative.startsWith('workbench/specs/')) continue;
      countForRecord += 1;
      assert.ok(fs.existsSync(literal), `${record.relativePath} links to unresolved Spec path ${link}`);
    }
    totalLinks += countForRecord;
    if (countForRecord > 0) filesWithLink += 1;
  }
  // TK-004 activates G/I: G routes its S-00P decision owner; I routes S-00I/S-00J.
  // ADR-000X (the workflow verbs) routes the two Landmark Tracker Specs it leaves with the Tracker work.
  // S-004F TK-005Q: each corrective-work amendment (ADR-000F, 000G, 000H, 000I, 000R, 000U) routes the Corrective Work Rules Spec.
  assert.equal(filesWithLink, 29, 're-count of accepted ADR files carrying a live Spec-path reference at this candidate');
  assert.equal(totalLinks, 39, 're-count of total accepted-ADR-to-spec link edges at this candidate');
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
  // TK-004 adds six decision-route edges; retained proposal history remains linked.
  // ADR-000R (the Wiki definition) links its two partially superseded records.
  // ADR-000S (Destination Decision Records) and ADR-000T (the read words) add two linked records.
  // ADR-000U (landmarks), ADR-000V (roles) and ADR-000W (Contract carriers) add three linked records.
  // ADR-000X (the workflow verbs) adds one linked record; ADR-000Y (promotion) links none.
  // S-004F TK-005Q: the corrective-work amendments in ADR-000F, ADR-000G, ADR-000H, ADR-000I, ADR-000R and ADR-000U add seven edges to the destination records.
  assert.equal(filesWithLink, 47, 're-count of ADR files carrying an intra-ADR link at this candidate');
  // S-004H TK-008C: ADR-000G's workflow-map route moved from the Blueprint's retired Desired Lifecycle to the workflow Wiki page, one more counted edge.
  assert.equal(totalLinks, 117, 're-count of total intra-ADR link edges at this candidate');
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

    // git mv, not delete-plus-add: the candidate must show renames (status
    // `R`, with a trailing `M` since the move also stripped `status` and
    // rewrote a link, so the working tree differs from the staged rename too).
    const status = gitStatus(dir);
    assert.match(status, /^R. workbench\/docs\/adr\/0002-draft\.md -> workbench\/docs\/adr\/proposed\/0002-draft\.md$/m);
    assert.match(status, /^R. workbench\/docs\/adr\/0003-old\.md -> workbench\/docs\/adr\/archive\/0003-old\.md$/m);

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

// TK-004 checks active decisions separately from retained proposal history.
// Mutations keep each effective lifecycle unchanged: acceptance alone is not proof.
function workflowCorpus() {
  const records = listAdrs(root);
  return {
    records: new Map(['000F', '000G', '000H', '000I'].map(id => {
      const record = records.find(item => item.name.startsWith(`${id}-`));
      assert.ok(record, `missing ADR-${id}`);
      return [id, { ...record, body: record.body.split('\n## Historical proposal')[0] }];
    })),
    controls: new Map(['LEXICON.md', 'AGENTS.md', 'RUNBOOK.md', 'BLUEPRINT.md'].map(file => [file, fs.readFileSync(path.join(root, file), 'utf8')]))
  };
}

function assertWorkflowMeaning(corpus) {
  const { records, controls } = corpus;
  const requires = (text, pattern, claim) => assert.match(text.replace(/\s+/g, ' '), pattern, claim);
  for (const [id, record] of records) {
    assert.equal(record.status, 'accepted', `ADR-${id} must be an active accepted decision`);
    assert.equal(record.folder, null, `ADR-${id} belongs in the active roster`);
    for (const owner of ['AGENTS.md', 'LEXICON.md']) {
      assert.ok(record.data.canonicalized_in.includes(owner), `ADR-${id} names ${owner}`);
      assert.ok(controls.has(owner), `ADR-${id} owner ${owner} exists`);
    }
  }
  const g = records.get('000G').body;
  requires(g, /Blueprint owns the grand product destination/, 'Blueprint owns product altitude');
  requires(g, /Spec is a PRD-shaped scoped objective with its own destination/, 'Spec owns the scoped PRD altitude');
  requires(g, /active ADRs, verified Actuality and required evidence/, 'Spec derives from decisions and verified actuality');
  requires(g, /Idea -> Align -> Scope -> Plan -> Implement -> Verify/, 'six confirmed phases');
  requires(g, /prototype is optional, after the Blueprint and before a Spec/i, 'prototype position and optionality');
  assert.doesNotMatch(g, /Blueprint[^.]*owns[^.]*PRD function/i, 'retired Blueprint PRD premise cannot be active');
  const f = records.get('000F').body;
  requires(f, /Dispatcher verifies the whole Spec/, 'Dispatcher owns whole-Spec QA');
  requires(f, /Director then approves the immutable assembled candidate in a separate context before it combines into `integration`/, 'separate Director review precedes integration');
  requires(f, /Worker self-checks[\s\S]*handing back/, 'Worker supplies self-check and proof');
  requires(f, /bootstrap exemption 2/, 'operative Task PR exception remains explicit');
  requires(f, /owner chooses when to QA/, 'owner chooses Human QA timing');
  requires(f, /not the only permitted time/, 'version cadence is not exclusive');
  requires(f, /failed Human QA[\s\S]*Align[\s\S]*appropriate scope/i, 'failed QA returns at implicated scope');
  const consequences = f.match(/\nConsequences:([\s\S]*?)\nProvenance:/)?.[1];
  assert.ok(consequences, 'ADR-000F retains its operational consequences');
  assert.doesNotMatch(consequences.replace(/\s+/g, ' '), /RUNBOOK[^.]*\b(?:remains|pending|awaits)\b[^.]*TK-003/i, 'active ADR-000F must not present delivered TK-003 Runbook procedures as pending');
  requires(consequences, /RUNBOOK carries the delivered Task-record workflow procedures from S-00P TK-003/, 'ADR-000F reflects achieved Runbook procedure delivery');
  const i = records.get('000I').body;
  requires(i, /Folder location is the source of lifecycle truth/, 'folder lifecycle');
  requires(i, /`archive`[\s\S]*permanent[\s\S]*never cleared/i, 'ADR archive is permanent');
  requires(i, /\*\*`retired`\*\* is a transient staging area/, 'retired is transient, distinct from permanent ADR archive');
  requires(i, /reviewed delivery on `integration`, owner approval, verification on `main`, then `complete`, features Wiki capture, retirement and discard/, 'main precedes completion, capture precedes cleanup');
  requires(i, /hold[\s\S]*lifted/i, 'superseded deletion hold resolved');
  requires(i, /stable-path rule[\s\S]*retired/i, 'stable path premise retired');
  requires(i, /Task progress \(`ready`, `in-progress`, `done`\) is distinct from folder lifecycle/, 'Task execution state distinct from folder lifecycle');
  const h = records.get('000H').body;
  // S-004F TK-005Q: the Wiki is evidence, not the destination of corrective work.
  requires(h, /A Wiki claim is never the destination of corrective work: a later gap against delivered work becomes a new Spec/, 'a later gap is a new Spec and the Wiki is never a corrective destination');
  requires(h, /Task's destination is a Spec's acceptance lines, or a Wiki page when the Task's own destination is producing that page/, 'the Wiki-page destination serves a Task that produces the page');
  const lexicon = controls.get('LEXICON.md');
  for (const [term, pattern] of [
    ['Blueprint', /desired finished product/],
    ['Destination Packet', /Spec acceptance lines[\s\S]*or the reconciled Wiki claim/],
    // S-004G TK-006D: the owner's confirmed Align meaning (the inquiry, usually grilling, in which an idea becomes a design concept the owner and the agents share).
    ['Align', /inquiry, usually grilling, in which an idea becomes a design concept the owner and the agents share/],
    ['Design concept', /exists between participants/],
    ['Spec', /scoped objective with its own destination/],
    ['Task', /reaches or repairs a destination/],
    ['Retired', /transient staging/],
    ['Archive', /permanent[\s\S]*ADRs/i],
    ['Assembled-Spec review', /Dispatcher[\s\S]*separate Director[\s\S]*before integration/],
    ['Human QA', /owner-led[\s\S]*chooses[\s\S]*failed findings/],
    ['Feature article', /manifest-declared `features` collection/],
    ['Uncaptured complete', /complete[\s\S]*missing[\s\S]*capture/]
  ]) {
    const row = lexicon.split('\n').find(line => line.startsWith(`| **${term}** |`));
    assert.ok(row, `Lexicon defines ${term}`);
    requires(row, pattern, `Lexicon meaning of ${term}`);
  }
  requires(controls.get('AGENTS.md'), /Dispatcher owns whole-Spec QA[\s\S]*separate Director context reviews/, 'AGENTS carries review roles');
  requires(controls.get('AGENTS.md'), /verification on main -> `complete`/, 'AGENTS carries closure order');
  // A reader follows literal paths and fragments; basename fallback is unsafe.
  for (const [file, text] of [['LEXICON.md', lexicon], ...[...records.values()].map(record => [record.relativePath, record.body])]) {
    for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = decodeURIComponent(match[1]);
      if (/^(?:https?:|mailto:)/.test(target)) continue;
      const [relative, fragment] = target.split('#');
      const resolved = path.resolve(path.dirname(path.join(root, file)), relative || path.basename(file));
      assert.ok(fs.existsSync(resolved), `${file} has missing literal route ${target}`);
      if (!fragment || !resolved.endsWith('.md')) continue;
      const content = controls.get(path.relative(root, resolved)) ?? fs.readFileSync(resolved, 'utf8');
      const anchors = [...content.matchAll(/^#{1,6} (.+)$/gm)].map(match => match[1].toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-'));
      assert.ok(anchors.includes(fragment), `${file} has missing literal heading ${target}`);
    }
  }
}

test('active workflow decisions and Lexicon meanings reconstruct the confirmed owner chain', () => {
  assertWorkflowMeaning(workflowCorpus());
});

test('workflow checks reject substantive and literal-route mutations with accepted status retained', () => {
  assertWorkflowMeaning(workflowCorpus());
  const cases = [
    ['Blueprint PRD', '000G', 'Blueprint owns the grand product destination', 'Blueprint owns the future-facing PRD function'],
    ['Spec altitude', '000G', 'Spec is a PRD-shaped scoped objective with its own destination', 'Spec is only a task list'],
    ['prototype standard', '000G', 'prototype is optional, after the Blueprint and before a Spec', 'prototype is a mandatory Align method'],
    ['Dispatcher QA', '000F', 'Dispatcher verifies the whole\nSpec', 'Worker verifies the whole\nSpec'],
    ['postintegration review', '000F', 'before it combines', 'after it combines'],
    ['exclusive QA cadence', '000F', 'not the only permitted time', 'the only permitted time'],
    ['delivered Runbook presented as pending', '000F', 'Task-record workflow procedures from S-00P TK-003.', "Task-record workflow procedures from S-00P TK-003. RUNBOOK's comprehensive workflow procedure rewrite remains S-00P TK-003 work."],
    ['ADR archive clearing', '000I', 'never cleared', 'cleared after main'],
    ['Task lifecycle conflation', '000I', 'is distinct from folder lifecycle', 'is the folder lifecycle'],
    ['premature capture', '000I', 'then `complete`, features Wiki capture', 'features Wiki capture, then `complete`'],
    ['permanent retirement', '000I', 'transient staging area', 'permanent archive'],
    ['closure before main', '000I', 'verification on `main`, then `complete`', '`complete`, then verification on `main`'],
    ['Wiki becomes a corrective destination', '000H', 'A Wiki claim is never the destination of corrective work', 'A Wiki claim is the destination of corrective work'],
    ['lost ADR route', '000G', '(000F-', '(proposed/000F-']
  ];
  for (const [label, id, before, after] of cases) {
    const corpus = workflowCorpus();
    const record = corpus.records.get(id);
    assert.ok(record.body.includes(before), `${label}: mutation must hit its real source`);
    record.body = record.body.replace(before, after);
    assert.equal(record.status, 'accepted');
    assert.throws(() => assertWorkflowMeaning(corpus), undefined, label);
  }
  const missingOwner = workflowCorpus();
  missingOwner.records.get('000G').data = { ...missingOwner.records.get('000G').data, canonicalized_in: ['BLUEPRINT.md'] };
  assert.throws(() => assertWorkflowMeaning(missingOwner), undefined, 'missing operational owner with accepted lifecycle');
  for (const [label, file, before, after] of [
    ['Context Map route', 'LEXICON.md', '(RUNBOOK.md)', '(MISSING-RUNBOOK.md)'],
    ['Context Map heading', 'LEXICON.md', '(#artifact-ownership-schema)', '(#missing-owner-heading)'],
    ['Packet loses corrective claim', 'LEXICON.md', 'or the reconciled Wiki claim for corrective work', 'only the Spec'],
    ['operational owner claim', 'AGENTS.md', 'Dispatcher owns whole-Spec QA', 'Worker owns whole-Spec QA']
  ]) {
    const corpus = workflowCorpus();
    const content = corpus.controls.get(file);
    assert.ok(content.includes(before), `${label}: mutation must hit its real source`);
    corpus.controls.set(file, content.replace(before, after));
    assert.throws(() => assertWorkflowMeaning(corpus), undefined, label);
  }
});

// S-003X TK-004X: Destination Decision Records (ADR-000S) share this runtime.
// `--kind ddr` selects the manifest-declared `ddr` collection, the `DDR`
// identifier prefix, the destination template and the `invalid-ddr` code;
// every ADR behavior above is unchanged.
function ddrRecord(front = 'canonicalized_in:\n  - BLUEPRINT.md\n', title = 'A destination choice') {
  return `---\ndate: 2026-10-03\nsupersedes:\n${front}---\n\n# ${title}\n\nThe finished product does this, and the owner chose it over the alternative.\n`;
}

test('new --kind ddr writes the next DDR into ddr/proposed with the DDR identifier and the three frontmatter keys, and never writes over an occupied identity', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench', 'docs', 'ddr');
    const created = newAdr(dir, { kind: 'ddr', title: 'Rooms keep destination decisions', date: '2026-10-03' });
    assert.equal(created.kind, 'ddr');
    assert.equal(created.id, 'DDR-000A', 'the first DDR takes the first letter-bearing width-four value');
    assert.equal(created.filePath, path.join(collection, 'proposed', '000A-rooms-keep-destination-decisions.md'));
    const content = fs.readFileSync(created.filePath, 'utf8');
    const { data, body } = parseFrontmatter(content);
    assert.deepEqual(Object.keys(data), ['date', 'supersedes', 'canonicalized_in'], 'a DDR carries exactly the three accepted keys and no status');
    assert.equal(data.date, '2026-10-03');
    assert.deepEqual(data.supersedes, []);
    assert.deepEqual(data.canonicalized_in, ['BLUEPRINT.md']);
    assert.match(body, /^# Rooms keep destination decisions$/m);
    assert.doesNotMatch(content, /landmark/i, 'the landmark field stays open and is not written');
    assert.deepEqual(listAdrs(dir), [], 'writing a DDR adds nothing to the ADR collection');

    const cli = spawnSync(process.execPath, [adrTool, 'new', '--kind', 'ddr', '--path', dir, '--title', 'Second destination choice', '--date', '2026-10-03'], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    const second = JSON.parse(cli.stdout);
    assert.equal(second.id, 'DDR-000B');
    assert.equal(fs.existsSync(path.join(collection, 'proposed', '000B-second-destination-choice.md')), true);

    const adrCreated = newAdr(dir, { title: 'An architecture choice', date: '2026-10-03' });
    assert.equal(adrCreated.id, 'ADR-000A', 'ADR and DDR identifiers are separate namespaces');
    assert.equal(path.dirname(adrCreated.filePath), path.join(dir, 'workbench', 'docs', 'adr', 'proposed'));

    // An unsafe entry holding the next identity refuses before anything is written.
    fs.symlinkSync(path.join(dir, 'missing-target.md'), path.join(collection, 'proposed', '000C-occupied.md'));
    const listing = fs.readdirSync(path.join(collection, 'proposed')).sort();
    assert.throws(() => newAdr(dir, { kind: 'ddr', title: 'Must refuse' }), /ordinary, singly linked DDR file/);
    assert.deepEqual(fs.readdirSync(path.join(collection, 'proposed')).sort(), listing);
    assert.throws(() => newAdr(dir, { kind: 'xdr', title: 'Unknown kind' }), /--kind must be adr or ddr/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('new --kind ddr refuses a room whose manifest does not declare the ddr collection and writes nothing', () => {
  const dir = fixture();
  try {
    const manifestPath = path.join(dir, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    delete manifest.collections.ddr;
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    fs.rmSync(path.join(dir, 'workbench', 'docs', 'ddr'), { recursive: true });
    assert.throws(() => newAdr(dir, { kind: 'ddr', title: 'Too early' }), /ddr collection is not declared.*migrate/);
    assert.equal(fs.existsSync(path.join(dir, 'workbench', 'docs', 'ddr')), false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('validation refuses a DDR whose canonicalized_in names the Wiki in any folder, applies the ADR rules to DDRs as invalid-ddr, and leaves ADR validation unchanged', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench', 'docs', 'ddr');
    fs.writeFileSync(path.join(collection, '000A-accepted.md'), ddrRecord());
    writeRegister(dir, { kind: 'ddr' });
    assert.deepEqual(validateAdrs(dir, { kind: 'ddr' }), [], 'an accepted DDR naming the Blueprint validates');

    fs.writeFileSync(path.join(collection, '000B-wiki-owner.md'), ddrRecord('canonicalized_in:\n  - BLUEPRINT.md\n  - workbench/wiki/SCHEMA.md\n'));
    fs.writeFileSync(path.join(collection, 'proposed', '000C-proposed-wiki.md'), ddrRecord('canonicalized_in:\n  - workbench/wiki\n'));
    fs.writeFileSync(path.join(collection, 'archive', '000D-archived-wiki.md'), '---\ndate: 2026-10-03\nsuperseded_by: 000A-accepted.md\ncanonicalized_in: ./workbench/wiki/MEMORY.md\n---\n\n# Archived\n');
    writeRegister(dir, { kind: 'ddr' });
    const findings = validateAdrs(dir, { kind: 'ddr' });
    assert.deepEqual(findings.filter((item) => item.code === 'invalid-ddr' && /names the Wiki/.test(item.message)).map((item) => item.ddr).sort(),
      ['000B-wiki-owner.md', '000C-proposed-wiki.md', '000D-archived-wiki.md'], 'the Wiki is refused at every lifecycle');
    assert.ok(findings.every((item) => item.code !== 'invalid-adr'), 'DDR findings never use the ADR code');
    assert.ok(findings.every((item) => item.severity === 'error' || item.code !== 'invalid-ddr'));

    fs.writeFileSync(path.join(collection, '000E-undated.md'), '---\ncanonicalized_in:\n  - BLUEPRINT.md\n---\n\n# Undated\n');
    fs.writeFileSync(path.join(collection, 'proposed', '000a-case-variant.md'), ddrRecord(''));
    const shared = validateAdrs(dir, { kind: 'ddr' });
    assert.ok(shared.some((item) => item.code === 'invalid-ddr' && /000E-undated\.md needs a YYYY-MM-DD date/.test(item.message)));
    assert.ok(shared.some((item) => item.code === 'invalid-ddr' && /DDR number 000[Aa] is used by/.test(item.message)));
    assert.ok(shared.some((item) => item.code === 'stale-register' && item.message.includes('workbench/docs/ddr/REGISTER.md')));

    fs.writeFileSync(path.join(dir, 'workbench', 'docs', 'adr', '0001-architecture.md'), adr('accepted', 'canonicalized_in:\n  - workbench/wiki/SCHEMA.md\n'));
    writeRegister(dir);
    assert.deepEqual(validateAdrs(dir), [], 'the Wiki rule is the DDR\'s; ADR validation is unchanged');

    const cli = spawnSync(process.execPath, [adrTool, 'validate', '--path', dir, '--json'], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 1, 'validate without a kind carries DDR errors and exits 1');
    const reported = JSON.parse(cli.stdout);
    assert.ok(reported.some((item) => item.code === 'invalid-ddr'));
    assert.ok(reported.every((item) => item.code !== 'invalid-adr'));
    assert.equal(spawnSync(process.execPath, [adrTool, 'validate', '--kind', 'adr', '--path', dir], { cwd: dir, encoding: 'utf8' }).status, 0, '--kind adr validates only the ADR collection');
    assert.ok(doctor(dir).some((item) => item.code === 'invalid-ddr' && item.scope === 'adr'), 'doctor carries DDR findings');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('register writes the DDR register and history beside the ADR ones, and doctor reports a stale DDR register until it runs', () => {
  const dir = fixture();
  try {
    const collection = path.join(dir, 'workbench', 'docs', 'ddr');
    fs.writeFileSync(path.join(collection, '000A-a-destination-choice.md'), ddrRecord());
    fs.writeFileSync(path.join(dir, 'workbench', 'docs', 'adr', '0001-first.md'), adr('accepted', 'canonicalized_in:\n  - AGENTS.md\n'));
    const stale = doctor(dir).filter((item) => item.code === 'stale-register').map((item) => item.message);
    assert.ok(stale.some((message) => message.includes('workbench/docs/ddr/REGISTER.md')), 'a missing DDR register is visible');
    assert.ok(stale.some((message) => message.includes('workbench/docs/ddr/HISTORY.md')));

    const cli = spawnSync(process.execPath, [adrTool, 'register', '--path', dir], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    const written = JSON.parse(cli.stdout);
    assert.equal(written.count, 1, 'the ADR result keeps its shape');
    assert.equal(written.ddr.count, 1, 'register without a kind also writes the DDR collection');
    const register = fs.readFileSync(path.join(collection, REGISTER_NAME), 'utf8');
    assert.match(register, /^# DDR Register$/m);
    assert.match(register, /^\| DDR \| Title \| Status \| Date \| Canonicalized in \|$/m);
    assert.match(register, /\| \[000A\]\(000A-a-destination-choice\.md\) \| A destination choice \| accepted \| 2026-10-03 \| BLUEPRINT\.md \|/);
    assert.match(fs.readFileSync(path.join(collection, 'HISTORY.md'), 'utf8'), /^# DDR History$/m);
    assert.match(fs.readFileSync(path.join(dir, 'workbench', 'docs', 'adr', REGISTER_NAME), 'utf8'), /^# ADR Register$/m);
    assert.deepEqual(doctor(dir).filter((item) => ['stale-register', 'invalid-ddr', 'invalid-adr'].includes(item.code)), []);
    assert.deepEqual(validateAdrs(dir, { kind: 'ddr' }), []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('new --kind ddr reserves DDR labels held only at a remote tip without touching the local tree', () => {
  const dir = gitFixture();
  const remote = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-ddr-remote-'));
  const git = (...args) => {
    const result = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
    assert.equal(result.status, 0, `git ${args.join(' ')}: ${result.stderr}`);
    return result.stdout;
  };
  try {
    const collection = path.join(dir, 'workbench', 'docs', 'ddr');
    git('checkout', '--quiet', '-b', 'main');
    gitCommitAll(dir, 'Seed the room');
    assert.equal(spawnSync('git', ['init', '--quiet', '--bare', remote]).status, 0);
    git('remote', 'add', 'origin', remote);
    git('push', '--quiet', 'origin', 'main');
    git('checkout', '--quiet', '-b', 'claude/other-lane');
    fs.writeFileSync(path.join(collection, 'proposed', '000A-held-on-another-branch.md'), ddrRecord());
    gitCommitAll(dir, 'Another lane adds a DDR');
    git('push', '--quiet', 'origin', 'claude/other-lane');
    git('checkout', '--quiet', 'main');
    git('branch', '--quiet', '-D', 'claude/other-lane');
    git('fetch', '--quiet', 'origin');
    assert.equal(fs.existsSync(path.join(collection, 'proposed', '000A-held-on-another-branch.md')), false);
    const created = newAdr(dir, { kind: 'ddr', title: 'Local destination choice', date: '2026-10-03' });
    assert.equal(created.id, 'DDR-000B', 'DDR-000A at origin/claude/other-lane is occupied');
    assert.deepEqual(fs.readdirSync(path.join(collection, 'proposed')).filter((name) => name.endsWith('.md')), ['000B-local-destination-choice.md']);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(remote, { recursive: true, force: true });
  }
});

// S-003X TK-004Y: the ADR lifecycle as commands for both kinds of decision
// record. Lifecycle is folder location (ADR-000I): accept moves a record out
// of proposed/, supersede and deprecate move it to the permanent archive/.
// Each move is a reviewable rename in Git, repairs live links, leaves
// append-only evidence as counted history and regenerates both registers;
// every refusal leaves the tree byte-identical.
function treeSnapshot(dir) {
  const files = {};
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === '.git') continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else files[path.relative(dir, full)] = entry.isSymbolicLink() ? `link:${fs.readlinkSync(full)}` : fs.readFileSync(full, 'utf8');
    }
  };
  walk(dir);
  return files;
}

function lifecycleRoom() {
  const dir = gitFixture();
  const adrDir = path.join(dir, 'workbench', 'docs', 'adr');
  const ddrDir = path.join(dir, 'workbench', 'docs', 'ddr');
  fs.writeFileSync(path.join(adrDir, '000A-current-architecture.md'), '---\ndate: 2026-10-01\ncanonicalized_in:\n  - AGENTS.md\n---\n\n# Current architecture\n\nThe decision.\n');
  fs.writeFileSync(path.join(adrDir, '000B-replacement-architecture.md'), '---\ndate: 2026-10-02\nsupersedes:\n  - 0001-older.md\ncanonicalized_in:\n  - AGENTS.md\n---\n\n# Replacement architecture\n\nIt replaces [the current one](000A-current-architecture.md).\n');
  fs.mkdirSync(path.join(adrDir, 'proposed'), { recursive: true });
  fs.writeFileSync(path.join(adrDir, 'proposed', '000C-proposed-architecture.md'), '---\nstatus: proposed\ndate: 2026-10-03\ncanonicalized_in:\n  - AGENTS.md\n---\n\n# Proposed architecture\n\nSee [the current one](../000A-current-architecture.md).\n');
  fs.writeFileSync(path.join(ddrDir, '000A-destination-choice.md'), ddrRecord('canonicalized_in:\n  - BLUEPRINT.md\n', 'Destination choice'));
  fs.writeFileSync(path.join(ddrDir, '000B-better-destination-choice.md'), ddrRecord('canonicalized_in:\n  - BLUEPRINT.md\n', 'Better destination choice'));
  fs.writeFileSync(path.join(ddrDir, 'proposed', '000C-proposed-destination.md'), ddrRecord('canonicalized_in:\n  - BLUEPRINT.md\n', 'Proposed destination'));
  const wiki = path.join(dir, 'workbench', 'wiki', 'decision-notes.md');
  fs.writeFileSync(wiki, '# Notes\n\nSee [the proposed destination](../docs/ddr/proposed/000C-proposed-destination.md), [the destination choice](../docs/ddr/000A-destination-choice.md) and [the current architecture](../docs/adr/000A-current-architecture.md).\n');
  const specDir = path.join(dir, 'workbench', 'specs', 'S-0ZZ-fixture');
  fs.mkdirSync(specDir, { recursive: true });
  fs.writeFileSync(path.join(specDir, 'SPEC.md'), '# S-0ZZ - Fixture\n\nLive link: [destination choice](../../docs/ddr/000A-destination-choice.md).\n\n## Append-Only Evidence And Execution Log\n\n| Date | Event |\n|---|---|\n| 2026-10-01 | Wrote [destination choice](../../docs/ddr/000A-destination-choice.md). |\n\n## Completion Result\n\nPending.\n');
  writeDecisionRegisters(dir);
  git(dir, 'checkout', '--quiet', '-b', 'main');
  gitCommitAll(dir, 'Seed the lifecycle room');
  return dir;
}

function git(dir, ...args) {
  const result = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
  assert.equal(result.status, 0, `git ${args.join(' ')}: ${result.stderr}`);
  return result.stdout;
}

test('accept moves a proposed ADR and DDR out of proposed/ by a Git rename, drops a leftover status key, repairs live links and regenerates both registers', () => {
  const dir = lifecycleRoom();
  try {
    const accepted = acceptRecord(dir, 'DDR-000C');
    assert.equal(accepted.from, 'workbench/docs/ddr/proposed/000C-proposed-destination.md');
    assert.equal(accepted.to, 'workbench/docs/ddr/000C-proposed-destination.md');
    assert.equal(fs.existsSync(path.join(dir, accepted.from)), false);
    assert.match(git(dir, 'status', '--porcelain'), /^R  workbench\/docs\/ddr\/proposed\/000C-proposed-destination\.md -> workbench\/docs\/ddr\/000C-proposed-destination\.md$/m, 'Git records a staged rename');
    assert.match(fs.readFileSync(path.join(dir, 'workbench', 'wiki', 'decision-notes.md'), 'utf8'), /\(\.\.\/docs\/ddr\/000C-proposed-destination\.md\)/, 'a live link follows the record');
    assert.match(fs.readFileSync(path.join(dir, 'workbench', 'docs', 'ddr', REGISTER_NAME), 'utf8'), /\| \[000C\]\(000C-proposed-destination\.md\) \| Proposed destination \| accepted \|/);
    gitCommitAll(dir, 'Accept the DDR');

    const adrAccepted = acceptRecord(dir, 'adr-000c');
    assert.equal(adrAccepted.id, 'ADR-000C', 'the identifier resolves case-folded');
    const moved = fs.readFileSync(path.join(dir, 'workbench', 'docs', 'adr', '000C-proposed-architecture.md'), 'utf8');
    assert.doesNotMatch(moved, /^status:/m, 'the folder is the lifecycle; a leftover status key would keep the record proposed');
    assert.match(moved, /\(000A-current-architecture\.md\)/, 'the moved record\'s own link is recomputed for its new folder');
    assert.equal(listAdrs(dir).find((record) => record.number === '000C').status, 'accepted');
    assert.deepEqual(validateDecisionRecords(dir).filter((item) => item.severity === 'error' || item.code === 'stale-register'), []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('supersede archives an accepted ADR and DDR under exactly one accepted successor of the same kind, records both directions and leaves evidence rows as counted history', () => {
  const dir = lifecycleRoom();
  try {
    const result = supersedeRecord(dir, 'DDR-000A', 'DDR-000B');
    assert.equal(result.successor, 'DDR-000B');
    assert.equal(result.to, 'workbench/docs/ddr/archive/000A-destination-choice.md');
    const archived = parseFrontmatter(fs.readFileSync(path.join(dir, result.to), 'utf8')).data;
    assert.equal(archived.superseded_by, '000B-better-destination-choice.md');
    assert.deepEqual(parseFrontmatter(fs.readFileSync(path.join(dir, 'workbench', 'docs', 'ddr', '000B-better-destination-choice.md'), 'utf8')).data.supersedes, ['000A-destination-choice.md']);
    const spec = fs.readFileSync(path.join(dir, 'workbench', 'specs', 'S-0ZZ-fixture', 'SPEC.md'), 'utf8');
    assert.match(spec, /Live link: \[destination choice\]\(\.\.\/\.\.\/docs\/ddr\/archive\/000A-destination-choice\.md\)/, 'a live Spec link is repaired');
    assert.match(spec, /\| 2026-10-01 \| Wrote \[destination choice\]\(\.\.\/\.\.\/docs\/ddr\/000A-destination-choice\.md\)\. \|/, 'an append-only evidence row keeps its first-published text');
    assert.equal(result.historicalReferencesLeft['workbench/specs/S-0ZZ-fixture/SPEC.md'], 1);
    assert.match(fs.readFileSync(path.join(dir, 'workbench', 'docs', 'ddr', 'HISTORY.md'), 'utf8'), /\| \[000A\]\(archive\/000A-destination-choice\.md\) \| Destination choice \| superseded \|/);
    assert.doesNotMatch(fs.readFileSync(path.join(dir, 'workbench', 'docs', 'ddr', REGISTER_NAME), 'utf8'), /000A-destination-choice/, 'the active register drops the replaced decision');
    gitCommitAll(dir, 'Supersede the DDR');

    const cli = spawnSync(process.execPath, [adrTool, 'supersede', 'ADR-000A', '--by', 'ADR-000B', '--path', dir], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    assert.equal(JSON.parse(cli.stdout).to, 'workbench/docs/adr/archive/000A-current-architecture.md');
    assert.deepEqual(parseFrontmatter(fs.readFileSync(path.join(dir, 'workbench', 'docs', 'adr', '000B-replacement-architecture.md'), 'utf8')).data.supersedes, ['0001-older.md', '000A-current-architecture.md'], 'an existing supersedes list gains the record');
    assert.match(fs.readFileSync(path.join(dir, 'workbench', 'docs', 'adr', '000B-replacement-architecture.md'), 'utf8'), /\(archive\/000A-current-architecture\.md\)/, 'the successor\'s own link follows the archived record');
    assert.deepEqual(validateDecisionRecords(dir).filter((item) => item.severity === 'error' || item.code === 'stale-register'), []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('deprecate archives an accepted record with its stated reason and no successor', () => {
  const dir = lifecycleRoom();
  try {
    const cli = spawnSync(process.execPath, [adrTool, 'deprecate', 'DDR-000B', '--reason', 'The destination no longer includes this feature', '--path', dir], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    const archived = path.join(dir, 'workbench', 'docs', 'ddr', 'archive', '000B-better-destination-choice.md');
    const data = parseFrontmatter(fs.readFileSync(archived, 'utf8')).data;
    assert.equal(data.deprecation_reason, 'The destination no longer includes this feature');
    assert.equal(data.superseded_by, undefined);
    assert.equal(listAdrs(dir, { kind: 'ddr' }).find((record) => record.number === '000B').status, 'deprecated');
    assert.deepEqual(validateDecisionRecords(dir).filter((item) => item.severity === 'error' || item.code === 'stale-register'), []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('every lifecycle refusal names its reason and leaves the tree byte-identical', () => {
  const dir = lifecycleRoom();
  try {
    const before = treeSnapshot(dir);
    const refusals = [
      [() => supersedeRecord(dir, 'DDR-000A'), /exactly one successor/],
      [() => supersedeRecord(dir, 'DDR-000A', ['DDR-000B', 'DDR-000C']), /exactly one successor/],
      [() => supersedeRecord(dir, 'DDR-000A', 'DDR-000B,DDR-000C'), /exactly one successor/],
      [() => supersedeRecord(dir, 'DDR-000A', 'DDR-000C'), /DDR-000C is proposed/],
      [() => supersedeRecord(dir, 'DDR-000A', 'ADR-000B'), /same kind/],
      [() => supersedeRecord(dir, 'DDR-000A', 'DDR-000A'), /cannot supersede itself/],
      [() => supersedeRecord(dir, 'DDR-000C', 'DDR-000B'), /only an accepted record at the top level/],
      [() => deprecateRecord(dir, 'DDR-000B'), /stated reason/],
      [() => deprecateRecord(dir, 'DDR-000B', '   '), /stated reason/],
      [() => deprecateRecord(dir, 'DDR-000B', 'line one\nline two'), /one line/],
      [() => deprecateRecord(dir, 'DDR-000C', 'too early'), /only an accepted record at the top level/],
      [() => acceptRecord(dir, 'DDR-000A'), /only a proposed record can be accepted/],
      [() => acceptRecord(dir, 'DDR-00ZZ'), /Unknown DDR identifier/],
      [() => acceptRecord(dir, 'XYZ-0001'), /not a decision-record identifier/]
    ];
    for (const [attempt, message] of refusals) {
      assert.throws(attempt, message);
      assert.deepEqual(treeSnapshot(dir), before, `${message} must write nothing`);
    }
    // An accept that would leave an invalid accepted record is refused first.
    const proposed = path.join(dir, 'workbench', 'docs', 'ddr', 'proposed', '000C-proposed-destination.md');
    fs.writeFileSync(proposed, ddrRecord('canonicalized_in:\n  - workbench/wiki/SCHEMA.md\n  - MISSING.md\n', 'Proposed destination'));
    gitCommitAll(dir, 'Break the proposed DDR');
    const broken = treeSnapshot(dir);
    assert.throws(() => acceptRecord(dir, 'DDR-000C'), /cannot be accepted: it canonicalized_in names the Wiki .*MISSING\.md does not exist|cannot be accepted: .*MISSING\.md does not exist/);
    assert.deepEqual(treeSnapshot(dir), broken);
    // A dirty Git tree is refused so the candidate shows only the move.
    fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# Agents\n\nEdited.\n');
    const dirty = treeSnapshot(dir);
    assert.throws(() => deprecateRecord(dir, 'DDR-000B', 'reason'), /dirty working tree/);
    assert.deepEqual(treeSnapshot(dir), dirty);
    const cli = spawnSync(process.execPath, [adrTool, 'supersede', 'DDR-000A', '--by', 'DDR-000B', '--by', 'DDR-000C', '--path', dir], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 1);
    assert.match(cli.stderr, /exactly one successor/);
    // Review corrective: only the move commands take a record identifier; any
    // other command refuses a stray one instead of silently ignoring it.
    for (const args of [['validate', 'ADR-000A'], ['register', 'DDR-000A'], ['accept', 'DDR-000C', 'DDR-000B']]) {
      const stray = spawnSync(process.execPath, [adrTool, ...args, '--path', dir], { cwd: dir, encoding: 'utf8' });
      assert.equal(stray.status, 1, `${args.join(' ')} must refuse`);
      assert.match(stray.stderr, /Unknown argument: [AD]DR-000[ABC]/);
    }
    assert.deepEqual(treeSnapshot(dir), dirty);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a lifecycle move outside Git renames the record and still regenerates both registers', () => {
  const dir = fixture();
  try {
    const created = newAdr(dir, { kind: 'ddr', title: 'Outside Git', date: '2026-10-03' });
    const result = acceptRecord(dir, created.id);
    assert.equal(result.usesGit, false);
    assert.equal(fs.existsSync(path.join(dir, result.to)), true);
    assert.match(fs.readFileSync(path.join(dir, 'workbench', 'docs', 'ddr', REGISTER_NAME), 'utf8'), /Outside Git \| accepted/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// S-003X TK-004Z: the five read words (ADR-000T) for both kinds of decision
// record, each in text and --json. Reads never write.
function readRoom() {
  const dir = lifecycleRoom();
  supersedeRecord(dir, 'DDR-000A', 'DDR-000B');
  gitCommitAll(dir, 'Supersede the first destination choice');
  return dir;
}

function cliRead(dir, ...args) {
  const result = spawnSync(process.execPath, [adrTool, ...args, '--path', dir], { cwd: dir, encoding: 'utf8' });
  return result;
}

test('list names the records that exist for both kinds, narrows by kind and status, and refuses an unknown status', () => {
  const dir = readRoom();
  try {
    const before = treeSnapshot(dir);
    const all = listRecords(dir);
    assert.deepEqual(all.map((record) => record.id), ['ADR-000A', 'ADR-000B', 'ADR-000C', 'DDR-000A', 'DDR-000B', 'DDR-000C']);
    const superseded = all.find((record) => record.id === 'DDR-000A');
    assert.equal(superseded.status, 'superseded');
    assert.equal(superseded.folder, 'archive');
    assert.equal(superseded.successor, 'DDR-000B');
    assert.deepEqual(listRecords(dir, { kind: 'ddr', status: 'accepted' }).map((record) => record.id), ['DDR-000B']);
    assert.deepEqual(listRecords(dir, { status: 'proposed' }).map((record) => record.id), ['ADR-000C', 'DDR-000C']);
    assert.throws(() => listRecords(dir, { status: 'pending' }), /--status must be one of/);
    const json = cliRead(dir, 'list', '--kind', 'adr', '--json');
    assert.equal(json.status, 0, json.stderr);
    assert.deepEqual(JSON.parse(json.stdout).map((record) => record.id), ['ADR-000A', 'ADR-000B', 'ADR-000C']);
    const text = cliRead(dir, 'list');
    assert.equal(text.status, 0, text.stderr);
    assert.match(text.stdout, /^DDR-000A\tsuperseded\t2026-10-03\tDestination choice\tworkbench\/docs\/ddr\/archive\/000A-destination-choice\.md\tsuperseded by DDR-000B$/m);
    assert.deepEqual(treeSnapshot(dir), before, 'list writes nothing');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('show returns one whole record, get is its synonym, and an unknown identifier fails visibly', () => {
  const dir = readRoom();
  try {
    const shown = showRecord(dir, 'ddr-000b');
    assert.equal(shown.id, 'DDR-000B');
    assert.equal(shown.content, fs.readFileSync(path.join(dir, 'workbench', 'docs', 'ddr', '000B-better-destination-choice.md'), 'utf8'));
    assert.deepEqual(shown.frontmatter.supersedes, ['000A-destination-choice.md']);
    const show = cliRead(dir, 'show', 'ADR-000B');
    const get = cliRead(dir, 'get', 'ADR-000B');
    assert.equal(show.status, 0, show.stderr);
    assert.equal(show.stdout, fs.readFileSync(path.join(dir, 'workbench', 'docs', 'adr', '000B-replacement-architecture.md'), 'utf8'), 'show prints the whole record');
    assert.equal(get.stdout, show.stdout, 'get is a synonym of show');
    assert.deepEqual(JSON.parse(cliRead(dir, 'get', 'ADR-000B', '--json').stdout), JSON.parse(cliRead(dir, 'show', 'ADR-000B', '--json').stdout));
    const unknown = cliRead(dir, 'show', 'DDR-0ZZZ');
    assert.equal(unknown.status, 1);
    assert.match(unknown.stderr, /Unknown DDR identifier: DDR-0ZZZ/);
    assert.equal(cliRead(dir, 'show').status, 1, 'show needs an identifier');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('search finds records by a literal case-insensitive query with their matching lines, status and a superseded hit\'s successor', () => {
  const dir = readRoom();
  try {
    const hits = searchRecords(dir, 'DESTINATION CHOICE');
    assert.deepEqual(hits.map((hit) => hit.id), ['DDR-000A', 'DDR-000B']);
    const replaced = hits.find((hit) => hit.id === 'DDR-000A');
    assert.equal(replaced.status, 'superseded');
    assert.equal(replaced.successor, 'DDR-000B', 'a replaced decision is never handed back as current');
    assert.ok(replaced.matches.some((match) => match.text === '# Destination choice' && match.line > 1));
    assert.equal(hits.find((hit) => hit.id === 'DDR-000B').successor, undefined);
    assert.deepEqual(searchRecords(dir, 'architecture', { kind: 'adr' }).map((hit) => hit.id), ['ADR-000A', 'ADR-000B', 'ADR-000C']);
    assert.deepEqual(searchRecords(dir, 'no record says this'), []);
    assert.throws(() => searchRecords(dir, '  '), /search needs a query/);
    const text = cliRead(dir, 'search', 'better destination');
    assert.equal(text.status, 0, text.stderr);
    assert.match(text.stdout, /^DDR-000B\taccepted\tBetter destination choice\tworkbench\/docs\/ddr\/000B-better-destination-choice\.md$/m);
    assert.match(text.stdout, /^  \d+: # Better destination choice$/m);
    assert.deepEqual(JSON.parse(cliRead(dir, 'search', 'better destination', '--json').stdout).map((hit) => hit.id), ['DDR-000B']);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('history reports the lifecycle chain and the Git commits that touched a record across its lifecycle move, and says when Git is unavailable', () => {
  const dir = readRoom();
  try {
    const history = recordHistory(dir, 'DDR-000A');
    assert.equal(history.lifecycle.status, 'superseded');
    assert.deepEqual(history.lifecycle.supersededBy, { name: '000B-better-destination-choice.md', id: 'DDR-000B' });
    assert.equal(history.git.available, true);
    assert.deepEqual(history.git.commits.map((commit) => commit.subject), ['Supersede the first destination choice', 'Seed the lifecycle room'], 'git log follows the record from archive/ back to where it was written');
    const successor = recordHistory(dir, 'DDR-000B');
    assert.deepEqual(successor.lifecycle.supersedes, [{ name: '000A-destination-choice.md', id: 'DDR-000A' }]);
    const text = cliRead(dir, 'history', 'DDR-000A');
    assert.equal(text.status, 0, text.stderr);
    assert.match(text.stdout, /^superseded by DDR-000B \(000B-better-destination-choice\.md\)$/m);
    assert.match(text.stdout, /^[0-9a-f]{40}\t\d{4}-\d{2}-\d{2}\tSeed the lifecycle room$/m);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  const plain = fixture();
  try {
    const created = newAdr(plain, { kind: 'ddr', title: 'Outside Git', date: '2026-10-03' });
    const history = recordHistory(plain, created.id);
    assert.equal(history.git.available, false);
    assert.match(history.git.reason, /not a Git working tree/);
    assert.equal(history.lifecycle.status, 'proposed');
  } finally {
    fs.rmSync(plain, { recursive: true, force: true });
  }
});

test('inspect returns one field or a line range of a record and refuses an unknown field, an out-of-range span or a missing selector', () => {
  const dir = readRoom();
  try {
    assert.deepEqual(inspectRecord(dir, 'DDR-000B', { field: 'supersedes' }), { id: 'DDR-000B', field: 'supersedes', value: ['000A-destination-choice.md'] });
    assert.deepEqual(inspectRecord(dir, 'DDR-000A', { field: 'status' }), { id: 'DDR-000A', field: 'status', value: 'superseded' });
    assert.deepEqual(inspectRecord(dir, 'ADR-000A', { field: 'title' }), { id: 'ADR-000A', field: 'title', value: 'Current architecture' });
    const lines = fs.readFileSync(path.join(dir, 'workbench', 'docs', 'adr', '000A-current-architecture.md'), 'utf8').split('\n');
    assert.deepEqual(inspectRecord(dir, 'ADR-000A', { lines: '1:2' }), { id: 'ADR-000A', lines: '1:2', text: lines.slice(0, 2).join('\n') });
    assert.equal(inspectRecord(dir, 'ADR-000A', { lines: '7' }).text, lines[6]);
    assert.throws(() => inspectRecord(dir, 'ADR-000A', { field: 'owner' }), /has no field owner/);
    assert.throws(() => inspectRecord(dir, 'ADR-000A', { lines: '0:2' }), /outside ADR-000A/);
    assert.throws(() => inspectRecord(dir, 'ADR-000A', { lines: '3:99' }), /outside ADR-000A/);
    assert.throws(() => inspectRecord(dir, 'ADR-000A', { lines: 'a:b' }), /START:END/);
    assert.throws(() => inspectRecord(dir, 'ADR-000A', {}), /exactly one of --field NAME or --lines START:END/);
    assert.throws(() => inspectRecord(dir, 'ADR-000A', { field: 'date', lines: '1:2' }), /exactly one of/);
    const field = cliRead(dir, 'inspect', 'DDR-000B', '--field', 'canonicalized_in');
    assert.equal(field.status, 0, field.stderr);
    assert.equal(field.stdout, 'BLUEPRINT.md\n');
    assert.equal(cliRead(dir, 'inspect', 'ADR-000A', '--lines', '1:2').stdout, `${lines.slice(0, 2).join('\n')}\n`);
    assert.deepEqual(JSON.parse(cliRead(dir, 'inspect', 'DDR-000B', '--field', 'date', '--json').stdout), { id: 'DDR-000B', field: 'date', value: '2026-10-03' });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('every existing decision-record command keeps its name and refuses a stray positional argument', () => {
  const dir = readRoom();
  try {
    assert.equal(cliRead(dir, 'validate').status, 0);
    assert.equal(cliRead(dir, 'register').status, 0);
    assert.equal(cliRead(dir, 'normalize', '--date', '2026-10-03').status, 0);
    const stray = cliRead(dir, 'validate', 'ADR-000A');
    assert.equal(stray.status, 1);
    assert.match(stray.stderr, /Unknown argument: ADR-000A/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
