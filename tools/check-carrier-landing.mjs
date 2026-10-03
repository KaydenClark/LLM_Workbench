#!/usr/bin/env node
// Contract carrier line-landing check (Spec S-004C, Task TK-005C).
//
// A maintainer verification tool, run at rewrite review; it is not a managed
// room runtime tool and is not installed into rooms. It makes "no carrier line
// is removed before its new home exists" a command: given a base commit, a
// candidate ref and an inventory for one carrier (`AGENTS.md` or `RUNBOOK.md`),
// it lists every normalized line the candidate removed from the carrier and
// refuses unless each has an inventory entry whose home holds its landed text
// at the candidate. It never decides which home is right; it only checks that
// the claimed home holds the text. It reads Git objects and never writes,
// except `scaffold --out`, which writes a new inventory file.
//
// Normalization (normalizeText, the one rule): trim, then collapse every run
// of whitespace (spaces, tabs, newlines) to one space. Lines, landed text and
// whole home files are compared only after it, so rewrapping or re-indenting
// never counts as a removal or a miss.
//
// Exempt lines: a blank line and a Markdown heading (`#` to `######` followed
// by a space) are never required to land and are left out of a scaffold; a
// heading that moves keeps its anchor, which the anchor check owns.
//
// A line is removed when the candidate carrier holds fewer copies of its
// normalized text than the base does. A line that stays (even reordered or
// rewrapped) is not removed, so its entry may stay unclassified.
//
// Inventory JSON (one file per carrier):
//   {
//     "schemaVersion": 1,
//     "carrier": "AGENTS.md",          // repository-relative carrier path
//     "baseSha": "<40-hex commit>",    // the commit the entries were read at
//     "normalization": "trim; collapse whitespace runs to one space",
//     "entries": [{
//       "line": 12,                    // 1-based line number at baseSha
//       "text": "...",                 // the raw line at baseSha
//       "hash": "<64-hex>",            // sha256 of normalizeText(text)
//       "homeKind": null,              // null (unclassified) or one of HOME_KINDS
//       "homePath": null,              // repository-relative home file at the candidate
//       "landedText": null,            // text the home must contain (normalized match)
//       "reason": null                 // required for retired-with-reason
//     }]
//   }
// Home kinds: stays (the line remains in the carrier), skill, pointer,
// lexicon, wiki, restates-owner (homePath names the owner that already holds
// the claim) and retired-with-reason (no home; `reason` records why). Every
// kind except stays and retired-with-reason needs homePath and landedText.
//
// Usage:
//   node tools/check-carrier-landing.mjs check --base SHA --inventory PATH
//        [--candidate REF] [--repo DIR] [--json]
//   node tools/check-carrier-landing.mjs scaffold --base SHA --carrier PATH
//        [--out PATH] [--repo DIR]
// Exit: 0 when every removed line landed and the inventory is valid; 1 on any
// unlanded removed line or inventory error; 2 on a usage or Git error.
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { isMainModule } from '../workbench/tools/workbench-paths.mjs';

export const HOME_KINDS = ['stays', 'skill', 'pointer', 'lexicon', 'wiki', 'restates-owner', 'retired-with-reason'];
const HOMED_KINDS = new Set(['skill', 'pointer', 'lexicon', 'wiki', 'restates-owner']);
export const NORMALIZATION = 'trim; collapse whitespace runs to one space';

export function normalizeText(text) {
  return String(text).replace(/\s+/g, ' ').trim();
}

export function lineHash(text) {
  return crypto.createHash('sha256').update(normalizeText(text)).digest('hex');
}

export function isExemptLine(text) {
  const normalized = normalizeText(text);
  return normalized === '' || /^#{1,6} /.test(normalized);
}

class UsageError extends Error {}

function git(repo, args) {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 1 << 28 });
  if (result.error) throw new UsageError(`git ${args.join(' ')}: ${result.error.message}`);
  return result;
}

