#!/usr/bin/env node
// The composed Workbench round trip, mechanically and provider-free:
// Genesis from this candidate -> planning checkpoint pushed (spec, claim,
// promoted checkpoint) -> forced interruption -> fresh clone resumes from
// repository state only -> red/green slice -> close -> render -> doctor ->
// push -> remote read-back, with Foundry absent throughout.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const product = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = 'v3.0.0';
const DATE = '2026-09-04';
const transcript = [];
// A scrubbed environment: no Foundry, deployment, or host lane variables reach
// any child process, and PATH is the only inherited value.
const env = { PATH: process.env.PATH, HOME: os.tmpdir(), LANG: 'C', LC_ALL: 'C' };
const FOUNDRY_SIGNS = /Foundry|\.foundry|Job Order|Captain|CAS\/Journal|GPT_OS/;

function run(cwd, command, args, expectStatus = 0) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', env });
  transcript.push(`$ ${command} ${args.join(' ')}\n${result.stdout}${result.stderr}`);
  assert.equal(result.status, expectStatus, `${command} ${args.join(' ')} exited ${result.status}: ${result.stdout}${result.stderr}`);
  return result.stdout;
}

function git(cwd, ...args) {
  return run(cwd, 'git', ['-c', 'core.hooksPath=/dev/null', '-c', 'user.name=Round Trip', '-c', 'user.email=round-trip@example.invalid', ...args]).trim();
}

function node(cwd, script, ...args) {
  return run(cwd, process.execPath, [script, ...args]);
}

