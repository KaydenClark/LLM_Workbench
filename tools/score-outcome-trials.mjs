#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function parseArgs(argv) {
  const args = {
    files: [],
    baseline: null,
    report: null,
    json: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--baseline') args.baseline = argv[++index];
    else if (arg === '--report') args.report = argv[++index];
    else if (arg === '--json') args.json = true;
    else args.files.push(arg);
  }

  if (args.files.length === 0) throw new Error('At least one result file is required');
  return args;
}

function loadRows(files) {
  const rows = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8').trim();
    if (!content) continue;
    for (const line of content.split('\n')) rows.push(JSON.parse(line));
  }
  return rows;
}

function dimensions(rows) {
  const found = [];
  for (const row of rows) {
    for (const key of Object.keys(row.scores ?? {})) {
      if (!found.includes(key)) found.push(key);
    }
  }
  return found;
}

function groupScores(rows, dimension) {
  const groups = {};
  for (const row of rows) {
    const value = dimension === 'composite'
      ? mean(Object.values(row.scores ?? {}).map(Number))
      : row.scores?.[dimension];
    if (value === undefined || Number.isNaN(value)) continue;
    groups[row.condition] ??= [];
    groups[row.condition].push(Number(value));
  }
  return groups;
}

function summarize(rows, baseline) {
  const dims = [...dimensions(rows), 'composite'];
  const conditions = [...new Set(rows.map((row) => row.condition))].sort();
  const summary = { dimensions: dims, conditions: {} };

  for (const condition of conditions) {
    summary.conditions[condition] = { n: rows.filter((row) => row.condition === condition).length, scores: {} };
  }

  for (const dimension of dims) {
    const groups = groupScores(rows, dimension);
    const baselineScores = baseline ? groups[baseline] : null;
    for (const condition of conditions) {
      const values = groups[condition] ?? [];
      const item = {
        mean: round(mean(values)),
        values
      };
      if (baselineScores && condition !== baseline) {
        const ci = bootstrapDiff(values, baselineScores);
        item.lift_vs_baseline = round(item.mean - mean(baselineScores));
        item.ci95 = ci.map(round);
        item.ci_excludes_zero = ci[0] > 0 || ci[1] < 0;
      }
      summary.conditions[condition].scores[dimension] = item;
    }
  }

  return summary;
}

function renderMarkdown(rows, baseline) {
  const summary = summarize(rows, baseline);
  const dims = summary.dimensions;
  const conditions = Object.keys(summary.conditions);
  const lines = ['# Outcome Trial Report', ''];
  lines.push(`- Rows: ${rows.length}`);
  lines.push(`- Baseline: ${baseline ? `\`${baseline}\`` : 'none'}`);
  lines.push(`- Tasks: ${[...new Set(rows.map((row) => row.task))].join(', ')}`);
  lines.push('');
  lines.push('| Condition | Trials | ' + dims.map((dim) => `${dim} mean`).join(' | ') + ' |');
  lines.push('|---|---:|' + dims.map(() => '---:').join('|') + '|');
  for (const condition of conditions) {
    const item = summary.conditions[condition];
    lines.push(`| \`${condition}\` | ${item.n} | ` + dims.map((dim) => format(item.scores[dim].mean)).join(' | ') + ' |');
  }

  if (baseline) {
    lines.push('');
    lines.push(`## Lift Vs \`${baseline}\``);
    lines.push('');
    lines.push('| Condition | Dimension | Lift | 95% bootstrap CI | Excludes 0? |');
    lines.push('|---|---|---:|---:|---|');
    for (const condition of conditions) {
      if (condition === baseline) continue;
      for (const dim of dims) {
        const score = summary.conditions[condition].scores[dim];
        lines.push(`| \`${condition}\` | ${dim} | ${format(score.lift_vs_baseline)} | [${format(score.ci95[0])}, ${format(score.ci95[1])}] | ${score.ci_excludes_zero ? 'yes' : 'no'} |`);
      }
    }
  }

  lines.push('');
  lines.push('## Interpretation Rules');
  lines.push('');
  lines.push('- Static template quality is not scored here; this report scores task outcomes.');
  lines.push('- A branch earns a real-world improvement claim only when task success or rework improves without worse safety, scope, verification honesty, or documentation freshness.');
  lines.push('- Synthetic mock-agent rows are harness self-tests only; cite real-agent rows for product claims.');
  lines.push('');
  return lines.join('\n');
}

function bootstrapDiff(treatment, baseline, iterations = 2000) {
  if (treatment.length === 0 || baseline.length === 0) return [Number.NaN, Number.NaN];
  const rng = seededRandom(123456789);
  const diffs = [];
  for (let index = 0; index < iterations; index += 1) {
    diffs.push(mean(sample(treatment, rng)) - mean(sample(baseline, rng)));
  }
  diffs.sort((a, b) => a - b);
  return [
    diffs[Math.floor(iterations * 0.025)],
    diffs[Math.floor(iterations * 0.975)]
  ];
}

function sample(values, rng) {
  return values.map(() => values[Math.floor(rng() * values.length)]);
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (1664525 * value + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}

function mean(values) {
  if (!values.length) return Number.NaN;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value) {
  return Number.isFinite(value) ? Math.round(value * 1000) / 1000 : value;
}

function format(value) {
  return Number.isFinite(value) ? value.toFixed(3) : 'n/a';
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rows = loadRows(args.files);
  if (rows.length === 0) throw new Error('No result rows found');
  const output = args.json
    ? JSON.stringify(summarize(rows, args.baseline), null, 2)
    : renderMarkdown(rows, args.baseline);
  if (args.report) {
    fs.mkdirSync(path.dirname(path.resolve(args.report)), { recursive: true });
    fs.writeFileSync(args.report, output);
    console.log(`wrote ${args.report}`);
  } else {
    console.log(output);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

