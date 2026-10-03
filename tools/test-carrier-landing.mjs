#!/usr/bin/env node
// Tests for tools/check-carrier-landing.mjs, the Contract carrier line-landing
// check (Spec S-004C, Task TK-005C). Every case builds a temporary Git
// repository with a base commit and a candidate commit, so the check reads
// carriers and homes exactly as it does in a real rewrite.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  HOME_KINDS,
  checkCarrierLanding,
  isExemptLine,
  lineHash,
  normalizeText,
  scaffoldInventory
} from './check-carrier-landing.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'tools', 'check-carrier-landing.mjs');

const BASE_CARRIER = [
  '# Example - Agent Operating System',
  '',
  '## Safety',
  '',
  'Never commit secrets.',
  'Ask before destructive changes.',
  '',
  '## Notes',
  '',
  'Keep notes in JSON.',
  'Handoffs are Markdown.',
  'Old rule with no successor.',
  'A claim the Lexicon already owns.',
  ''
].join('\n');

function git(dir, ...args) {
  const result = spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', ...args], { cwd: dir, encoding: 'utf8' });
  assert.equal(result.status, 0, `git ${args.join(' ')} failed: ${result.stderr}`);
  return result.stdout.trim();
}

function write(dir, file, text) {
  fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
  fs.writeFileSync(path.join(dir, file), text);
}

// A repository whose base commit holds BASE_CARRIER as AGENTS.md. `change`
// edits the working tree before the candidate commit is made.
function fixture(change) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'carrier-landing-'));
  git(dir, 'init', '-q');
  write(dir, 'AGENTS.md', BASE_CARRIER);
  write(dir, 'LEXICON.md', '# Lexicon\n\nA claim the Lexicon\n   already owns.\n');
  git(dir, 'add', '.');
  git(dir, 'commit', '-qm', 'base');
  const base = git(dir, 'rev-parse', 'HEAD');
  change(dir);
  git(dir, 'add', '-A');
  git(dir, 'commit', '-qm', 'candidate', '--allow-empty');
  const candidate = git(dir, 'rev-parse', 'HEAD');
  return { dir, base, candidate };
}

function removeLines(dir, ...lines) {
  const kept = BASE_CARRIER.split('\n').filter((line) => !lines.includes(line));
  write(dir, 'AGENTS.md', kept.join('\n'));
}

// The scaffolded inventory with selected entries classified.
function inventoryFor(dir, base, classify = {}) {
  const inventory = scaffoldInventory({ repo: dir, base, carrier: 'AGENTS.md' });
  for (const entry of inventory.entries) Object.assign(entry, classify[entry.text] ?? {});
  return inventory;
}

