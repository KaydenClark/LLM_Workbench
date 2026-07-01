#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const RUBRIC = [
  {
    id: 'control_surfaces',
    label: 'Core control surfaces',
    weight: 10,
    checks: [
      { label: 'agent instructions', requireFiles: ['AGENTS.md'] },
      { label: 'stable blueprint', requireFiles: ['BLUEPRINT.md'] },
      { label: 'active taskboard', requireFiles: ['TASKBOARD.md'] },
      { label: 'operator runbook', requireFiles: ['RUNBOOK.md'] },
      { label: 'user-facing readme', requireFiles: ['README.md'] }
    ]
  },
  {
    id: 'authority_scope',
    label: 'Authority, read, and edit scope',
    weight: 10,
    checks: [
      { label: 'authority order', files: ['AGENTS.md'], patterns: ['Authority Order'] },
      { label: 'read scope', files: ['AGENTS.md'], patterns: ['Read Scope'] },
      { label: 'edit scope', files: ['AGENTS.md'], patterns: ['Edit Scope'] },
      { label: 'secrets boundary', files: ['AGENTS.md'], patterns: ['secrets|credentials|tokens'] }
    ]
  },
  {
    id: 'project_model',
    label: 'Project model and contracts',
    weight: 8,
    checks: [
      { label: 'project promise', files: ['BLUEPRINT.md'], patterns: ['What This Project Is', 'Core promise'] },
      { label: 'architecture table', files: ['BLUEPRINT.md'], patterns: ['Architecture', 'Runtime', 'Testing'] },
      { label: 'contracts', files: ['BLUEPRINT.md'], patterns: ['Main Contracts', 'Routes / Screens|API Endpoints|Commands'] },
      { label: 'invariants', files: ['BLUEPRINT.md'], patterns: ['Core Logic And Invariants'] },
      { label: 'safety boundaries', files: ['BLUEPRINT.md'], patterns: ['Trust, Privacy, And Safety Boundaries'] }
    ]
  },
  {
    id: 'active_work_state',
    label: 'Active work state',
    weight: 9,
    checks: [
      { label: 'current focus', files: ['TASKBOARD.md'], patterns: ['Current focus'] },
      { label: 'ready queue', files: ['TASKBOARD.md'], patterns: ['Ready', 'ready'] },
      { label: 'status values', files: ['TASKBOARD.md'], patterns: ['Status Values', 'in-progress', 'blocked'] },
      { label: 'blocked/deferred lanes', files: ['TASKBOARD.md'], patterns: ['Blocked', 'Deferred'] },
      { label: 'proof log', files: ['TASKBOARD.md'], patterns: ['Proof Log', 'Remaining gap'] }
    ]
  },
  {
    id: 'operations',
    label: 'Operations and recovery',
    weight: 8,
    checks: [
      { label: 'prerequisites', files: ['RUNBOOK.md'], patterns: ['Prerequisites'] },
      { label: 'environment config', files: ['RUNBOOK.md'], patterns: ['Environment Configuration'] },
      { label: 'install/run', files: ['RUNBOOK.md'], patterns: ['Install', 'Run Locally'] },
      { label: 'test/build', files: ['RUNBOOK.md'], patterns: ['Test And Build', 'Full verification'] },
      { label: 'troubleshooting/recovery', files: ['RUNBOOK.md'], patterns: ['Troubleshooting', 'Recovery And Rollback'] }
    ]
  },
  {
    id: 'verification_contract',
    label: 'Verification contract',
    weight: 12,
    checks: [
      { label: 'red/green workflow', files: ['AGENTS.md'], patterns: ['red/green/refactor|Red/Green', 'failing test'] },
      { label: 'specific skip reason', files: ['AGENTS.md'], patterns: ['test is impractical|tests are impractical', 'specific reason|name the specific reason'] },
      { label: 'targeted and full verification', files: ['AGENTS.md'], patterns: ['targeted test', 'full verification suite'] },
      { label: 'meaningful coverage policy', files: ['RUNBOOK.md'], patterns: ['Test Coverage Policy', 'deletes? a meaningful line|accidentally deletes?|meaningful line', 'stale|bloat'] },
      { label: 'final response proof', files: ['AGENTS.md'], patterns: ['Final response', 'proof'] },
      { label: 'durable proof log', files: ['AGENTS.md', 'TASKBOARD.md'], patterns: ['Proof Log|proof log'] }
    ]
  },
  {
    id: 'documentation_ownership',
    label: 'Documentation ownership',
    weight: 8,
    checks: [
      { label: 'docs are part of done', files: ['AGENTS.md'], patterns: ['Documentation is part of the work|Documentation is part of done'] },
      { label: 'documentation owner', files: ['AGENTS.md'], patterns: ['documentation owner'] },
      { label: 'doc routing table', files: ['AGENTS.md', 'TASKBOARD.md'], patterns: ['BLUEPRINT\\.md', 'TASKBOARD\\.md', 'RUNBOOK\\.md', 'README\\.md'] },
      { label: 'no-update note', files: ['AGENTS.md', 'TASKBOARD.md'], patterns: ['Docs checked; no update needed'] }
    ]
  },
  {
    id: 'drift_control',
    label: 'Long-session drift control',
    weight: 8,
    checks: [
      { label: 'long session section', files: ['AGENTS.md'], patterns: ['Long Session Control'] },
      { label: 're-read taskboard', files: ['AGENTS.md'], patterns: ['Re-read `BLUEPRINT\\.md` and `TASKBOARD\\.md`'] },
      { label: 'context recovery', files: ['AGENTS.md', 'TASKBOARD.md'], patterns: ['context summary|long interruption|Long Session Control'] },
      { label: 'progress ledger statuses', files: ['AGENTS.md', 'TASKBOARD.md'], patterns: ['proof rows|Proof Log', 'ready|in-progress|blocked'] }
    ]
  },
  {
    id: 'collaboration',
    label: 'Team coordination',
    weight: 8,
    checks: [
      { label: 'manager instructions', requireFiles: ['team templates/MANAGER.md'] },
      { label: 'subagent instructions', requireFiles: ['team templates/SUBAGENT.md'] },
      { label: 'team taskboard', requireFiles: ['team templates/TASKBOARD.md'] },
      { label: 'non-overlapping lanes', files: ['team templates/MANAGER.md', 'team templates/TASKBOARD.md'], patterns: ['No two open tasks|no two open tasks|do not overlap'] },
      { label: 'single durable writer', files: ['AGENTS.md', 'team templates/MANAGER.md', 'team templates/README.md'], patterns: ['single author|single durable|Subagents log proof.*TASKBOARD\\.md'] }
    ]
  },
  {
    id: 'safety',
    label: 'Safety and change control',
    weight: 8,
    checks: [
      { label: 'destructive change approval', files: ['AGENTS.md', 'RUNBOOK.md'], patterns: ['delete data|reset databases|destructive|destroy data'] },
      { label: 'paid service approval', files: ['AGENTS.md'], patterns: ['paid services'] },
      { label: 'explicit error handling', files: ['AGENTS.md'], patterns: ['explicit error handling'] },
      { label: 'privacy/data boundary', files: ['AGENTS.md', 'BLUEPRINT.md', 'RUNBOOK.md'], patterns: ['privacy|private|local data'] }
    ]
  },
  {
    id: 'portability',
    label: 'Tool portability',
    weight: 5,
    checks: [
      { label: 'plain markdown', files: ['README.md'], patterns: ['plain Markdown'] },
      { label: 'multi-agent compatibility', files: ['README.md'], patterns: ['Codex, Claude|Codex|Claude'] },
      { label: 'Claude Code import note', files: ['README.md'], patterns: ['Claude Code', '@AGENTS\\.md|/init'] }
    ]
  },
  {
    id: 'asset_workflow',
    label: 'Visual and asset guardrails',
    weight: 6,
    checks: [
      { label: 'no bundled house style', files: ['AGENTS.md', 'README.md'], patterns: ['does not define a house visual style|Do not force a shared visual style'] },
      { label: 'project-specific direction', files: ['AGENTS.md', 'README.md'], patterns: ['project-local design|original product prompt|brand requirements'] },
      { label: 'license-safe asset search', files: ['AGENTS.md', 'README.md'], patterns: ['license-safe free assets'] },
      { label: 'asset attribution', files: ['AGENTS.md', 'README.md'], patterns: ['source URL|license|author|attribution'] },
      { label: 'avoid emoji icons', files: ['AGENTS.md', 'README.md'], patterns: ['avoid emoji'] }
    ]
  }
];

