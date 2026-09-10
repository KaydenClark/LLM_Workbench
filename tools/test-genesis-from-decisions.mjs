#!/usr/bin/env node
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function command(program, args, options = {}) {
  const result = spawnSync(program, args, { encoding: 'utf8', ...options });
  assert.equal(result.status, options.expect ?? 0, result.stdout + result.stderr);
  return result.stdout.trim();
}

function git(root, ...args) { return command('git', args, { cwd: root }); }
function sha256(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }
function write(file, content) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); }
function json(file, value) { write(file, `${JSON.stringify(value, null, 2)}\n`); }

function initializeGit(root, origin) {
  fs.mkdirSync(root, { recursive: true });
  git(root, 'init', '-b', 'main');
  git(root, 'config', 'user.name', 'Workbench Test');
  git(root, 'config', 'user.email', 'workbench-test@invalid.example');
  git(root, 'remote', 'add', 'origin', origin);
}

function commit(root, message) {
  git(root, 'add', '-A');
  git(root, 'commit', '-m', message);
  return git(root, 'rev-parse', 'HEAD');
}

function makeRelease(base) {
  const release = path.join(base, 'release');
  fs.mkdirSync(path.join(release, 'workbench'), { recursive: true });
  fs.mkdirSync(path.join(release, 'tools'), { recursive: true });
  fs.copyFileSync(path.join(repoRoot, 'workbench', 'manifest.json'), path.join(release, 'workbench', 'manifest.json'));
  fs.cpSync(path.join(repoRoot, 'workbench', 'tools'), path.join(release, 'workbench', 'tools'), { recursive: true });
  fs.cpSync(path.join(repoRoot, 'templates'), path.join(release, 'templates'), { recursive: true });
  for (const name of ['workbench-tools.mjs', 'genesis-from-decisions.mjs']) {
    fs.copyFileSync(path.join(repoRoot, 'tools', name), path.join(release, 'tools', name));
  }
  initializeGit(release, 'https://example.invalid/llm-workbench.git');
  const commitId = commit(release, 'Synthetic release candidate');
  return { root: release, commit: commitId, version: JSON.parse(fs.readFileSync(path.join(release, 'workbench', 'manifest.json'))).workbenchVersion };
}

function initializeRoom(release, root, origin) {
  initializeGit(root, origin);
  const layout = path.join(release.root, 'workbench', 'tools', 'workbench-layout.mjs');
  const installer = path.join(release.root, 'tools', 'workbench-tools.mjs');
  command(process.execPath, [layout, 'init', '--project', root, '--provenance', 'genesis', '--version', release.version, '--name', path.basename(root), '--default-branch', 'main', '--integration-branch', 'integration']);
  command(process.execPath, [installer, 'install', '--project', root]);
}

function controlText(name, version) {
  if (name === 'CLAUDE.md') return '@AGENTS.md\n';
  const region = name === 'TASKBOARD.md'
    ? '\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n'
    : '';
  return `# Puffer Pond - ${name.replace('.md', '')}\n\n> Generated from LLM Workbench ${version}.\n\n## Purpose\n\nThis filled control belongs to Puffer Pond.${region}`;
}

function templateControlText(name, version) {
  if (name === 'CLAUDE.md') return '@AGENTS.md\n';
  const region = name === 'TASKBOARD.md'
    ? '\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n'
    : '';
  return `# Workbench Template - ${name.replace('.md', '')}\n\n> Generated from LLM Workbench ${version}.\n\n## Purpose\n\nThis is the filled Template source control.${region}`;
}

function makeTemplate(release, base) {
  const root = path.join(base, 'template');
  initializeRoom(release, root, 'https://example.invalid/workbench-template.git');
  for (const name of ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'CLAUDE.md', 'README.md']) {
    write(path.join(root, name), templateControlText(name, release.version));
  }
  write(path.join(root, 'template-only.txt'), 'This state must not be inherited.\n');
  const commitId = commit(root, 'Template fixture');
  git(root, 'branch', 'integration');
  return { root, commit: commitId, workbenchId: JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'))).workbenchId };
}

