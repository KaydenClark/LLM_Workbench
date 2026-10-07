#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { coreSkills } from '../workbench/tools/workbench-layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'))).workbenchVersion;
const hash = value => createHash('sha256').update(value).digest('hex');
function run(cwd, file, args, expected = 0) {
  const result = spawnSync(process.execPath, [file, ...args], { cwd, encoding: 'utf8' });
  assert.equal(result.status, expected, result.stdout + result.stderr);
  return JSON.parse(result.stdout);
}

test('fresh core composes local save and selected promotion using only installed project runtime', () => {
  for (const skill of ['save', 'promote', 'notepad', 'to-docs', 'handoff']) assert.ok(coreSkills.includes(skill), `${skill} must be in the self-sufficient core`);
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-core-composition-'));
  const home = path.join(base, 'home'), project = path.join(base, 'room');
  try {
    fs.mkdirSync(home);fs.mkdirSync(project);
    run(root, 'tools/core-skill-installer.mjs', ['install', '--home', home]);
    for (const skill of ['save', 'promote', 'notepad', 'to-docs', 'handoff']) {
      const canonical = path.join(home, '.agents/skills', skill);
      assert.equal(fs.realpathSync(path.join(home, '.claude/skills', skill)), fs.realpathSync(canonical));
      assert.equal(fs.readFileSync(path.join(canonical, 'SKILL.md'), 'utf8'), fs.readFileSync(path.join(root, 'workbench', 'skills', skill, 'SKILL.md'), 'utf8'));
    }
    assert.equal(fs.readFileSync(path.join(home, '.agents/skills/handoff/assets/HANDOFF.md'), 'utf8'), fs.readFileSync(path.join(root, 'templates/HANDOFF.md'), 'utf8'), 'installed handoff carries its portable shape without a producer checkout');
    assert.equal(fs.existsSync(path.join(home, '.agents/skills/promote-decision')), false, 'the decision coordinator stays outside the personal Core catalog');
    assert.equal(fs.existsSync(path.join(home, '.codex')), false);
    run(root, 'workbench/tools/workbench-layout.mjs', ['init', '--project', project, '--provenance', 'genesis', '--version', version]);
    run(root, 'tools/workbench-tools.mjs', ['install', '--project', project]);
    const notes = (args, status) => run(project, 'workbench/tools/notepads.mjs', args, status);
    const created = notes(['create', '--note', 'composition', '--objective', 'portable-composition', '--title', 'Portable composition']);
    const note = created.note;
    notes(['append', '--note', note, '--revision', '1', '--kind', 'finding', '--topic', 'demo', '--content', 'Earlier draft proposed three steps.']);
    notes(['append', '--note', note, '--revision', '2', '--kind', 'correction', '--topic', 'demo', '--corrects', 'finding-001', '--content', 'The verified demo needs two steps.']);
    notes(['append', '--note', note, '--revision', '3', '--kind', 'blocker', '--topic', 'delivery', '--content', 'Actual remote delivery remains unverified.']);
    notes(['current', '--note', note, '--revision', '4', '--state', 'Local demo verified; remote remains open.', '--next-action', 'Verify the authorized remote.']);
    const before = fs.readFileSync(path.join(project, note));
    assert.equal(notes(['current', '--note', note, '--revision', '4', '--state', 'Stale write'], 1).error.code, 'stale-revision');
    const owner = '# Runbook\n\n## Demo\n\nOriginal procedure.\n';
    const draft = '# Runbook\n\n## Demo\n\nThe verified demo needs two steps.\n';
    fs.writeFileSync(path.join(project, 'RUNBOOK.md'), owner);
    const draftPath = 'workbench/sessions/recovery/promotion-draft.md';
    fs.writeFileSync(path.join(project, draftPath), draft);
    run(project, 'workbench/tools/sessions.mjs', ['promote', '--from', note, '--revision', '5', '--entries', 'finding-001', '--to', 'RUNBOOK.md', '--expected', hash(owner), '--content', draftPath]);
    assert.equal(fs.readFileSync(path.join(project, 'RUNBOOK.md'), 'utf8'), draft);
    assert.deepEqual(fs.readFileSync(path.join(project, note)), before, 'promotion never rewrites the source');
    assert.equal(notes(['trim', '--note', note, '--revision', '5', '--entry', 'correction-001', '--durable-owner', 'RUNBOOK.md'], 1).error.code, 'retained-dependency');
    const trimmed = notes(['trim', '--note', note, '--revision', '5', '--entry', 'finding-001', '--entry', 'correction-001', '--durable-owner', 'RUNBOOK.md']);
    assert.equal(trimmed.remaining, 1);
    const retained = JSON.parse(fs.readFileSync(path.join(project, note)));
    assert.equal(retained.entries[0].id, 'blocker-001');
    assert.equal(retained.current.next_action, 'Verify the authorized remote.');
    assert.equal(fs.existsSync(path.join(project, 'skills')), false);
    // S-00V: the room's core skills and any room-local extension live in the
    // skills lane; both discovery adapters resolve into it with no per-skill
    // link and nothing published to the personal catalog.
    run(root, 'tools/workbench-skills.mjs', ['install', '--project', project]);
    assert.equal(fs.existsSync(path.join(project, 'workbench/skills/promote-decision')), false, 'the decision coordinator is Workbench-only, not installed as Core');
    for (const skill of ['save', 'promote', 'notepad', 'to-docs', 'handoff']) {
      assert.equal(fs.readFileSync(path.join(project, '.agents/skills', skill, 'SKILL.md'), 'utf8'), fs.readFileSync(path.join(root, 'workbench', 'skills', skill, 'SKILL.md'), 'utf8'));
      assert.equal(fs.realpathSync(path.join(project, '.claude/skills', skill)), fs.realpathSync(path.join(project, 'workbench/skills', skill)));
    }
    const local = path.join(project, 'workbench/skills/room-demo');
    fs.mkdirSync(local, { recursive: true });
    fs.writeFileSync(path.join(local, 'SKILL.md'), '---\nname: room-demo\ndescription: Run the room demo.\n---\nRun node .agents/skills/room-demo/demo.mjs from the project.\n');
    fs.writeFileSync(path.join(local, 'demo.mjs'), 'process.stdout.write(JSON.stringify({steps: 2}));\n');
    assert.equal(fs.realpathSync(path.join(project, '.claude/skills/room-demo')), fs.realpathSync(local));
    assert.deepEqual(run(project, '.agents/skills/room-demo/demo.mjs', []), { steps: 2 });
    assert.deepEqual(run(project, '.claude/skills/room-demo/demo.mjs', []), { steps: 2 });
    const verified = run(root, 'tools/workbench-skills.mjs', ['verify', '--project', project]);
    assert.equal(verified.status, 'valid');
    assert.deepEqual(verified.roomLocal, ['room-demo'], 'a room-local skill is listed, never replaced or removed');
    assert.equal(fs.existsSync(path.join(home, '.agents/skills/room-demo')), false, 'room source is not published to the global catalog');
    assert.equal(fs.existsSync(path.join(project, '.codex/skills')), false);

  } finally { fs.rmSync(base, { recursive: true, force: true }); }
});

