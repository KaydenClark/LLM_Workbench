#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(source, 'workbench/tools/spec-workbench.mjs');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const room = fs.mkdtempSync(path.join(os.tmpdir(), 'task-collision-'));
const spec = 'workbench/specs/S-003P-binding';
const oldDir = `${spec}/tasks/TK-004F`;
const newDir = `${spec}/tasks/TK-004I`;
const foreignPath = 'workbench/specs/S-00I-lifecycle/tasks/TK-004F/TASK.md';
const git = (...args) => execFileSync('git', ['-C', room, ...args], { encoding: 'utf8' }).trim();
const write = (file, bytes) => { fs.mkdirSync(path.dirname(path.join(room, file)), { recursive: true }); fs.writeFileSync(path.join(room, file), bytes); };
const commit = message => { git('add', '-A'); git('commit', '-qm', message); return git('rev-parse', 'HEAD'); };
const specBytes = id => `# ${id} - Fixture\n\n**Spec ID:** ${id}\n**Status:** active\n**Priority:** 1\n**Owner:** fixture\n**Updated:** 2026-10-01\n**Catalog description:** Collision fixture\n**Blockers:** none\n**Latest event:** TK-004F closed\n**Next gate:** review\n\n## Vertical Implementation Slices\n\n| Task | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n\n## Acceptance Criteria\n\n- [ ] Fixture review\n\n## Append-Only Evidence And Execution Log\n\n| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n| 2026-10-01 | TK-004F | Task closed | original proof | none | review |\n\n## Completion Result\n\nPending.\n`;
const taskBytes = id => `# TK-004F - Fixture\n\n**Task ID:** TK-004F\n**Spec ID:** ${id}\n**Slice:** Fixture\n**Status:** done\n**Blockers:** none\n**Destination:** spec-acceptance: ${id} Acceptance Criteria\n**Proof:** original proof\n\n## Receipt\n\nOriginal receipt bytes and checksum remain untouched.\n`;
const snapshot = () => ({ head: git('rev-parse', 'HEAD'), refs: git('for-each-ref', '--format=%(refname) %(objectname)'), index: fs.readFileSync(path.join(room, '.git/index')).toString('base64'), status: git('status', '--porcelain'), files: git('ls-files').split('\n').map(file => [file, fs.lstatSync(path.join(room, file)).isSymbolicLink() ? fs.readlinkSync(path.join(room, file)) : fs.readFileSync(path.join(room, file)).toString('base64')]) });
let tests = 0;
try {
  execFileSync(process.execPath, [path.join(source, 'workbench/tools/workbench-layout.mjs'), 'init', '--project', room, '--provenance', 'genesis', '--version', JSON.parse(fs.readFileSync(path.join(source, 'workbench/manifest.json'))).workbenchVersion]);
  git('init', '-q'); git('config', 'user.name', 'Fixture'); git('config', 'user.email', 'fixture@example.com');
  write('BLUEPRINT.md', '# Blueprint\n'); write('TASKBOARD.md', '<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
  write('RUNBOOK.md', '# Procedure\n');
  write('workbench/specs/S-00I-lifecycle/SPEC.md', specBytes('S-00I')); write(foreignPath, taskBytes('S-00I'));
  const earlier = commit('earlier identity'); git('update-ref', 'refs/remotes/origin/earlier', earlier);
  write(`${spec}/SPEC.md`, specBytes('S-003P')); write(`${oldDir}/TASK.md`, taskBytes('S-003P'));
  write(`${oldDir}/asset.txt`, 'carried asset\n');
  write('README.md', `[Task](./${oldDir}/TASK.md)\n[Directory](./${oldDir}/)\n`);
  const original = commit('later collision'); git('update-ref', 'refs/remotes/origin/later', original);
  const originalTask = fs.readFileSync(path.join(room, oldDir, 'TASK.md'));
  const baseArgs = ['move-task', 'S-003P', '--task', 'TK-004F', '--replacement', 'TK-004I', '--collision-spec', 'S-00I', '--collision-revision', earlier, '--collision-path', foreignPath, '--source-revision', original, '--expected-head', original, '--task-hash', hash(originalTask), '--reason', 'Director retains earlier identity', '--path', room, '--json'];
  const run = (extra = [], options = {}) => spawnSync(process.execPath, [cli, ...baseArgs, ...extra], { encoding: 'utf8', ...options });
  const before = snapshot();
  let result = run(['--dry-run']);
  assert.equal(result.status, 0, result.stderr); assert.equal(JSON.parse(result.stdout).status, 'planned');
  assert.deepEqual(snapshot(), before, 'dry-run leaves files, raw index, HEAD and refs unchanged'); tests++;
  result = run(); assert.equal(result.status, 0, result.stderr);
  const changed = fs.readFileSync(path.join(room, newDir, 'TASK.md'), 'utf8');
  assert.ok(changed.startsWith('# TK-004I - ')); assert.ok(changed.includes('**Task ID:** TK-004I'));
  assert.ok(changed.includes('**Collision recovery:** S-003P/TK-004F@'+original)); assert.ok(!changed.includes('**Former ID:**'));
  assert.equal(changed.slice(changed.indexOf('## Receipt')), originalTask.toString().slice(originalTask.toString().indexOf('## Receipt')));
  assert.ok(changed.includes('**Status:** done')); assert.equal(git('rev-parse', 'HEAD'), original);
  assert.equal(fs.readFileSync(path.join(room, foreignPath), 'utf8'), taskBytes('S-00I'));
  assert.ok(fs.readFileSync(path.join(room, `${spec}/SPEC.md`), 'utf8').includes('| 2026-10-01 | TK-004F | Task closed | original proof | none | review |'));
  assert.ok(fs.readFileSync(path.join(room, 'README.md'), 'utf8').includes(`${newDir}/TASK.md`));
  assert.ok(fs.readFileSync(path.join(room, 'README.md'), 'utf8').includes(`${newDir}/`)); tests++;
  git('reset', '--hard', original);
  const refusal = (args, pattern, options) => { const prior = snapshot(); const output = run(args, options); assert.notEqual(output.status, 0); assert.match(output.stderr, pattern); assert.deepEqual(snapshot(), prior, 'refusal leaves complete tracked state unchanged'); tests++; };
  refusal(['--expected-head', '0'.repeat(40)], /expected HEAD/);
  refusal(['--task-hash', '0'.repeat(64)], /Task hash/);
  refusal(['--collision-path', `${oldDir}/TASK.md`], /collision evidence/);
  refusal(['--replacement', 'TK-0004F'], /different identity/);
  refusal(['--replacement', 'TK-004F'], /different identity/);
  refusal(['--collision-revision', original.slice(0, 8)], /exact.*revision/);
  refusal([], /Git environment/, { env: { ...process.env, GIT_DIR: path.join(room, '.git') } });
  write('README.md', 'uncommitted\n'); refusal([], /clean/); git('restore', 'README.md');
  // One failed publication after git mv must restore the original bytes AND index.
  const injection = path.join(os.tmpdir(), `collision-inject-${process.pid}.mjs`);
  fs.writeFileSync(injection, `import fs from 'node:fs'; const old=fs.renameSync; let failed=false; fs.renameSync=(from,to)=>{if(!failed && String(to).endsWith('/TK-004I/TASK.md')) {failed=true;throw new Error('injected publication failure');} return old(from,to);};`);
  try { refusal([], /rolled back.*injected publication failure/s, { env: { ...process.env, NODE_OPTIONS: `--import=${injection}` } }); } finally { fs.unlinkSync(injection); }
  console.log(`task-id-collision ${tests}/${tests} PASS`);
} finally { fs.rmSync(room, { recursive: true, force: true }); }
