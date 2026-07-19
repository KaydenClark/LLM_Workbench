#!/usr/bin/env node
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseMarkdownTableRow } from './markdown-table.mjs';

const IMPACT_WEIGHT = { high: 3, medium: 2, low: 1 };
const RUN_OUTCOME_CATEGORIES = new Set([
  'actionable',
  'worked',
  'idle',
  'owner_gate',
  'collision',
  'infrastructure_error'
]);
const EXCLUDED_NAME = /(?:^|[-_])(backup|copy|worktree|worktrees|t\d{2,})$/i;
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'be', 'by', 'for', 'from', 'in', 'into', 'is',
  'it', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'with'
]);

export function parseFeedbackRows(markdown, source) {
  const rows = [];
  let inFeedbackTable = false;
  const lines = markdown.split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) {
      if (inFeedbackTable) inFeedbackTable = false;
      continue;
    }
    if (!trimmed.endsWith('|')) {
      if (inFeedbackTable) throw malformedFeedbackRow(index + 1, 'row must end with |');
      continue;
    }

    const cells = parseMarkdownTableRow(trimmed).map(cleanCell);
    if (isFeedbackHeader(cells)) {
      inFeedbackTable = true;
      continue;
    }
    if (!inFeedbackTable) continue;
    if (cells.length !== 6) {
      throw malformedFeedbackRow(index + 1, `expected 6 columns, found ${cells.length}`);
    }
    if (cells.every((cell) => /^-+$/.test(cell))) continue;

    const [date, docSection, whatHappened, impactText, proposedChange, statusText] = cells;
    const status = normalize(statusText);
    if (status !== 'new') continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      if (/^\[YYYY-MM-DD\]$/.test(date)) continue;
      throw malformedFeedbackRow(index + 1, `invalid date ${date || '(empty)'}`);
    }
    const impact = Object.keys(IMPACT_WEIGHT).find((value) => normalize(impactText).startsWith(value)) ?? 'low';
    const normalized = [source.repo, date, docSection, whatHappened, proposedChange]
      .map(normalize)
      .join('|');
    rows.push({
      repo: source.repo,
      origin: source.origin,
      date,
      docSection,
      whatHappened,
      impact,
      impactText,
      proposedChange,
      status,
      fingerprint: crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 12),
      semanticTokens: semanticTokens(`${docSection} ${whatHappened} ${proposedChange}`)
    });
  }
  return rows;
}

function isFeedbackHeader(cells) {
  return cells.length === 6
    && cells.map(normalize).join('|') === 'date|doc / section|what happened|impact|proposed change|status';
}

function malformedFeedbackRow(line, detail) {
  return new Error(`Workbench Feedback line ${line} is malformed: ${detail}`);
}

export function discoverFeedback(projectsRoot) {
  const candidates = [];
  const seenOrigins = new Set();
  const entries = fs.readdirSync(projectsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name));

  for (const entry of entries) {
    if (EXCLUDED_NAME.test(entry.name)) continue;
    const repoPath = path.join(projectsRoot, entry.name);
    const gitPath = path.join(repoPath, '.git');
    // Workbench Feedback is the current name (S-008); HARNESS_FEEDBACK.md is
    // the grandfathered legacy filename downstream projects may still carry.
    // When both exist, the renamed file wins.
    const feedbackPath = ['WORKBENCH_FEEDBACK.md', 'HARNESS_FEEDBACK.md']
      .map((name) => path.join(repoPath, name))
      .find((candidate) => fs.existsSync(candidate));
    if (!fs.existsSync(gitPath) || !fs.statSync(gitPath).isDirectory() || !feedbackPath) continue;
    const origin = git(repoPath, ['remote', 'get-url', 'origin']);
    const topLevel = git(repoPath, ['rev-parse', '--show-toplevel']);
    if (!origin || realPath(topLevel) !== realPath(repoPath) || !isWritableOwnerOrigin(origin)) continue;
    const originKey = normalizeOrigin(origin);
    if (seenOrigins.has(originKey)) continue;
    seenOrigins.add(originKey);
    candidates.push(...parseFeedbackRows(fs.readFileSync(feedbackPath, 'utf8'), {
      repo: entry.name,
      origin
    }));
  }

  const recurrences = candidates.map((candidate) =>
    candidates.filter((other) => similarity(candidate.semanticTokens, other.semanticTokens) >= 0.7).length
  );
  for (const [index, candidate] of candidates.entries()) {
    candidate.recurrence = recurrences[index];
    delete candidate.semanticTokens;
  }
  return rankCandidates(candidates);
}

export function rankCandidates(candidates) {
  return [...candidates].sort((left, right) =>
    (IMPACT_WEIGHT[right.impact] ?? 0) - (IMPACT_WEIGHT[left.impact] ?? 0)
    || (right.recurrence ?? 1) - (left.recurrence ?? 1)
    || left.date.localeCompare(right.date)
    || left.repo.localeCompare(right.repo)
  );
}

export function selectCandidate(candidates, { pendingFingerprints = [], processedFingerprints = [] } = {}) {
  if (pendingFingerprints.length > 0) return null;
  const processed = new Set(processedFingerprints);
  return rankCandidates(candidates).find((candidate) => !processed.has(candidate.fingerprint)) ?? null;
}

