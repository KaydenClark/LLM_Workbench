#!/usr/bin/env node
// Read-only machine evidence for ADR-0055. Semantic review remains explicit:
// hashes and structural diagnostics cannot certify arbitrary prose as current.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { assertSafeReadPath, isMainModule, readManifest, laneRelative, collectionRelative } from './workbench-paths.mjs';
import { doctor } from './spec-workbench.mjs';
import { provenanceFindings, seededDocumentFindings } from './workbench-layout.mjs';

const CONTROLS = ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'README.md', 'TASKBOARD.md'];
const HISTORY = /(?:^|\/)(?:retired|archive|checkpoints|recovery)(?:\/|$)/;
function field(text, name) { return text.match(new RegExp(`^\\*\\*${name}:\\*\\* (.+)$`, 'm'))?.[1]?.trim() ?? null; }
function section(text, name) { return text.match(new RegExp(`^## ${name}\\r?\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, 'm'))?.[1]?.trim() ?? ''; }
function liveBlockers(text) {
  const declared = field(text, 'Blockers') ?? '';
  if (/^none\b/i.test(declared)) return [];
  return [...declared.matchAll(/(S-[A-Z0-9]+)\b([^;,\n]*)/g)]
    .filter(match => !/^\s*\(?\s*(?:is\s+)?(?:complete|completed|done|superseded|historical)\b/i.test(match[2]))
    .map(match => match[1]);
}
function hash(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex'); }

export function inspectSelfDrift(project, options = {}) {
  const root = path.resolve(project);
  const phase = options.phase ?? 'inspection';
  if (!['pre', 'post', 'inspection'].includes(phase)) throw new Error('phase must be pre, post or inspection');
  const inventory = [], findings = [], bodies = new Map();
  function finding(code, artifact, claim, expected, observed, correction, classification = 'stale') {
    findings.push({ code, artifact, claim, expected, observed, correction, classification, severity: 'error', effect: 'blocks-clean-update' });
  }
  function read(relative, required = true) {
    if (bodies.has(relative)) return bodies.get(relative);
    try {
      const file = path.resolve(root, relative);
      assertSafeReadPath(root, file);
      const stat = fs.lstatSync(file);
      if (!stat.isFile()) throw new Error('required artifact is not an ordinary file');
      const bytes = fs.readFileSync(file);
      const text = bytes.toString('utf8');
      const status = field(text, 'Status');
      const classification = (HISTORY.test(relative) || ['complete', 'superseded'].includes(status)) ? 'historical' : status === 'planned' ? 'planned' : status === 'blocked' ? 'blocked' : 'current';
      inventory.push({ artifact: relative, classification, sha256: hash(bytes), bytes: bytes.length, status });
      bodies.set(relative, text);
      if (relative.endsWith('.json')) {
        try { JSON.parse(text); } catch { throw new Error('invalid JSON (content omitted)'); }
      }
      return text;
    } catch (error) {
      if (!required && error.code === 'ENOENT') return null;
      finding('unreadable', relative, 'required steering artifact is readable', 'ordinary readable artifact', error.message, `Restore or reconcile ${relative} in its owning lane`, 'unreadable');
      return null;
    }
  }
  function walk(relative, required = false) {
    try {
      const directory = path.resolve(root, relative);
      assertSafeReadPath(root, directory);
      for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        if (entry.name === '.git' || entry.name === 'node_modules') continue;
        const child = `${relative}/${entry.name}`;
        if (entry.isDirectory()) walk(child, true);
        else if (entry.isSymbolicLink()) read(child);
        else if (/\.(?:md|json|mjs)$/.test(entry.name)) read(child);
      }
    } catch (error) {
      if (!required && error.code === 'ENOENT') return;
      finding('unreadable', relative, 'inventory lane is readable', 'ordinary directory', error.message, `Restore the manifest-declared ${relative} lane`, 'unreadable');
    }
  }
  const manifestText = read('workbench/manifest.json');
  let manifest;
  try {
    if (!manifestText) throw new Error('manifest could not be read');
    manifest = readManifest(root);
    if (manifest.schemaVersion !== 2) throw new Error('schemaVersion must be 2');
    for (const control of CONTROLS) read(control);
    const specs = laneRelative(root, 'specs');
    read(`${specs}/CATALOG.md`);
    read(`${laneRelative(root, 'wiki')}/MEMORY.md`);
    read(`${collectionRelative(root, 'adr')}/REGISTER.md`);
    read(`${laneRelative(root, 'feedback')}/REPORT_FORMAT.md`, false);
    read('workbench/.workbench-seed.json', false);
    for (const relative of [specs, collectionRelative(root, 'adr'), laneRelative(root, 'tools'), collectionRelative(root, 'notepads'), 'templates', 'skills']) walk(relative);
  } catch (error) {
    finding('invalid-inventory', 'workbench/manifest.json', 'manifest resolves inventory', 'schema 2 safe routes', error.message, 'Repair manifest routing before checking self-drift', 'unreadable');
  }
  const seedIdentity = [];
  try {
    const seeds = JSON.parse(bodies.get('workbench/.workbench-seed.json') ?? '{}');
    for (const [artifact, identity] of Object.entries(seeds.documents ?? {})) {
      const content = read(artifact, false);
      seedIdentity.push({ artifact, targetState: content === null ? 'absent' : 'present', repository: identity.repository ?? null, release: identity.release ?? null, commit: identity.commit ?? null, recordedHash: identity.contentHash ?? null, observedHash: content === null ? null : hash(Buffer.from(content)), identityLimit: 'Missing repository/commit fields remain unknown; matching bytes do not establish source generation' });
    }
  } catch { /* Invalid seed JSON already has an unreadable finding. */ }
  const specStates = new Map();
  for (const [file, text] of bodies) if (file.endsWith('/SPEC.md')) {
    const id = field(text, 'Spec ID');
    if (id) specStates.set(id, { status: field(text, 'Status'), historical: HISTORY.test(file), file });
  }
  for (const [file, text] of bodies) {
    if (!file.endsWith('/SPEC.md') || HISTORY.test(file)) continue;
    const status = field(text, 'Status');
    if (status === 'complete' && /^(?:Pending|Not started)\b/i.test(section(text, 'Completion Result'))) {
      finding('completed-pending', file, 'completion result agrees with complete status', 'verified completion result', section(text, 'Completion Result'), `Reconcile Completion Result in ${file}`, 'contradictory');
    }
    const superseded = section(text, 'Supersession').match(/Superseded by:\s*(S-[A-Z0-9]+)/i)?.[1];
    if (superseded && !['complete', 'superseded'].includes(status)) finding('superseded-current', file, 'superseded work is not active work', `historical route to ${superseded}`, status, `Reconcile lifecycle with ${superseded}`);
    for (const id of (['blocked', 'active'].includes(status) ? liveBlockers(text) : [])) {
      const owner = specStates.get(id);
      if (owner?.status === 'complete' || owner?.historical) finding('resolved-blocker', file, `blocker ${id} remains live`, 'current unmet dependency', `${id} is complete or historical`, `Review the remaining gate against ${owner.file}; preserve historical evidence`);
    }
  }
  // Existing diagnostics supply projection, seed, source and managed-byte
  // evidence. Their ordinary blocking effects are unchanged by this command.
  if (manifest && !findings.some(f => /symbolic link|ordinary path inside/.test(f.observed))) {
    try {
      const components = [...doctor(root, { home: options.home }), ...provenanceFindings(root), ...seededDocumentFindings(root)];
      const unique = new Map(components.map(issue => [`${issue.code}:${issue.message}`, issue]));
      for (const issue of unique.values()) {
        const historical = issue.code === 'stale-seed' || (issue.code === 'unverified-provenance' && issue.field === 'release' && manifest.provenance?.lifecycle === 'adoption');
        const installed = ['incompatible-core', 'skill-missing', 'skill-shadow', 'skill-unreadable'].includes(issue.code);
        findings.push({ code: issue.code, artifact: issue.document ?? issue.path ?? issue.file ?? issue.scope ?? 'workbench', claim: issue.summary ?? issue.message, expected: 'current owner and verified identity', observed: issue.message, correction: historical ? 'Preserve historical adoption/seed source identity; inspect current owner and managed installation separately. Missing old seed targets require receipt reconciliation, not restoration of retired artifacts.' : installed ? 'Inspect installed source read-only; replacement requires explicit update, native invocation remains unverified' : issue.summary ?? issue.message, classification: historical ? 'historical' : installed ? 'blocked' : 'stale', severity: historical || installed ? 'attention' : issue.severity, effect: historical || installed ? 'limitation' : 'blocks-clean-update', diagnosticEffect: issue.blocks });
      }
    } catch (error) {
      finding('diagnostic-unreadable', 'workbench', 'component evidence is readable', 'diagnostic report', error.message, 'Reconcile the named unreadable owner', 'unreadable');
    }
  }
  const git = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
  const sourceRevision = git.status === 0 ? git.stdout.trim() : null;
  const dirty = spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' });
  return { schemaVersion: 1, operation: 'workbench-self-drift', phase, sourceRevision, dirty: dirty.status === 0 ? Boolean(dirty.stdout.trim()) : null, workbenchVersion: manifest?.workbenchVersion ?? null, sourceIdentity: manifest?.provenance?.source ?? null, sourceIdentityRole: manifest?.provenance?.lifecycle === 'adoption' ? 'historical-adoption' : 'source-generation-unverified', seedIdentity, inventory, findings, machineResult: findings.some(f => f.effect === 'blocks-clean-update') ? 'blocked' : 'no-machine-finding', cleanUpdate: false, limitations: ['Machine evidence does not establish semantic freshness. Review current-facing claims against their owners and record a no-memory cold-start read-back.', 'Target-project drift is a separate operation.', 'Installed-source files do not prove native host callability; no installation or repair is performed.'] };
}

if (isMainModule(import.meta.url)) {
  try {
    const options = {}, args = process.argv.slice(2);
    let project = process.cwd(), json = false;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--json') json = true;
      else if (['--project', '--phase', '--home'].includes(args[i])) {
        const key = args[i].slice(2), value = args[++i];
        if (!value || value.startsWith('--')) throw new Error(`Missing ${key} value`);
        if (key === 'project') project = value; else options[key] = value;
      } else throw new Error(`Unknown argument: ${args[i]}`);
    }
    const report = inspectSelfDrift(project, options);
    console.log(json ? JSON.stringify(report, null, 2) : `${report.operation}: ${report.machineResult}; semantic review required\n${report.findings.map(f => `${f.code}: ${f.artifact}: ${f.observed}`).join('\n')}`);
    process.exitCode = report.machineResult === 'blocked' ? 1 : 0;
  } catch (error) { console.error(error.message); process.exitCode = 2; }
}
