#!/usr/bin/env node
// S-00H TK-004: the repository-wide prose sweep for the retired `Ticket`
// term across root controls, skills, and the generic template mirrors.
// TK-003 already swept `workbench/tools` and `tools` (tools/test-spec-workbench.mjs);
// this sweep covers everything that instructs an agent outside those tool
// files: AGENTS.md, RUNBOOK.md, LEXICON.md, README.md, BLUEPRINT.md,
// CLAUDE.md, skills/**, templates/** and `team templates/**`. It never
// touches `workbench/specs/` (historical `TK-###` and `Ticket closed`
// evidence rows live there, outside this sweep's scope by design) and does
// not rewrite anything itself.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Every entry names one specific line this task deliberately leaves saying
// "ticket", with the reason a reviewer can check against the file itself.
// Nothing else may say it.
const ALLOWLIST = [
  { file: 'LEXICON.md', match: '**Ticket** | Retired as a live term.',
    reason: 'the Lexicon row that defines the retired term necessarily names it' },
  { file: 'templates/LEXICON.md', match: '**Ticket** | Retired as a live term.',
    reason: 'the generic mirror of the same retired-term row' },
  { file: 'LEXICON.md', match: 'task-replaces-ticket-as-the-execution-slice-term.md',
    reason: 'the accepted ADR-000H\'s own filename names the historical replacement it enacted; the file is immutable Canon history, cited nowhere else in this sweep\'s scope, and renaming it is out of this vocabulary-only lane' }
];

function isAllowed(relFile, line) {
  return ALLOWLIST.some((entry) => entry.file === relFile && line.includes(entry.match));
}

function walk(dir) {
  let out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(full));
    else out.push(full);
  }
  return out;
}

const targets = [];
for (const file of ['AGENTS.md', 'RUNBOOK.md', 'LEXICON.md', 'README.md', 'BLUEPRINT.md', 'CLAUDE.md']) {
  targets.push(path.join(root, file));
}
for (const dir of ['skills', 'templates', 'team templates']) {
  targets.push(...walk(path.join(root, dir)));
}

const violations = [];
for (const file of targets) {
  if (!fs.statSync(file).isFile()) continue;
  const relFile = path.relative(root, file).split(path.sep).join('/');
  fs.readFileSync(file, 'utf8').split('\n').forEach((line, index) => {
    if (/ticket/i.test(line) && !isAllowed(relFile, line)) {
      violations.push(`${relFile}:${index + 1}: ${line.trim()}`);
    }
  });
}
assert.deepEqual(
  violations,
  [],
  `live "ticket" vocabulary must not appear in root controls, skills/, templates/ or team templates/ outside the allow-list:\n${violations.join('\n')}`
);

// A stale allow-list entry (naming text that has since been removed or
// rewritten) would silently stop excusing anything and just as silently stop
// being checked; catch that rather than let the allow-list rot.
for (const entry of ALLOWLIST) {
  const content = fs.readFileSync(path.join(root, entry.file), 'utf8');
  assert.ok(content.includes(entry.match), `stale allow-list entry: ${entry.file} no longer contains ${JSON.stringify(entry.match)}`);
}

console.log('ok - repository-wide controls/skills/templates ticket-vocabulary sweep found no live vocabulary outside the allow-list');