function cleanup(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function cli(dir, ...args) {
  const result = spawnSync(process.execPath, [tool, ...args], { cwd: dir, encoding: 'utf8' });
  return { ...result, report: args.includes('--json') && result.stdout ? JSON.parse(result.stdout) : null };
}

test('normalization is one rule: trim and collapse every whitespace run', () => {
  assert.equal(normalizeText('  Keep   notes\tin  JSON.  '), 'Keep notes in JSON.');
  assert.equal(normalizeText('A claim the Lexicon\n   already owns.'), 'A claim the Lexicon already owns.');
  assert.equal(lineHash('Keep notes in JSON.'), lineHash('  Keep  notes in JSON. '));
  assert.match(lineHash('Keep notes in JSON.'), /^[0-9a-f]{64}$/);
  assert.deepEqual(HOME_KINDS, ['stays', 'skill', 'pointer', 'lexicon', 'wiki', 'restates-owner', 'retired-with-reason']);
  assert.equal(isExemptLine(''), true);
  assert.equal(isExemptLine('   '), true);
  assert.equal(isExemptLine('## Safety'), true);
  assert.equal(isExemptLine('#### Worker: selection'), true);
  assert.equal(isExemptLine('Never commit secrets.'), false);
  assert.equal(isExemptLine('#hashtag is not a heading'), false);
});

test('scaffold lists every content line unclassified, skipping headings and blank lines', () => {
  const { dir, base } = fixture(() => {});
  try {
    const inventory = scaffoldInventory({ repo: dir, base, carrier: 'AGENTS.md' });
    assert.equal(inventory.carrier, 'AGENTS.md');
    assert.equal(inventory.baseSha, base);
    assert.deepEqual(inventory.entries.map((entry) => entry.line), [5, 6, 10, 11, 12, 13]);
    for (const entry of inventory.entries) {
      assert.equal(entry.hash, lineHash(entry.text));
      assert.equal(entry.homeKind, null);
      assert.equal(entry.homePath, null);
      assert.equal(entry.landedText, null);
      assert.equal(entry.reason, null);
    }
  } finally { cleanup(dir); }
});

test('an unchanged carrier reports zero removed lines with an unclassified scaffold', () => {
  const { dir, base, candidate } = fixture(() => {});
  try {
    const report = checkCarrierLanding({ repo: dir, base, candidate, inventory: inventoryFor(dir, base) });
    assert.equal(report.ok, true);
    assert.equal(report.removedLines, 0);
    assert.deepEqual(report.unlanded, []);
  } finally { cleanup(dir); }
});

test('a removed line with no inventory entry fails by naming the line', () => {
  const { dir, base, candidate } = fixture((d) => removeLines(d, 'Keep notes in JSON.'));
  try {
    const inventory = inventoryFor(dir, base);
    inventory.entries = inventory.entries.filter((entry) => entry.text !== 'Keep notes in JSON.');
    const report = checkCarrierLanding({ repo: dir, base, candidate, inventory });
    assert.equal(report.ok, false);
    assert.equal(report.removedLines, 1);
    assert.equal(report.unlanded.length, 1);
    assert.equal(report.unlanded[0].code, 'no-entry');
    assert.equal(report.unlanded[0].text, 'Keep notes in JSON.');
    assert.deepEqual(report.unlanded[0].baseLines, [10]);
  } finally { cleanup(dir); }
});

test('a removed line whose entry is still unclassified fails', () => {
  const { dir, base, candidate } = fixture((d) => removeLines(d, 'Keep notes in JSON.'));
  try {
    const report = checkCarrierLanding({ repo: dir, base, candidate, inventory: inventoryFor(dir, base) });
    assert.equal(report.ok, false);
    assert.equal(report.unlanded[0].code, 'unclassified');
    assert.match(report.unlanded[0].message, /Keep notes in JSON\./);
  } finally { cleanup(dir); }
});

test('an entry whose home lacks the landed text fails by naming the line and the home', () => {
  const { dir, base, candidate } = fixture((d) => {
    removeLines(d, 'Keep notes in JSON.');
    write(d, 'workbench/skills/notepad/SKILL.md', '# Notepad\n\nNotes are kept somewhere.\n');
  });
  try {
    const report = checkCarrierLanding({ repo: dir, base, candidate, inventory: inventoryFor(dir, base, {
      'Keep notes in JSON.': { homeKind: 'skill', homePath: 'workbench/skills/notepad/SKILL.md', landedText: 'Keep notes in JSON.' }
    }) });
    assert.equal(report.ok, false);
    const finding = report.unlanded[0];
    assert.equal(finding.code, 'home-lacks-text');
    assert.equal(finding.homePath, 'workbench/skills/notepad/SKILL.md');
    assert.equal(finding.text, 'Keep notes in JSON.');
    assert.match(finding.message, /workbench\/skills\/notepad\/SKILL\.md/);
  } finally { cleanup(dir); }
});

test('an entry naming a missing home or an empty home fails by name', () => {
  const { dir, base, candidate } = fixture((d) => {
    removeLines(d, 'Keep notes in JSON.', 'Handoffs are Markdown.');
    write(d, 'workbench/wiki/handoffs.md', '  \n\n');
  });
  try {
    const report = checkCarrierLanding({ repo: dir, base, candidate, inventory: inventoryFor(dir, base, {
      'Keep notes in JSON.': { homeKind: 'skill', homePath: 'workbench/skills/notepad/SKILL.md', landedText: 'Keep notes in JSON.' },
      'Handoffs are Markdown.': { homeKind: 'wiki', homePath: 'workbench/wiki/handoffs.md', landedText: 'Handoffs are Markdown.' }
    }) });
    assert.equal(report.ok, false);
    const byText = Object.fromEntries(report.unlanded.map((finding) => [finding.text, finding]));
    assert.equal(byText['Keep notes in JSON.'].code, 'home-missing');
    assert.equal(byText['Keep notes in JSON.'].homePath, 'workbench/skills/notepad/SKILL.md');
    assert.equal(byText['Handoffs are Markdown.'].code, 'home-empty');
    assert.equal(byText['Handoffs are Markdown.'].homePath, 'workbench/wiki/handoffs.md');
  } finally { cleanup(dir); }
});

test('a home that exists only in the working tree, not at the candidate, is missing', () => {
  const { dir, base, candidate } = fixture((d) => removeLines(d, 'Keep notes in JSON.'));
  try {
    write(dir, 'workbench/skills/notepad/SKILL.md', 'Keep notes in JSON.\n');
    const report = checkCarrierLanding({ repo: dir, base, candidate, inventory: inventoryFor(dir, base, {
      'Keep notes in JSON.': { homeKind: 'skill', homePath: 'workbench/skills/notepad/SKILL.md', landedText: 'Keep notes in JSON.' }
    }) });
    assert.equal(report.unlanded[0].code, 'home-missing');
  } finally { cleanup(dir); }
});

test('a restates-owner entry whose named owner lacks the claim fails', () => {
  const { dir, base, candidate } = fixture((d) => removeLines(d, 'A claim the Lexicon already owns.'));
  try {
    const report = checkCarrierLanding({ repo: dir, base, candidate, inventory: inventoryFor(dir, base, {
      'A claim the Lexicon already owns.': { homeKind: 'restates-owner', homePath: 'LEXICON.md', landedText: 'A claim nobody owns.' }
    }) });
    assert.equal(report.ok, false);
    assert.equal(report.unlanded[0].code, 'owner-lacks-claim');
    assert.equal(report.unlanded[0].homePath, 'LEXICON.md');
  } finally { cleanup(dir); }
});

test('a line classified stays that the candidate removed fails', () => {
  const { dir, base, candidate } = fixture((d) => removeLines(d, 'Never commit secrets.'));
  try {
    const report = checkCarrierLanding({ repo: dir, base, candidate, inventory: inventoryFor(dir, base, {
      'Never commit secrets.': { homeKind: 'stays' }
    }) });
    assert.equal(report.ok, false);
    assert.equal(report.unlanded[0].code, 'stays-but-removed');
  } finally { cleanup(dir); }
});

test('retired-with-reason needs a recorded reason, and an unknown home kind fails', () => {
  const { dir, base, candidate } = fixture((d) => removeLines(d, 'Old rule with no successor.', 'Handoffs are Markdown.'));
  try {
    const report = checkCarrierLanding({ repo: dir, base, candidate, inventory: inventoryFor(dir, base, {
      'Old rule with no successor.': { homeKind: 'retired-with-reason', reason: '   ' },
      'Handoffs are Markdown.': { homeKind: 'elsewhere', homePath: 'LEXICON.md', landedText: 'Lexicon' }
    }) });
    const byText = Object.fromEntries(report.unlanded.map((finding) => [finding.text, finding]));
    assert.equal(byText['Old rule with no successor.'].code, 'retired-without-reason');
    assert.equal(byText['Handoffs are Markdown.'].code, 'unknown-home-kind');
  } finally { cleanup(dir); }
});

test('a fully landed fixture passes, with homes matched after whitespace normalization', () => {
  const { dir, base, candidate } = fixture((d) => {
    removeLines(d, 'Keep notes in JSON.', 'Handoffs are Markdown.', 'Old rule with no successor.', 'A claim the Lexicon already owns.', 'Ask before destructive changes.');
    write(d, 'workbench/skills/notepad/SKILL.md', '# Notepad\n\nKeep notes\nin JSON.\n');
    write(d, 'workbench/wiki/handoffs.md', '# Handoffs\n\nHandoffs are   Markdown files.\n');
    write(d, 'RUNBOOK.md', '# Runbook\n\n- Destructive changes: ask first; see the safety skill.\n');
  });
  try {
    const inventory = inventoryFor(dir, base, {
      'Never commit secrets.': { homeKind: 'stays' },
      'Keep notes in JSON.': { homeKind: 'skill', homePath: 'workbench/skills/notepad/SKILL.md', landedText: 'Keep notes in JSON.' },
      'Handoffs are Markdown.': { homeKind: 'wiki', homePath: 'workbench/wiki/handoffs.md', landedText: 'Handoffs are Markdown' },
      'Old rule with no successor.': { homeKind: 'retired-with-reason', reason: 'Superseded by the corrective rules; no successor wording.' },
      'A claim the Lexicon already owns.': { homeKind: 'restates-owner', homePath: 'LEXICON.md', landedText: 'A claim the Lexicon already owns.' },
      'Ask before destructive changes.': { homeKind: 'pointer', homePath: 'RUNBOOK.md', landedText: 'Destructive changes: ask first' }
    });
    const report = checkCarrierLanding({ repo: dir, base, candidate, inventory });
    assert.deepEqual(report.unlanded, []);
    assert.deepEqual(report.inventoryErrors, []);
    assert.equal(report.removedLines, 5);
    assert.equal(report.landed, 5);
    assert.equal(report.ok, true);
  } finally { cleanup(dir); }
});

test('a line that stays need not move: reordered and rewrapped lines are not removed', () => {
  const { dir, base, candidate } = fixture((d) => {
    const lines = BASE_CARRIER.split('\n');
    const moved = lines.filter((line) => line !== 'Never commit secrets.');
    moved.push('   Never   commit secrets.   ');
    write(d, 'AGENTS.md', moved.join('\n'));
  });
  try {
    const report = checkCarrierLanding({ repo: dir, base, candidate, inventory: inventoryFor(dir, base) });
    assert.equal(report.removedLines, 0);
    assert.equal(report.ok, true);
  } finally { cleanup(dir); }
});

test('headings and blank lines are not required to land', () => {
  const { dir, base, candidate } = fixture((d) => {
    write(d, 'AGENTS.md', BASE_CARRIER.split('\n').filter((line) => line.trim() && !line.startsWith('## ')).join('\n'));
  });
  try {
    const report = checkCarrierLanding({ repo: dir, base, candidate, inventory: inventoryFor(dir, base) });
    assert.equal(report.removedLines, 0);
    assert.equal(report.ok, true);
  } finally { cleanup(dir); }
});

test('a duplicated line removed twice needs two landed entries', () => {
  const doubled = BASE_CARRIER.replace('Handoffs are Markdown.', 'Handoffs are Markdown.\nKeep notes in JSON.');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'carrier-landing-'));
  try {
    git(dir, 'init', '-q');
    write(dir, 'AGENTS.md', doubled);
    git(dir, 'add', '.');
    git(dir, 'commit', '-qm', 'base');
    const base = git(dir, 'rev-parse', 'HEAD');
    write(dir, 'AGENTS.md', doubled.split('\n').filter((line) => line !== 'Keep notes in JSON.').join('\n'));
    write(dir, 'SKILL.md', 'Keep notes in JSON.\n');
    git(dir, 'add', '-A');
    git(dir, 'commit', '-qm', 'candidate');
    const candidate = git(dir, 'rev-parse', 'HEAD');
    const inventory = scaffoldInventory({ repo: dir, base, carrier: 'AGENTS.md' });
    const copies = inventory.entries.filter((entry) => entry.text === 'Keep notes in JSON.');
    assert.equal(copies.length, 2);
    Object.assign(copies[0], { homeKind: 'skill', homePath: 'SKILL.md', landedText: 'Keep notes in JSON.' });
    let report = checkCarrierLanding({ repo: dir, base, candidate, inventory });
    assert.equal(report.ok, false);
    assert.equal(report.unlanded[0].code, 'unclassified');
    assert.deepEqual(report.unlanded[0].baseLines, [10, 12]);
    Object.assign(copies[1], { homeKind: 'skill', homePath: 'SKILL.md', landedText: 'Keep notes in JSON.' });
    report = checkCarrierLanding({ repo: dir, base, candidate, inventory });
    assert.equal(report.ok, true);
    assert.equal(report.removedLines, 2);
  } finally { cleanup(dir); }
});