function write(root, relative, content) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-round-trip-'));
const remote = path.join(workspace, 'origin.git');
const first = path.join(workspace, 'planning-clone');
const second = path.join(workspace, 'resume-clone');
try {
  // ---- Genesis in the first clone, from this candidate's tools -------------
  fs.mkdirSync(remote);
  run(remote, 'git', ['init', '-q', '--bare', '-b', 'main']);
  fs.mkdirSync(first);
  git(first, 'init', '-q', '-b', 'main');
  git(first, 'remote', 'add', 'origin', remote);
  node(first, path.join(product, 'workbench', 'tools', 'workbench-layout.mjs'), 'init', '--project', first, '--provenance', 'genesis', '--version', VERSION, '--name', 'Round Trip', '--date', DATE, '--source-commit', 'candidate');
  node(first, path.join(product, 'tools', 'workbench-tools.mjs'), 'install', '--project', first);
  const stamp = `> Generated from LLM Workbench ${VERSION}.`;
  write(first, 'AGENTS.md', `# Round Trip - Agent Operating System\n\n${stamp}\n\n## Authority Order\n\n1. The current user request.\n2. This file.\n3. The assigned spec.\n\n## Work Selection And Lifecycle\n\nRun \`node workbench/tools/spec-workbench.mjs doctor\`, then \`next --json\`, then \`show\`, claim, implement red/green, close, render, doctor, push.\n`);
  write(first, 'BLUEPRINT.md', `# Round Trip - Blueprint\n\n${stamp}\n\n## Product Map\n\nA tiny CLI that greets.\n\n## Spec Catalog\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n`);
  write(first, 'LEXICON.md', `# Round Trip - Lexicon\n\n${stamp}\n\n## Terms\n\nNone yet.\n`);
  write(first, 'RUNBOOK.md', `# Round Trip - Runbook\n\n${stamp}\n\n## Test And Build\n\n\`\`\`bash\nnode --test tests/hello.test.mjs\nnode workbench/tools/spec-workbench.mjs doctor\n\`\`\`\n`);
  write(first, 'TASKBOARD.md', `# Round Trip - Hot Taskboard\n\n${stamp}\n\n## Active Specs\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n`);
  write(first, 'README.md', `# Round Trip\n\n${stamp}\n\n## Usage\n\nRun \`node src/hello.mjs\`.\n`);
  write(first, 'CLAUDE.md', '@AGENTS.md\n');
  const router = fs.readFileSync(path.join(product, 'templates', 'wiki', 'MEMORY.project.md'), 'utf8')
    .replaceAll('[PROJECT_NAME]', 'Round Trip').replaceAll('[HARNESS_VERSION]', VERSION.slice(1)).replaceAll('[YYYY-MM-DD]', DATE)
    .replace(/^\| \[QUESTION THIS ROOM'S MEMORY ANSWERS\].*\n/m, '').replace(/^\| \[ANOTHER DURABLE QUESTION\].*\n/m, '');
  write(first, 'workbench/wiki/MEMORY.md', router);
  write(first, 'workbench/feedback/WORKBENCH_FEEDBACK.md', fs.readFileSync(path.join(product, 'templates', 'WORKBENCH_FEEDBACK.md'), 'utf8').replaceAll('[PROJECT_NAME]', 'Round Trip').replaceAll('[HARNESS_VERSION]', VERSION.slice(1)));
  write(first, 'workbench/specs/S-001-greeting/SPEC.md', `# S-001 - Greeting\n\n${stamp}\n\n**Spec ID:** S-001\n**Status:** active\n**Priority:** 0\n**Owner:** unassigned\n**Updated:** ${DATE}\n**Catalog description:** Greet by name from the command line.\n**Blockers:** none\n**Latest event:** Spec captured by Genesis.\n**Next gate:** Claim TK-001.\n\n## Outcome\n\nA caller runs the CLI and receives a greeting.\n\n## Vertical Implementation Slices\n\n| Ticket | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n| TK-001 | The CLI greets a named caller and a test proves it | ready | none | pending |\n\n## Acceptance Criteria\n\n- [ ] \`node src/hello.mjs World\` prints a greeting.\n\n## Append-Only Evidence And Execution Log\n\n| Date | Ticket | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n| ${DATE} | genesis | Genesis ran with the v3.1 candidate | validate --genesis valid | Controls filled | TK-001 |\n\n## Completion Result\n\nPending.\n\n## Supersession\n\n- Supersedes: none\n- Superseded by: none\n`);
  const tool = (clone) => path.join(clone, 'workbench', 'tools', 'spec-workbench.mjs');
  node(first, tool(first), 'render');
  const readiness = JSON.parse(node(first, path.join(first, 'workbench', 'tools', 'workbench-layout.mjs'), 'validate', '--project', first, '--genesis'));
  assert.equal(readiness.status, 'valid', JSON.stringify(readiness));
  node(first, tool(first), 'doctor');

  // ---- Planning checkpoint: notepad, promotion, claim, push ----------------
  write(first, 'workbench/sessions/grilling/greeting-2026-09-04.md', '# Grilling — greeting\nSTATUS: PROMOTED — 2026-09-04\n\n1. [locked] Greet by name; default to World.\n');
  const promoted = JSON.parse(node(first, path.join(first, 'workbench', 'tools', 'sessions.mjs'), 'checkpoint', '--from', 'workbench/sessions/grilling/greeting-2026-09-04.md', '--topic', 'greeting', '--date', DATE));
  assert.equal(promoted.status, 'promoted');
  node(first, tool(first), 'claim', 'S-001', '--agent', 'planner');
  node(first, tool(first), 'render');
  git(first, 'add', '-A');
  const tracked = git(first, 'ls-files');
  assert.match(tracked, /workbench\/sessions\/checkpoints\/greeting-2026-09-04\.md/, 'the promoted checkpoint is tracked');
  assert.doesNotMatch(tracked, /workbench\/sessions\/grilling\/greeting/, 'the live notepad never enters the commit');
  git(first, 'commit', '-q', '-m', 'Planning checkpoint: S-001 claimed');
  git(first, 'push', '-q', 'origin', 'main');
  const planningSha = git(first, 'rev-parse', 'HEAD');
  assert.equal(git(first, 'ls-remote', 'origin', 'main').split('\t')[0], planningSha, 'the planning checkpoint is remotely recoverable');

  // ---- Interruption: the planning context is destroyed --------------------
  fs.rmSync(first, { recursive: true, force: true });
  assert.equal(fs.existsSync(first), false);

  // ---- Resume from a fresh clone using repository state only -------------
  git(workspace, 'clone', '-q', remote, second);
  assert.equal(git(second, 'rev-parse', 'HEAD'), planningSha);
  assert.equal(fs.existsSync(path.join(second, 'workbench', 'sessions', 'grilling', 'greeting-2026-09-04.md')), false, 'the untracked notepad did not travel');
  assert.equal(fs.existsSync(path.join(second, 'workbench', 'sessions', 'checkpoints', 'greeting-2026-09-04.md')), true, 'the promoted checkpoint did');
  const receipt = JSON.parse(fs.readFileSync(path.join(second, 'workbench', 'tools', '.workbench-tools.json'), 'utf8'));
  assert.equal(receipt.source.release, VERSION, 'the resumer runs the exact receipt-backed candidate tools');
  node(second, tool(second), 'doctor');
  const next = JSON.parse(node(second, tool(second), 'next', '--json'));
  assert.equal(next.specId, 'S-001');
  assert.equal(next.ticketId, 'TK-001');
  assert.equal(next.status, 'in-progress', 'the claimed slice resumes without the original chat');
  assert.match(node(second, tool(second), 'show', 'S-001'), /Greet by name; default to World|Greet by name from the command line/);

  // ---- Red/green slice ----------------------------------------------------
  write(second, 'tests/hello.test.mjs', "import assert from 'node:assert/strict';\nimport test from 'node:test';\nimport { greet } from '../src/hello.mjs';\ntest('greets by name', () => { assert.equal(greet('World'), 'Hello, World!'); });\n");
  const red = spawnSync(process.execPath, ['--test', 'tests/hello.test.mjs'], { cwd: second, encoding: 'utf8', env });
  transcript.push(`$ node --test tests/hello.test.mjs (red)\n${red.stdout}${red.stderr}`);
  assert.notEqual(red.status, 0, 'the slice test is red before the implementation exists');
  assert.match(`${red.stdout}${red.stderr}`, /hello\.mjs/, 'the red run fails on the missing implementation, not on the harness');
  write(second, 'src/hello.mjs', "export function greet(name = 'World') { return `Hello, ${name}!`; }\nif (process.argv[1] && process.argv[1].endsWith('hello.mjs')) console.log(greet(process.argv[2]));\n");
  run(second, process.execPath, ['--test', 'tests/hello.test.mjs']);
  assert.equal(run(second, process.execPath, ['src/hello.mjs', 'World']).trim(), 'Hello, World!');

  // ---- Close, render, doctor, push, read back ----------------------------
  node(second, tool(second), 'close', 'S-001', '--proof', 'node --test tests/hello.test.mjs red then green; node src/hello.mjs World prints Hello, World!', '--docs', 'README.md usage retained; RUNBOOK.md commands executed', '--remaining-gap', 'none');
  node(second, tool(second), 'render');
  node(second, tool(second), 'doctor');
  git(second, 'add', '-A');
  git(second, 'commit', '-q', '-m', 'S-001/TK-001: greet by name');
  git(second, 'push', '-q', 'origin', 'main');
  const finalSha = git(second, 'rev-parse', 'HEAD');
  assert.equal(git(second, 'ls-remote', 'origin', 'main').split('\t')[0], finalSha, 'the proof is remotely recoverable');
  assert.notEqual(finalSha, planningSha);
  assert.match(fs.readFileSync(path.join(second, 'workbench', 'specs', 'S-001-greeting', 'SPEC.md'), 'utf8'), /\| TK-001 \| .* \| done \| none \| node --test tests\/hello\.test\.mjs red then green/);

  // ---- Foundry absence -----------------------------------------------------
  const clonePaths = git(second, 'ls-files');
  assert.doesNotMatch(clonePaths, FOUNDRY_SIGNS, 'no Foundry path exists in the resumed repository');
  assert.doesNotMatch(transcript.join('\n'), FOUNDRY_SIGNS, 'no Foundry mechanism was named or required');
  assert.doesNotMatch(transcript.join('\n'), /\/Users\/|\/home\//, 'no private home path leaked into the transcript');
  console.log(`ok - mechanical round trip: planning ${planningSha.slice(0, 7)} interrupted, resumed from a clean clone, proof ${finalSha.slice(0, 7)} read back with Foundry absent`);
} finally {
  fs.rmSync(workspace, { recursive: true, force: true });
}
