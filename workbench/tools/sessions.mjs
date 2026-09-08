#!/usr/bin/env node
// Reconcile selected live-note material into existing durable owners.
// Legacy checkpoint invocation is a refusal-only compatibility boundary.
// Privacy and structure checks never certify semantic fidelity or authority.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { finding } from './diagnostics.mjs';
import { assertSafeReadPath, assertSafeWritePath, writeSafeFile, collectionRelative, findRoot, isMainModule } from './workbench-paths.mjs';
import { scanPrivacy } from './privacy.mjs';
import { readNote, resolveNote } from './notepads.mjs';
import { parseSpecPacket } from './spec-packet.mjs';
import { validateSpecCandidate } from './spec-workbench.mjs';
import { listAdrs, validateAdrs } from './adr.mjs';
import { validateWiki } from './wiki.mjs';
import { controls, containsPlaceholder } from './workbench-layout.mjs';
import { laneRelative, IGNORED_COLLECTIONS } from './workbench-paths.mjs';

export function checkpoint() {
  return { status: 'blocked', error: finding('invalid-note', 'Checkpoint copy creation is retired; use notepads for local continuity and sessions.mjs promote for selected durable-owner reconciliation. Existing checkpoint history remains unchanged.') };
}

function digest(value) { return createHash('sha256').update(value).digest('hex'); }

function ordinaryFile(root, value) {
  const requested = path.resolve(root, requireValue(value, 'A file path is required'));
  assertSafeReadPath(root, requested);
  const stat = fs.lstatSync(requested);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink > 1) throw new Error('Promotion requires ordinary, singly linked files');
  const relative = path.relative(fs.realpathSync.native(root), fs.realpathSync.native(requested));
  return { absolute: path.resolve(root, relative), relative: relative.split(path.sep).join('/') };
}

function evidenceRows(content) {
  const section = content.split(/^## Append-Only Evidence And Execution Log\s*$/m)[1]?.split(/^## /m)[0] ?? '';
  return section.split(/\r?\n/).filter(line => /^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line));
}

function decodedStrings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(decodedStrings);
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => [key, ...decodedStrings(item)]);
  return [];
}

function canonicalReference(target) {
  const missing = [];
  let existing = target;
  while (!fs.existsSync(existing)) {
    const parent = path.dirname(existing);
    if (parent === existing) throw new Error('Cannot resolve citation ancestry');
    missing.unshift(path.basename(existing));
    existing = parent;
  }
  return path.join(fs.realpathSync.native(existing), ...missing);
}

function markdownReferences(content) {
  const references = [];
  for (const pattern of [
    /\[[^\]\n]*\]\(\s*(?:<([^>\n]+)>|([^\s)]+))/g,
    /^ {0,3}\[[^\]\n]+\]:\s*(?:<([^>\n]+)>|(\S+))/gm
  ]) {
    for (const match of content.matchAll(pattern)) references.push(match[1] ?? match[2]);
  }
  return references;
}