function resolveCommit(repo, ref, label) {
  if (typeof ref !== 'string' || !ref.trim()) throw new UsageError(`${label} ref is required`);
  const result = git(repo, ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`]);
  if (result.status !== 0) throw new UsageError(`${label} ref ${ref} is not a commit in ${repo}`);
  return result.stdout.trim();
}

function validRelativePath(file) {
  if (typeof file !== 'string' || !file.trim()) return false;
  if (path.isAbsolute(file) || file.includes('\\')) return false;
  return !file.split('/').some((part) => part === '..' || part === '');
}

// The file at a commit, or null when the commit has no such blob.
function readAt(repo, commit, file) {
  const type = git(repo, ['cat-file', '-t', `${commit}:${file}`]);
  if (type.status !== 0 || type.stdout.trim() !== 'blob') return null;
  const result = git(repo, ['show', `${commit}:${file}`]);
  if (result.status !== 0) return null;
  return result.stdout;
}

function carrierLines(repo, commit, carrier, label) {
  const text = readAt(repo, commit, carrier);
  if (text === null) throw new UsageError(`carrier ${carrier} does not exist at ${label} ${commit}`);
  return text.split('\n');
}

export function scaffoldInventory({ repo = process.cwd(), base, carrier }) {
  if (!validRelativePath(carrier)) throw new UsageError('carrier must be a repository-relative path');
  const baseSha = resolveCommit(repo, base, 'base');
  const entries = [];
  carrierLines(repo, baseSha, carrier, 'base').forEach((text, index) => {
    if (isExemptLine(text)) return;
    entries.push({ line: index + 1, text, hash: lineHash(text), homeKind: null, homePath: null, landedText: null, reason: null });
  });
  return { schemaVersion: 1, carrier, baseSha, normalization: NORMALIZATION, entries };
}

function loadInventory(inventory) {
  if (typeof inventory === 'string') {
    let raw;
    try { raw = fs.readFileSync(inventory, 'utf8'); } catch (error) { throw new UsageError(`cannot read inventory ${inventory}: ${error.message}`); }
    try { return JSON.parse(raw); } catch (error) { throw new UsageError(`inventory ${inventory} is not JSON: ${error.message}`); }
  }
  if (!inventory || typeof inventory !== 'object') throw new UsageError('inventory must be a path or an inventory object');
  return inventory;
}

function countHashes(lines) {
  const counts = new Map();
  for (const text of lines) {
    if (isExemptLine(text)) continue;
    const hash = lineHash(text);
    counts.set(hash, (counts.get(hash) ?? 0) + 1);
  }
  return counts;
}

// Why one classified entry does or does not land its line at the candidate.
function judgeEntry(repo, candidate, entry, homes) {
  const kind = entry.homeKind;
  if (kind === null || kind === undefined) return { code: 'unclassified', detail: 'the entry has no home kind yet' };
  if (!HOME_KINDS.includes(kind)) return { code: 'unknown-home-kind', detail: `home kind ${JSON.stringify(kind)} is not one of ${HOME_KINDS.join(', ')}` };
  if (kind === 'stays') return { code: 'stays-but-removed', detail: 'the entry says the line stays, but the candidate removed it' };
  if (kind === 'retired-with-reason') {
    return typeof entry.reason === 'string' && normalizeText(entry.reason)
      ? null
      : { code: 'retired-without-reason', detail: 'a retired line needs a recorded reason' };
  }
  const homePath = entry.homePath;
  if (!homes.has(homePath)) homes.set(homePath, readAt(repo, candidate, homePath));
  const home = homes.get(homePath);
  if (home === null) return { code: 'home-missing', homePath, detail: `home ${homePath} does not exist at the candidate` };
  if (!normalizeText(home)) return { code: 'home-empty', homePath, detail: `home ${homePath} is empty at the candidate` };
  if (typeof entry.landedText !== 'string' || !normalizeText(entry.landedText)) return { code: 'landed-text-missing', homePath, detail: 'the entry records no landed text' };
  if (!normalizeText(home).includes(normalizeText(entry.landedText))) {
    return kind === 'restates-owner'
      ? { code: 'owner-lacks-claim', homePath, detail: `owner ${homePath} does not hold the restated claim` }
      : { code: 'home-lacks-text', homePath, detail: `home ${homePath} does not hold the landed text` };
  }
  return null;
}

function validateInventory(inventory, baseLines) {
  const errors = [];
  if (inventory.schemaVersion !== 1) errors.push({ code: 'schema-version', message: `schemaVersion must be 1, found ${JSON.stringify(inventory.schemaVersion)}` });
  if (!Array.isArray(inventory.entries)) {
    errors.push({ code: 'entries-missing', message: 'inventory.entries must be an array' });
    return errors;
  }
  inventory.entries.forEach((entry, index) => {
    const at = { index, line: entry?.line };
    if (!entry || typeof entry !== 'object') { errors.push({ ...at, code: 'entry-shape', message: `entry ${index} is not an object` }); return; }
    if (typeof entry.text !== 'string' || entry.hash !== lineHash(entry.text)) {
      errors.push({ ...at, code: 'hash-mismatch', message: `entry ${index} (line ${entry.line}): hash does not match sha256 of its normalized text` });
    }
    if (!Number.isInteger(entry.line) || entry.line < 1 || entry.line > baseLines.length || lineHash(baseLines[entry.line - 1]) !== entry.hash) {
      errors.push({ ...at, code: 'line-mismatch', message: `entry ${index}: base line ${entry.line} does not hold the entry's text` });
    }
    if (HOMED_KINDS.has(entry.homeKind) && !validRelativePath(entry.homePath)) {
      errors.push({ ...at, code: 'invalid-home-path', message: `entry ${index} (line ${entry.line}): homePath ${JSON.stringify(entry.homePath)} must be a repository-relative path inside the repository` });
    }
  });
  return errors;
}

