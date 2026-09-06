#!/usr/bin/env node
// Portable wiki validator: router, declared collections, note metadata,
// portability, the Design Concept article shape, no copied live task state,
// no secret-like material. Staleness is attention, never blocking.
import fs from 'node:fs';
import path from 'node:path';
import { finding } from './diagnostics.mjs';
import { collectionRelative, findRoot, isMainModule, lanePath, laneRelative, readManifest, writeSafeFile, WIKI_PROFILES } from './workbench-paths.mjs';
import { insertFrontmatterKeys, parseFrontmatter } from './adr.mjs';
import { scanPrivacy } from './privacy.mjs';
import { provenanceFindings, seededDocumentFindings, versionStamp, wikiContractFiles } from './workbench-layout.mjs';

export const NOTE_TYPES = Object.freeze(['memory', 'project', 'person', 'machine', 'guidebook', 'design-concept', 'meta']);
export const NOTE_STATUSES = Object.freeze(['active', 'partial', 'stale', 'archived']);
export const SENSITIVITIES = Object.freeze(['normal', 'private', 'restricted']);
export const KNOWLEDGE_ROLES = Object.freeze(['canonical', 'curated', 'derived', 'historical']);
export const REQUIRED_PROPERTIES = Object.freeze(['type', 'status', 'sensitivity', 'knowledge_role', 'provenance', 'source_paths', 'last_verified']);
const REQUIRED_COLLECTIONS = Object.freeze(['design-concepts', 'guidebooks', 'archive']);
const LIVE_STATE_MARKERS = [/<!--\s*hot-specs:start\s*-->/, /<!--\s*spec-catalog:start\s*-->/, /^\|\s*TK-\d{3}\s*\|.*\|\s*(?:ready|in-progress|blocked|done|deferred)\s*\|/m];

function walkMarkdown(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const target = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) walkMarkdown(target, files);
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(target);
  }
  return files.sort();
}

// The room brain is only useful when the controls route back to it: AGENTS.md
// must name the wiki lane and README.md must name MEMORY.md (UP-009).
function roomBrainRouting(root, wikiRelative) {
  const findings = [];
  for (const [control, reference] of [['AGENTS.md', wikiRelative], ['README.md', 'MEMORY.md']]) {
    const target = path.join(root, control);
    const content = fs.existsSync(target) && fs.lstatSync(target).isFile() ? fs.readFileSync(target, 'utf8') : '';
    if (!content.includes(reference)) {
      findings.push(finding('room-brain-unrouted', `${control} does not route to the room brain ${wikiRelative}/MEMORY.md; it must reference ${reference}`, { control }));
    }
  }
  return findings;
}