test('an inventory that does not match its base is refused before any line is judged', () => {
  const { dir, base, candidate } = fixture((d) => removeLines(d, 'Keep notes in JSON.'));
  try {
    const tampered = inventoryFor(dir, base);
    tampered.entries[0].text = 'Never commit anything.';
    let report = checkCarrierLanding({ repo: dir, base, candidate, inventory: tampered });
    assert.equal(report.ok, false);
    assert.ok(report.inventoryErrors.some((error) => error.code === 'hash-mismatch' && error.line === 5));
    const shifted = inventoryFor(dir, base);
    shifted.entries[0].line = 6;
    report = checkCarrierLanding({ repo: dir, base, candidate, inventory: shifted });
    assert.ok(report.inventoryErrors.some((error) => error.code === 'line-mismatch'));
    const escaping = inventoryFor(dir, base, { 'Keep notes in JSON.': { homeKind: 'skill', homePath: '../outside.md', landedText: 'x' } });
    report = checkCarrierLanding({ repo: dir, base, candidate, inventory: escaping });
    assert.ok(report.inventoryErrors.some((error) => error.code === 'invalid-home-path'));
    assert.throws(() => checkCarrierLanding({ repo: dir, base: candidate, candidate, inventory: inventoryFor(dir, base) }), /base/);
  } finally { cleanup(dir); }
});