function validatePromotionOwner(root, destination, content, original) {
  if (destination.relative === 'CLAUDE.md') {
    if (content.trim() !== '@AGENTS.md') throw new Error('CLAUDE.md must remain the AGENTS adapter');
    return 'control';
  }
  if (path.extname(destination.relative) !== '.md' || !content.trim() || !/^\uFEFF?#\s+\S/m.test(content)) throw new Error('A durable Markdown owner needs nonempty content and a title');
  const beneath = relative => destination.relative.startsWith(`${relative}/`);
  const forbidden = [...IGNORED_COLLECTIONS, 'checkpoints', 'notepad-templates'].map(name => collectionRelative(root, name));
  if (forbidden.some(beneath)) throw new Error('A live record, template or frozen checkpoint cannot be the promotion destination');
  // Candidate text is authored by the agent. A link to an ignored working
  // record is not durable provenance, even if that source currently exists.
  for (const citation of markdownReferences(content)) {
    const reference = decodeURIComponent(citation.split('#')[0]);
    if (!reference || /^[a-z][a-z0-9+.-]*:/i.test(reference)) continue;
    const target = path.resolve(path.dirname(destination.absolute), reference);
    const relative = path.relative(fs.realpathSync.native(root), canonicalReference(target)).split(path.sep).join('/');
    if (IGNORED_COLLECTIONS.some(name => relative.startsWith(`${collectionRelative(root, name)}/`)) && !relative.startsWith(`${collectionRelative(root, 'notepad-templates')}/`)) throw new Error('Durable provenance cannot cite an ignored live record');
  }
  const overrides = { contentOverrides: new Map([[destination.absolute, content]]) };
  let findings = [];
  if (controls.includes(destination.relative)) {
    if (containsPlaceholder(content) || /\[BRACKETED(?:_[A-Z]+)*\]/.test(content)) throw new Error('A root control cannot contain template placeholders');
    return 'control';
  }
  if (beneath(laneRelative(root, 'specs')) && path.basename(destination.absolute) === 'SPEC.md') {
    const before = parseSpecPacket(original, destination.absolute, root);
    const after = parseSpecPacket(content, destination.absolute, root);
    if (before.id !== after.id) throw new Error('Promotion cannot change the existing spec identity');
    const oldRows = evidenceRows(original); const newRows = evidenceRows(content);
    if (oldRows.some((row, index) => newRows[index] !== row)) throw new Error('Promotion cannot rewrite append-only spec evidence');
    const existing = new Set(validateSpecCandidate(root, destination.absolute, original).map(issue => JSON.stringify(issue)));
    const invalid = validateSpecCandidate(root, destination.absolute, content).filter(issue => issue.severity === 'error' && (issue.specId === after.id || !existing.has(JSON.stringify(issue))));
    if (invalid.length) throw new Error(invalid.map(issue => issue.message).join('; '));
    return 'spec';
  }
  if (beneath(collectionRelative(root, 'adr'))) {
    if (!listAdrs(root).some(record => record.filePath === destination.absolute)) throw new Error('Destination is not a recognized ADR record');
    findings = validateAdrs(root, overrides).filter(issue => issue.severity === 'error');
  }
  else if (beneath(laneRelative(root, 'wiki'))) findings = validateWiki(root, overrides).filter(issue => issue.severity === 'error' && (issue.note === destination.relative || issue.message.includes(destination.relative)));
  else if (beneath(laneRelative(root, 'docs')) || beneath(laneRelative(root, 'feedback'))) return 'document';
  else throw new Error('Destination must be an existing control, spec, ADR, Wiki or docs/feedback Markdown owner');
  if (findings.length) throw new Error(findings.map(issue => issue.message).join('; '));
  return beneath(collectionRelative(root, 'adr')) ? 'adr' : 'wiki';
}

// The tool validates structure and performs a checked write. The agent owns
// authorization, owner selection and faithful reconciliation of the selected
// claims and their correction context. Source cleanup is a separate operation.
export function promote(root, options) {
  let destination; let original; let backupDirectory; let attempted = false;
  try {
    const allowed = new Set(['path', 'from', 'revision', 'entries', 'to', 'expected', 'content']);
    for (const key of Object.keys(options)) if (!allowed.has(key)) throw new Error(`promote does not accept --${key}`);
    const revision = Number(options.revision);
    if (!Number.isInteger(revision) || revision < 1) throw new Error('--revision must name the positive source revision');
    const entries = requireValue(options.entries, '--entries is required').split(',').map(value => value.trim());
    if (entries.some(value => !value) || new Set(entries).size !== entries.length) throw new Error('--entries must contain distinct entry IDs');
    const source = ordinaryFile(root, resolveNote(root, options.from).absolute);
    const sourceBytes = fs.readFileSync(source.absolute);
    const selected = readNote(root, { note: options.from, entry: entries });
    if (selected.status !== 'read') return selected;
    if (selected.revision !== revision) return { status: 'blocked', error: finding('stale-revision', 'Source revision changed; read and reconcile again') };
    if (entries.some(id => !selected.entries.some(entry => entry.id === id && entry.included_as === 'match'))) throw new Error('Every selected entry must exist in the source');
    if (!fs.readFileSync(source.absolute).equals(sourceBytes)) throw new Error('Source changed during selection');
    destination = ordinaryFile(root, options.to);
    const draft = ordinaryFile(root, options.content);
    if (new Set([source.absolute, destination.absolute, draft.absolute]).size !== 3) throw new Error('Source, destination and authored draft must be distinct files');
    assertSafeWritePath(root, destination.absolute);
    original = fs.readFileSync(destination.absolute);
    if (!/^[a-f0-9]{64}$/i.test(String(options.expected ?? '')) || digest(original) !== options.expected.toLowerCase()) throw new Error('Destination hash is stale or invalid; read and reconcile again');
    const draftBytes = fs.readFileSync(draft.absolute);
    const content = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(draftBytes);
    const hits = decodedStrings(selected.entries).flatMap(scanPrivacy).concat(scanPrivacy(content));
    if (hits.length) return { status: 'blocked', error: finding('secret-like-content', 'Selected material or authored destination contains private content'), hits };
    const owner = validatePromotionOwner(root, destination, content, original.toString('utf8'));
    if (!fs.readFileSync(source.absolute).equals(sourceBytes) || !fs.readFileSync(destination.absolute).equals(original) || !fs.readFileSync(draft.absolute).equals(draftBytes)) throw new Error('Source, destination or draft changed during validation; read and reconcile again');
    backupDirectory = fs.mkdtempSync(path.join(path.dirname(destination.absolute), '.promotion-'));
    fs.writeFileSync(path.join(backupDirectory, 'original.md'), original, { flag: 'wx', mode: 0o600 });
    attempted = true;
    writeSafeFile(root, destination.absolute, draftBytes);
    const after = fs.readFileSync(destination.absolute);
    if (!after.equals(draftBytes)) throw new Error('Destination read-back disagrees with the authored bytes');
    let recoveryResidue = null;
    try { fs.rmSync(backupDirectory, { recursive: true }); backupDirectory = null; }
    catch { recoveryResidue = path.relative(root, backupDirectory).split(path.sep).join('/'); }
    return { status: 'promoted', ...(recoveryResidue ? { recoveryResidue } : {}), source: { id: selected.id, revision, sha256: digest(sourceBytes), selected: entries, context: selected.entries.filter(entry => entry.included_as === 'context').map(entry => entry.id) }, destination: { path: destination.relative, owner, before: digest(original), sha256: digest(after) }, sourceRetained: true, verification: 'privacy, owner structure, expected hashes and byte read-back; semantic fidelity and authorization are agent judgments' };
  } catch (error) {
    if (attempted) {
      try {
        // Single-writer operation: a failed read-back restores the saved owner.
        // Keep a physical backup if the filesystem also refuses restoration.
        writeSafeFile(root, destination.absolute, original);
        if (!fs.readFileSync(destination.absolute).equals(original)) throw new Error('Original destination read-back failed');
      } catch (recovery) {
        return { status: 'partial', error: finding('promotion-recovery-required', `${error.message}; restoration failed: ${recovery.message}`), sourceRetained: true, destination: destination.relative, recovery: path.relative(root, path.join(backupDirectory, 'original.md')).split(path.sep).join('/') };
      }
    }
    let recoveryResidue = null;
    if (backupDirectory) {
      try { fs.rmSync(backupDirectory, { recursive: true }); }
      catch { recoveryResidue = path.relative(root, backupDirectory).split(path.sep).join('/'); }
    }
    return { status: 'blocked', error: finding(attempted ? 'write-failed' : 'invalid-note', error.message), sourceRetained: true, ...(recoveryResidue ? { recoveryResidue } : {}) };
  }
}

export function scanFile(root, target) {
  const file = path.resolve(root, target);
  const hits = scanPrivacy(fs.readFileSync(file, 'utf8'));
  return { status: hits.length ? 'blocked' : 'clean', file: path.relative(root, file), hits };
}

function requireValue(value, message) {
  if (!value || !String(value).trim()) throw new Error(message);
  return String(value).trim();
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg.startsWith('--')) options[arg.slice(2)] = rest[++index];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return { command, options };
}

if (isMainModule(import.meta.url)) {
  try {
    const { command, options } = parseArgs(process.argv.slice(2));
    const root = findRoot(options.path ?? process.cwd());
    let result;
    if (command === 'promote') result = promote(root, options);
    else if (command === 'checkpoint') result = checkpoint(root, options);
    else if (command === 'scan') result = scanFile(root, requireValue(options.file, '--file is required'));
    else throw new Error('Usage: sessions.mjs promote --from NOTE --revision N --entries IDS --to OWNER --expected SHA256 --content DRAFT | checkpoint --from LIVE_RECORD --topic slug [--date YYYY-MM-DD] | scan --file PATH');
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (['blocked', 'partial'].includes(result.status)) process.exitCode = 1;
  } catch (error) {
    process.stdout.write(`${JSON.stringify({ status: 'blocked', error: { code: 'invalid-invocation', message: error.message } })}\n`);
    process.exitCode = 1;
  }
}