export function checkCarrierLanding({ repo = process.cwd(), base, candidate = 'HEAD', inventory }) {
  const data = loadInventory(inventory);
  const baseSha = resolveCommit(repo, base, 'base');
  const candidateSha = resolveCommit(repo, candidate, 'candidate');
  if (!validRelativePath(data.carrier)) throw new UsageError('inventory.carrier must be a repository-relative path');
  const inventoryBase = resolveCommit(repo, data.baseSha, 'inventory baseSha');
  if (inventoryBase !== baseSha) throw new UsageError(`base ${baseSha} differs from the inventory baseSha ${inventoryBase}`);

  const baseLines = carrierLines(repo, baseSha, data.carrier, 'base');
  const candidateLines = carrierLines(repo, candidateSha, data.carrier, 'candidate');
  const inventoryErrors = validateInventory(data, baseLines);
  const entries = Array.isArray(data.entries) ? data.entries.filter((entry) => entry && typeof entry === 'object') : [];

  const before = countHashes(baseLines);
  const after = countHashes(candidateLines);
  const homes = new Map();
  const unlanded = [];
  let removedLines = 0;
  let landed = 0;
  for (const [hash, count] of before) {
    const removed = count - (after.get(hash) ?? 0);
    if (removed <= 0) continue;
    removedLines += removed;
    const baseIndexes = baseLines.map((text, index) => (!isExemptLine(text) && lineHash(text) === hash ? index + 1 : 0)).filter(Boolean);
    const text = normalizeText(baseLines[baseIndexes[0] - 1]);
    const matching = entries.filter((entry) => entry.hash === hash);
    const verdicts = matching.map((entry) => ({ entry, problem: judgeEntry(repo, candidateSha, entry, homes) }));
    const passing = verdicts.filter((verdict) => !verdict.problem).length;
    landed += Math.min(passing, removed);
    if (passing >= removed) continue;
    const problems = verdicts.filter((verdict) => verdict.problem).map((verdict) => ({ line: verdict.entry.line, ...verdict.problem }));
    // Name the most actionable failure: a classified entry's problem before an unclassified one.
    const lead = problems.find((problem) => problem.code !== 'unclassified') ?? problems[0];
    const code = matching.length === 0 ? 'no-entry' : (lead ? lead.code : 'too-few-entries');
    const detail = matching.length === 0
      ? 'no inventory entry records a home for it'
      : (lead ? lead.detail : `${removed} copies removed but only ${passing} landed entries`);
    unlanded.push({
      code,
      text,
      hash,
      baseLines: baseIndexes,
      removed,
      landedEntries: passing,
      ...(lead?.homePath ? { homePath: lead.homePath } : {}),
      problems,
      message: `${data.carrier} base line ${baseIndexes.join(', ')} "${text}" was removed without a landed home: ${detail}`
    });
  }
  unlanded.sort((a, b) => a.baseLines[0] - b.baseLines[0]);
  return {
    schemaVersion: 1,
    operation: 'carrier-landing-check',
    carrier: data.carrier,
    base: baseSha,
    candidate: candidateSha,
    normalization: NORMALIZATION,
    entries: entries.length,
    classifiedEntries: entries.filter((entry) => entry.homeKind !== null && entry.homeKind !== undefined).length,
    removedLines,
    landed,
    unlanded,
    inventoryErrors,
    ok: unlanded.length === 0 && inventoryErrors.length === 0
  };
}