function makeSource(release, base) {
  const root = path.join(base, 'source');
  initializeRoom(release, root, 'https://example.invalid/puffer-preparation.git');
  const evidence = path.join(root, 'inputs', 'pond.md');
  write(evidence, '# Pond\nA small interactive simulation.\n');
  const drafts = path.join(root, 'workbench', 'docs', 'puffer-drafts');
  const controls = {};
  for (const name of ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'CLAUDE.md', 'README.md']) {
    const file = path.join(drafts, name);
    write(file, controlText(name, release.version));
    controls[name] = { file: path.relative(root, file).split(path.sep).join('/'), sha256: sha256(file) };
  }
  fs.copyFileSync(path.join(drafts, 'BLUEPRINT.md'), path.join(root, 'BLUEPRINT.md'));
  const memoryFile = path.join(drafts, 'MEMORY.md');
  write(memoryFile, `---\ntype: memory\nstatus: active\nsensitivity: normal\nknowledge_role: canonical\nprovenance:\n  - Genesis derivation\nsource_paths:\n  - workbench/wiki\nlast_verified: 2026-09-09\n---\n\n# Puffer Pond Memory\n\n> Generated from LLM Workbench ${release.version}.\n\n## Routing\n\nUse the root controls and assigned spec.\n`);
  const adr = path.join(root, 'workbench', 'docs', 'adr', '0001-pond-architecture.md');
  write(adr, '---\nstatus: accepted\ndate: 2026-09-09\ncanonicalized_in:\n  - BLUEPRINT.md\n---\n\n# Pond architecture\n\nUse a bounded static interaction first.\n');
  const request = path.join(root, 'workbench', 'sessions', 'recovery', 'request.json');
  json(request, {
    schema_version: 'project-evidence-request-1',
    project: { name: 'Puffer Pond' },
    objective: { key: 'puffer-pond', title: 'Puffer Pond Blueprint', focus: 'Lock the first useful capability.' },
    evidence: [{ id: 'E1', source: 'inputs/pond.md', line_start: 1, line_end: 2, kind: 'fact', statement: 'The source describes a small interactive simulation.' }],
    questions: [{ id: 'Q1', question: 'What should be built first?', recommendation: 'Build the bounded pond interaction.', evidence: ['E1'] }, { id: 'Q2', question: 'Should sound ship now?', recommendation: 'Defer sound.', evidence: ['E1'] }]
  });
  const evidenceTool = path.join(root, 'workbench', 'tools', 'project-evidence.mjs');
  const notepads = path.join(root, 'workbench', 'tools', 'notepads.mjs');
  const prepared = JSON.parse(command(process.execPath, [evidenceTool, 'prepare', '--project-root', root, '--input', request, '--note', 'pond']));
  const appended = JSON.parse(command(process.execPath, [notepads, 'append', '--path', root, '--note', prepared.note, '--revision', String(prepared.revision), '--kind', 'decision', '--topic', 'First capability', '--content', 'Build the ambient pond first.', '--interpretation', 'This authorizes one bounded static interaction, not a deployed product.', '--question-id', 'Q1', '--entry-id', 'decision-001']));
  const questions = [
    { id: 'Q1', status: 'locked', question: 'What should be built first?', recommendation: 'Build the bounded pond interaction.', evidence: ['E1'], decision_entry: 'decision-001' },
    { id: 'Q2', status: 'open', question: 'Should sound ship now?', recommendation: 'Defer sound.', evidence: ['E1'] }
  ];
  JSON.parse(command(process.execPath, [notepads, 'current', '--path', root, '--note', prepared.note, '--revision', String(appended.revision), '--status', 'ACTIVE', '--view-field', `questions=${JSON.stringify(questions)}`]));
  const commitId = commit(root, 'Source preparation fixture');
  git(root, 'branch', 'integration');
  const planFile = path.join(root, 'workbench', 'sessions', 'recovery', 'plan.json');
  const plan = {
    schema_version: 'genesis-plan-1',
    project: { name: 'Puffer Pond', founding_prompt: 'Build an ambient pond for calm observation.' },
    controls,
    memory: { file: path.relative(root, memoryFile).split(path.sep).join('/'), sha256: sha256(memoryFile) },
    selected_questions: ['Q1'],
    active_adr_ids: ['ADR-0001'],
    capabilities: [{ id: 'S-001', title: 'Ambient pond', derived_from: ['Q1'], outcome: 'Visitors can observe an ambient pond.', acceptance: ['The pond renders and responds to a visitor.'], ticket: { id: 'TK-001', slice: 'Render the ambient pond.' } }]
  };
  json(planFile, plan);
  return { root, commit: commitId, evidence, controls, memoryFile, adr, plan, planFile, note: prepared.note };
}

