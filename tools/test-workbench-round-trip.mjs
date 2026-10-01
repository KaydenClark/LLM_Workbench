#!/usr/bin/env node
// The composed Workbench round trip, mechanically and provider-free:
// Candidate Genesis -> record-backed claim -> interrupted/fresh-clone resume ->
// actual greeting red/green -> documented review/owner corrective cycles ->
// main-verified closure -> feature capture -> whole-Spec retirement/discard ->
// exact fresh-clone recovery. Review/owner acts are local fixture data only.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { templatePlaceholders } from '../workbench/tools/template-placeholders.mjs';

const sourceProduct = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Closed test-only input: arbitrary files cannot become executable recipes.
const invocation = process.argv.slice(2).filter(arg => arg !== '--transcript');
const guidance = invocation.length === 0 ? 'RUNBOOK.md'
  : invocation.length === 2 && invocation[0] === '--guidance' ? invocation[1] : null;
if (!['RUNBOOK.md', 'templates/RUNBOOK.md'].includes(guidance)) {
  console.error('Usage: test-workbench-round-trip.mjs [--guidance RUNBOOK.md|templates/RUNBOOK.md] [--transcript]');
  process.exit(1);
}
const guidanceFile = path.join(sourceProduct, guidance);
assert.ok(fs.lstatSync(guidanceFile).isFile() && !fs.lstatSync(guidanceFile).isSymbolicLink(), 'guidance is an ordinary shipped control');
const genericGuidance = guidance === 'templates/RUNBOOK.md';
const VERSION = JSON.parse(fs.readFileSync(path.join(sourceProduct, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
const DATE = '2026-09-04';
const started = Date.now();
const transcript = [];
const documentedLifecycle = fs.readFileSync(guidanceFile, 'utf8')
  .split('### Spec Lifecycle And Retrieval')[1].split(genericGuidance ? '### Visible Identifiers' : '### Architecture Decision Records')[0];
const executedRecipes = new Set();
// Execute the Runbook's actual examples with concrete fixture values, without
// a shell. Only quoted strings, plain arguments and named placeholders occur.
function recipe(cwd, verb, values = {}, expectStatus = 0, variant = '') {
  const commands = documentedLifecycle.replace(/\\\n/g, ' ').split('\n')
    .filter(line => line.startsWith(`node workbench/tools/spec-workbench.mjs ${verb} `) || line === `node workbench/tools/spec-workbench.mjs ${verb}`);
  const command = commands.find(line => !variant || (variant === 'plain' ? !line.includes('--finding') && !line.includes('--destination-change') && !line.includes('--activate') && !line.includes('--task') : line.includes(variant)));
  assert.ok(command, `Runbook supplies an executable ${verb} ${variant} example`);
  const tokens = command.match(/"[^"]*"|'[^']*'|\[[^\]]*\]|[^\s]+/g).map(token => token.replace(/^(["'])(.*)\1$/, '$2'));
  const defaults = { 'S-001': 'S-001', 'TK-001': 'TK-001', '[SHA]': values.candidate,
    '[DIGEST]': values.digest, '[INTEGRATION SHA]': values.candidate, '[WHO]': 'Simulated fixture owner; not Human QA',
    '[FINDINGS OR none]': values.findings ?? 'none', '[FINDINGS]': values.findings ?? 'Missing punctuation coverage',
    '[SEPARATE CONTEXT, MODEL AND MODE]': 'Simulated fixture Director; machinery only',
    '[NAMED VERIFICATION]': 'node --test tests/hello.test.mjs PASS; actual greeting observed',
    '[DOCS UPDATED OR Docs checked; no update needed + reason]': 'README usage checked; no update needed',
    '[GAP OR none]': 'none', '[TESTS RUN AND RESULT]': 'node --test tests/hello.test.mjs PASS',
    '[DOCS TOUCHED OR none]': 'README.md', '[TEXT]': 'Simulated owner changes destination; no real approval', 'pass|fail': values.result ?? 'pass',
    'SHA': values.candidate, 'DIGEST': values.digest, 'INTEGRATION_SHA': values.candidate,
    '[owner]': 'Simulated fixture owner/reviewer; not Human QA',
    '[command/check]': 'node --test tests/hello.test.mjs PASS; actual greeting observed',
    '[Docs to update, or why no update is needed]': 'README usage checked; no update needed',
    '[Known limit or linked follow-up]': 'none', '[product tradeoff]': 'Simulated owner destination change', ...values };
  const args = tokens.slice(1).map(token => defaults[token] ?? token).map((token, index, args) => {
    if (!genericGuidance) return token;
    if (args[index - 1] === '--findings' || args[index - 1] === '--finding') return values.findings ?? (command.includes('--result fail') ? 'Missing punctuation coverage' : 'none');
    if (args[index - 1] === '--tests') return values['[TESTS RUN AND RESULT]'] ?? token;
    if (args[index - 1] === '--remaining-gap') return values['[GAP OR none]'] ?? token;
    return token;
  });
  // Legacy examples have grouped optional alternatives. They remain parseable
  // for the red proof; the corrected procedure uses separate actual commands.
  assert.ok(args.every(arg => arg !== undefined), `${verb}: every placeholder has a fixture value`);
  executedRecipes.add(command);
  return run(cwd, process.execPath, args, expectStatus);
}
function refusedRecipe(cwd, verb, values, reason, variant = '') {
  const before = { files: directoryBytes(cwd), head: git(cwd, 'rev-parse', 'HEAD'), index: git(cwd, 'ls-files', '--stage'), refs: git(cwd, 'for-each-ref', '--format=%(refname) %(objectname)') };
  const output = recipe(cwd, verb, values, 1, variant);
  assert.match(transcript.at(-1), reason);
  assert.deepEqual({ files: directoryBytes(cwd), head: git(cwd, 'rev-parse', 'HEAD'), index: git(cwd, 'ls-files', '--stage'), refs: git(cwd, 'for-each-ref', '--format=%(refname) %(objectname)') }, before, `${verb} refusal preserves files, index, HEAD and refs`);
  return output;
}
function directoryBytes(root) {
  const bytes = {};
  function walk(relative) {
    for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
      if (!relative && entry.name === '.git') continue;
      const child = path.posix.join(relative, entry.name);
      if (entry.isDirectory()) walk(child);
      else bytes[child] = entry.isSymbolicLink() ? `link:${fs.readlinkSync(path.join(root, child))}` : fs.readFileSync(path.join(root, child)).toString('base64');
    }
  }
  walk('');
  return bytes;
}

// A scrubbed environment: no Foundry, deployment, or host lane variables reach
// any child process, and PATH is the only inherited value. HOME is a fresh
// empty directory of its own rather than the shared system temp directory,
// which can hold anything another process left there.
const home = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-round-trip-home-'));
const env = { PATH: process.env.PATH, HOME: home, LANG: 'C', LC_ALL: 'C' };
const FOUNDRY_SIGNS = /Foundry|\.foundry|Job Order|Captain|CAS\/Journal|GPT_OS/;

function run(cwd, command, args, expectStatus = 0) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', env });
  transcript.push(`$ ${command === process.execPath ? 'node' : command} ${args.join(' ')}\n${result.stdout}${result.stderr}`);
  assert.equal(result.status, expectStatus, `${command} ${args.join(' ')} exited ${result.status}: ${result.stdout}${result.stderr}`);
  return result.stdout;
}

function git(cwd, ...args) {
  return run(cwd, 'git', ['-c', 'core.hooksPath=/dev/null', '-c', 'user.name=Round Trip', '-c', 'user.email=round-trip@example.invalid', ...args]).trim();
}

function node(cwd, script, ...args) {
  return run(cwd, process.execPath, [path.relative(cwd, script), ...args]);
}

function write(root, relative, content) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

// S-00H TK-004 follow-up: fills every known bracket placeholder with a plain
// non-placeholder token, mirroring tools/test-genesis-from-decisions.mjs, so
// a real template body can be embedded beneath the Round Trip project's own
// filled section without genesis readiness reading it as an unfilled control.
function fillPlaceholders(content) {
  let filled = content;
  for (const placeholder of templatePlaceholders) filled = filled.split(placeholder).join('FILLED');
  return filled;
}

function withTemplateBody(name, templatesRoot, header) {
  const templateBody = fillPlaceholders(fs.readFileSync(path.join(templatesRoot, name), 'utf8'));
  return `${header}\n\n## Template source (swept for retired vocabulary)\n\n${templateBody}`;
}

// S-00V TK-00I: host memory (a provider's per-project auto-memory under
// HOME, such as `.claude/projects/*/memory`, or a `.codex` home) is a
// per-machine convenience the Workbench never depends on. The run starts with
// a HOME that holds nothing at all and must leave no provider memory behind.
assert.equal(fs.readdirSync(env.HOME).length, 0, 'the scrubbed HOME starts empty, so no host memory directory exists for any step to read');
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-round-trip-'));
const product = path.join(workspace, 'candidate');
const remote = path.join(workspace, 'origin.git');
const first = path.join(workspace, 'planning-clone');
const second = path.join(workspace, 'resume-clone');
try {
  // Snapshot current source bytes, including uncommitted changes. A local clone
  // would leak its source path through Git's origin and installer receipts.
  // Keep raw stdout/stderr untouched: unexpected private paths must still fail.
  // S-00V: the skills lane and its installer ride along too, so Genesis below
  // lays this candidate's real skills into the room and the post-Genesis
  // sweep reads them from the clone, never from a provider home.
  for (const relative of ['templates', 'workbench/tools', 'workbench/manifest.json', 'tools/workbench-tools.mjs', 'workbench/skills',
    'tools/workbench-skills.mjs']) {
    const target = path.join(product, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.cpSync(path.join(sourceProduct, relative), target, { recursive: true });
  }
  git(product, 'init', '-q', '-b', 'main');
  git(product, 'remote', 'add', 'origin', 'https://github.com/KaydenClark/LLM_Workbench.git');
  git(product, 'add', '.');
  git(product, 'commit', '-q', '-m', 'Exact candidate fixture files');
  // ---- Genesis in the first clone, from this candidate's tools -------------
  fs.mkdirSync(remote);
  run(remote, 'git', ['init', '-q', '--bare', '-b', 'main']);
  fs.mkdirSync(first);
  git(first, 'init', '-q', '-b', 'main');
  git(first, 'config', 'user.name', 'Simulated Round Trip');
  git(first, 'config', 'user.email', 'round-trip@example.invalid');
  git(first, 'remote', 'add', 'origin', remote);
  // Genesis establishes the declared integration branch from the default
  // branch and pushes it, so the review gate has a merge target from the start.
  git(first, 'commit', '-q', '--allow-empty', '-m', 'Genesis base');
  git(first, 'branch', 'integration');
  git(first, 'push', '-q', 'origin', 'main', 'integration');
  node(product, path.join(product, 'workbench', 'tools', 'workbench-layout.mjs'), 'init', '--project', first, '--provenance', 'genesis', '--version', VERSION, '--name', 'Round Trip', '--date', DATE);
  node(product, path.join(product, 'tools', 'workbench-tools.mjs'), 'install', '--project', first);
  node(product, path.join(product, 'tools', 'workbench-skills.mjs'), 'install', '--project', first);
  const stamp = `> Generated from LLM Workbench ${VERSION}.`;
  const productTemplates = path.join(product, 'templates');
  write(first, 'AGENTS.md', withTemplateBody('AGENTS.md', productTemplates, `# Round Trip - Agent Operating System\n\n${stamp}\n\n## Authority Order\n\n1. The current user request.\n2. This file.\n3. The assigned spec.\n\n## Work Selection And Lifecycle\n\nRun \`node workbench/tools/spec-workbench.mjs doctor\`, then \`next --json\`, then \`show\`, claim, implement red/green, close, render, doctor, push.`));
  write(first, 'BLUEPRINT.md', `# Round Trip - Blueprint\n\n${stamp}\n\n## Product Map\n\nA tiny CLI that greets.\n\n## Spec Catalog\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n`);
  write(first, 'LEXICON.md', withTemplateBody('LEXICON.md', productTemplates, `# Round Trip - Lexicon\n\n${stamp}\n\n## Terms\n\nNone yet.`));
  write(first, 'RUNBOOK.md', withTemplateBody('RUNBOOK.md', productTemplates, `# Round Trip - Runbook\n\n${stamp}\n\n## Test And Build\n\n\`\`\`bash\nnode --test tests/hello.test.mjs\nnode workbench/tools/spec-workbench.mjs doctor\n\`\`\``));
  write(first, 'TASKBOARD.md', `# Round Trip - Hot Taskboard\n\n${stamp}\n\n## Active Specs\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n`);
  write(first, 'README.md', withTemplateBody('README.md', productTemplates, `# Round Trip\n\n${stamp}\n\n## Usage\n\nRun \`node src/hello.mjs\`.`));
  write(first, 'CLAUDE.md', '@AGENTS.md\n');
  const router = fs.readFileSync(path.join(product, 'templates', 'wiki', 'MEMORY.project.md'), 'utf8')
    .replaceAll('[PROJECT_NAME]', 'Round Trip').replaceAll('[HARNESS_VERSION]', VERSION.slice(1)).replaceAll('[YYYY-MM-DD]', DATE)
    .replace(/^\| \[QUESTION THIS ROOM'S MEMORY ANSWERS\].*\n/m, '').replace(/^\| \[ANOTHER DURABLE QUESTION\].*\n/m, '');
  write(first, 'workbench/wiki/MEMORY.md', router);
  write(first, 'workbench/feedback/WORKBENCH_FEEDBACK.md', fs.readFileSync(path.join(product, 'templates', 'WORKBENCH_FEEDBACK.md'), 'utf8').replaceAll('[PROJECT_NAME]', 'Round Trip').replaceAll('[HARNESS_VERSION]', VERSION.slice(1)));
  write(first, 'workbench/specs/S-001-greeting/SPEC.md', `# S-001 - Greeting\n\n${stamp}\n\n**Spec ID:** S-001\n**Status:** active\n**Priority:** 0\n**Owner:** unassigned\n**Updated:** ${DATE}\n**Catalog description:** Greet by name from the command line.\n**Blockers:** none\n**Latest event:** Spec captured by Genesis.\n**Next gate:** Claim TK-001.\n\n## Outcome\n\nA caller runs the CLI and receives a greeting.\n\n## Vertical Implementation Slices\n\n| Task | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n| TK-001 | The CLI greets a named caller and a test proves it | ready | none | pending |\n\n## Acceptance Criteria\n\n- [ ] \`node src/hello.mjs World\` prints a greeting.\n\n## Append-Only Evidence And Execution Log\n\n| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n| ${DATE} | genesis | Genesis ran with the v3.1 candidate | validate --genesis valid | Controls filled | TK-001 |\n\n## Completion Result\n\nPending.\n\n## Supersession\n\n- Supersedes: none\n- Superseded by: none\n`);
  const tool = (clone) => path.join(clone, 'workbench', 'tools', 'spec-workbench.mjs');
  node(first, tool(first), 'render');
  const readiness = JSON.parse(node(first, path.join(first, 'workbench', 'tools', 'workbench-layout.mjs'), 'validate', '--project', first, '--genesis'));
  assert.equal(readiness.status, 'valid', JSON.stringify(readiness));
  recipe(first, 'doctor');

  // ---- S-00H TK-004 follow-up: the finished room speaks Task, not Ticket --
  // Sweep the generated room's own controls (embedded with this candidate's
  // real templates/ body above) and the skills a fresh agent installs from
  // this candidate, the same two checks tools/test-genesis-from-decisions.mjs
  // runs after its own derive().
  {
    const controlHits = [];
    for (const name of ['AGENTS.md', 'RUNBOOK.md', 'LEXICON.md', 'README.md']) {
      fs.readFileSync(path.join(first, name), 'utf8').split('\n').forEach((line, index) => {
        if (name === 'LEXICON.md' && line.includes('**Ticket** | Retired as a live term.')) return;
        if (/ticket/i.test(line)) controlHits.push(`${name}:${index + 1}: ${line.trim()}`);
      });
    }
    assert.deepEqual(controlHits, [],
      `the generated room's own controls must not say Ticket outside the documented retired-term row:\n${controlHits.join('\n')}`);

    // The skills a fresh agent reads are the ones the room carries in its
    // lane, reached through both discovery adapters inside the clone.
    const skillHits = [];
    for (const engineRoot of [path.join(first, '.agents', 'skills'), path.join(first, '.claude', 'skills')]) {
      assert.ok(fs.realpathSync(engineRoot).startsWith(fs.realpathSync(first)), `${engineRoot} resolves inside the room`);
      (function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) { walk(full); continue; }
          if (entry.name !== 'SKILL.md') continue;
          const relative = path.relative(first, full).split(path.sep).join('/');
          fs.readFileSync(full, 'utf8').split('\n').forEach((line, index) => {
            if (/ticket/i.test(line)) skillHits.push(`${relative}:${index + 1}: ${line.trim()}`);
          });
        }
      })(engineRoot);
    }
    assert.deepEqual(skillHits, [],
      `the skills a fresh room carries from this candidate must not say Ticket:\n${skillHits.join('\n')}`);
  }

  // ---- Selected claim reconciliation, claim, push -------------------------
  const notes = path.join(first, 'workbench/tools/notepads.mjs');
  const note = JSON.parse(node(first, notes, 'create', '--note', 'greeting', '--objective', 'greeting', '--title', 'Greeting decisions'));
  node(first, notes, 'append', '--note', note.note, '--revision', '1', '--kind', 'decision', '--topic', 'greeting', '--content', 'Greet by name; default to World.');
  const owner = 'workbench/specs/S-001-greeting/SPEC.md';
  const beforeOwner = fs.readFileSync(path.join(first, owner));
  const authored = beforeOwner.toString('utf8') + '\n## Reconciled Decision\n\nGreet by name; default to World.\n';
  write(first, 'workbench/sessions/handoffs/greeting-draft.md', authored);
  const promoted = JSON.parse(node(first, path.join(first, 'workbench/tools/sessions.mjs'), 'promote', '--from', note.note, '--revision', '2', '--entries', 'decision-001', '--to', owner, '--expected', createHash('sha256').update(beforeOwner).digest('hex'), '--content', 'workbench/sessions/handoffs/greeting-draft.md'));
  assert.equal(promoted.status, 'promoted');
  assert.equal(promoted.destination.sha256, createHash('sha256').update(authored).digest('hex'));
  // Coordinated claim publishes the ready Task record on a Task branch to
  // this fixture's local bare origin; the fresh clone resumes that exact SHA.
  recipe(first, 'convert-tasks', {}, 0, 'plain');
  assert.ok(fs.existsSync(path.join(first, 'workbench/specs/S-001-greeting/tasks/TK-001/TASK.md')));
  const planned = path.join(workspace, 'planned-alternative');
  fs.cpSync(first, planned, { recursive: true });
  fs.rmSync(path.join(planned, 'workbench/specs/S-001-greeting/tasks'), { recursive: true });
  write(planned, owner, authored.replace('**Status:** active', '**Status:** planned'));
  recipe(planned, 'convert-tasks', {}, 0, '--activate');
  assert.equal(JSON.parse(node(planned, tool(planned), 'show', 'S-001', '--json')).status, 'active');
  git(first, 'switch', '-q', '-c', 'codex/greeting');
  git(first, 'add', '-A');
  git(first, 'commit', '-q', '-m', 'Persist the ready record-backed product room');
  git(first, 'push', '-q', '-u', 'origin', 'codex/greeting');
  recipe(first, 'claim', { codex: 'simulated-fixture-worker' });
  node(first, tool(first), 'render');
  git(first, 'add', '-A');
  const tracked = git(first, 'ls-files');
  assert.match(tracked, /workbench\/specs\/S-001-greeting\/SPEC\.md/, 'the reconciled owner is tracked');
  assert.doesNotMatch(tracked, /workbench\/sessions\/(?:notepads\/work|handoffs)\/greeting/, 'source and draft stay local');
  assert.doesNotMatch(tracked, /workbench\/sessions\/grilling\/greeting/, 'the live notepad never enters the commit');
  git(first, 'commit', '-q', '--allow-empty', '-m', 'Planning checkpoint: S-001 claimed');
  git(first, 'push', '-q', '-u', 'origin', 'codex/greeting');
  const planningSha = git(first, 'rev-parse', 'HEAD');
  assert.equal(git(first, 'ls-remote', 'origin', 'codex/greeting').split('\t')[0], planningSha, 'the planning checkpoint is remotely recoverable');

  // ---- Interruption: the planning context is destroyed --------------------
  fs.rmSync(first, { recursive: true, force: true });
  assert.equal(fs.existsSync(first), false);

  // ---- Resume from a fresh clone using repository state only -------------
  git(workspace, 'clone', '-q', '--branch', 'codex/greeting', remote, second);
  git(second, 'config', 'user.name', 'Simulated Round Trip');
  git(second, 'config', 'user.email', 'round-trip@example.invalid');
  assert.equal(git(second, 'rev-parse', 'HEAD'), planningSha);
  assert.equal(fs.existsSync(path.join(second, 'workbench', 'sessions', 'grilling', 'greeting-2026-09-04.md')), false, 'the untracked notepad did not travel');
  assert.match(fs.readFileSync(path.join(second, owner), 'utf8'), /Greet by name; default to World/, 'the reconciled claim travels in its owner');
  assert.equal(fs.existsSync(path.join(second, note.note)), false, 'the local JSON note did not travel');
  const receipt = JSON.parse(fs.readFileSync(path.join(second, 'workbench', 'tools', '.workbench-tools.json'), 'utf8'));
  assert.equal(receipt.source.release, VERSION, 'the resumer runs the exact receipt-backed candidate tools');
  node(second, tool(second), 'doctor');
  const next = JSON.parse(node(second, tool(second), 'next', '--json'));
  assert.equal(next, null, 'ordinary next offers no already claimed Task');
  const recovered = JSON.parse(node(second, tool(second), 'show', 'S-001', '--json'));
  assert.equal(recovered.tasks[0].id, 'TK-001');
  assert.equal(recovered.tasks[0].status, 'in-progress', 'explicit source/show recovers the claim without the original chat');
  assert.match(recipe(second, 'show'), /Greet by name; default to World|Greet by name from the command line/);

  // ---- Red/green slice ----------------------------------------------------
  write(second, 'tests/hello.test.mjs', "import assert from 'node:assert/strict';\nimport test from 'node:test';\nimport { greet } from '../src/hello.mjs';\ntest('greets by name', () => { assert.equal(greet('World'), 'Hello, World!'); });\n");
  const red = spawnSync(process.execPath, ['--test', 'tests/hello.test.mjs'], { cwd: second, encoding: 'utf8', env });
  transcript.push(`$ node --test tests/hello.test.mjs (red)\n${red.stdout}${red.stderr}`);
  assert.notEqual(red.status, 0, 'the slice test is red before the implementation exists');
  assert.match(`${red.stdout}${red.stderr}`, /hello\.mjs/, 'the red run fails on the missing implementation, not on the harness');
  recipe(second, 'receipt', { '[TESTS RUN AND RESULT]': 'FAIL missing src/hello.mjs', '[GAP OR none]': 'Implement greeting' });
  write(second, 'src/hello.mjs', "export function greet(name = 'World') { return `Hello, ${name}!`; }\nif (process.argv[1] && process.argv[1].endsWith('hello.mjs')) console.log(greet(process.argv[2]));\n");
  run(second, process.execPath, ['--test', 'tests/hello.test.mjs']);
  assert.equal(run(second, process.execPath, ['src/hello.mjs', 'World']).trim(), 'Hello, World!');

  // ---- Commit and push, close, render, doctor, push, read back -----------
  // S-00M TK-003: close refuses a dirty or unpushed tree, so the slice is
  // committed and pushed before its completion is claimed.
  refusedRecipe(second, 'close', {}, /dirty|uncommitted/i);
  git(second, 'add', '-A');
  git(second, 'commit', '-q', '-m', 'S-001/TK-001: greet by name');
  refusedRecipe(second, 'close', {}, /unpushed|ahead/i);
  git(second, 'push', '-q', 'origin', 'codex/greeting');
  recipe(second, 'receipt');
  git(second, 'add', '-A');
  git(second, 'commit', '-q', '-m', 'Preserve in-progress Receipt before close');
  git(second, 'push', '-q', 'origin', 'codex/greeting');
  recipe(second, 'close');
  node(second, tool(second), 'render');
  node(second, tool(second), 'doctor');
  git(second, 'add', '-A');
  git(second, 'commit', '-q', '-m', 'Close S-001/TK-001 with proof');
  git(second, 'push', '-q', 'origin', 'codex/greeting');
  const finalSha = git(second, 'rev-parse', 'HEAD');
  assert.equal(git(second, 'ls-remote', 'origin', 'codex/greeting').split('\t')[0], finalSha, 'the proof is remotely recoverable');
  assert.notEqual(finalSha, planningSha);
  let originalTask = 'workbench/specs/S-001-greeting/tasks/TK-001/TASK.md';
  assert.match(fs.readFileSync(path.join(second, originalTask), 'utf8'), /\*\*Status:\*\* done/);
  const report = JSON.parse(node(second, tool(second), 'report', 'S-001', '--candidate', finalSha, '--json'));
  const originalSpec = fs.readFileSync(path.join(second, owner), 'utf8');
  write(second, owner, originalSpec + '\n## Decisions\n\nPreserve named greeting punctuation.\n');
  // Red at the actual content-bound seam: the old Runbook omits --digest,
  // so a verdict silently rebinds to new content instead of refusing the
  // stale report. With the corrected example, this refuses before any write.
  refusedRecipe(second, 'verdict', { candidate: finalSha, digest: report.specDigest }, /does not match/, '--result');
  write(second, owner, originalSpec);


  // The same documented examples now drive a continuous lifecycle. All
  // reviewer/owner decisions below are simulated data in this local room.
  const read = relative => fs.readFileSync(path.join(second, relative), 'utf8');
  const commit = message => { git(second, 'add', '-A'); git(second, 'commit', '-q', '-m', message); return git(second, 'rev-parse', 'HEAD'); };
  const publish = () => { const branch = git(second, 'branch', '--show-current'); git(second, 'push', '-q', '-u', 'origin', branch); git(second, 'fetch', '-q', 'origin'); };
  const checkpoint = step => console.log(`demo - ${step}; HEAD ${git(second, 'rev-parse', '--short', 'HEAD')}`);
  const inspect = () => JSON.parse(recipe(second, 'report', { candidate: git(second, 'rev-parse', 'HEAD') }, 0, '--json'));
  const originalBytes = read(originalTask);
  const failed = JSON.parse(recipe(second, 'verdict', { candidate: finalSha, digest: report.specDigest, findings: 'Empty names need the default greeting' }, 0, '--result fail'));
  assert.equal(failed.correctiveTasks.length, 1);
  assert.equal(read(originalTask), originalBytes, 'failed review preserves original Task and Receipt bytes');
  const repairId = failed.correctiveTasks[0].id;
  commit('Persist simulated failed review and its corrective Task'); publish();
  const selected = JSON.parse(recipe(second, 'next'));
  assert.equal(selected.taskId, repairId);
  recipe(second, 'claim');
  write(second, 'tests/hello.test.mjs', read('tests/hello.test.mjs') + "test('empty name uses default', () => { assert.equal(greet(''), 'Hello, World!'); });\n");
  run(second, process.execPath, ['--test', 'tests/hello.test.mjs'], 1);
  recipe(second, 'receipt', { 'TK-001': repairId, '[TESTS RUN AND RESULT]': 'FAIL empty name did not use World', '[GAP OR none]': 'Repair empty input' });
  write(second, 'src/hello.mjs', "export function greet(name = 'World') { return `Hello, ${name.trim() || 'World'}!`; }\nif (process.argv[1] && process.argv[1].endsWith('hello.mjs')) console.log(greet(process.argv[2]));\n");
  run(second, process.execPath, ['--test', 'tests/hello.test.mjs']);
  assert.equal(run(second, process.execPath, ['src/hello.mjs', '']).trim(), 'Hello, World!');
  recipe(second, 'receipt', { 'TK-001': repairId });
  write(second, owner, read(owner).replace('- [ ] `node src/hello.mjs World` prints a greeting.', '- [x] `node src/hello.mjs World` prints a greeting; empty names use World.').replace('Pending.', 'Named and empty greetings pass the actual CLI tests.'));
  commit('Repair the greeting and check assembled acceptance'); publish();
  recipe(second, 'close');
  commit('Persist the corrective Task close'); publish();
  assert.equal(read(originalTask), originalBytes);
  write(second, 'workbench/specs/S-001-greeting/tasks/TK-001/assets/example.txt', 'World\n');
  commit('Preserve Task sibling asset before review'); publish();
  let assembled = inspect();
  assert.equal(assembled.complete, true);
  let candidate = git(second, 'rev-parse', 'HEAD');
  // Candidate need not equal HEAD when substantive content is unchanged.
  git(second, 'commit', '-q', '--allow-empty', '-m', 'Administrative checkpoint after immutable report');
  recipe(second, 'report', { candidate });
  refusedRecipe(second, 'complete', {}, /review verdict|earlier content/);
  recipe(second, 'verdict', { candidate, digest: assembled.specDigest }, 0, '--result pass');
  assert.equal(JSON.parse(recipe(second, 'gate', { candidate }, 0, '--spec')).refused, false);
  assert.equal(JSON.parse(recipe(second, 'gate', {}, 0, '--task')).mode, 'task-pr');
  refusedRecipe(second, 'approve', { candidate }, /not contained/, 'plain');
  commit('Persist fresh simulated Director PASS'); publish();
  const lane = git(second, 'branch', '--show-current');
  git(second, 'switch', '-q', 'integration');
  git(second, 'merge', '-q', '--no-ff', lane, '-m', 'Deliver reviewed greeting in the fixture'); publish();
  assert.equal(git(second, 'merge-base', candidate, 'origin/integration'), candidate);
  checkpoint('reviewed integration delivery (fixture)');
  refusedRecipe(second, 'complete', {}, /owner Human QA approval/);
  candidate = git(second, 'rev-parse', 'HEAD');
  // A destination change is an observation/finding, not an approval or new Task.
  const taskCount = inspect().tasks.length;
  recipe(second, 'approve', { candidate }, 0, '--destination-change');
  assert.equal(inspect().tasks.length, taskCount);
  refusedRecipe(second, 'complete', {}, /owner Human QA|finding|earlier content/);
  commit('Preserve simulated owner destination-change observation'); publish();
  candidate = git(second, 'rev-parse', 'HEAD');
  const qa = JSON.parse(recipe(second, 'approve', { candidate, findings: 'Explain empty greeting input in usage' }, 0, '--finding'));
  assert.equal(qa.result, 'finding'); assert.equal(qa.correctiveTasks.length, 1);
  const qaTask = qa.correctiveTasks[0].id;
  assert.equal(read(originalTask), originalBytes);
  commit('Preserve simulated owner finding and corrective work'); publish();
  assert.equal(JSON.parse(recipe(second, 'next')).taskId, qaTask);
  recipe(second, 'claim');
  write(second, 'README.md', read('README.md') + '\nAn empty or all-space name greets World. See workbench/wiki/MEMORY.md.\n');
  recipe(second, 'receipt', { 'TK-001': qaTask });
  run(second, process.execPath, ['--test', 'tests/hello.test.mjs']);
  commit('Explain the verified empty greeting'); publish(); recipe(second, 'close');
  commit('Persist owner-finding correction'); publish();
  assembled = inspect(); candidate = git(second, 'rev-parse', 'HEAD');
  recipe(second, 'verdict', { candidate, digest: assembled.specDigest }, 0, '--result pass');
  commit('Preserve simulated review after owner finding'); publish();
  const correctedLane = git(second, 'branch', '--show-current');
  git(second, 'switch', '-q', 'integration');
  if (correctedLane !== 'integration') git(second, 'merge', '-q', '--no-ff', correctedLane, '-m', 'Deliver the fixture owner-finding correction');
  publish(); candidate = git(second, 'rev-parse', 'HEAD');
  const approval = JSON.parse(recipe(second, 'approve', { candidate }, 0, 'plain'));
  assert.equal(approval.result, 'approve');
  commit('Preserve explicit simulated approval of S-001 only'); publish();
  refusedRecipe(second, 'complete', {}, /not contained in origin\/main/);
  const approvedCandidate = candidate;
  const promoteMain = message => { git(second, 'switch', '-q', 'main'); git(second, 'merge', '-q', '--no-ff', 'integration', '-m', message); git(second, 'push', '-q', 'origin', 'main'); run(second, 'git', ['fetch', 'origin', 'main']); git(second, 'switch', '-q', 'integration'); };
  promoteMain('Simulated fixture owner promotes approved content to main');
  assert.equal(git(second, 'merge-base', approvedCandidate, 'origin/main'), approvedCandidate);
  recipe(second, 'complete'); recipe(second, 'render'); recipe(second, 'doctor');
  recipe(second, 'render', {}, 0, '--format json');
  assert.ok(fs.existsSync(path.join(second, 'TASKBOARD.preview.json')), 'documented preview renders its actual output');
  assert.equal(inspect().status, 'complete');
  checkpoint('main-verified complete; no production owner approval');
  commit('Preserve completion before feature capture');
  const feature = `workbench/wiki/features/${genericGuidance ? 'capability' : 'greeting'}.md`;
  const historical = 'workbench/specs/retired/S-001-greeting/SPEC.md';
  refusedRecipe(second, 'retire-spec', {}, /found no Wiki note|features article/);
  write(second, feature, `---\ntype: feature\nstatus: active\nsensitivity: normal\nknowledge_role: curated\nprovenance:\n  - fixture closure capture, ${DATE}\nsource_paths:\n  - ${historical}\n  - src/hello.mjs\n  - tests/hello.test.mjs\nlast_verified: ${DATE}\n---\n\n# Greeting\n\nA caller receives a predictable greeting.\n\n## What It Does\n\nNamed callers are greeted; an empty name uses World.\n\n## Why It Matters\n\nCommand-line callers receive readable output.\n\n## Limits\n\nString names only. Fixture reviewer and owner records prove mechanics only.\n\n## Evidence and Sources\n\n- [Closure](../../specs/retired/S-001-greeting/SPEC.md).\n- src/hello.mjs and tests/hello.test.mjs prove the behavior.\n`);
  commit('Write unrouted fixture features capture');
  refusedRecipe(second, 'retire-spec', {}, /not linked/);
  write(second, 'workbench/wiki/MEMORY.md', read('workbench/wiki/MEMORY.md') + `\n- [Greeting](features/${path.basename(feature)})\n`);
  commit('Route readable feature knowledge after complete');
  node(second, path.join(second, 'workbench/tools/wiki.mjs'), 'validate');
  // Folder-only move alternative is exercised on an isolated clone; the main
  // scenario uses the reconciliation-owning retirement command instead.
  publish();
  const alternative = path.join(workspace, 'move-alternative');
  git(workspace, 'clone', '-q', '--branch', 'integration', remote, alternative);
  recipe(alternative, 'move-spec');
  assert.ok(fs.existsSync(path.join(alternative, historical)));
  // A branch with new unmerged proof must survive retirement cleanup.
  git(second, 'branch', 'codex/S-001-unmerged-proof');
  git(second, 'switch', '-q', 'codex/S-001-unmerged-proof');
  write(second, 'unmerged-proof.txt', 'Keep this unmerged result.\n');
  const unmerged = commit('Preserve an unmerged independent result');
  git(second, 'switch', '-q', 'integration');
  const retirement = JSON.parse(recipe(second, 'retire-spec'));
  assert.equal(retirement.route, historical);
  assert.equal(git(second, 'rev-parse', 'codex/S-001-unmerged-proof'), unmerged);
  assert.ok(retirement.unmergedBranchesNamingSpec.includes('codex/S-001-unmerged-proof'));
  run(second, 'git', ['branch', '-d', 'codex/S-001-unmerged-proof'], 1);
  assert.equal(git(second, 'rev-parse', 'codex/S-001-unmerged-proof'), unmerged, 'safe branch deletion refuses unmerged proof');
  const retiredDir = 'workbench/specs/retired/S-001-greeting';
  commit('Preserve reconciled retirement'); publish();
  refusedRecipe(second, 'discard', {}, /not verified contained|not contained|directory content/, 'plain');
  promoteMain('Simulated owner preserves retirement on fixture main');
  refusedRecipe(second, 'discard', {}, /complete reference scan/, 'plain');
  // Reconcile the legacy generated Blueprint catalog into destination prose.
  // The durable feature router now answers capability lookup.
  write(second, 'BLUEPRINT.md', `# Round Trip - Blueprint\n\n${stamp}\n\n## Product Map\n\nA tiny CLI greets named and empty callers.\n`);
  commit('Reconcile current Blueprint pointer before disposal'); publish();
  // Optional Task folder move/disposal is an independent clone alternative,
  // after closure/capture/whole-Spec retirement. It cannot repair or invalidate
  // the primary room's owner approval. Its own local bare remote isolates refs.
  const taskAlternative = path.join(workspace, 'task-alternative');
  const alternativeRemote = path.join(workspace, 'task-alternative.git');
  git(workspace, 'clone', '-q', '--bare', remote, alternativeRemote);
  git(workspace, 'clone', '-q', '--branch', 'integration', alternativeRemote, taskAlternative);
  git(taskAlternative, 'config', 'user.name', 'Simulated alternate fixture');
  git(taskAlternative, 'config', 'user.email', 'round-trip@example.invalid');
  const altCommit = message => { git(taskAlternative, 'add', '-A'); git(taskAlternative, 'commit', '-q', '-m', message); };
  const alternativeRead = relative => fs.readFileSync(path.join(taskAlternative, relative), 'utf8');
  const beforeMoveDigest = JSON.parse(recipe(taskAlternative, 'report', { candidate: git(taskAlternative, 'rev-parse', 'HEAD') }, 0, '--json')).specDigest;
  write(taskAlternative, 'README.md', alternativeRead('README.md') + `\n[Temporary proof](${retiredDir}/tasks/TK-001/TASK.md).\n`);
  altCommit('Preserve optional Task live-link probe');
  recipe(taskAlternative, 'move-task');
  const taskDir = `${retiredDir}/tasks/retired/TK-001`;
  assert.match(alternativeRead('README.md'), /tasks\/retired\/TK-001\/TASK.md/);
  assert.equal(alternativeRead(`${taskDir}/TASK.md`), originalBytes);
  const afterMove = JSON.parse(recipe(taskAlternative, 'report', { candidate: git(taskAlternative, 'rev-parse', 'HEAD') }, 0, '--json'));
  assert.notEqual(afterMove.specDigest, beforeMoveDigest, 'optional individual Task path move participates in the assembled digest');
  assert.equal(afterMove.latestOwnerApproval, null, 'a Task move must not silently claim earlier approval still binds');
  write(taskAlternative, 'README.md', alternativeRead('README.md').replace(/\n\[Temporary proof\].*\n/, '\n'));
  altCommit('Reconcile optional Task link after move');
  refusedRecipe(taskAlternative, 'discard', {}, /not verified contained|directory content/, '--task');
  git(taskAlternative, 'push', '-q', 'origin', 'integration');
  git(taskAlternative, 'switch', '-q', 'main');
  git(taskAlternative, 'merge', '-q', '--no-ff', 'integration', '-m', 'Simulated alternative owner preserves retired Task directory on main');
  git(taskAlternative, 'push', '-q', 'origin', 'main');
  run(taskAlternative, 'git', ['fetch', 'origin', 'main']);
  git(taskAlternative, 'switch', '-q', 'integration');
  const taskBytes = directoryBytes(path.join(taskAlternative, taskDir));
  const taskDiscard = JSON.parse(recipe(taskAlternative, 'discard', {}, 0, '--task'));
  assert.equal(taskDiscard.recoveryCommand, `git checkout ${taskDiscard.recoveryCommit} -- ${taskDir}`);
  altCommit('Preserve Task disposal recovery identity in alternative only');
  git(taskAlternative, 'push', '-q', 'origin', 'integration');
  const taskRecovery = path.join(workspace, 'task-recovery-clone');
  git(workspace, 'clone', '-q', '--branch', 'integration', alternativeRemote, taskRecovery);
  git(taskRecovery, ...taskDiscard.recoveryCommand.split(' ').slice(1));
  assert.deepEqual(directoryBytes(path.join(taskRecovery, taskDir)), taskBytes);
  // Primary approval remains intact; its normal whole-Spec retirement moved
  // the directory only after complete and readable feature capture.
  assert.equal(inspect().latestOwnerApproval.candidate, approvedCandidate);
  const specBytes = directoryBytes(path.join(second, retiredDir));
  const specDiscard = JSON.parse(recipe(second, 'discard', {}, 0, 'plain'));
  assert.equal(specDiscard.recoveryCommand, `git checkout ${specDiscard.recoveryCommit} -- ${retiredDir}`);
  commit('Preserve Spec disposal and durable feature source'); publish();
  const clean = path.join(workspace, 'discovery-clone');
  git(workspace, 'clone', '-q', '--branch', 'integration', remote, clean);
  assert.equal(fs.existsSync(path.join(clean, historical)), false);
  assert.match(fs.readFileSync(path.join(clean, feature), 'utf8'), /Named callers are greeted/);
  assert.equal(JSON.parse(node(clean, path.join(clean, 'workbench/tools/spec-workbench.mjs'), 'next', '--json')), null);
  const recoveredClone = path.join(workspace, 'recovery-clone');
  git(workspace, 'clone', '-q', '--branch', 'integration', remote, recoveredClone);
  git(recoveredClone, ...specDiscard.recoveryCommand.split(' ').slice(1));
  assert.deepEqual(directoryBytes(path.join(recoveredClone, retiredDir)), specBytes);
  assert.equal(fs.readFileSync(path.join(recoveredClone, retiredDir, 'tasks/TK-001/TASK.md'), 'utf8'), originalBytes);
  checkpoint('capture, link-safe retirement, discard and exact fresh-clone directory recovery');
  // No CLI exists for orphan creation. Exercise and disclose the real export,
  // then use actual CLI claim/close and challenge unsupported standalone receipt.
  const orphan = JSON.parse(run(second, process.execPath, ['--input-type=module', '-e', `import { createCorrectiveTasks } from './workbench/tools/spec-report.mjs'; console.log(JSON.stringify(createCorrectiveTasks(process.cwd(), 'S-001', { candidate: '${git(second, 'rev-parse', 'HEAD')}', findings: 'Clarify string-only greeting inputs', wikiClaim: '${feature}#Limits' })));`]));
  const orphanId = orphan.created[0].id;
  commit('Preserve post-discard Wiki-claim corrective Task'); publish();
  node(second, tool(second), 'claim', orphanId, '--agent', 'simulated-fixture-worker');
  write(second, feature, read(feature).replace('String names only.', 'Only string names are supported; other input types are outside this CLI.'));
  // The receipt CLI remains Spec-bound; claim/close are delivered standalone.
  const beforeOrphanReceipt = directoryBytes(second);
  run(second, process.execPath, ['workbench/tools/spec-workbench.mjs', 'receipt', orphanId, '--task', orphanId, '--tests', 'PASS', '--docs', feature, '--remaining-gap', 'none'], 1);
  assert.deepEqual(directoryBytes(second), beforeOrphanReceipt, 'unsupported standalone Receipt refuses without writing');
  commit('Clarify durable feature claim without restoring the Spec'); publish();
  node(second, tool(second), 'close', orphanId, '--proof', 'String-only implementation and feature Limits agree', '--docs', feature, '--remaining-gap', 'none');
  assert.equal(fs.existsSync(path.join(second, historical)), false);
  assert.match(read(feature), /corrective Task closed/);
  // Every changed fenced CLI example must have been executed. Read-only and
  // optional alternatives cannot escape this coverage by mere phrase matching.
  const allRecipes = documentedLifecycle.replace(/\\\n/g, ' ').split('\n').filter(line => line.startsWith('node workbench/tools/spec-workbench.mjs '));
  const collisionExamples = allRecipes.filter(command => command.includes('--replacement'));
  if (collisionExamples.length) {
    // This fixture's normal greeting identity is unique. Execute the actual
    // shipped collision example in its dedicated public CLI collision room.
    run(sourceProduct, process.execPath, ['tools/test-task-id-collision.mjs']);
    for (const command of collisionExamples) executedRecipes.add(command);
  }
  assert.deepEqual(allRecipes.filter(command => !executedRecipes.has(command)), [], 'every changed lifecycle CLI example has an executed result');
  checkpoint(`post-discard claim correction; ${executedRecipes.size} documentation examples executed`);

  // ---- Foundry absence -----------------------------------------------------
  const clonePaths = git(second, 'ls-files');
  assert.doesNotMatch(clonePaths, FOUNDRY_SIGNS, 'no Foundry path exists in the resumed repository');
  assert.doesNotMatch(transcript.join('\n'), FOUNDRY_SIGNS, 'no Foundry mechanism was named or required');
  assert.doesNotMatch(transcript.join('\n'), /\/Users\/|\/home\//, 'no private home path leaked into the transcript');
  for (const memory of ['.claude', '.codex']) {
    assert.equal(fs.existsSync(path.join(env.HOME, memory)), false, `the round trip neither read nor created host memory under HOME/${memory}`);
  }
  console.log(`ok - ${guidance} documented lifecycle ${(Date.now() - started) / 1000}s; mechanical round trip: planning ${planningSha.slice(0, 7)} interrupted, resumed from a clean clone, proof ${finalSha.slice(0, 7)} read back with Foundry absent`);
} finally {
  if (process.argv.includes('--transcript')) console.log(transcript.join('\n'));
  fs.rmSync(workspace, { recursive: true, force: true });
  fs.rmSync(home, { recursive: true, force: true });
}