const SKIP_DIRS = new Set(['.git', 'node_modules', '.next', 'dist', 'build']);

export function scoreWorkbench(files) {
  const breakdown = RUBRIC.map((criterion) => {
    const checkResults = criterion.checks.map((check) => {
      const passed = checkPassed(files, check);
      return { label: check.label, passed };
    });
    const passed = checkResults.filter((result) => result.passed).length;
    const rawScore = criterion.weight * (passed / criterion.checks.length);
    return {
      id: criterion.id,
      label: criterion.label,
      weight: criterion.weight,
      score: round(rawScore),
      passed,
      total: criterion.checks.length,
      missing: checkResults.filter((result) => !result.passed).map((result) => result.label)
    };
  });
  const score = round(breakdown.reduce((sum, item) => sum + item.score, 0));
  return { score, maxScore: totalWeight(), breakdown };
}

export function controlCandidates() {
  return [
    {
      name: 'control:no-template',
      source: 'synthetic',
      files: {}
    },
    {
      name: 'control:single-instruction-file',
      source: 'synthetic',
      files: {
        'AGENTS.md': [
          '# Agent Instructions',
          '',
          '- Follow the existing code style.',
          '- Run relevant tests before finishing.',
          '- Ask before risky changes.'
        ].join('\n')
      }
    }
  ];
}