export function classifyDecision(evidence = {}) {
  if (evidence.infrastructureError) {
    return {
      verdict: 'blocked',
      reason: String(evidence.infrastructureError),
      alert: Number(evidence.infraFailureCount ?? 0) >= 2
    };
  }
  const required = [
    ['baselineRed', 'baseline did not reproduce the reported failure'],
    ['candidateGreen', 'candidate did not fix the targeted failure'],
    ['fullSuite', 'full verification suite failed'],
    ['mergeable', 'PR is not mergeable'],
    ['current', 'PR is stale against integration'],
    ['publicSafe', 'PR contains unsafe or private material']
  ];
  for (const [key, reason] of required) {
    if (!evidence[key]) return { verdict: 'deny', reason, alert: false };
  }
  if (evidence.guardrailRegression) return { verdict: 'deny', reason: 'guardrail score regressed', alert: false };
  if (evidence.staticRegression) return { verdict: 'deny', reason: 'static contract score regressed', alert: false };
  if (evidence.behavioralClaim && !evidence.confidencePositive) {
    return { verdict: 'deny', reason: 'behavioral evidence is statistically inconclusive', alert: false };
  }
  return {
    verdict: 'pass',
    reason: evidence.behavioralClaim
      ? 'positive behavioral confidence and all safety gates passed'
      : 'direct regression proof and all safety gates passed',
    alert: false
  };
}

export function transitionRunOutcome(input = {}) {
  const category = String(input.category ?? '');
  if (!RUN_OUTCOME_CATEGORIES.has(category)) {
    throw new Error(`category must be one of: ${[...RUN_OUTCOME_CATEGORIES].join(', ')}`);
  }
  if (typeof input.reason !== 'string' || !input.reason.trim()) {
    throw new Error('reason must be a non-empty string');
  }
  const reason = input.reason.trim();
  const previousIdleCount = input.previousIdleCount ?? 0;
  if (!Number.isInteger(previousIdleCount) || previousIdleCount < 0) {
    throw new Error('previousIdleCount must be a non-negative integer');
  }
  if (category === 'idle' && input.verifiedIdle !== true) {
    throw new Error('idle requires verifiedIdle=true');
  }

  const idleCount = category === 'idle'
    ? previousIdleCount + 1
    : ['actionable', 'worked'].includes(category)
      ? 0
      : previousIdleCount;
  return {
    category,
    reason,
    idleCount,
    pauseRecommended: category === 'idle' && idleCount >= 2
  };
}

function cleanCell(value) {
  return value.trim().replace(/`/g, '');
}

function normalize(value) {
  return String(value).toLowerCase().replace(/`/g, '').replace(/\s+/g, ' ').trim();
}

function semanticTokens(value) {
  return new Set(normalize(value).match(/[a-z0-9]+/g)?.filter((token) => token.length > 2 && !STOP_WORDS.has(token)) ?? []);
}

function similarity(left, right) {
  if (left.size === 0 || right.size === 0) return 0;
  const intersection = [...left].filter((token) => right.has(token)).length;
  const union = new Set([...left, ...right]).size;
  return intersection / union;
}

function git(repo, args) {
  try {
    return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function isWritableOwnerOrigin(origin) {
  return /^(?:https:\/\/github\.com\/KaydenClark\/|git@github\.com:KaydenClark\/)/i.test(origin);
}

function normalizeOrigin(origin) {
  return origin.toLowerCase().replace(/^git@github\.com:/, 'https://github.com/').replace(/\.git$/, '');
}

function realPath(value) {
  try {
    return fs.realpathSync(value);
  } catch {
    return path.resolve(value);
  }
}

function parseCli(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 2) {
    options[rest[index].replace(/^--/, '')] = rest[index + 1];
  }
  return { command, options };
}

function main(argv) {
  const { command, options } = parseCli(argv);
  if (command === 'discover') {
    if (!options['projects-root']) throw new Error('discover requires --projects-root');
    const candidates = discoverFeedback(options['projects-root']);
    const selected = selectCandidate(candidates, {
      pendingFingerprints: splitCsv(options.pending),
      processedFingerprints: splitCsv(options.processed)
    });
    process.stdout.write(`${JSON.stringify({ candidates, selected }, null, 2)}\n`);
    return;
  }
  if (command === 'decision') {
    if (!options.input) throw new Error('decision requires --input');
    const evidence = JSON.parse(fs.readFileSync(options.input, 'utf8'));
    process.stdout.write(`${JSON.stringify(classifyDecision(evidence), null, 2)}\n`);
    return;
  }
  if (command === 'run-outcome') {
    if (!options.input) throw new Error('run-outcome requires --input');
    const input = JSON.parse(fs.readFileSync(options.input, 'utf8'));
    process.stdout.write(`${JSON.stringify(transitionRunOutcome(input), null, 2)}\n`);
    return;
  }
  throw new Error('usage: feedback-automation.mjs discover --projects-root PATH [--pending CSV] [--processed CSV] | decision --input FILE | run-outcome --input FILE');
}

function splitCsv(value) {
  return value ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];
}

if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`ERROR: ${error.message}\n`);
    process.exitCode = 1;
  }
}
