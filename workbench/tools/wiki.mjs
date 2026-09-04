#!/usr/bin/env node
// Portable wiki validator: router, declared collections, note metadata,
// portability, the Design Concept article shape, no copied live task state,
// no secret-like material. Staleness is attention, never blocking.
import fs from 'node:fs';
import path from 'node:path';
import { finding } from './diagnostics.mjs';
import { collectionRelative, findRoot, isMainModule, lanePath, laneRelative, readManifest, WIKI_PROFILES } from './workbench-paths.mjs';
import { parseFrontmatter } from './adr.mjs';
import { scanPrivacy } from './privacy.mjs';

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

if (isMainModule(import.meta.url)) {
  try {
    const [command, ...rest] = process.argv.slice(2);
    const json = rest.includes('--json');
    const pathIndex = rest.indexOf('--path');
    const root = findRoot(pathIndex >= 0 ? rest[pathIndex + 1] : process.cwd());
    if (command !== 'validate') throw new Error('Usage: wiki.mjs validate [--path PROJECT] [--json]');
    const findings = validateWiki(root);
    console.log(json ? JSON.stringify(findings, null, 2) : (findings.length ? findings.map((item) => `${item.code} [${item.severity}]: ${item.message}`).join('\n') : 'ok - wiki validated'));
    if (findings.some((item) => item.severity === 'error')) process.exitCode = 1;
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}