test('CLI: scaffold writes once, check exits 0 when landed and 1 with --json findings otherwise', () => {
  const { dir, base, candidate } = fixture((d) => removeLines(d, 'Keep notes in JSON.'));
  try {
    const out = path.join(dir, 'inventory-agents.json');
    let result = cli(dir, 'scaffold', '--base', base, '--carrier', 'AGENTS.md', '--out', out);
    assert.equal(result.status, 0, result.stderr);
    const written = JSON.parse(fs.readFileSync(out, 'utf8'));
    assert.equal(written.entries.length, 6);
    result = cli(dir, 'scaffold', '--base', base, '--carrier', 'AGENTS.md', '--out', out);
    assert.notEqual(result.status, 0, 'scaffold refuses to overwrite a progressively classified inventory');
    assert.match(result.stderr, /exists/);

    result = cli(dir, 'check', '--base', base, '--candidate', candidate, '--inventory', out, '--json');
    assert.equal(result.status, 1);
    assert.equal(result.report.ok, false);
    assert.equal(result.report.unlanded[0].text, 'Keep notes in JSON.');
    result = cli(dir, 'check', '--base', base, '--candidate', candidate, '--inventory', out);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /Keep notes in JSON\./);

    result = cli(dir, 'check', '--base', base, '--candidate', base, '--inventory', out, '--json');
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.report.removedLines, 0);

    result = cli(dir, 'check', '--base', base, '--inventory', out, '--bogus');
    assert.equal(result.status, 2);
    result = cli(dir, 'check', '--candidate', candidate, '--inventory', out);
    assert.equal(result.status, 2);
  } finally { cleanup(dir); }
});
