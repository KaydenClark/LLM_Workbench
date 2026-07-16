#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { scoreWorkbench } from './evaluate-workbench.mjs';

const SKIP_DIRS = new Set(['.git', 'node_modules', '.next', 'dist', 'build']);
const AUDIT_EXTENSIONS = new Set(['.md', '.txt', '.json', '.jsonl']);

export function loadAuditFiles(rootDir) {
  const root = path.resolve(rootDir);
  const files = {};
  walk(root);
  return files;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(fullPath);
        continue;
      }
      if (!entry.isFile() || !AUDIT_EXTENSIONS.has(path.extname(entry.name))) continue;
      const relative = path.relative(root, fullPath).split(path.sep).join('/');
      files[relative] = fs.readFileSync(fullPath, 'utf8');
    }
  }
}

export function auditGuardrails(files, options = {}) {
  const today = parseDate(options.today ?? new Date().toISOString().slice(0, 10));
  if (!today) throw new Error(`Invalid audit date: ${options.today}`);

  const staticEvaluation = scoreWorkbench(files);
  const categories = [
    staticCoverageCategory(staticEvaluation),
    driftResistanceCategory(files, today),
    benchmarkDisciplineCategory(files),
    outcomeEvidenceCategory(files, today)
  ];
  const score = round(categories.reduce((sum, category) => sum + category.score, 0));
  const recommendations = categories
    .flatMap((category) => category.checks
      .filter((check) => !check.passed)
      .map((check) => ({
        category: category.label,
        points: check.weight,
        action: check.action,
        evidence: check.evidence
      })))
    .sort((a, b) => b.points - a.points || a.category.localeCompare(b.category));

  return {
    score,
    maxScore: 100,
    status: score === 100 ? 'north-star reached' : score >= 80 ? 'strong but drifting' : score >= 60 ? 'developing' : 'evidence-poor',
    categories,
    recommendations,
    staticEvaluation
  };
}

export function renderGuardrailReport(audit, options = {}) {
  const name = options.name ?? 'local harness';
  const lines = [
    `# Guardrail Audit: ${name}`,
    '',
    `Score: **${audit.score}/${audit.maxScore}** (${audit.status})`,
    '',
    '> 100 is the north star, not a regression-test pass mark. A green test suite can coexist with a low guardrail score.',
    '',
    '| Area | Score | What is missing |',
    '|---|---:|---|'
  ];

  for (const category of audit.categories) {
    const missing = category.checks.filter((check) => !check.passed).map((check) => check.label).join('; ') || 'none';
    lines.push(`| ${escapeCell(category.label)} | ${category.score}/${category.weight} | ${escapeCell(missing)} |`);
  }

  lines.push('', '## Recommended improvements', '');
  if (audit.recommendations.length === 0) {
    lines.push('No scored gaps. Add harder held-out tasks before treating 100 as permanent.');
  } else {
    for (const item of audit.recommendations) {
      lines.push(`- **+${item.points} ${item.category}:** ${item.action} _Evidence: ${item.evidence}_`);
    }
  }
  lines.push('');
  return lines.join('\n');
}

function staticCoverageCategory(evaluation) {
  const weight = 20;
  const score = round(weight * evaluation.score / evaluation.maxScore);
  const passed = score === weight;
  return {
    id: 'static_contract',
    label: 'Static guardrail contract',
    weight,
    score,
    checks: [{
      id: 'static_rubric',
      label: 'complete static control surfaces',
      weight: round(weight - score),
      passed,
      evidence: `static evaluator ${evaluation.score}/${evaluation.maxScore}`,
      action: 'Close the highest-weight missing static evaluator criteria without weakening existing checks.'
    }]
  };
}

