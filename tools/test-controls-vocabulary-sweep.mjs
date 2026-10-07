#!/usr/bin/env node
// S-00H TK-004: the repository-wide prose sweep for the retired `Ticket`
// term across root controls, skills, and the generic template mirrors.
// TK-003 already swept `workbench/tools` and `tools` (tools/test-spec-workbench.mjs);
// this sweep covers everything that instructs an agent outside those tool
// files: AGENTS.md, RUNBOOK.md, GLOSSARY.md, ARCHITECTURE.md, README.md,
// BLUEPRINT.md, CLAUDE.md, skills/**, templates/** and `team templates/**`. It never
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
  // S-004O TK-009C: the glossary Task entry names the retired word as its
  // avoided alias, the glossary's home for the retired-term row.
  { file: 'GLOSSARY.md', match: '_Avoid_: ticket',
    reason: 'the glossary Task entry lists the retired term as the alias to avoid' },
  { file: 'templates/GLOSSARY.md', match: '_Avoid_: ticket',
    reason: 'the generic mirror of the same avoided alias' },
  // S-004O TK-009H: the Lexicons are removed, so their retired-term row and
  // ADR-000H filename entries left with them.
];

// Each entry excuses only its own exact matched substring, not the whole
// line: an entry could sit inside one long line, and
// excusing that entire line the way `line.includes(entry.match)` alone would
// do could silently swallow unrelated new `ticket` prose added later
// anywhere else on that same row. Stripping just the matched token and
// re-testing the remainder keeps the exemption exactly as narrow as the
// reason given for it.
function stripAllowedTokens(relFile, line) {
  let stripped = line;
  for (const entry of ALLOWLIST) {
    if (entry.file === relFile) stripped = stripped.split(entry.match).join('');
  }
  return stripped;
}

function lineHasLiveTicket(relFile, line) {
  return /ticket/i.test(stripAllowedTokens(relFile, line));
}

// Mutation check, run before the real sweep: appending unrelated `ticket`
// prose after the allow-listed glossary alias on the same line must still be
// caught. If a future edit widens the entry back to a whole-line match, this
// assertion turns red.
{
  const mutated = '_Avoid_: ticket, and also a stray ticket queue';
  assert.ok(lineHasLiveTicket('GLOSSARY.md', mutated),
    'narrowing regression: the glossary alias allow-list entry must not excuse unrelated ticket prose sharing its line');
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
for (const file of ['AGENTS.md', 'RUNBOOK.md', 'GLOSSARY.md', 'ARCHITECTURE.md', 'README.md', 'BLUEPRINT.md', 'CLAUDE.md']) {
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
    if (lineHasLiveTicket(relFile, line)) {
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
