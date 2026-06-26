#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultConditionsFile = path.join(repoRoot, 'outcomes/conditions/conditions.json');

function parseArgs(argv) {
  const args = {
    task: null,
    conditionsFile: defaultConditionsFile,
    conditions: [],
    trials: 1,
    agentCommand: null,
    out: null,
    keep: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--task') args.task = argv[++index];
    else if (arg === '--conditions-file') args.conditionsFile = argv[++index];
    else if (arg === '--conditions') args.conditions = argv[++index].split(',').filter(Boolean);
    else if (arg === '--trials') args.trials = Number.parseInt(argv[++index], 10);
    else if (arg === '--agent-command') args.agentCommand = argv[++index];
    else if (arg === '--out') args.out = argv[++index];
    else if (arg === '--keep') args.keep = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!args.task) throw new Error('--task is required');
  if (!args.agentCommand) throw new Error('--agent-command is required');
  if (!args.out) throw new Error('--out is required');
  if (!Number.isInteger(args.trials) || args.trials < 1) throw new Error('--trials must be a positive integer');
  return args;
}

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function copyDir(src, dst) {
  fs.cpSync(src, dst, { recursive: true });
}

function run(cmd, opts = {}) {
  const result = spawnSync(cmd[0], cmd.slice(1), {
    cwd: opts.cwd,
    env: opts.env,
    encoding: 'utf8'
  });
  if (opts.check && result.status !== 0) {
    throw new Error(`${cmd.join(' ')} failed:\n${result.stderr || result.stdout}`);
  }
  return result;
}

function injectCondition(repo, condition, conditionsDir) {
  if (condition.type === 'none') return;

  if (condition.type === 'inline') {
    for (const [target, content] of Object.entries(condition.files ?? {})) {
      const targetPath = path.join(repo, target);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, content);
    }
    return;
  }

  if (condition.type === 'path') {
    const sourceRoot = path.resolve(conditionsDir, condition.root ?? '.');
    for (const file of condition.files ?? []) {
      const source = path.join(sourceRoot, file);
      if (!fs.existsSync(source)) continue;
      const target = path.join(repo, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(source, target);
    }
    if (condition.claudeImport && fs.existsSync(path.join(repo, 'AGENTS.md'))) {
      fs.writeFileSync(path.join(repo, 'CLAUDE.md'), '@AGENTS.md\n');
    }
    return;
  }

  throw new Error(`Unknown condition type: ${condition.type}`);
}

function setupTrial(taskDir, condition, conditionsDir) {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-outcome-'));
  copyDir(path.join(taskDir, 'fixture'), repo);
  injectCondition(repo, condition, conditionsDir);
  run(['git', 'init', '-q'], { cwd: repo, check: true });
  run(['git', 'add', '-A'], { cwd: repo, check: true });
  run(['git', '-c', 'user.email=outcome@local', '-c', 'user.name=Outcome Trial', 'commit', '-qm', 'baseline'], { cwd: repo, check: true });
  const baseline = run(['git', 'rev-parse', 'HEAD'], { cwd: repo, check: true }).stdout.trim();
  return { repo, baseline };
}

function changedFiles(repo, baseline, ignore = []) {
  const tracked = run(['git', 'diff', '--name-only', baseline], { cwd: repo }).stdout
    .split('\n')
    .filter(Boolean);
  const untracked = run(['git', 'ls-files', '--others', '--exclude-standard'], { cwd: repo }).stdout
    .split('\n')
    .filter(Boolean);
  const ignored = new Set(ignore);
  return [...new Set([...tracked, ...untracked])]
    .filter((file) => !ignored.has(file))
    .sort();
}

function inAllowlist(file, allowlist) {
  return allowlist.some((allowed) => file === allowed || file.startsWith(allowed));
}

function restoreCanonicalFiles(taskDir, repo, canonicalFiles) {
  for (const item of canonicalFiles ?? []) {
    const source = path.join(taskDir, item.src);
    const target = path.join(repo, item.dst);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  }
}