function driftResistanceCategory(files, today) {
  const taskboard = files['TASKBOARD.md'] ?? '';
  const checks = [
    booleanCheck(
      'fresh_control_docs',
      'fresh root control documents',
      5,
      controlDocsAreFresh(files, today, 45),
      'Last reviewed or updated dates in BLUEPRINT.md, TASKBOARD.md, and RUNBOOK.md are present and no more than 45 days old.',
      'Review stale root control docs against live code and update their dates only after resolving any drift.'
    ),
    booleanCheck(
      'version_contract',
      'consistent harness version contract',
      5,
      versionContractIsConsistent(files),
      'Root blueprint declares a harness version and the five copyable control docs carry the generic version stamp.',
      'Align the root harness version with version placeholders across all copyable control docs.'
    ),
    booleanCheck(
      'task_state',
      'no contradictory task status',
      5,
      !hasContradictoryTaskStatus(taskboard) && !hasContradictorySpecState(files),
      'A legacy task cannot be active and Done; a complete spec cannot remain hot or contain unfinished tickets.',
      'Resolve contradictory task status or spec lifecycle state and preserve completion evidence in the stable spec.'
    ),
    booleanCheck(
      'proof_freshness',
      'fresh taskboard proof',
      5,
      taskboardProofIsFresh(files, today, 30),
      'The hot taskboard update and newest spec evidence row are no more than 30 days old.',
      'Run current verification and append a dated spec evidence row with the real result and remaining gap.'
    ),
    booleanCheck(
      'retired_controls',
      'retired control docs stay retired',
      5,
      !Object.hasOwn(files, 'ROADMAP.md') && !Object.hasOwn(files, 'GAMEPLAN.md'),
      'ROADMAP.md and GAMEPLAN.md are absent from the root control layer.',
      'Move unique live work into BLUEPRINT.md or TASKBOARD.md, then retire duplicate root planning files.'
    )
  ];
  return scoredCategory('drift_resistance', 'Drift resistance', 25, checks);
}

function benchmarkDisciplineCategory(files) {
  const contract = [
    files['AGENTS.md'] ?? '',
    files['RUNBOOK.md'] ?? '',
    files['templates/AGENTS.md'] ?? '',
    files['templates/RUNBOOK.md'] ?? '',
    files['benchmarks/README.md'] ?? '',
    files['TASKBOARD.md'] ?? ''
  ].join('\n');
  const results = files['benchmarks/RESULTS.md'] ?? '';
  const checks = [
    patternCheck(
      'prechange_baseline',
      'pre-change guardrail baseline',
      5,
      contract,
      /(?:capture|record|run)[^\n]{0,80}(?:guardrail|benchmark)[^\n]{0,80}before|baseline[^\n]{0,80}before[^\n]{0,40}(?:edit|change)/i,
      'A durable rule requires the benchmark baseline before a harness change.',
      'Require harness changes to capture the guardrail score before editing.'
    ),
    patternCheck(
      'benchmark_delta',
      'benchmark movement in acceptance proof',
      5,
      contract,
      /before\/?after score|score delta|benchmark movement|improv(?:e|ement)[^\n]{0,60}benchmark/i,
      'Completion proof must report the before/after benchmark score or explain why no score can move.',
      'Make the before/after score and remaining recommendations part of harness-change acceptance.'
    ),
    patternCheck(
      'evidence_layers',
      'static and outcome evidence stay distinct',
      5,
      contract,
      /static[^\n]{0,100}(?:not sufficient|not causal|outcome|behavior)|outcome[^\n]{0,100}static/i,
      'The docs distinguish static coverage from causal agent-behavior evidence.',
      'State that static rubric success cannot substitute for repeated outcome trials.'
    ),
    booleanCheck(
      'append_only_results',
      'append-only benchmark result ledger',
      5,
      /append-only/i.test(results) && /remaining gap/i.test(results),
      'benchmarks/RESULTS.md is append-only and records remaining gaps.',
      'Create an append-only benchmark result ledger with proof, result, and remaining-gap fields.'
    ),
    booleanCheck(
      'north_star',
      '100-point north star is not the release gate',
      5,
      /100[^\n]{0,40}north.star|north.star[^\n]{0,40}100/i.test(contract)
        && /not[^\n]{0,60}(?:release|regression)[^\n]{0,20}(?:gate|pass)|regression[^\n]{0,40}release gate/i.test(contract),
      'The perfect score is an aspirational improvement target; regression health remains a separate release gate.',
      'Define 100 as the deliberately hard north star while keeping regression checks as a separate minimum gate.'
    )
  ];
  return scoredCategory('benchmark_discipline', 'Benchmark discipline', 25, checks);
}