function fixture(release) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'genesis-decisions-case-'));
  return { root, template: makeTemplate(release, root), source: makeSource(release, root) };
}

function run(release, f, destination, expect = 0, extras = []) {
  const tool = path.join(release.root, 'tools', 'genesis-from-decisions.mjs');
  const args = ['derive', '--template', f.template.root, '--source-project', f.source.root, '--intake', f.source.note, '--plan', path.relative(f.source.root, f.source.planFile), '--destination', destination, ...extras];
  const result = spawnSync(process.execPath, [tool, ...args], { encoding: 'utf8' });
  assert.equal(result.status, expect, result.stdout + result.stderr);
  return JSON.parse(result.stdout);
}

function assertNoStage(destination) {
  const parent = path.dirname(destination);
  const prefix = `.${path.basename(destination)}.genesis-`;
  assert.equal(fs.readdirSync(parent).some(name => name.startsWith(prefix)), false, 'failed derivation leaves no staging directory');
}

const suiteRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'genesis-decisions-suite-'));
const release = makeRelease(suiteRoot);

{
  const f = fixture(release);
  const destination = path.join(f.root, 'generated');
  const report = run(release, f, destination);
  assert.equal(report.status, 'derived');
  assert.equal(report.capabilities, 1);
  const manifest = JSON.parse(fs.readFileSync(path.join(destination, 'workbench', 'manifest.json')));
  assert.notEqual(manifest.workbenchId, f.template.workbenchId);
  assert.equal(manifest.provenance.source.commit, release.commit);
  assert.equal(manifest.provenance.derivedFrom.intake.id, 'pond');
  assert.equal(manifest.provenance.derivedFrom.questions[0].decisionEntry, 'decision-001');
  const receipt = JSON.parse(fs.readFileSync(path.join(destination, 'workbench', 'docs', 'intake', 'DERIVATION.json')));
  assert.equal(receipt.source_project.observation, 'local checkout identity only; remote availability was not established');
  assert.equal(receipt.controls['AGENTS.md'].template.sha256, sha256(path.join(f.template.root, 'AGENTS.md')));
  assert.equal(receipt.controls['AGENTS.md'].draft.sha256, f.source.controls['AGENTS.md'].sha256);
  assert.equal(sha256(path.join(destination, receipt.controls['AGENTS.md'].template.preserved_file)), receipt.controls['AGENTS.md'].template.sha256);
  assert.equal(receipt.controls['AGENTS.md'].disposition, 'replaced by caller-authored project control');
  assert.equal(receipt.questions.find(item => item.id === 'Q1').decision.interpretation, 'This authorizes one bounded static interaction, not a deployed product.');
  assert.equal(receipt.questions.find(item => item.id === 'Q2').status, 'open');
  const evidenceRecord = receipt.evidence[0];
  assert.equal(sha256(path.join(destination, evidenceRecord.preserved_file)), evidenceRecord.source.sha256);
  assert.equal(fs.readFileSync(path.join(destination, 'workbench', 'docs', 'adr', '0001-pond-architecture.md'), 'utf8'), fs.readFileSync(f.source.adr, 'utf8'));
  const spec = fs.readFileSync(path.join(destination, 'workbench', 'specs', 'S-001-ambient-pond', 'SPEC.md'), 'utf8');
  assert.match(spec, /Build an ambient pond for calm observation\./);
  assert.match(spec, /decision-001/);
  assert.match(spec, /This authorizes one bounded static interaction/);
  assert.match(spec, /\.\.\/\.\.\/docs\/adr\/0001-pond-architecture\.md/);
  assert.equal(fs.readFileSync(path.join(destination, 'workbench', 'wiki', 'MEMORY.md'), 'utf8'), fs.readFileSync(f.source.memoryFile, 'utf8'));
  assert.equal(fs.existsSync(path.join(destination, 'template-only.txt')), false);
  assert.equal(fs.existsSync(path.join(destination, 'workbench', 'sessions', 'handoffs', 'founding-prompt.md')), false);
  assert.equal(git(destination, 'status', '--porcelain'), '');
  assert.ok(git(destination, 'show-ref', '--verify', 'refs/heads/main'));
  assert.ok(git(destination, 'show-ref', '--verify', 'refs/heads/integration'));
  const installed = JSON.parse(fs.readFileSync(path.join(destination, 'workbench', 'tools', '.workbench-tools.json')));
  assert.equal(installed.source.commit, release.commit);
  assertNoStage(destination);
}