export function loadLocalFiles(rootDir) {
  const files = {};
  const root = path.resolve(rootDir);
  walk(root);
  return files;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;
      if (!entry.name.endsWith('.md') && !entry.name.endsWith('.txt')) continue;
      const relative = path.relative(root, fullPath).split(path.sep).join('/');
      files[relative] = fs.readFileSync(fullPath, 'utf8');
    }
  }
}

export function loadGithubBranch(repo, branch) {
  const treeJson = ghApi(`repos/${repo}/git/trees/${branch}?recursive=1`);
  const tree = JSON.parse(treeJson).tree ?? [];
  const markdownBlobs = tree.filter((item) => {
    return item.type === 'blob' && (item.path.endsWith('.md') || item.path.endsWith('.txt'));
  });
  const files = {};
  for (const blob of markdownBlobs) {
    const blobJson = ghApi(`repos/${repo}/git/blobs/${blob.sha}`);
    const parsed = JSON.parse(blobJson);
    if (parsed.encoding !== 'base64') continue;
    files[blob.path] = Buffer.from(parsed.content, 'base64').toString('utf8');
  }
  return files;
}

export function renderMarkdown(results) {
  const rows = [
    '| Candidate | Score | Missing high-value evidence |',
    '|---|---:|---|'
  ];
  for (const result of results) {
    const missing = topMissing(result.evaluation).join('; ') || 'none';
    rows.push(`| ${escapeCell(result.name)} | ${result.evaluation.score}/${result.evaluation.maxScore} | ${escapeCell(missing)} |`);
  }

  const details = [];
  for (const result of results) {
    details.push(`\n## ${result.name}\n`);
    details.push(`Source: ${result.source}`);
    details.push('');
    details.push('| Area | Score | Missing |');
    details.push('|---|---:|---|');
    for (const item of result.evaluation.breakdown) {
      details.push(`| ${escapeCell(item.label)} | ${item.score}/${item.weight} | ${escapeCell(item.missing.join(', ') || 'none')} |`);
    }
  }

  return ['# Workbench Evaluation', '', ...rows, ...details, ''].join('\n');
}

function checkPassed(files, check) {
  if (check.requireFiles) {
    return check.requireFiles.every((file) => Object.hasOwn(files, file));
  }
  const required = check.files ?? Object.keys(files);
  if (required.length === 0) return false;
  const haystack = required.map((file) => files[file] ?? '').join('\n');
  if (!haystack.trim()) return false;
  return (check.patterns ?? []).every((pattern) => new RegExp(pattern, 'im').test(haystack));
}

function totalWeight() {
  return RUBRIC.reduce((sum, item) => sum + item.weight, 0);
}

function topMissing(evaluation) {
  return evaluation.breakdown
    .filter((item) => item.missing.length > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((item) => `${item.label}: ${item.missing.slice(0, 2).join(', ')}`);
}

function ghApi(endpoint) {
  return execFileSync('gh', ['api', endpoint], { encoding: 'utf8' });
}

function escapeCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function parseArgs(argv) {
  const options = {
    path: null,
    github: null,
    branches: [],
    includeControls: false,
    json: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--path') options.path = argv[++index];
    else if (arg === '--github') options.github = argv[++index];
    else if (arg === '--branches') options.branches = argv[++index].split(',').filter(Boolean);
    else if (arg === '--include-controls') options.includeControls = true;
    else if (arg === '--json') options.json = true;
    else if (!options.path) options.path = arg;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const candidates = [];

  if (options.github) {
    const branches = options.branches.length > 0 ? options.branches : listGithubBranches(options.github);
    for (const branch of branches) {
      candidates.push({
        name: `${options.github}:${branch}`,
        source: `github:${options.github}@${branch}`,
        files: loadGithubBranch(options.github, branch)
      });
    }
  }

  if (options.path || !options.github) {
    const root = options.path ?? '.';
    candidates.push({
      name: `local:${path.resolve(root)}`,
      source: `local:${path.resolve(root)}`,
      files: loadLocalFiles(root)
    });
  }

  if (options.includeControls) {
    candidates.push(...controlCandidates());
  }

  const results = candidates.map((candidate) => ({
    name: candidate.name,
    source: candidate.source,
    evaluation: scoreWorkbench(candidate.files)
  }));

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(renderMarkdown(results));
  }
}

function listGithubBranches(repo) {
  const branchesJson = ghApi(`repos/${repo}/branches?per_page=100`);
  return JSON.parse(branchesJson).map((branch) => branch.name);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