function outcomeEvidenceCategory(files, today) {
  const taskDefinitions = Object.entries(files)
    .filter(([name]) => /^evals\/tasks\/[^/]+\/task\.json$/.test(name))
    .map(([name, content]) => ({ name, data: safeJson(content) }))
    .filter((item) => item.data);
  const realResults = Object.entries(files)
    .filter(([name, content]) => /^evals\/results\/(?!_)[^/]+\.jsonl$/.test(name) && content.trim())
    .map(([name, content]) => ({ name, content }));
  const resultText = realResults.map((item) => item.content).join('\n');
  const ledger = files['evals/results/LEDGER.md'] ?? '';
  const hasHeldout = taskDefinitions.some((item) => item.data.suite === 'heldout');
  const checks = [
    booleanCheck(
      'task_diversity',
      'two task domains including held-out work',
      8,
      taskDefinitions.length >= 2 && hasHeldout,
      `${taskDefinitions.length} eval task(s); held-out present: ${hasHeldout ? 'yes' : 'no'}`,
      'Add a deterministic held-out task in a second domain so template tuning cannot overfit the development task.'
    ),
    booleanCheck(
      'real_results',
      'real repeated outcome results',
      8,
      realResults.length > 0,
      `${realResults.length} non-synthetic outcome result file(s)`,
      'Run real repeated outcome trials and save the non-synthetic JSONL evidence.'
    ),
    booleanCheck(
      'candidate_comparison',
      'controls, prior version, and candidate compared',
      6,
      hasCondition(resultText, 'c0_') && hasCondition(resultText, 'c1_')
        && hasCondition(resultText, 'c2_') && hasCondition(resultText, 'c3_'),
      'Real results must include no-template, generic, prior/current, and candidate conditions.',
      'Compare the candidate against both controls and the prior harness on the same tasks.'
    ),
    booleanCheck(
      'recent_results',
      'recent real outcome evidence',
      4,
      realResults.some((item) => containsRecentDate(item.content, today, 90)),
      'At least one non-synthetic outcome result is no more than 90 days old.',
      'Refresh the real outcome benchmark on the current candidate and record the tested ref and date.'
    ),
    booleanCheck(
      'uncertainty',
      'repeated trials with uncertainty',
      4,
      realResults.length > 0 && /95% CI|confidence interval/i.test(ledger) && ledgerHasRealRow(ledger),
      'The real-result ledger reports repeated trials and uncertainty, not a one-off win.',
      'Score repeated trials, report the effect and confidence interval, and append the run to the ledger.'
    )
  ];
  return scoredCategory('outcome_evidence', 'Outcome evidence', 30, checks);
}

function scoredCategory(id, label, weight, checks) {
  return {
    id,
    label,
    weight,
    score: round(checks.filter((check) => check.passed).reduce((sum, check) => sum + check.weight, 0)),
    checks
  };
}

function booleanCheck(id, label, weight, passed, evidence, action) {
  return { id, label, weight, passed: Boolean(passed), evidence, action };
}

function patternCheck(id, label, weight, haystack, pattern, evidence, action) {
  return booleanCheck(id, label, weight, pattern.test(haystack), evidence, action);
}

function controlDocsAreFresh(files, today, maxAgeDays) {
  const docs = ['BLUEPRINT.md', 'TASKBOARD.md', 'RUNBOOK.md'];
  return docs.every((name) => {
    const match = (files[name] ?? '').match(/\*\*(?:Last reviewed|Last updated):\*\*\s*(\d{4}-\d{2}-\d{2})/i);
    const date = parseDate(match?.[1]);
    return date && daysBetween(date, today) >= 0 && daysBetween(date, today) <= maxAgeDays;
  });
}

function versionContractIsConsistent(files) {
  const hasRootVersion = /\*\*Harness version:\*\*\s*v\d+(?:\.\d+)*/i.test(files['BLUEPRINT.md'] ?? '');
  const templateFiles = ['AGENTS.md', 'BLUEPRINT.md', 'TASKBOARD.md', 'RUNBOOK.md', 'README.md'];
  const stamped = templateFiles.every((name) => /Generated from LLM Workbench v\[HARNESS_VERSION\]/i.test(files[`templates/${name}`] ?? ''));
  return hasRootVersion && stamped;
}

