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
      assert.equal(fs.readFileSync(path.join(canonical, 'SKILL.md'), 'utf8'), fs.readFileSync(path.join(root, 'skills', skill, 'SKILL.md'), 'utf8'));
    }
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
    const local = path.join(project, '.agents/skills/room-demo');
    const adapter = path.join(project, '.claude/skills/room-demo');
    fs.mkdirSync(local, { recursive: true });
    fs.writeFileSync(path.join(local, 'SKILL.md'), '---\nname: room-demo\ndescription: Run the room demo.\n---\nRun node .agents/skills/room-demo/demo.mjs from the project.\n');
    fs.writeFileSync(path.join(local, 'demo.mjs'), 'process.stdout.write(JSON.stringify({steps: 2}));\n');
    fs.mkdirSync(path.dirname(adapter), { recursive: true });
    fs.symlinkSync(path.relative(path.dirname(adapter), local), adapter, 'dir');
    assert.equal(fs.realpathSync(adapter), fs.realpathSync(local));
    assert.deepEqual(run(project, '.agents/skills/room-demo/demo.mjs', []), { steps: 2 });
    assert.deepEqual(run(project, '.claude/skills/room-demo/demo.mjs', []), { steps: 2 });
    assert.equal(fs.existsSync(path.join(home, '.agents/skills/room-demo')), false, 'room source is not published to the global catalog');
    assert.equal(fs.existsSync(path.join(project, '.codex/skills')), false);

  } finally { fs.rmSync(base, { recursive: true, force: true }); }
});
