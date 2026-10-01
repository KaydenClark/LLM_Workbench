#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { appendReceiptRowToContent, readReceipt } from '../workbench/tools/task-receipt.mjs';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(source, 'workbench/tools/spec-workbench.mjs');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const room = fs.mkdtempSync(path.join(os.tmpdir(), 'task-collision-'));
const spec = 'workbench/specs/S-003P-binding';
const oldDir = `${spec}/tasks/TK-004F`;
const newDir = `${spec}/tasks/TK-004I`;
const foreignPath = 'workbench/specs/S-00I-folder-lifecycle-for-records/tasks/TK-004F/TASK.md';
const git = (...args) => execFileSync('git', ['-C', room, ...args], { encoding: 'utf8' }).trim();
const write = (file, bytes) => { fs.mkdirSync(path.dirname(path.join(room, file)), { recursive: true }); fs.writeFileSync(path.join(room, file), bytes); };
const commit = message => { git('add', '-A'); git('commit', '-qm', message); return git('rev-parse', 'HEAD'); };
const specBytes = id => `# ${id} - Fixture\n\n**Spec ID:** ${id}\n**Status:** active\n**Priority:** 1\n**Owner:** fixture\n**Updated:** 2026-10-01\n**Catalog description:** Collision fixture\n**Blockers:** none\n**Latest event:** TK-004F closed\n**Next gate:** review\n\n## Vertical Implementation Slices\n\n| Task | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n\n## Acceptance Criteria\n\n- [ ] Fixture review\n\n## Append-Only Evidence And Execution Log\n\n| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n| 2026-10-01 | TK-004F | Task closed | original proof | none | review |\n\n## Completion Result\n\nPending.\n`;
const taskBytes = id => appendReceiptRowToContent(`# TK-004F - Fixture\n\n**Task ID:** TK-004F\n**Spec ID:** ${id}\n**Slice:** Fixture\n**Status:** done\n**Blockers:** none\n**Destination:** spec-acceptance: ${id} Acceptance Criteria\n**Proof:** original proof\n`, { branch: 'fixture', headSha: '1'.repeat(40), upstream: 'none', dirty: 0, testsRun: 'original proof', docsTouched: 'none', remainingGap: 'review' });
const snapshot = () => ({ head: git('rev-parse', 'HEAD'), refs: git('for-each-ref', '--format=%(refname) %(objectname)'), index: fs.readFileSync(path.join(room, '.git/index')).toString('base64'), status: git('status', '--porcelain'), files: git('ls-files').split('\n').map(file => [file, fs.lstatSync(path.join(room, file)).isSymbolicLink() ? fs.readlinkSync(path.join(room, file)) : fs.readFileSync(path.join(room, file)).toString('base64')]) });
let tests = 0;
try {
  // This is a controlled command fixture, not a receipt-backed installation.
  // Keeping its manifest explicit lets red/green run while source is dirty.
  write('workbench/manifest.json', fs.readFileSync(path.join(source, 'workbench/manifest.json')));
  const manifest = JSON.parse(fs.readFileSync(path.join(room, 'workbench/manifest.json')));
  for (const directory of [...Object.values(manifest.lanes), ...Object.values(manifest.collections)]) fs.mkdirSync(path.join(room, directory), { recursive: true });
  for (const directory of [manifest.landmarkTracker.root, ...Object.values(manifest.landmarkTracker.collections)]) fs.mkdirSync(path.join(room, directory), { recursive: true });
  write('workbench/sessions/.gitignore', fs.readFileSync(path.join(source, 'workbench/sessions/.gitignore')));
  for (const directory of [...Object.values(manifest.lanes), ...Object.values(manifest.collections), manifest.landmarkTracker.root, ...Object.values(manifest.landmarkTracker.collections)]) write(`${directory}/.gitkeep`, '');
  git('init', '-q'); git('config', 'user.name', 'Fixture'); git('config', 'user.email', 'fixture@example.com');
  write('BLUEPRINT.md', '# Blueprint\n'); write('TASKBOARD.md', '<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
  write('RUNBOOK.md', '# Procedure\n');
  write('workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md', specBytes('S-00I')); write(foreignPath, taskBytes('S-00I'));
  const earlier = commit('earlier identity'); git('update-ref', 'refs/remotes/origin/earlier', earlier);
  write(`${spec}/SPEC.md`, specBytes('S-003P')); write(`${oldDir}/TASK.md`, taskBytes('S-003P'));
  write(`${oldDir}/asset.txt`, 'carried asset\n');
  write('README.md', `[Task](./${oldDir}/TASK.md)\n[Directory](./${oldDir}/)\n`);
  const original = commit('later collision'); git('update-ref', 'refs/remotes/origin/later', original);
  const originalTask = fs.readFileSync(path.join(room, oldDir, 'TASK.md'));
  const baseArgs = ['move-task', 'S-003P', '--task', 'TK-004F', '--replacement', 'TK-004I', '--collision-spec', 'S-00I', '--collision-revision', earlier, '--collision-path', foreignPath, '--source-revision', original, '--expected-head', original, '--task-hash', hash(originalTask), '--reason', 'Director retains earlier identity', '--path', room, '--json'];
  const cliEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));
  const run = (extra = [], options = {}) => spawnSync(process.execPath, [cli, ...baseArgs, ...extra], { encoding: 'utf8', env: cliEnv, ...options });
  const before = snapshot();
  // Execute the shipped root procedure itself; the composed round-trip uses
  // this fixture because its normal greeting Task has no identity collision.
  const example = fs.readFileSync(path.join(source, 'RUNBOOK.md'), 'utf8').replace(/\\\n/g, ' ').split('\n').find(line => line.startsWith('node workbench/tools/spec-workbench.mjs move-task ') && line.includes('--replacement'));
  assert.ok(example, 'Runbook carries the guarded collision dry-run example');
  const values = { '$EXPECTED_HEAD': original, '$TASK_HASH': hash(originalTask), '$SOURCE_SHA': original, '$COLLISION_SHA': earlier };
  const tokens = example.match(/"[^"]*"|'[^']*'|[^\s]+/g).slice(2).map(token => { const value = token.replace(/^(["'])(.*)\1$/, '$2'); return values[value] ?? value; });
  const documented = spawnSync(process.execPath, [cli, ...tokens, '--path', room], { encoding: 'utf8', env: cliEnv });
  assert.equal(documented.status, 0, documented.stderr); assert.equal(JSON.parse(documented.stdout).status, 'planned');
  assert.deepEqual(snapshot(), before, 'documented dry-run leaves raw index and tracked state intact'); tests++;
  let result = run(['--dry-run']);
  assert.equal(result.status, 0, result.stderr); assert.equal(JSON.parse(result.stdout).status, 'planned');
  assert.deepEqual(snapshot(), before, 'dry-run leaves files, raw index, HEAD and refs unchanged'); tests++;
  result = run(); assert.equal(result.status, 0, result.stderr);
  const changed = fs.readFileSync(path.join(room, newDir, 'TASK.md'), 'utf8');
  assert.ok(changed.startsWith('# TK-004I - ')); assert.ok(changed.includes('**Task ID:** TK-004I'));
  assert.ok(changed.includes('**Collision recovery:** S-003P/TK-004F@'+original)); assert.ok(!changed.includes('**Former ID:**'));
  assert.equal(changed.slice(changed.indexOf('## Receipt')), originalTask.toString().slice(originalTask.toString().indexOf('## Receipt')));
  assert.deepEqual(readReceipt(changed), readReceipt(originalTask.toString()));
  assert.ok(changed.includes('**Status:** done')); assert.equal(git('rev-parse', 'HEAD'), original);
  assert.equal(fs.readFileSync(path.join(room, foreignPath), 'utf8'), taskBytes('S-00I'));
  assert.ok(fs.readFileSync(path.join(room, `${spec}/SPEC.md`), 'utf8').includes('| 2026-10-01 | TK-004F | Task closed | original proof | none | review |'));
  assert.ok(fs.readFileSync(path.join(room, 'README.md'), 'utf8').includes(`${newDir}/TASK.md`));
  assert.ok(fs.readFileSync(path.join(room, 'README.md'), 'utf8').includes(`${newDir}/`)); tests++;
  git('reset', '--hard', original);
  const refusal = (args, pattern, options) => { const prior = snapshot(); const output = run(args, options); assert.notEqual(output.status, 0); assert.match(output.stderr, pattern); assert.deepEqual(snapshot(), prior, 'refusal leaves complete tracked state unchanged'); tests++; };
  refusal(['--expected-head', earlier], /expected HEAD/);
  refusal(['--task-hash', '0'.repeat(64)], /Task hash/);
  refusal(['--collision-path', `${oldDir}/TASK.md`], /collision evidence/);
  refusal(['--replacement', 'TK-0004F'], /different identity/);
  refusal(['--replacement', 'TK-004F'], /different identity/);
  refusal(['--collision-revision', original.slice(0, 8)], /exact.*revision/);
  refusal([], /Git environment/, { env: { ...process.env, GIT_DIR: path.join(room, '.git') } });
  write('README.md', 'uncommitted\n'); refusal([], /clean/); git('restore', 'README.md');
  const currentArgs = () => ['--expected-head', git('rev-parse', 'HEAD')];
  write(`${oldDir}/TASK.md`, originalTask.toString().replace('**Status:** done', '**Status:** in-progress')); commit('unfinished source');
  refusal(currentArgs(), /done record/); git('reset', '--hard', original);
  write(`${oldDir}/TASK.md`, originalTask.toString().replace('**Status:** done', '**Status:** done\n**Close pending:** {"version":1}')); commit('pending close');
  refusal(currentArgs(), /pending close/); git('reset', '--hard', original);
  write('linked-target.md', 'outside linked bytes\n'); commit('hardlink target');
  fs.unlinkSync(path.join(room, 'README.md')); fs.linkSync(path.join(room, 'linked-target.md'), path.join(room, 'README.md'));
  // Keep the link's bytes a live incoming reference and then commit it.
  fs.writeFileSync(path.join(room, 'README.md'), `[Task](${oldDir}/TASK.md)\n`); commit('linked live reference');
  refusal(currentArgs(), /Unsafe write destination/); fs.unlinkSync(path.join(room, 'README.md')); git('reset', '--hard', original);
  fs.renameSync(path.join(room, oldDir), path.join(room, 'linked-task'));
  fs.symlinkSync(path.relative(path.dirname(path.join(room, oldDir)), path.join(room, 'linked-task')), path.join(room, oldDir)); commit('linked Task directory');
  refusal(currentArgs(), /symbolic link/); fs.unlinkSync(path.join(room, oldDir)); fs.rmSync(path.join(room, 'linked-task'), { recursive: true }); git('reset', '--hard', original);
  write('live-reference.json', JSON.stringify({ taskPath: `${oldDir}/TASK.md` })); commit('unsupported source reference');
  refusal(currentArgs(), /unhandled JSON/); git('reset', '--hard', original);
  write('workbench/specs/S-00I-folder-lifecycle-for-records/tasks/TK-004I/TASK.md', taskBytes('S-00I').replaceAll('TK-004F', 'TK-004I'));
  const occupied = commit('remote replacement record'); git('update-ref', 'refs/remotes/origin/occupied', occupied); git('reset', '--hard', original);
  refusal([], /occupied on an observed remote tip/); git('update-ref', '-d', 'refs/remotes/origin/occupied');
  write('workbench/specs/DISCARDS.md', '| TK-0004i | preserved discard |\n'); const discarded = commit('remote discarded alias');
  git('update-ref', 'refs/remotes/origin/discarded', discarded); git('reset', '--hard', original);
  refusal([], /discarded on an observed remote tip/); git('update-ref', '-d', 'refs/remotes/origin/discarded');
  write('workbench/specs/S-00I-folder-lifecycle-for-records/tasks/TK-004I/TASK.md', taskBytes('S-00I').replaceAll('TK-004F', 'TK-004I')); commit('local occupied replacement');
  refusal(currentArgs(), /occupied by a record/); git('reset', '--hard', original);
  write('workbench/specs/S-00I-folder-lifecycle-for-records/tasks/TK-0004I/TASK.md', taskBytes('S-00I').replaceAll('TK-004F', 'TK-0004I').replace('**Task ID:** TK-0004I', '**Task ID:** TK-0004I\n**Former ID:** TK-004i'));
  commit('local replacement alias'); refusal(currentArgs(), /occupied by a record or alias/); git('reset', '--hard', original);
  git('rm', 'workbench/manifest.json'); const legacy = commit('pre-manifest remote tip');
  git('update-ref', 'refs/remotes/origin/legacy', legacy); git('reset', '--hard', original);
  const legacyBefore = snapshot(); result = run(['--dry-run']); assert.equal(result.status, 0, result.stderr); assert.deepEqual(snapshot(), legacyBefore); tests++;
  git('update-ref', '-d', 'refs/remotes/origin/legacy');
  write('workbench/specs/S-777-table/SPEC.md', specBytes('S-777').replace('|---|---|---|---|---|', '|---|---|---|---|---|\n| TK-004I | Embedded assignment | ready | none | pending |'));
  const table = commit('remote embedded replacement identity'); git('update-ref', 'refs/remotes/origin/table', table); git('reset', '--hard', original);
  refusal([], /occupied by an observed remote slice/); git('update-ref', '-d', 'refs/remotes/origin/table');
  git('rm', 'workbench/manifest.json');
  write('specs/S-777-table/SPEC.md', specBytes('S-777').replace('|---|---|---|---|---|', '|---|---|---|---|---|\n| TK-0004i | Legacy embedded assignment | ready | none | pending |'));
  const legacyTable = commit('legacy remote embedded alias'); git('update-ref', 'refs/remotes/origin/legacy-table', legacyTable); git('reset', '--hard', original);
  refusal([], /occupied by an observed remote slice/); git('update-ref', '-d', 'refs/remotes/origin/legacy-table');
  write('workbench/specs/S-00I-folder-lifecycle-for-records/tasks/retired/TK-004I/TASK.md', taskBytes('S-00I').replaceAll('TK-004F', 'TK-004I')); commit('retired replacement holder');
  refusal(currentArgs(), /occupied by a record or alias/); git('reset', '--hard', original);
  write('workbench/specs/corrective/tasks/TK-004I/TASK.md', taskBytes('S-777').replaceAll('TK-004F', 'TK-004I')); commit('orphan replacement holder');
  refusal(currentArgs(), /occupied by a corrective record/); git('reset', '--hard', original);
  // One failed publication after git mv must restore the original bytes AND index.
  const injection = path.join(os.tmpdir(), `collision-inject-${process.pid}.mjs`);
  fs.writeFileSync(injection, `import fs from 'node:fs'; const old=fs.renameSync; let failed=false; fs.renameSync=(from,to)=>{if(!failed && String(to).endsWith('/TK-004I/TASK.md')) {failed=true;throw new Error('injected publication failure');} return old(from,to);};`);
  try { refusal([], /rolled back.*injected publication failure/s, { env: { ...process.env, NODE_OPTIONS: `--import=${injection}` } }); } finally { fs.unlinkSync(injection); }
  fs.writeFileSync(injection, `import fs from 'node:fs'; const old=fs.renameSync; let failed=false; fs.renameSync=(from,to)=>{if(!failed && String(to).endsWith('/CATALOG.md')) {failed=true;throw new Error('injected projection failure');} return old(from,to);};`);
  try { refusal([], /rolled back.*injected projection failure/s, { env: { ...process.env, NODE_OPTIONS: `--import=${injection}` } }); } finally { fs.unlinkSync(injection); }
  console.log(`task-id-collision ${tests}/${tests} PASS`);
} finally { fs.rmSync(room, { recursive: true, force: true }); }