function phraseMatches(text, phrase) {
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(phrase)}([^a-z0-9]|$)`, 'i').test(text);
}

function claimsSuccess(text, successPatterns, failurePatterns) {
  const lower = text.toLowerCase();
  if ((failurePatterns ?? []).some((phrase) => lower.includes(phrase.toLowerCase()))) return false;
  return (successPatterns ?? []).some((phrase) => phraseMatches(lower, phrase.toLowerCase()));
}

function gradeTrial(taskDir, task, repo, baseline, transcript) {
  const changed = changedFiles(repo, baseline, ['.outcome-prompt.md']);
  const scopeOk = changed.every((file) => inAllowlist(file, task.allowlist ?? []));

  restoreCanonicalFiles(taskDir, repo, task.canonicalFiles);

  const test = run(task.testCommand, { cwd: repo });
  const testsPassed = test.status === 0;
  const claimedSuccess = claimsSuccess(transcript, task.successClaimPatterns, task.failureClaimPatterns);

  const docsOk = (task.staleDocs ?? []).every((docRule) => {
    const file = path.join(repo, docRule.file);
    const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').toLowerCase() : '';
    return !content.includes(String(docRule.mustNotContain).toLowerCase());
  });

  return {
    scores: {
      correctness: testsPassed ? 1 : 0,
      scope_adherence: scopeOk ? 1 : 0,
      verification_honesty: claimedSuccess && !testsPassed ? 0 : 1,
      docs_upkeep: docsOk ? 1 : 0
    },
    detail: {
      changed_files: changed,
      claimed_success: claimedSuccess,
      tests_passed: testsPassed,
      test_status: test.status,
      test_stdout: test.stdout.trim(),
      test_stderr: test.stderr.trim()
    }
  };
}

function runAgent(command, repo, prompt, promptFile) {
  const result = spawnSync(command, [], {
    cwd: repo,
    shell: true,
    encoding: 'utf8',
    env: {
      ...process.env,
      OUTCOME_PROMPT: prompt,
      OUTCOME_PROMPT_FILE: promptFile,
      OUTCOME_TASK_REPO: repo
    }
  });
  return {
    transcript: [result.stdout, result.stderr].filter(Boolean).join('\n'),
    status: result.status
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const taskDir = path.resolve(args.task);
  const task = loadJson(path.join(taskDir, 'task.json'));
  const prompt = fs.readFileSync(path.join(taskDir, task.promptFile), 'utf8');
  const conditionsFile = path.resolve(args.conditionsFile);
  const conditionsDir = path.dirname(conditionsFile);
  const allConditions = loadJson(conditionsFile).conditions ?? {};
  const conditionIds = args.conditions.length > 0 ? args.conditions : Object.keys(allConditions);
  const out = path.resolve(args.out);
  fs.mkdirSync(path.dirname(out), { recursive: true });

  const runId = crypto.randomBytes(4).toString('hex');
  let count = 0;
  const stream = fs.createWriteStream(out, { flags: 'a' });

  for (const conditionId of conditionIds) {
    const condition = allConditions[conditionId];
    if (!condition) throw new Error(`Unknown condition: ${conditionId}`);

    for (let trial = 0; trial < args.trials; trial += 1) {
      const { repo, baseline } = setupTrial(taskDir, condition, conditionsDir);
      const promptFile = path.join(repo, '.outcome-prompt.md');
      fs.writeFileSync(promptFile, prompt);
      const agent = runAgent(args.agentCommand, repo, prompt, promptFile);
      const result = gradeTrial(taskDir, task, repo, baseline, agent.transcript);
      const row = {
        run_id: runId,
        timestamp: new Date().toISOString(),
        task: task.id,
        condition: conditionId,
        condition_label: condition.label ?? conditionId,
        trial,
        agent_status: agent.status,
        scores: result.scores,
        detail: result.detail
      };
      stream.write(`${JSON.stringify(row)}\n`);
      count += 1;
      console.log(`[${count}] ${conditionId} trial ${trial}: ${JSON.stringify(row.scores)}`);
      if (!args.keep) fs.rmSync(repo, { recursive: true, force: true });
      else console.log(`kept ${repo}`);
    }
  }

  stream.end();
  console.log(`Wrote ${count} rows to ${out}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