for (const [label, mutate, code] of [
  ['open-question', f => { const file = path.join(f.source.root, f.source.note); const note = JSON.parse(fs.readFileSync(file)); note.current.questions[0].status = 'open'; json(file, note); }, 'question-not-locked'],
  ['missing-decision', f => { const file = path.join(f.source.root, f.source.note); const note = JSON.parse(fs.readFileSync(file)); note.entries[0].question_id = 'Q2'; json(file, note); }, 'decision-missing'],
  ['changed-evidence', f => { write(f.source.evidence, '# Pond\nChanged after intake.\n'); }, 'source-changed'],
  ['changed-control', f => { const file = path.join(f.source.root, f.source.controls['AGENTS.md'].file); fs.appendFileSync(file, 'changed\n'); }, 'source-changed'],
  ['symlinked-plan', f => { const target = `${f.source.planFile}.target`; fs.renameSync(f.source.planFile, target); fs.symlinkSync(path.basename(target), f.source.planFile); }, 'unsafe-path'],
  ['hardlinked-evidence', f => { fs.linkSync(f.source.evidence, path.join(path.dirname(f.source.evidence), 'pond-hardlink.md')); }, 'unsafe-path'],
  ['privacy-plan', f => { f.source.plan.capabilities[0].outcome = 'token=abcdefghijklmnop'; json(f.source.planFile, f.source.plan); }, 'privacy-boundary'],
  ['unselected-derivation', f => { f.source.plan.capabilities[0].derived_from = ['Q2']; json(f.source.planFile, f.source.plan); }, 'invalid-plan']
]) {
  const f = fixture(release);
  mutate(f);
  const destination = path.join(f.root, label);
  const report = run(release, f, destination, 1);
  assert.equal(report.error.code, code, label);
  assert.equal(fs.existsSync(destination), false, `${label} publishes nothing`);
  assertNoStage(destination);
}

{
  const f = fixture(release);
  const destination = path.join(f.root, 'already-exists');
  fs.mkdirSync(destination);
  const report = run(release, f, destination, 1);
  assert.equal(report.error.code, 'destination-exists');
  assert.deepEqual(fs.readdirSync(destination), []);
}

{
  const f = fixture(release);
  const outside = path.join(f.root, 'outside-plan.json');
  json(outside, f.source.plan);
  const tool = path.join(release.root, 'tools', 'genesis-from-decisions.mjs');
  const destination = path.join(f.root, 'outside-plan-result');
  const result = spawnSync(process.execPath, [tool, 'derive', '--template', f.template.root, '--source-project', f.source.root, '--intake', f.source.note, '--plan', outside, '--destination', destination], { encoding: 'utf8' });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.equal(JSON.parse(result.stdout).error.code, 'unsafe-path');
  assert.equal(fs.existsSync(destination), false);
}

{
  const f = fixture(release);
  const tool = path.join(release.root, 'tools', 'genesis-from-decisions.mjs');
  const secret = 'password=do-not-reflect';
  const result = spawnSync(process.execPath, [tool, 'derive', secret], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.doesNotMatch(result.stdout, /do-not-reflect/);
}

console.log('ok - Genesis derives one source-linked room through release init/install and publishes atomically');