// The wiki contract files and the room brain carry the Genesis stamp; one that
// names a version other than the manifest is stale (version equality, not
// content freshness), and so is a stamp still holding the template placeholder,
// which a hand-copied template leaves behind where the Genesis gate never ran.
// A file without any stamp names no version.
function wikiStamps(root, wikiRoot, wikiRelative, expectedVersion) {
  const findings = [];
  if (!expectedVersion) return findings;
  for (const relative of ['MEMORY.md', ...wikiContractFiles]) {
    const target = path.join(wikiRoot, relative);
    if (!fs.existsSync(target) || !fs.lstatSync(target).isFile()) continue;
    const content = fs.readFileSync(target, 'utf8');
    const note = `${wikiRelative}/${relative}`;
    if (/LLM Workbench v\[/.test(content)) {
      findings.push(finding('stale-stamp', `${note} stamp is unfilled; fill it with the manifest version ${expectedVersion}`, { note }));
      continue;
    }
    const stamp = versionStamp(content);
    if (stamp !== null && stamp !== expectedVersion) {
      findings.push(finding('stale-stamp', `${note} is stamped ${stamp} but the manifest says ${expectedVersion}`, { note }));
    }
  }
  return findings;
}

export function validateWiki(root) {
  const findings = [];
  const wikiRoot = lanePath(root, 'wiki');
  const wikiRelative = laneRelative(root, 'wiki');
  const manifest = readManifest(root);
  const profile = manifest?.wiki?.profile;
  if (!WIKI_PROFILES.includes(profile)) {
    findings.push(finding('invalid-wiki-profile', `manifest wiki.profile must be one of ${WIKI_PROFILES.join(', ')}`));
  }
  if (!fs.existsSync(path.join(wikiRoot, 'MEMORY.md'))) {
    findings.push(finding('invalid-note', `${wikiRelative}/MEMORY.md router is missing`));
  }
  else findings.push(...roomBrainRouting(root, wikiRelative));
  findings.push(...wikiStamps(root, wikiRoot, wikiRelative, manifest?.workbenchVersion));
  // The next two checks are not wiki facts: the generation of a room's seeded
  // lane documents and the source identity its manifest records. Unlike
  // invalid-wiki-profile and missing-collection above, which are wiki-domain
  // facts that happen to be stored in the manifest, these belong behind a
  // dedicated doctor hook in spec-workbench.mjs. Doctor wires exactly two
  // support-root validators, this one and the ADR validator, and
  // spec-workbench.mjs was held by a sibling branch when this landed, so
  // AGENTS.md's non-overlapping file lanes rule kept this ticket out of it.
  // The placement is therefore interim and is carried as a follow-up in
  // S-042. Both checks live in workbench-layout.mjs, which owns seeding and
  // provenance; this validator only carries them to the one report a room
  // actually reads, and RUNBOOK.md and wiki/SCHEMA.md name it as the emitter.
  findings.push(...seededDocumentFindings(root));
  findings.push(...provenanceFindings(root));
  for (const name of REQUIRED_COLLECTIONS) {
    const relative = collectionRelative(root, name);
    const entry = fs.existsSync(path.join(root, relative)) ? fs.lstatSync(path.join(root, relative)) : null;
    if (!entry || entry.isSymbolicLink() || !entry.isDirectory()) {
      findings.push(finding('missing-collection', `${relative} must be an ordinary directory (it may be empty)`));
    }
  }
  if (!fs.existsSync(wikiRoot)) return findings;
  const designConcepts = path.join(root, collectionRelative(root, 'design-concepts'));
  const archive = path.join(root, collectionRelative(root, 'archive'));
  const basenames = new Map();
  for (const file of walkMarkdown(wikiRoot)) {
    const relative = path.relative(root, file).split(path.sep).join('/');
    const content = fs.readFileSync(file, 'utf8');
    const inArchive = file.startsWith(archive + path.sep);
    const basename = path.basename(file, '.md');
    basenames.set(basename, [...(basenames.get(basename) ?? []), relative]);
    if (inArchive) continue;
    const { data } = parseFrontmatter(content);
    if (!data) {
      findings.push(finding('invalid-note', `${relative} has no frontmatter`, { note: relative }));
      continue;
    }
    for (const property of REQUIRED_PROPERTIES) {
      if (data[property] === undefined) findings.push(finding('invalid-note', `${relative} is missing ${property}`, { note: relative }));
    }
    if (data.authority !== undefined) findings.push(finding('invalid-note', `${relative} uses retired property authority; use knowledge_role for handling and provenance for attribution`, { note: relative }));
    if (data.type !== undefined && !NOTE_TYPES.includes(data.type)) findings.push(finding('invalid-note', `${relative} type ${data.type} is not one of ${NOTE_TYPES.join(', ')}`, { note: relative }));
    if (data.status !== undefined && !NOTE_STATUSES.includes(data.status)) findings.push(finding('invalid-note', `${relative} status ${data.status} is invalid`, { note: relative }));
    if (data.sensitivity !== undefined && !SENSITIVITIES.includes(data.sensitivity)) findings.push(finding('invalid-note', `${relative} sensitivity ${data.sensitivity} is invalid`, { note: relative }));
    if (data.knowledge_role !== undefined && !KNOWLEDGE_ROLES.includes(data.knowledge_role)) findings.push(finding('invalid-note', `${relative} knowledge_role ${data.knowledge_role} is invalid`, { note: relative }));
    if (data.last_verified !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(String(data.last_verified))) findings.push(finding('invalid-note', `${relative} last_verified must be YYYY-MM-DD`, { note: relative }));
    const sources = Array.isArray(data.source_paths) ? data.source_paths : [];
    for (const source of sources) {
      if (path.isAbsolute(source) || /^[A-Za-z]:[\\/]/.test(source) || source.split('/').includes('..')) {
        findings.push(finding('invalid-note', `${relative} source path ${source} must be repository-relative`, { note: relative }));
      }
    }
    if (LIVE_STATE_MARKERS.some((marker) => marker.test(content))) {
      findings.push(finding('copied-task-state', `${relative} copies live task state; link to the owner instead`, { note: relative }));
    }
    const hits = scanPrivacy(content).filter((hit) => hit.label !== 'email address' || data.sensitivity === 'normal');
    if (hits.length > 0) {
      findings.push(finding('secret-like-content', `${relative} contains ${hits.map((hit) => `${hit.label} at line ${hit.line}`).join(', ')}`, { note: relative }));
    }
    if (data.status === 'stale') findings.push(finding('stale-note', `${relative} is marked stale`, { note: relative }));
    if (file.startsWith(designConcepts + path.sep) && basename !== 'README') {
      if (data.type !== 'design-concept') findings.push(finding('invalid-note', `${relative} must declare type design-concept`, { note: relative }));
      if (!data.authorized_by) findings.push(finding('invalid-note', `${relative} must record authorized_by (the owner directs creation)`, { note: relative }));
      if (data.parent === undefined) findings.push(finding('invalid-note', `${relative} must declare parent (a route or none)`, { note: relative }));
      for (const section of ['Evidence and Sources', 'History']) {
        if (!new RegExp(`^## ${section}$`, 'm').test(content)) findings.push(finding('invalid-note', `${relative} must end with a ${section} section`, { note: relative }));
      }
    }
  }
  for (const [basename, paths] of basenames) {
    if (paths.length > 1 && basename !== 'README') findings.push(finding('invalid-note', `note basename ${basename} is not unique: ${paths.join(', ')}`));
  }
  return findings;
}

// Bring existing notes into shape without editing a body. Every inserted value
// is the least-claiming one the schema allows: `status: partial` says the note
// was completed mechanically rather than verified, `knowledge_role: derived`
// never outranks its inputs, and `last_verified` records the day normalize ran,
// not a fact anyone checked. `type` is inferred from where the note actually
// lives. A note in `archive/` is historical and is left alone, exactly as the
// validator leaves it alone. An owner-directed design-concept article still
// needs its `authorized_by`, `parent`, and sections; normalize adds none of
// them and `validate` keeps reporting them.
export function normalizeWiki(root, options = {}) {
  const date = options.date ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('--date must be YYYY-MM-DD');
  const wikiRoot = lanePath(root, 'wiki');
  if (!fs.existsSync(wikiRoot)) return { changed: [] };
  const archive = path.join(root, collectionRelative(root, 'archive'));
  const changed = [];
  for (const file of walkMarkdown(wikiRoot)) {
    if (file.startsWith(archive + path.sep)) continue;
    const relative = path.relative(root, file).split(path.sep).join('/');
    const content = fs.readFileSync(file, 'utf8');
    const result = insertFrontmatterKeys(content, noteFields(root, file, relative, date), relative);
    if (result.inserted.length === 0) continue;
    writeSafeFile(root, file, result.content);
    changed.push({ note: relative, inserted: result.inserted });
  }
  return { changed };
}

function noteFields(root, file, relative, date) {
  return [
    ['type', [`type: ${inferredType(root, file)}`]],
    ['status', ['status: partial']],
    ['sensitivity', ['sensitivity: normal']],
    ['knowledge_role', ['knowledge_role: derived']],
    ['provenance', ['provenance:', `  - required properties completed by LLM Workbench wiki normalize ${date}`]],
    ['source_paths', ['source_paths:', `  - ${relative}`]],
    ['last_verified', [`last_verified: ${date}`]]
  ];
}

function inferredType(root, file) {
  if (path.basename(file) === 'MEMORY.md') return 'memory';
  for (const [collection, type] of [['guidebooks', 'guidebook'], ['design-concepts', 'design-concept']]) {
    if (file.startsWith(path.join(root, collectionRelative(root, collection)) + path.sep)) return type;
  }
  return 'meta';
}

if (isMainModule(import.meta.url)) {
  try {
    const [command, ...rest] = process.argv.slice(2);
    const json = rest.includes('--json');
    const pathIndex = rest.indexOf('--path');
    const root = findRoot(pathIndex >= 0 ? rest[pathIndex + 1] : process.cwd());
    const dateIndex = rest.indexOf('--date');
    if (!['validate', 'normalize'].includes(command)) throw new Error('Usage: wiki.mjs validate [--path PROJECT] [--json] | normalize [--path PROJECT] [--date YYYY-MM-DD] [--json] (validate also reports the installed-state findings stale-seed and unverified-provenance, which workbench-layout.mjs repairs; see RUNBOOK.md)');
    if (command === 'normalize') {
      const result = normalizeWiki(root, { date: dateIndex >= 0 ? rest[dateIndex + 1] : undefined });
      console.log(json ? JSON.stringify(result, null, 2) : (result.changed.length ? result.changed.map((entry) => `${entry.note}: inserted ${entry.inserted.join(', ')}`).join('\n') : 'ok - every note already carries its required properties'));
    } else {
      const findings = validateWiki(root);
      console.log(json ? JSON.stringify(findings, null, 2) : (findings.length ? findings.map((item) => `${item.code} [${item.severity}]: ${item.message}`).join('\n') : 'ok - wiki validated'));
      if (findings.some((item) => item.severity === 'error')) process.exitCode = 1;
    }
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}