// This exercises installed public seams and Git publication, with simulated
// fixture merge authorization. It does not run an agent or a live GitHub PR.
test('public runtime supports separate decision-record, Map and Plan publication with retry', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-promote-stages-'));
  const project = path.join(base, 'room'), remote = path.join(base, 'remote.git'), reader = path.join(base, 'reader');
  const git = (cwd, args, expected = 0) => {
    const result = spawnSync('git', ['-c', 'user.name=Promotion Test', '-c', 'user.email=promotion@example.invalid', '-c', 'commit.gpgsign=false', ...args], { cwd, encoding: 'utf8' });
    assert.equal(result.status, expected, `git ${args.join(' ')}: ${result.stdout}${result.stderr}`);
    return result.stdout.trim();
  };
  const write = (relative, content) => {
    const file = path.join(project, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  };
  const node = (...args) => run(project, 'workbench/tools/spec-workbench.mjs', args);
  const readRemote = relative => git(reader, ['show', `origin/integration:${relative}`]);
  const commitStage = (files, message) => {
    git(project, ['add', ...files]);
    git(project, ['commit', '-q', '-m', message]);
    return git(project, ['rev-parse', 'HEAD']);
  };
  const publish = (branch, candidate, owners) => {
    git(project, ['push', '-q', 'origin', branch]);
    git(reader, ['fetch', '-q', 'origin']);
    git(reader, ['merge-base', '--is-ancestor', candidate, 'origin/integration'], 1);
    const authored = owners.map(relative => fs.readFileSync(path.join(project, relative), 'utf8').trimEnd());
    git(project, ['switch', '-q', 'integration']);
    git(project, ['merge', '-q', '--no-ff', branch, '-m', 'Simulated approved record-stage merge']);
    git(project, ['push', '-q', 'origin', 'integration']);
    git(reader, ['fetch', '-q', 'origin', 'integration']);
    git(reader, ['merge-base', '--is-ancestor', candidate, 'origin/integration']);
    owners.forEach((relative, i) => assert.equal(readRemote(relative), authored[i]));
    assert.equal(git(reader, ['ls-tree', '-r', '--name-only', 'origin/integration']).split('\n').includes('unfinished.mjs'), false);
    return git(reader, ['rev-parse', 'origin/integration']);
  };
  try {
    fs.mkdirSync(project);
    git(base, ['init', '-q', '--bare', remote]);
    run(root, 'workbench/tools/workbench-layout.mjs', ['init', '--project', project, '--provenance', 'genesis', '--version', version, '--integration-branch', 'integration']);
    run(root, 'tools/workbench-tools.mjs', ['install', '--project', project]);
    run(root, 'tools/workbench-skills.mjs', ['install', '--project', project]);
    git(project, ['init', '-q', '-b', 'integration']);
    git(project, ['remote', 'add', 'origin', remote]);
    const original = '# Runbook\n\n## Reports\n\nNaming remains open.\n';
    write('RUNBOOK.md', original);
    write('BLUEPRINT.md', '# Reports\n\nGenerate reports with the confirmed name.\n');
    git(project, ['add', '-A']);
    git(project, ['commit', '-q', '-m', 'Fixture baseline']);
    git(project, ['push', '-q', 'origin', 'integration']);
    git(base, ['clone', '-q', '-b', 'integration', remote, reader]);
    git(project, ['switch', '-q', '-c', 'codex/unfinished']);
    write('unfinished.mjs', '// Work has not met acceptance.\n');
    const unfinished = commitStage(['unfinished.mjs'], 'Keep incomplete implementation separate');
    git(project, ['push', '-q', 'origin', 'codex/unfinished']);
    git(project, ['switch', '-q', '-c', 'codex/docs', 'integration']);

    const notes = args => run(project, 'workbench/tools/notepads.mjs', args);
    const note = notes(['create', '--note', 'promotion', '--objective', 'promotion', '--title', 'Promotion fixture']).note;
    notes(['append', '--note', note, '--revision', '1', '--kind', 'source_record', '--topic', 'naming', '--content', 'Name reports room-first.']);
    notes(['append', '--note', note, '--revision', '2', '--kind', 'correction', '--topic', 'naming', '--corrects', 'source_record-001', '--content', 'Use YYYY-MM-DD-ROOM.md instead.']);
    notes(['append', '--note', note, '--revision', '3', '--kind', 'decision', '--topic', 'naming', '--content', 'Confirmed date-first naming so reports sort by date; this applies to report names only.']);
    notes(['append', '--note', note, '--revision', '4', '--kind', 'source_record', '--topic', 'retention', '--content', 'Retention is still undecided.']);
    notes(['current', '--note', note, '--revision', '5', '--unresolved', 'retention readback pending', '--next-action', 'Publish the confirmed naming decision.']);
    const noteBefore = fs.readFileSync(path.join(project, note));
    const authoredDocs = '# Runbook\n\n## Reports\n\nUse YYYY-MM-DD-ROOM.md for report names so reports sort by date.\n';
    const draft = 'workbench/sessions/recovery/reports.md';
    write(draft, authoredDocs);
    run(project, 'workbench/tools/sessions.mjs', ['promote', '--from', note, '--revision', '6', '--entries', 'decision-001,correction-001', '--to', 'RUNBOOK.md', '--expected', hash(original), '--content', draft]);
    const docs = commitStage(['RUNBOOK.md'], 'Publish the corrected confirmed naming decision');
    const docsTip = publish('codex/docs', docs, ['RUNBOOK.md']);

    // A docs-only endpoint reaches integration without creating planning work.
    const specPath = 'workbench/specs/S-0PA-reports/SPEC.md';
    git(reader, ['cat-file', '-e', `origin/integration:${specPath}`], 128);
    assert.deepEqual(fs.readFileSync(path.join(project, note)), noteBefore);
    assert.equal(git(reader, ['ls-tree', '-r', '--name-only', 'origin/integration']).split('\n').includes(note), false);

    // Simulate losing continuity after merge but before the local receipt.
    // Resume checks live containment and reuses the stage without another merge.
    git(reader, ['fetch', '-q', 'origin', 'integration']);
    git(reader, ['merge-base', '--is-ancestor', docs, 'origin/integration']);
    assert.equal(git(reader, ['rev-parse', 'origin/integration']), docsTip);
    assert.equal(readRemote('RUNBOOK.md'), authoredDocs.trimEnd());

    git(project, ['switch', '-q', '-c', 'codex/spec']);
    const spec = `# S-0PA - Reports\n\n**Spec ID:** S-0PA\n**Status:** planned\n**Priority:** 2\n**Owner:** fixture\n**Stance:** Builder\n**Updated:** 2026-10-07\n**Catalog description:** Implement confirmed report naming.\n**Blockers:** none\n**Latest event:** Decision published.\n**Next gate:** Plan the authorized Task.\n\n## Outcome\n\nImplement the naming in RUNBOOK.md; code remains unfinished.\n\n## Why It Matters\n\nReports sort by date.\n\n## Current Verified State\n\nThe decision is published; implementation is pending.\n\n## Desired Behavior\n\nGenerate the confirmed report name.\n\n## Decisions And Contracts\n\nRead RUNBOOK.md for the accepted naming rule.\n\n## Non-Goals\n\nRetention policy.\n\n## Dependencies And Blockers\n\nNone.\n\n## Vertical Implementation Slices\n\n| Task | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n\n## Acceptance Criteria\n\n- [ ] A report uses the confirmed name.\n\n## Testing Seams\n\nReport output.\n\n## Verification Procedure\n\nCheck a generated name.\n\n## Documentation Impact\n\nRUNBOOK.md.\n\n## Append-Only Evidence And Execution Log\n\n| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n`;
    write(specPath, spec);
    write('workbench/specs/S-0PA-reports/tasks/.gitkeep', '');
    node('render');
    node('doctor', '--json');
    const specFiles = [specPath, 'workbench/specs/S-0PA-reports/tasks/.gitkeep', 'workbench/specs/CATALOG.md', 'TASKBOARD.md'];
    publish('codex/spec', commitStage(specFiles, 'Publish the planned report capability'), specFiles);
    assert.match(readRemote(specPath), /\*\*Status:\*\* planned/);
    assert.equal(node('show', 'S-0PA').tasks.length, 0);

    git(project, ['switch', '-q', '-c', 'codex/tasks']);
    const taskPath = 'workbench/specs/S-0PA-reports/tasks/TK-0PA/TASK.md';
    write(taskPath, '# TK-0PA - Generate the confirmed report name\n\n**Task ID:** TK-0PA\n**Spec ID:** S-0PA\n**Slice:** Generate the confirmed report name\n**Status:** ready\n**Stance:** Builder\n**Blockers:** none\n**Destination:** spec-acceptance: A report uses the confirmed name.\n**Planned verification:** Generate and compare a report name.\n');
    node('convert-tasks', 'S-0PA', '--activate');
    node('render');
    node('doctor', '--json');
    const taskFiles = [specPath, taskPath, 'workbench/specs/CATALOG.md', 'TASKBOARD.md'];
    publish('codex/tasks', commitStage(taskFiles, 'Publish the unclaimed report Task plan'), taskFiles);
    assert.match(readRemote(specPath), /\*\*Status:\*\* active/);
    assert.match(readRemote(taskPath), /\*\*Status:\*\* ready/);
    assert.doesNotMatch(readRemote(taskPath), /Claimed by|Receipt|\*\*Status:\*\* done/);
    git(reader, ['merge-base', '--is-ancestor', unfinished, 'origin/integration'], 1);
    assert.deepEqual(fs.readFileSync(path.join(project, note)), noteBefore, 'planning and publication preserve pending exploration');
  } finally { fs.rmSync(base, { recursive: true, force: true }); }
});

