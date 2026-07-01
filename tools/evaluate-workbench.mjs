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
      { label: 'active roadmap', requireFiles: ['ROADMAP.md'] },
      { label: 'operator runbook', requireFiles: ['RUNBOOK.md'] },
      { label: 'user-facing readme', requireFiles: ['README.md'] }
    ]
  },
  {
    id: 'structured_metadata',
    label: 'Structured metadata',
    weight: 8,
    checks: [
      {
        label: 'agent front matter',
        frontMatterFiles: ['AGENTS.md'],
        requiredKeys: ['doc_type', 'version', 'project_name', 'status', 'applies_to', 'owners', 'writable_roots', 'forbidden_paths', 'quality_gates', 'requires_review_for']
      },
      {
        label: 'blueprint front matter',
        frontMatterFiles: ['BLUEPRINT.md'],
        requiredKeys: ['doc_type', 'version', 'project_name', 'status', 'source_root', 'last_reviewed', 'tracks']
      },
      {
        label: 'roadmap front matter',
        frontMatterFiles: ['ROADMAP.md'],
        requiredKeys: ['doc_type', 'version', 'project_name', 'status', 'current_goal', 'proof_log', 'last_reviewed', 'tracks']
      },
      {
        label: 'runbook front matter',
        frontMatterFiles: ['RUNBOOK.md'],
        requiredKeys: ['doc_type', 'version', 'project_name', 'status', 'environment', 'runtime_owner', 'verification_commands', 'guardrails']
      }
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
      { label: 'current state', files: ['ROADMAP.md'], patterns: ['Current State'] },
      { label: 'current goal', files: ['ROADMAP.md'], patterns: ['Current Goal'] },
      { label: 'checkable next tasks', files: ['ROADMAP.md'], patterns: ['Next Tasks', '\\[ \\]'] },
      { label: 'blocked/deferred', files: ['ROADMAP.md'], patterns: ['Blocked Or Deferred'] },
      { label: 'verification log', files: ['ROADMAP.md'], patterns: ['Verification Log', 'Remaining gap'] }
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
      { label: 'meaningful coverage policy', files: ['RUNBOOK.md'], patterns: ['Test Coverage Policy', 'deletes? a meaningful line|accidentally deletes?|meaningful line', 'pointless|bloat|stale'] },
      { label: 'final response proof', files: ['AGENTS.md'], patterns: ['Final response', 'proof'] },
      { label: 'durable verification log', files: ['AGENTS.md', 'ROADMAP.md'], patterns: ['Verification Log'] }
    ]
  },
  {
    id: 'documentation_ownership',
    label: 'Documentation ownership',
    weight: 8,
    checks: [
      { label: 'docs are part of done', files: ['AGENTS.md'], patterns: ['Documentation is part of the work|Documentation is part of done'] },
      { label: 'documentation owner', files: ['AGENTS.md'], patterns: ['documentation owner'] },
      { label: 'doc routing table', files: ['AGENTS.md', 'ROADMAP.md'], patterns: ['BLUEPRINT\\.md', 'ROADMAP\\.md', 'RUNBOOK\\.md', 'README\\.md'] },
      { label: 'no-update note', files: ['AGENTS.md', 'ROADMAP.md'], patterns: ['Docs checked; no update needed'] }
    ]
  },
  {
    id: 'drift_control',
    label: 'Long-session drift control',
    weight: 8,
    checks: [
      { label: 'staying on track section', files: ['AGENTS.md'], patterns: ['Staying On Track'] },
      { label: 're-read roadmap', files: ['AGENTS.md'], patterns: ['Re-read `ROADMAP\\.md`'] },
      { label: 'context compaction', files: ['AGENTS.md', 'ROADMAP.md'], patterns: ['context compaction|context summary'] },
      { label: 'progress ledger checkboxes', files: ['AGENTS.md', 'ROADMAP.md'], patterns: ['progress ledger', '\\[ \\]'] }
    ]
  },
  {
    id: 'collaboration',
    label: 'Team coordination',
    weight: 8,
    checks: [
      { label: 'manager instructions', requireFiles: ['team templates/MANAGER.md'] },
      { label: 'subagent instructions', requireFiles: ['team templates/SUBAGENT.md'] },
      { label: 'taskboard', requireFiles: ['team templates/TASKBOARD.md'] },
      { label: 'non-overlapping lanes', files: ['team templates/MANAGER.md', 'team templates/TASKBOARD.md'], patterns: ['No two open tasks|no two open tasks|do not overlap'] },
      { label: 'single durable writer', files: ['AGENTS.md', 'team templates/MANAGER.md', 'team templates/README.md'], patterns: ['single author|single durable|Subagents log proof to `TASKBOARD\\.md`'] }
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
    id: 'guardrails',
    label: 'Prompt-injection and guardrails',
    weight: 8,
    checks: [
      { label: 'prompt-injection boundary', files: ['AGENTS.md'], patterns: ['Prompt-Injection Boundary', 'untrusted evidence|untrusted input', 'Approved instruction files|approved instruction files'] },
      { label: 'guardrail ladder', files: ['RUNBOOK.md'], patterns: ['Harness Guardrails', 'Input guardrails', 'Tool guardrails', 'Output guardrails', 'Approval guardrails'] },
      { label: 'forbidden path policy', files: ['AGENTS.md', 'RUNBOOK.md'], patterns: ['forbidden_paths|forbidden paths', 'destructive operations|destructive changes|production deploys'] },
      { label: 'CI/CD security defaults', files: ['RUNBOOK.md'], patterns: ['CI/CD security defaults', 'read-only', 'OIDC', 'self-hosted runners', 'artifact|provenance'] },
      { label: 'traceable proof fields', files: ['ROADMAP.md', 'RUNBOOK.md'], patterns: ['exit code|observed result', 'artifact/log/trace|artifact or trace', 'coverage scope'] }
    ]
  },
  {
    id: 'portability',
    label: 'Tool portability',
    weight: 7,
    checks: [
      { label: 'plain markdown', files: ['README.md'], patterns: ['plain Markdown'] },
      { label: 'multi-agent compatibility', files: ['README.md'], patterns: ['Codex, Claude|Codex|Claude'] },
      { label: 'Claude Code import note', files: ['README.md'], patterns: ['Claude Code', '@AGENTS\\.md|/init'] },
      { label: 'Claude bridge file', requireFiles: ['CLAUDE.md'] },
      { label: 'Claude bridge imports AGENTS', files: ['CLAUDE.md'], patterns: ['@AGENTS\\.md'] }
    ]
  },
  {
    id: 'benchmark_evidence',
    label: 'Benchmark evidence discipline',
    weight: 6,
    checks: [
      { label: 'metadata hypothesis', files: ['benchmarks/README.md'], patterns: ['H5: Machine-checkable metadata', 'YAML front matter'] },
      { label: 'guardrail hypothesis', files: ['benchmarks/README.md'], patterns: ['H6: Policy needs guardrails', 'Prompt-injection boundaries|prompt-injection boundaries'] },
      { label: 'evaluator-first claim rule', files: ['benchmarks/README.md'], patterns: ['New claims must become evaluator checks', 'template\\s+improvements'] },
      { label: 'research-backed checklist', files: ['README.md', 'benchmarks/README.md'], patterns: ['research-backed', 'CLAUDE\\.md', 'traceable proof'] }
    ]
  },
  {
    id: 'visual_workflow',
    label: 'Visual workflow guidance',
    weight: 6,
    checks: [
      { label: 'visual work process', files: ['AGENTS.md', 'README.md'], patterns: ['Visual Work|Visual-design starters'] },
      { label: 'project-specific direction', files: ['AGENTS.md', 'README.md'], patterns: ['project-local design|original product prompt|brand requirements'] },
      { label: 'clarifying visual question', files: ['AGENTS.md'], patterns: ['ask one focused question'] },
      { label: 'accessibility', files: ['AGENTS.md'], patterns: ['accessibility', 'WCAG AA'] },
      { label: 'no color alone', files: ['AGENTS.md'], patterns: ['color alone'] },
      { label: 'icon guidance', files: ['AGENTS.md'], patterns: ['icons instead of emoji|recognizable icons'] }
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
  if (check.frontMatterFiles) {
    return check.frontMatterFiles.every((file) => {
      const frontMatter = parseFrontMatter(files[file] ?? '');
      if (!frontMatter.exists) return false;
      return (check.requiredKeys ?? []).every((key) => frontMatter.keys.has(key));
    });
  }
  const required = check.files ?? Object.keys(files);
  if (required.length === 0) return false;
  const haystack = required.map((file) => files[file] ?? '').join('\n');
  if (!haystack.trim()) return false;
  return (check.patterns ?? []).every((pattern) => new RegExp(pattern, 'im').test(haystack));
}

function parseFrontMatter(content) {
  const normalized = content.replace(/^\uFEFF/, '');
  const lines = normalized.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return { exists: false, keys: new Set() };

  const keys = new Set();
  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === '---') return { exists: true, keys };
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):/);
    if (match) keys.add(match[1]);
  }

  return { exists: false, keys: new Set() };
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