const USAGE = [
  'Usage:',
  '  node tools/check-carrier-landing.mjs check --base SHA --inventory PATH [--candidate REF] [--repo DIR] [--json]',
  '  node tools/check-carrier-landing.mjs scaffold --base SHA --carrier PATH [--out PATH] [--repo DIR]'
].join('\n');

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const allowed = {
    check: new Set(['--base', '--candidate', '--inventory', '--repo', '--json']),
    scaffold: new Set(['--base', '--carrier', '--out', '--repo'])
  }[command];
  if (!allowed) throw new UsageError(USAGE);
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index];
    if (!allowed.has(flag)) throw new UsageError(`unknown option ${flag}\n${USAGE}`);
    if (flag === '--json') { options.json = true; continue; }
    const value = rest[index + 1];
    if (value === undefined || value.startsWith('--')) throw new UsageError(`${flag} needs a value\n${USAGE}`);
    options[flag.slice(2)] = value;
    index += 1;
  }
  const required = command === 'check' ? ['base', 'inventory'] : ['base', 'carrier'];
  for (const name of required) if (!options[name]) throw new UsageError(`--${name} is required\n${USAGE}`);
  return { command, options };
}

function printReport(report) {
  console.log(`${report.carrier}: base ${report.base} -> candidate ${report.candidate}`);
  console.log(`removed lines: ${report.removedLines}; landed: ${report.landed}; inventory entries: ${report.entries} (${report.classifiedEntries} classified)`);
  for (const error of report.inventoryErrors) console.log(`inventory-error ${error.code}: ${error.message}`);
  for (const finding of report.unlanded) console.log(`unlanded ${finding.code}: ${finding.message}`);
  console.log(report.ok ? 'ok - every removed line landed in a named home' : 'not ok - removed lines lack a landed home or the inventory is invalid');
}

if (isMainModule(import.meta.url)) {
  try {
    const { command, options } = parseArgs(process.argv.slice(2));
    const repo = path.resolve(options.repo ?? process.cwd());
    if (command === 'scaffold') {
      const inventory = scaffoldInventory({ repo, base: options.base, carrier: options.carrier });
      const text = `${JSON.stringify(inventory, null, 2)}\n`;
      if (options.out) {
        if (fs.existsSync(options.out)) throw new UsageError(`inventory ${options.out} already exists; scaffold never overwrites a classified inventory`);
        fs.writeFileSync(options.out, text, { flag: 'wx' });
        console.log(`scaffold: wrote ${inventory.entries.length} unclassified entries for ${inventory.carrier} at ${inventory.baseSha} to ${options.out}`);
      } else process.stdout.write(text);
    } else {
      const report = checkCarrierLanding({ repo, base: options.base, candidate: options.candidate ?? 'HEAD', inventory: path.resolve(options.inventory) });
      if (options.json) console.log(JSON.stringify(report, null, 2));
      else printReport(report);
      process.exitCode = report.ok ? 0 : 1;
    }
  } catch (error) {
    console.error(error instanceof UsageError ? error.message : error.stack);
    process.exitCode = 2;
  }
}
