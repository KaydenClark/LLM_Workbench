#!/usr/bin/env node
// The v3.1 portability and privacy matrix: every row of the release
// amendment has a named, deterministic check here or in the test it cites.
//   schema migration        -> test-workbench-layout.mjs (upgrade-required, lossless migrate)
//   mixed Adoption          -> test-workbench-adoption.mjs (five fixtures)
//   case-sensitive paths    -> tracked paths never differ only by case; lowercase lanes enforced
//   Windows/POSIX behavior  -> backslash lanes rejected; CRLF spec packets and controls accepted
//   symlink invocation      -> test-symlink-invocation.mjs (runtime lane tools)
//   collisions              -> test-workbench-tools.mjs and test-workbench-adoption.mjs
//   stale links             -> doctor broken-link and wiki stale-note are attention (test-diagnostics, test-wiki)
//   public privacy strip    -> active surfaces carry no private path, private catalog, or secret-like content
//   retired/Foundry paths   -> active surfaces name no retired lane or Foundry-dependent path
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { scanPrivacy } from '../workbench/tools/privacy.mjs';
import { isSafeRelative } from '../workbench/tools/workbench-paths.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const layout = path.join(root, 'workbench', 'tools', 'workbench-layout.mjs');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
const ACTIVE_SURFACES = ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'README.md', 'CLAUDE.md', 'templates', 'skills', 'workbench/manifest.json', 'workbench/tools', 'workbench/docs', 'workbench/wiki', 'workbench/sessions/checkpoints', 'workbench/specs/S-00E-fresh-template-project-proof/proof', 'workbench/specs/S-00E-fresh-template-project-proof/PROOF.md'];
const RETIRED = [
  { label: 'hidden notepad directory', pattern: /\.agents\/grilling diary/ },
  // The two v3.0 lane names may appear only where the one-time migration is
  // described or implemented: the Runbook's migrate paragraph, the layout
  // tool's legacy source map, and promoted planning records that explain it.
  { label: 'v3.0 grilling lane', pattern: /workbench\/grilling\b/, allow: { 'RUNBOOK.md': /becomes `workbench\/sessions\/grilling`/, 'workbench/tools/workbench-layout.mjs': /legacyLanes/, 'workbench/sessions/checkpoints/': /migrat/i } },
  { label: 'v3.0 handoffs lane', pattern: /workbench\/handoffs\b/, allow: { 'RUNBOOK.md': /checkpoints become/, 'workbench/tools/workbench-layout.mjs': /legacyLanes/, 'workbench/sessions/checkpoints/': /migrat/i } },
  { label: 'host temp handoff lane', pattern: /\$TMPDIR\/\.foundry|\/\.foundry\// },
  { label: 'private skill catalog', pattern: /KaydenClark\/skills/ },
  { label: 'Foundry-dependent path', pattern: /Foundry\/(?:Halls|Sockets|Modules|Roles|Schematic)|Halls\/Forge/ },
  { label: 'private home path', pattern: /\/Users\/[A-Za-z0-9._-]+\/|\/home\/[A-Za-z0-9._-]+\// }
];

function trackedFiles() {
  return execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
}

function activeFiles() {
  return trackedFiles().filter((file) => ACTIVE_SURFACES.some((surface) => file === surface || file.startsWith(`${surface}/`)))
    .filter((file) => /\.(md|mjs|json)$/.test(file));
}

// A locked ledger question can preserve a rejected proposal. Scan its settled
// answer and every operational field, while distinguishing explicitly bounded
// historical proposal text from an instruction to use the retired path.
function retiredContent(file, content) {
  if (file !== 'workbench/wiki/grilling-destination-audit-ledger.json') return content;
  const ledger = JSON.parse(content);
  if (ledger.schema !== 'grilling-destination-ledger/1' || !Array.isArray(ledger.questions)) return content;
  // Recognize nominal path proposals only; nearby history markers must never
  // hide an instruction or a different path in the same sentence/parenthesis.
  const historical = /\bearlier\s+(?:status-folder\s+and\s+)?workbench\/(?:grilling|handoffs)\/?\s+proposals?\s+are\s+(?:superseded|unselected)(?:\s+or\s+(?:superseded|unselected))?\./gi;
  const proposed = /\(\s*workbench\/(?:grilling|handoffs)\/?\s+proposed\s*\)/gi;
  const legacyLane = /workbench\/(?:grilling|handoffs)\b/g;
  for (const row of ledger.questions) {
    if (row.status !== 'locked' || typeof row.answer !== 'string' || typeof row.notes !== 'string'
      || RETIRED.some(({ pattern }) => pattern.test(row.answer))) continue;
    if (!row.notes.match(historical)) continue;
    if (typeof row.question === 'string') {
      row.question = row.question.replace(proposed, (proposal) => proposal.replace(legacyLane, '[historical lane]'));
    }
    row.notes = row.notes.replace(historical, (history) => history.replace(legacyLane, '[historical lane]'));
  }
  return JSON.stringify(ledger);
}

test('historical ledger proposals remain recoverable while active retired routes are rejected', () => {
  const file = 'workbench/wiki/grilling-destination-audit-ledger.json';
  const retired = RETIRED.find(({ label }) => label === 'v3.0 grilling lane').pattern;
  const row = {
    status: 'locked', question: 'Which root (workbench/grilling/ proposed)?',
    answer: 'Use workbench/landmark-tracker/.',
    notes: 'Earlier workbench/grilling/ proposals are superseded or unselected.'
  };
  const encode = (value) => JSON.stringify({ schema: 'grilling-destination-ledger/1', questions: [value] });
  assert.equal(retired.test(retiredContent(file, encode(row))), false);
  for (const changed of [
    { ...row, answer: 'Use workbench/grilling/.' },
    { ...row, status: 'open' },
    { ...row, question: 'Use workbench/grilling/ now. Which root (old proposal proposed)?' },
    { ...row, notes: `${row.notes} Now use workbench/grilling/.` },
    { ...row, progress: { evidence: 'Live root is workbench/grilling/.' } },
    { ...row, result: [{ artifact: 'workbench/grilling/' }] }
  ]) assert.equal(retired.test(retiredContent(file, encode(changed))), true, JSON.stringify(changed));
  assert.equal(retired.test(retiredContent('workbench/wiki/another.json', encode(row))), true);
  const privateHistory = encode({ ...row, notes: 'Earlier /Users/private/workbench/grilling/ proposals are superseded or unselected.' });
  assert.equal(RETIRED.find(({ label }) => label === 'private home path').pattern.test(retiredContent(file, privateHistory)), true, 'historical classification never masks private paths');
});

test('historical markers never mask operational text surrounding a legacy path', () => {
  const file = 'workbench/wiki/grilling-destination-audit-ledger.json';
  const encode = (row) => JSON.stringify({ schema: 'grilling-destination-ledger/1', questions: [row] });
  for (const lane of ['grilling', 'handoffs']) {
    const retired = RETIRED.find(({ label }) => label === `v3.0 ${lane} lane`).pattern;
    const legacyPath = `workbench/${lane}/`;
    const row = {
      status: 'locked', question: `Which root (${legacyPath} proposed)?`,
      answer: 'Use workbench/landmark-tracker/.',
      notes: `Earlier status-folder and ${legacyPath} proposals are superseded or unselected.`
    };
    assert.equal(retired.test(retiredContent(file, encode(row))), false, `${lane} nominal history remains recoverable`);
    assert.equal(retired.test(retiredContent(file, encode({ ...row, question: `Which root (workbench/${lane} proposed)?` }))), false, `${lane} historical token without trailing slash`);
    for (const changed of [
      { ...row, question: `Which root (the old name was proposed; now use ${legacyPath})?` },
      { ...row, question: `Which root (${legacyPath} proposed; now use ${legacyPath})?` },
      { ...row, question: `Which root (${legacyPath}live proposed)?` },
      { ...row, question: `${row.question} Now use ${legacyPath}.` },
      { ...row, notes: `Earlier the old name was proposed; now use ${legacyPath} proposals are superseded or unselected.` },
      { ...row, notes: `Earlier use ${legacyPath} proposals are superseded or unselected.` },
      { ...row, notes: `Earlier ${legacyPath} proposals are superseded or unselected; now use ${legacyPath}.` },
      { ...row, notes: `${row.notes} Now use ${legacyPath}.` },
      { ...row, answer: `Use ${legacyPath}.` },
      { ...row, progress: { evidence: `Live root is ${legacyPath}.` } },
      { ...row, result: [{ artifact: legacyPath }] }
    ]) assert.equal(retired.test(retiredContent(file, encode(changed))), true, JSON.stringify(changed));
  }
});

test('tracked paths never differ only by case, and lanes must be lowercase without spaces or backslashes', () => {
  const seen = new Map();
  for (const file of trackedFiles()) {
    const key = file.toLowerCase();
    assert.equal(seen.has(key), false, `${file} collides with ${seen.get(key)} on a case-insensitive host`);
    seen.set(key, file);
  }
  assert.equal(isSafeRelative('workbench/wiki/Design Concepts'), false);
  assert.equal(isSafeRelative('workbench\\specs'), false);
  assert.equal(isSafeRelative('Workbench/specs'), false);
  assert.equal(isSafeRelative('workbench/../specs'), false);
  assert.equal(isSafeRelative('workbench/specs'), true);
});

test('a manifest with a backslash or capitalised lane is rejected before any lane is read', () => {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-matrix-'));
  try {
    assert.equal(spawnSync(process.execPath, [layout, 'init', '--project', project, '--provenance', 'genesis', '--version', VERSION], { encoding: 'utf8' }).status, 0);
    const manifestPath = path.join(project, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    for (const [lane, value, code] of [['specs', 'workbench\\specs', 'invalid-lane'], ['wiki', 'Workbench/wiki', 'invalid-lane']]) {
      const mutated = { ...manifest, lanes: { ...manifest.lanes, [lane]: value } };
      fs.writeFileSync(manifestPath, JSON.stringify(mutated));
      const result = JSON.parse(spawnSync(process.execPath, [layout, 'validate', '--project', project], { encoding: 'utf8' }).stdout);
      assert.equal(result.error.code, code, `${value} must be rejected`);
    }
    // CRLF line endings in a spec packet and the manifest are Windows-normal.
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\r\n`.replaceAll('\n', '\r\n'));
    const crlfManifest = JSON.parse(spawnSync(process.execPath, [layout, 'validate', '--project', project], { encoding: 'utf8' }).stdout);
    assert.equal(crlfManifest.status, 'valid', 'a CRLF manifest validates');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('active surfaces carry no retired lane, private path, private catalog, or Foundry-dependent path', () => {
  for (const file of activeFiles()) {
    const content = retiredContent(file, fs.readFileSync(path.join(root, file), 'utf8'));
    for (const { label, pattern, allow } of RETIRED) {
      for (const hit of content.matchAll(new RegExp(pattern.source, 'g'))) {
        const key = allow && Object.keys(allow).find((prefix) => file === prefix || (prefix.endsWith('/') && file.startsWith(prefix)));
        const allowed = key && allow[key].test(content.slice(Math.max(0, hit.index - 200), hit.index + 200));
        assert.ok(allowed, `${file} names a ${label}: ${hit[0]}`);
      }
    }
  }
});

test('active surfaces contain no secret-like content by the shared privacy patterns', () => {
  const hits = [];
  for (const file of activeFiles()) {
    for (const hit of scanPrivacy(fs.readFileSync(path.join(root, file), 'utf8'))) hits.push(`${file}:${hit.line} ${hit.label}`);
  }
  assert.deepEqual(hits, []);
});