// S-01O: the recovery proof the save skill names. A pushed save commit is
// proven by containment in the freshly fetched remote ref, which still holds
// after another writer advances the branch tip; an unpushed commit is not
// contained. The unresolved note stays local, untracked and readable.
test('a save commit is proven by fresh remote containment while its unresolved note stays local', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-save-containment-'));
  const remote = path.join(base, 'remote.git'), project = path.join(base, 'room'), other = path.join(base, 'other');
  const git = (cwd, args, expected = 0) => {
    const result = spawnSync('git', ['-c', 'user.name=Save Test', '-c', 'user.email=save@example.invalid', '-c', 'commit.gpgsign=false', ...args], { cwd, encoding: 'utf8' });
    assert.equal(result.status, expected, `git ${args.join(' ')}: ${result.stdout}${result.stderr}`);
    return result.stdout.trim();
  };
  try {
    fs.mkdirSync(project);
    git(base, ['init', '-q', '--bare', remote]);
    run(root, 'workbench/tools/workbench-layout.mjs', ['init', '--project', project, '--provenance', 'genesis', '--version', version]);
    run(root, 'tools/workbench-tools.mjs', ['install', '--project', project]);
    git(project, ['init', '-q', '-b', 'task']);
    git(project, ['remote', 'add', 'origin', remote]);
    git(project, ['add', '-A']);
    git(project, ['commit', '-q', '-m', 'Room baseline']);
    const notes = (args, status) => run(project, 'workbench/tools/notepads.mjs', args, status);
    const note = notes(['create', '--note', 'save-proof', '--objective', 'save-proof', '--title', 'Save proof']).note;
    notes(['append', '--note', note, '--revision', '1', '--kind', 'blocker', '--topic', 'delivery', '--content', 'Integration review is still pending.']);
    notes(['current', '--note', note, '--revision', '2', '--unresolved', 'integration review pending', '--next-action', 'Request the separate-context review.']);
    fs.writeFileSync(path.join(project, 'RUNBOOK.md'), '# Runbook\n\nSaved procedure.\n');
    git(project, ['add', 'RUNBOOK.md']);
    git(project, ['commit', '-q', '-m', 'Save the procedure']);
    const saved = git(project, ['rev-parse', 'HEAD']);
    git(project, ['push', '-q', 'origin', 'task']);

    git(base, ['clone', '-q', '-b', 'task', remote, other]);
    fs.writeFileSync(path.join(other, 'LATER.md'), 'Another writer.\n');
    git(other, ['add', 'LATER.md']);
    git(other, ['commit', '-q', '-m', 'Advance the shared branch']);
    git(other, ['push', '-q', 'origin', 'task']);

    fs.writeFileSync(path.join(project, 'LOCAL.md'), 'Not pushed.\n');
    git(project, ['add', 'LOCAL.md']);
    git(project, ['commit', '-q', '-m', 'Unpushed local work']);
    const unpushed = git(project, ['rev-parse', 'HEAD']);

    git(project, ['fetch', '-q', 'origin']);
    assert.notEqual(git(project, ['rev-parse', 'origin/task']), saved, 'tip equality fails once another writer advances the branch');
    git(project, ['merge-base', '--is-ancestor', saved, 'origin/task']);
    git(project, ['merge-base', '--is-ancestor', unpushed, 'origin/task'], 1);

    assert.equal(spawnSync('git', ['check-ignore', '-q', note], { cwd: project }).status, 0, 'the live note is ignored');
    assert.equal(git(project, ['ls-tree', '-r', '--name-only', 'origin/task']).split('\n').includes(note), false, 'the note never reaches the remote');
    const resumed = notes(['read', '--note', note, '--topic', 'delivery']);
    assert.deepEqual(resumed.current.unresolved, ['integration review pending'], 'unresolved context remains available after the save');
    assert.deepEqual(resumed.entries.map(entry => entry.id), ['blocker-001']);
  } finally { fs.rmSync(base, { recursive: true, force: true }); }
});