function hasContradictoryTaskStatus(taskboard) {
  const active = new Set([
    ...taskIdsInSection(taskboard, 'Ready'),
    ...taskIdsInSection(taskboard, 'In Progress'),
    ...taskIdsInSection(taskboard, 'Blocked'),
    ...taskIdsInSection(taskboard, 'Deferred')
  ]);
  const done = new Set(taskIdsInSection(taskboard, 'Done'));
  return [...active].some((id) => done.has(id));
}

function taskIdsInSection(markdown, heading) {
  const lines = markdown.split('\n');
  const start = lines.findIndex((line) => line.trim().toLowerCase() === `## ${heading}`.toLowerCase());
  if (start < 0) return [];
  const endOffset = lines.slice(start + 1).findIndex((line) => /^##\s+/.test(line));
  const end = endOffset < 0 ? lines.length : start + 1 + endOffset;
  return [...lines.slice(start + 1, end).join('\n').matchAll(/\|\s*(T-\d+)\s*\|/g)].map((item) => item[1]);
}

function taskboardProofIsFresh(files, today, maxAgeDays) {
  const taskboard = files['TASKBOARD.md'] ?? '';
  const updated = parseDate(taskboard.match(/\*\*Last updated:\*\*\s*(\d{4}-\d{2}-\d{2})/i)?.[1]);
  const specProof = Object.entries(files)
    .filter(([name]) => /^specs\/S-\d{3}-[^/]+\/SPEC\.md$/.test(name))
    .map(([, content]) => content.split(/^## Append-Only Evidence And Execution Log\s*$/im)[1] ?? '')
    .join('\n');
  const proof = specProof || (taskboard.split(/^## Proof Log\s*$/im)[1] ?? '');
  const proofDates = [...proof.matchAll(/^\|\s*(\d{4}-\d{2}-\d{2})\s*\|/gm)]
    .map((item) => parseDate(item[1]))
    .filter(Boolean)
    .sort((a, b) => b - a);
  if (!updated || proofDates.length === 0) return false;
  return daysBetween(updated, today) >= 0 && daysBetween(updated, today) <= maxAgeDays
    && daysBetween(proofDates[0], today) >= 0 && daysBetween(proofDates[0], today) <= maxAgeDays;
}

function hasContradictorySpecState(files) {
  for (const [name, content] of Object.entries(files)) {
    if (!/^specs\/S-\d{3}-[^/]+\/SPEC\.md$/.test(name)) continue;
    const id = content.match(/^\*\*Spec ID:\*\*\s*(S-\d{3})/m)?.[1];
    const status = content.match(/^\*\*Status:\*\*\s*([^\n]+)/m)?.[1]?.trim();
    if (!id || !status) return true;
    if (['complete', 'superseded'].includes(status)) {
      if (/^\|\s*TK-\d+\s*\|.*\|\s*(?:ready|in-progress|blocked|deferred)\s*\|/m.test(content)) return true;
      if ((files['TASKBOARD.md'] ?? '').includes(`| [${id}](`)) return true;
    }
  }
  return false;
}

function hasCondition(content, prefix) {
  return new RegExp(`(?:condition|condition_id|id)\\s*[\"':=]+\\s*[\"]?${prefix}`, 'i').test(content)
    || new RegExp(`[\"']${prefix}[^\"']*[\"']`, 'i').test(content);
}

function containsRecentDate(content, today, maxAgeDays) {
  return [...content.matchAll(/\b(\d{4}-\d{2}-\d{2})\b/g)]
    .map((item) => parseDate(item[1]))
    .filter(Boolean)
    .some((date) => daysBetween(date, today) >= 0 && daysBetween(date, today) <= maxAgeDays);
}

function ledgerHasRealRow(ledger) {
  return ledger.split('\n').some((line) => /^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line));
}

function safeJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function parseDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysBetween(earlier, later) {
  return Math.floor((later - earlier) / 86_400_000);
}

function escapeCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function parseArgs(argv) {
  const options = { path: '.', name: null, json: false, today: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--path') options.path = argv[++index];
    else if (arg === '--name') options.name = argv[++index];
    else if (arg === '--today') options.today = argv[++index];
    else if (arg === '--json') options.json = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const root = path.resolve(options.path);
  const audit = auditGuardrails(loadAuditFiles(root), { today: options.today });
  if (options.json) console.log(JSON.stringify(audit, null, 2));
  else console.log(renderGuardrailReport(audit, { name: options.name ?? root }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
