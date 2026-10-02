#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

// --source exercises these same regressions against an immutable older runtime.
const sourceOption = process.argv.indexOf('--source');
const source = sourceOption < 0
  ? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  : path.resolve(process.argv[sourceOption + 1]);
const { render, moveSpecDirectory, moveTaskRecord, scanReferences } = await import(
  pathToFileURL(path.join(source, 'workbench/tools/spec-workbench.mjs')));
const version = JSON.parse(fs.readFileSync(path.join(source, 'workbench/manifest.json'), 'utf8')).workbenchVersion;

const kindOption = process.argv.indexOf('--kind');
const kinds = kindOption < 0 ? ['spec', 'task'] : [process.argv[kindOption + 1]];
assert.ok(kinds.every(kind => ['spec', 'task'].includes(kind)), '--kind must be spec or task');
for (const kind of kinds) {
  const room = fs.mkdtempSync(path.join(os.tmpdir(), 'lifecycle-directory-links-'));
  const aliases = fs.mkdtempSync(path.join(os.tmpdir(), 'lifecycle-directory-aliases-'));
  const git = (...args) => execFileSync('git', ['-C', room, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const write = (file, content) => {
    const destination = path.join(room, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content);
  };
  const commit = message => { git('add', '.'); git('commit', '--quiet', '-m', message); };
  const snapshot = () => ({
    head: git('rev-parse', 'HEAD'), refs: git('for-each-ref', '--format=%(refname) %(objectname)'),
    index: git('ls-files', '--stage'), status: git('status', '--porcelain'),
    files: git('ls-files').split('\n').map(file => [file, fs.lstatSync(path.join(room, file)).isSymbolicLink()
      ? fs.readlinkSync(path.join(room, file)) : fs.readFileSync(path.join(room, file)).toString('base64')])
  });
  try {
    execFileSync(process.execPath, [path.join(source, 'workbench/tools/workbench-layout.mjs'), 'init',
      '--project', room, '--provenance', 'genesis', '--version', version], { stdio: ['ignore', 'pipe', 'pipe'] });
    write('AGENTS.md', '# Fixture controls\n');
    write('BLUEPRINT.md', '# Blueprint\n');
    write('TASKBOARD.md', '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
    write('README.md', '# Directory link fixture\n');
    const spec = 'workbench/specs/S-616-directory-links';
    const task = `${spec}/tasks/TK-001`;
    const oldDir = kind === 'spec' ? spec : task;
    const newDir = kind === 'spec' ? 'workbench/specs/retired/S-616-directory-links' : `${spec}/tasks/retired/TK-001`;
    const primary = kind === 'spec' ? 'SPEC.md' : 'TASK.md';
    write(`${spec}/SPEC.md`, `# S-616 - Directory Links

**Spec ID:** S-616
**Status:** complete
**Priority:** 0
**Owner:** fixture
**Updated:** 2026-09-30
**Catalog description:** Directory links survive retirement.
**Blockers:** none
**Latest event:** Fixture complete.
**Next gate:** none

## Vertical Implementation Slices

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|

## Acceptance Criteria

- [x] Directory links resolve.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | TK-001 | Task closed | Fixture proof | Fixture docs | none |

## Completion Result

Fixture complete.

## Supersession

- Supersedes: none
- Superseded by: none
`);
    write(`${task}/TASK.md`, '# TK-001 - Directory Links\n\n**Task ID:** TK-001\n**Spec ID:** S-616\n**Slice:** Directory links\n**Status:** done\n**Blockers:** none\n**Destination:** spec-acceptance: S-616 Acceptance Criteria\n**Proof:** Fixture-only proof\n');
    write(`${oldDir}/nested folder/deeper/asset.txt`, 'carried asset\n');
    write(`${oldDir}/nested folder/deeper/hash #percent%/asset.txt`, 'reserved directory name\n');
    const parentheses = [['Closing', 'parentheses)', 'parentheses%29'], ['Opening', 'parentheses(', 'parentheses%28'], ['Balanced', 'parentheses(a)', 'parentheses%28a%29']];
    for (const [, name] of parentheses) write(`${oldDir}/nested folder/deeper/${name}/asset.txt`, 'parenthesis directory\n');
    write('assets/shared space/deep/asset.txt', 'unmoved asset\n');
    const link = (file, destination) => path.posix.relative(path.posix.dirname(file), destination).split('/').map(part => encodeURIComponent(part).replaceAll('(', '%28').replaceAll(')', '%29')).join('/');
    const outgoing = `${oldDir}/navigation.md`;
    const outgoingSeed = `# Outgoing directory links\n\n[Shared](${link(outgoing, 'assets/shared space')}/#shared)\n[Room](${link(outgoing, '.')}/#room)\n[Self](./#self)\n[Nested](nested%20folder/deeper/#nested)\n[Reserved](nested%20folder/deeper/hash%20%23percent%25/#reserved?fragment)\n`;
    const parenthesisLinks = file => parentheses.map(([label, name]) => `[${label}](${link(file, `${oldDir}/nested folder/deeper/${name}`)}/#proof?fragment)`).join('\n');
    write(outgoing, `${outgoingSeed}${parenthesisLinks(outgoing)}\n`);
    const skills = ['workbench/skills/directory-probe/SKILL.md', 'skills/directory-probe/SKILL.md'];
    const histories = new Map();
    const untouched = new Map();
    for (const file of skills) {
      const history = `## Append-Only Evidence And Execution Log\n\n| Date | Claim |\n|---|---|\n| 2026-09-30 | [Root](${link(file, oldDir)}/#history) and [Nested](${link(file, `${oldDir}/nested folder`)}/#history) |\n\n`;
      const unchanged = `[Unchanged](${link(file, 'assets/shared space').replace('/assets/', '/assets/./')}/#unchanged)`;
      histories.set(file, history); untouched.set(file, unchanged);
      write(file, `# Incoming directory links\n\n[Root](${link(file, oldDir)}/#root)\n[Bare](${link(file, oldDir)}#bare)\n[Plain](${link(file, oldDir)})\n[Nested](${link(file, `${oldDir}/nested folder/deeper`)}/#nested)\n[Reserved](${link(file, `${oldDir}/nested folder/deeper/hash #percent%`)}/#reserved?fragment)\n${parenthesisLinks(file)}\n[Record](${link(file, `${oldDir}/${primary}`)}#record)\n${unchanged}\n[External](https://example.invalid/folder/#external)\n\n${history}## Current limits\n\nFixture only.\n`);
    }
    // A directory-only referrer ensures preflight does not rely on a file link.
    const directoryOnly = 'workbench/skills/directory-only/SKILL.md';
    write(directoryOnly, `# Directory only\n\n[Root](${link(directoryOnly, oldDir)}/)\n`);
    git('init', '--quiet'); git('config', 'user.email', 'fixture@example.invalid'); git('config', 'user.name', 'Fixture');
    render(room); commit('seed directory link fixture');
    assert.deepEqual(scanReferences(room), [], `${kind}: all live links initially resolve`);
    const move = () => kind === 'spec' ? moveSpecDirectory(room, 'S-616', 'retired') : moveTaskRecord(room, 'S-616', 'TK-001', 'retired');

    const result = move();
    for (const file of skills) {
      const content = fs.readFileSync(path.join(room, file), 'utf8');
      assert.ok(content.includes(`[Root](${link(file, newDir)}/#root)`), `${kind}: moved-root directory link preserves slash and fragment`);
      assert.ok(content.includes(`[Bare](${link(file, newDir)}#bare)`) && content.includes(`[Plain](${link(file, newDir)})`), `${kind}: directory links need neither a slash nor a fragment`);
      assert.ok(content.includes(`[Nested](${link(file, `${newDir}/nested folder/deeper`)}/#nested)`), `${kind}: nested directory link preserves encoding`);
      assert.ok(content.includes(`[Reserved](${link(file, `${newDir}/nested folder/deeper/hash #percent%`)}/#reserved?fragment)`), `${kind}: encoded hash and percent remain path bytes`);
      for (const [label, , encodedName] of parentheses) {
        const expected = `${link(file, `${newDir}/nested folder/deeper`)}/${encodedName}/#proof?fragment`;
        assert.ok(content.includes(`[${label}](${expected})`), `${kind}: ${label.toLowerCase()} parenthesis remains explicitly percent encoded`);
      }
      assert.ok(content.includes(`[Record](${link(file, `${newDir}/${primary}`)}#record)`), `${kind}: primary file link remains correct`);
      assert.ok(content.includes(untouched.get(file)), `${kind}: unchanged referrer keeps its original spelling`);
      assert.ok(content.includes(histories.get(file)), `${kind}: historical directory links stay byte-identical`);
      assert.equal(result.historicalReferencesLeft[file], 2, `${kind}: historical directory links are counted`);
    }
    const movedOutgoing = `${newDir}/navigation.md`;
    const outgoingBytes = fs.readFileSync(path.join(room, movedOutgoing), 'utf8');
    assert.ok(outgoingBytes.includes(`[Shared](${link(movedOutgoing, 'assets/shared space')}/#shared)`), `${kind}: outgoing unmoved directory adjusts relative depth`);
    assert.ok(outgoingBytes.includes(`[Room](${link(movedOutgoing, '.')}/#room)`), `${kind}: outgoing repository-root link adjusts relative depth`);
    assert.ok(outgoingBytes.includes('[Self](./#self)'), `${kind}: a moved self-directory link keeps its relative meaning`);
    assert.ok(outgoingBytes.includes('[Nested](nested%20folder/deeper/#nested)'), `${kind}: moved internal directory retains its relative path`);
    assert.ok(outgoingBytes.includes('[Reserved](nested%20folder/deeper/hash%20%23percent%25/#reserved?fragment)'), `${kind}: moved reserved-name directory retains its relative path`);
    for (const [label, , encodedName] of parentheses) {
      assert.ok(outgoingBytes.includes(`[${label}](nested%20folder/deeper/${encodedName}/#proof?fragment)`), `${kind}: outgoing ${label.toLowerCase()} parenthesis remains percent encoded`);
    }
    assert.deepEqual(scanReferences(room), [], `${kind}: live directory and file links resolve after retirement`);
    // Commit the supported move, then use a fresh active incarnation to probe refusals.
    commit('record supported fixture retirement');
    git('mv', newDir, oldDir); commit('restore active fixture for preflight refusal probes');
    write(outgoing, outgoingSeed);
    for (const file of [...skills, directoryOnly]) {
      write(file, fs.readFileSync(path.join(room, file), 'utf8').replaceAll(link(file, newDir), link(file, oldDir)));
    }
    commit('restore incoming directory targets');
    const alias = path.join(aliases, 'directory-only.md');
    fs.linkSync(path.join(room, directoryOnly), alias);
    const beforeHardlink = snapshot(); const aliasBytes = fs.readFileSync(alias, 'utf8');
    assert.throws(move, /Unsafe write destination/, `${kind}: directory-only hard-link refuses before rename`);
    assert.deepEqual(snapshot(), beforeHardlink, `${kind}: hard-link refusal preserves files, index, HEAD and refs`);
    assert.equal(fs.readFileSync(alias, 'utf8'), aliasBytes, `${kind}: external hard-link bytes remain unchanged`);
    assert.ok(fs.existsSync(path.join(room, oldDir)) && !fs.existsSync(path.join(room, newDir)), `${kind}: neither record moved on refusal`);
    fs.unlinkSync(alias);
    fs.symlinkSync('nested folder', path.join(room, oldDir, 'linked-directory'));
    write(directoryOnly, `# Linked directory\n\n[Linked](${link(directoryOnly, `${oldDir}/linked-directory`)}/)\n`);
    commit('plant linked directory target'); const beforeLink = snapshot();
    assert.throws(move, /symbolic link|ordinary path/, `${kind}: linked directory target refuses before rename`);
    assert.deepEqual(snapshot(), beforeLink, `${kind}: linked directory refusal preserves files, index, HEAD and refs`);
    console.log(`ok - ${kind} retirement preserves live directory links, immutable history and pre-move safety`);
  } finally {
    fs.rmSync(room, { recursive: true, force: true });
    fs.rmSync(aliases, { recursive: true, force: true });
  }
}
