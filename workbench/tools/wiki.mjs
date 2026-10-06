#!/usr/bin/env node
// Portable wiki validator: router, declared collections, note metadata,
// portability, the Design Concept and features article shapes, no copied live task state,
// no secret-like material, a one-line summary beside each routed page. Staleness and
// a missing summary are attention, never blocking.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { finding } from './diagnostics.mjs';
import { assertSafeReadPath, assertSafeWritePath, collectionRelative, findRoot, isMainModule, lanePath, laneRelative, liveRecordPath, markdownLinkTargets, readManifest, writeSafeFile, WIKI_PROFILES } from './workbench-paths.mjs';
import { collectRecordReferenceFiles, insertFrontmatterKeys, localLinks, parseFrontmatter, planReferenceRewrite } from './adr.mjs';
import { scanPrivacy } from './privacy.mjs';
import { versionStamp, wikiContractFiles } from './workbench-layout.mjs';

export const NOTE_TYPES = Object.freeze(['memory', 'project', 'person', 'machine', 'guidebook', 'design-concept', 'feature', 'meta']);
// S-00I TK-01U: a features article is the readable knowledge a completed Spec
// is captured into at its closure point. It lives only in the additive
// `features` collection, which is not required to exist (earlier rooms never
// declared it), and it must state what the capability does, why it matters,
// its limits and its evidence.
export const FEATURE_SECTIONS = Object.freeze(['What It Does', 'Why It Matters', 'Limits', 'Evidence and Sources']);
export const NOTE_STATUSES = Object.freeze(['active', 'partial', 'stale', 'archived']);
// S-002L TK-006M: the draft skills wiki. It is the Wiki's second nesting
// exception beside `archive/`: `skills-draft/<group>/<skill>.md`, one folder per
// group. It is a repo-only prototype, so it is named here and in SCHEMA.md and
// is not a declared manifest collection (the closed registry in
// `workbench-paths.mjs` stays untouched). `draft` is a status only a note inside
// it may carry; promotion moves a draft out and gives it an ordinary status.
export const DRAFT_COLLECTION = 'skills-draft';
export const DRAFT_GROUPS = Object.freeze(['getting-started', 'main-workflow', 'shaping', 'upkeep', 'primitives', 'productivity', 'stances', 'foundry']);
export const DRAFT_STATUS = 'draft';
// The owner-approved article template (S-002L TK-006N): eight reader sections,
// then the draft-only marker and three draft-only sections. Every finding is one
// greppable line, `F:<skill>:NN | kind | one line | who fixes it`.
export const DRAFT_READER_SECTIONS = Object.freeze(['What it does', 'When to reach for it', 'What it needs', 'What it reads and writes', 'How it works', 'Common questions', 'It\'s working if', 'Where it fits']);
export const DRAFT_ONLY_SECTIONS = Object.freeze(['Compared with Matt\'s', 'Findings', 'Sources and history']);
export const DRAFT_ONLY_MARKER = '--- draft only, stripped on promotion ---';
export const FINDING_KINDS = Object.freeze(['dangling', 'stale-name', 'overlap', 'gap', 'conflict', 'missing-skill']);
const DRAFT_ORIGINS = Object.freeze(['workbench', 'matt', 'foundry', 'other']);
const DRAFT_SKILL_SOURCES = Object.freeze(['core', 'pending', 'personal', 'new']);
// The collection's own files, directly under its root: the index and the template.
const DRAFT_ROOT_FILES = Object.freeze(['README', 'TEMPLATE']);
export const SENSITIVITIES = Object.freeze(['normal', 'private', 'restricted']);
export const KNOWLEDGE_ROLES = Object.freeze(['canonical', 'curated', 'derived', 'historical']);
export const REQUIRED_PROPERTIES = Object.freeze(['type', 'status', 'sensitivity', 'knowledge_role', 'provenance', 'source_paths', 'last_verified']);
const REQUIRED_COLLECTIONS = Object.freeze(['design-concepts', 'guidebooks', 'archive']);
// S-00I TK-005: a slice-table row (first cell a bare Task id) is not the
// only shape "copied live task state" takes. SCHEMA.md's Update section
// already forbids copying "live task rows, spec evidence, or generated
// Taskboard state" into a note; a Spec's own Append-Only Evidence And
// Execution Log row - first cell a date, second cell a Task id or the
// literal `spec`/`review` (closeTask/completeSpec/recordReviewVerdict's own
// vocabulary in spec-workbench.mjs/spec-report.mjs) - is copied spec
// evidence, the exact class SCHEMA.md already names, so a reconciliation
// that pastes it must fail the same check a copied slice table already
// does rather than passing silently.
const LIVE_STATE_MARKERS = [/<!--\s*hot-specs:start\s*-->/, /<!--\s*spec-catalog:start\s*-->/, /^\|\s*TK-[0-9A-Za-z]+\s*\|.*\|\s*(?:ready|in-progress|blocked|done|deferred)\s*\|/m, /^\|\s*\d{4}-\d{2}-\d{2}\s*\|\s*(?:TK-[0-9A-Za-z]+|spec|review)\s*\|/m];

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

// A draft article sits directly inside one group folder, is called by its skill,
// names that skill and group, and carries the scoped `draft` status. The
// collection's own index and template sit at its root and are ordinary notes.
function draftArticleFindings(relative, segments, data, body) {
  const problem = (message) => finding('invalid-note', `${relative} ${message}`, { note: relative });
  const basename = path.basename(segments[segments.length - 1], '.md');
  if (segments.length === 1) {
    return DRAFT_ROOT_FILES.includes(basename) ? [] : [problem(`must sit directly inside a group folder (${DRAFT_GROUPS.join(', ')}); only README.md and TEMPLATE.md sit at the collection root`)];
  }
  if (segments.length > 2) return [problem('must sit directly inside a group folder, not nested below it')];
  const findings = [];
  const [group] = segments;
  if (!DRAFT_GROUPS.includes(group)) findings.push(problem(`folder ${group} is not one of the group folders (${DRAFT_GROUPS.join(', ')})`));
  else if (data.group === undefined) findings.push(problem(`must declare group ${group}, the folder it sits in`));
  else if (data.group !== group) findings.push(problem(`group ${data.group} does not match its folder ${group}`));
  if (data.status !== undefined && data.status !== DRAFT_STATUS) findings.push(problem(`must declare status ${DRAFT_STATUS}; it lives in the draft collection`));
  if (data.skill === undefined) findings.push(problem(`must declare skill ${basename}, the skill its file is called`));
  else if (data.skill !== basename) findings.push(problem(`skill ${data.skill} does not match its file name ${basename}`));
  if (data.origin !== undefined && !DRAFT_ORIGINS.includes(data.origin)) findings.push(problem(`origin ${data.origin} is not one of ${DRAFT_ORIGINS.join(', ')}; write the bare value with no trailing comment`));
  if (data.skill_source !== undefined && !DRAFT_SKILL_SOURCES.includes(data.skill_source)) findings.push(problem(`skill_source ${data.skill_source} is not one of ${DRAFT_SKILL_SOURCES.join(', ')}; write the bare value with no trailing comment`));
  findings.push(...draftBodyFindings(relative, body, basename));
  return findings;
}

// The template's sections must all be present, and the Findings section holds
// only finding lines (plus `none` and single-line comments), so a later roll-up
// can grep every connection problem with `^F:`.
function draftBodyFindings(relative, body, skill) {
  const problem = (message) => finding('invalid-note', `${relative} ${message}`, { note: relative });
  const findings = [];
  for (const section of [...DRAFT_READER_SECTIONS, ...DRAFT_ONLY_SECTIONS]) {
    if (!new RegExp(`^## ${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm').test(body)) findings.push(problem(`must carry a "${section}" section`));
  }
  if (!body.split('\n').some((line) => line.trim() === DRAFT_ONLY_MARKER)) findings.push(problem(`must carry the draft-only marker line ${DRAFT_ONLY_MARKER}`));
  const start = body.search(/^## Findings$/m);
  if (start < 0) return findings;
  const rest = body.slice(start).split('\n').slice(1);
  const end = rest.findIndex((line) => /^## /.test(line));
  const seen = new Set();
  for (const raw of end < 0 ? rest : rest.slice(0, end)) {
    const line = raw.trim();
    if (line === '' || line === 'none' || /^<!--.*-->$/.test(line)) continue;
    const parts = line.split(' | ');
    const head = parts[0].match(/^F:([a-z0-9][a-z0-9-]*):(\d{2})$/);
    if (parts.length !== 4 || !head || parts.some((part) => part.trim() === '')) {
      findings.push(problem(`has a malformed finding line "${line.slice(0, 60)}"; write F:<skill>:NN | kind | one line | who fixes it, one finding per line`));
      continue;
    }
    if (!FINDING_KINDS.includes(parts[1])) findings.push(problem(`finding kind ${parts[1]} is not one of ${FINDING_KINDS.join(', ')}`));
    if (head[1] !== skill) findings.push(problem(`finding names skill ${head[1]}, not ${skill}`));
    if (seen.has(head[2])) findings.push(problem(`finding number ${head[2]} is used twice`));
    seen.add(head[2]);
  }
  return findings;
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

// S-003W TK-002: the router is the Wiki's overview, so every Wiki page it routes
// carries a one-line summary beside its link and a reader can choose a page
// without opening it. The rule is mechanical and conservative. A routed page is
// a Markdown link whose target resolves to a Markdown file inside the Wiki lane
// other than the router itself; a link to a control, Spec or record outside the
// Wiki, an external link, a folder, a wikilink and anything in a code span or
// fence is not checked. The link has a summary when the text right after it,
// up to the next link or the end of its list item, paragraph or table cell,
// is a separator (` - `, an en or em dash, or a colon) followed by at least two
// words, or when its table row has another cell that holds text of its own.
// The finding is attention only: a missing summary never blocks.
const SUMMARY_LINK = /(!?)\[([^\]\n]+)\]\(\s*(?:<([^>\n]+)>|([^\s)]+))[^)\n]*\)/g;
const SUMMARY_SEPARATOR = /^(?:\s*:\s+|\s+[-–—]\s+)(\S[\s\S]*)$/;

function maskCode(content) {
  const lines = content.split(/\r?\n/);
  let fence = null;
  return lines.map((line) => {
    const opener = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fence) {
      if (opener && opener[1][0] === fence[0] && opener[1].length >= fence.length) fence = null;
      return '';
    }
    if (opener) { fence = opener[1]; return ''; }
    return line.replace(/(`+)[^`]*?\1/g, 'code');
  });
}

function summaryUnits(lines) {
  const units = [];
  let current = null;
  const flush = () => { if (current) units.push(current); current = null; };
  lines.forEach((line, index) => {
    if (!line.trim()) return flush();
    const start = /^\s*(?:[-*+]|\d+[.)])\s/.test(line) || /^\s*\|/.test(line) || /^\s{0,3}#{1,6}\s/.test(line);
    if (start || !current) { flush(); current = { text: line.trim(), line: index + 1 }; }
    else current.text += ` ${line.trim()}`;
    if (/^\s*\|/.test(line) || /^\s{0,3}#{1,6}\s/.test(line)) flush();
  });
  flush();
  return units;
}

function wordCount(text) {
  return text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

function hasSummaryAfter(text) {
  const match = SUMMARY_SEPARATOR.exec(text.replace(/\s+/g, ' '));
  return match !== null && wordCount(match[1]) >= 2;
}

export function routerSummaryFindings(root, wikiRoot, routerFile, content) {
  const findings = [];
  const note = path.relative(root, routerFile).split(path.sep).join('/');
  for (const unit of summaryUnits(maskCode(content))) {
    const table = /^\s*\|/.test(unit.text);
    const cells = table ? unit.text.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split(/(?<!\\)\|/) : [unit.text];
    cells.forEach((cell, cellIndex) => {
      for (const link of cell.matchAll(SUMMARY_LINK)) {
        if (link[1] === '!') continue;
        const raw = (link[3] ?? link[4]).split('#')[0];
        if (!raw || /^(?:[a-z][a-z0-9+.-]*:)/i.test(raw)) continue;
        let decoded = raw;
        try { decoded = decodeURIComponent(raw); } catch { decoded = raw; }
        const resolved = path.resolve(wikiRoot, decoded);
        const inWiki = path.relative(wikiRoot, resolved);
        if (!inWiki || inWiki.startsWith('..') || path.isAbsolute(inWiki) || !resolved.endsWith('.md') || resolved === routerFile) continue;
        const rest = cell.slice(link.index + link[0].length);
        const next = rest.search(/!?\[[^\]\n]+\]\(/);
        if (hasSummaryAfter(next === -1 ? rest : rest.slice(0, next))) continue;
        if (table && cells.some((other, index) => index !== cellIndex && wordCount(other.replace(SUMMARY_LINK, '')) >= 1)) continue;
        const target = path.relative(root, resolved).split(path.sep).join('/');
        findings.push(finding('unsummarized-route', `${note} line ${unit.line} routes [${link[2]}](${raw}) with no one-line summary beside the link; write "- [Title](path) - summary" (a separator, then at least two words) or give a table row a second cell that says what the page is for`, { note, target, line: unit.line }));
      }
    });
  }
  return findings;
}

export function validateWiki(root, options = {}) {
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
  else {
    findings.push(...roomBrainRouting(root, wikiRelative));
    const routerFile = path.join(wikiRoot, 'MEMORY.md');
    findings.push(...routerSummaryFindings(root, wikiRoot, routerFile, options.contentOverrides?.get(routerFile) ?? fs.readFileSync(routerFile, 'utf8')));
  }
  findings.push(...wikiStamps(root, wikiRoot, wikiRelative, manifest?.workbenchVersion));
  // S-045 TK-002 moved two checks out of here: `stale-seed`, the generation of
  // a room's seeded lane documents, and `unverified-provenance`, the source
  // identity its manifest records. Neither is a wiki fact - unlike
  // invalid-wiki-profile and missing-collection above, which are wiki-domain
  // facts that happen to be stored in the manifest - so `wiki.mjs validate`
  // reported a feedback-lane fact and a manifest fact to anyone checking the
  // wiki. S-042 recorded the placement as interim: doctor wired exactly two
  // support-root validators, and `spec-workbench.mjs` was held by a sibling
  // branch, so the non-overlapping file lanes rule kept that task out of it.
  // They are now emitted from `collectionFindings` in `spec-workbench.mjs`,
  // next to the managed-runtime check, whose scope is the room's installed
  // state. The checks themselves still live in `workbench-layout.mjs`, which
  // owns seeding and provenance. One consequence of the move, deliberate:
  // running here meant running only when a room had a wiki lane, and running
  // there means running for every schema 2 room. Both codes are registered
  // `none`, so nothing new blocks - but a wiki-less room now sees two findings
  // it did not see before, which is the correct scope rather than a regression.
  for (const name of REQUIRED_COLLECTIONS) {
    const relative = collectionRelative(root, name);
    const entry = fs.existsSync(path.join(root, relative)) ? fs.lstatSync(path.join(root, relative)) : null;
    if (!entry || entry.isSymbolicLink() || !entry.isDirectory()) {
      findings.push(finding('missing-collection', `${relative} must be an ordinary directory (it may be empty)`));
    }
  }
  if (!fs.existsSync(wikiRoot)) return findings;
  const designConcepts = path.join(root, collectionRelative(root, 'design-concepts'));
  const featuresRelative = collectionRelative(root, 'features');
  const features = path.join(root, featuresRelative);
  const archive = path.join(root, collectionRelative(root, 'archive'));
  const draftRoot = path.join(wikiRoot, DRAFT_COLLECTION);
  const draftRelative = `${wikiRelative}/${DRAFT_COLLECTION}`;
  const basenames = new Map();
  for (const file of walkMarkdown(wikiRoot)) {
    const relative = path.relative(root, file).split(path.sep).join('/');
    const content = options.contentOverrides?.get(file) ?? fs.readFileSync(file, 'utf8');
    const inArchive = file.startsWith(archive + path.sep);
    const basename = path.basename(file, '.md');
    basenames.set(basename, [...(basenames.get(basename) ?? []), relative]);
    if (inArchive) continue;
    const { data, body } = parseFrontmatter(content);
    if (!data) {
      findings.push(finding('invalid-note', `${relative} has no frontmatter`, { note: relative }));
      continue;
    }
    for (const property of REQUIRED_PROPERTIES) {
      if (data[property] === undefined) findings.push(finding('invalid-note', `${relative} is missing ${property}`, { note: relative }));
    }
    if (data.authority !== undefined) findings.push(finding('invalid-note', `${relative} uses retired property authority; use knowledge_role for handling and provenance for attribution`, { note: relative }));
    if (data.type !== undefined && !NOTE_TYPES.includes(data.type)) findings.push(finding('invalid-note', `${relative} type ${data.type} is not one of ${NOTE_TYPES.join(', ')}`, { note: relative }));
    const inDrafts = file.startsWith(draftRoot + path.sep);
    if (data.status === DRAFT_STATUS) {
      if (!inDrafts) findings.push(finding('invalid-note', `${relative} status ${DRAFT_STATUS} belongs in ${draftRelative}; promote the draft out of the collection and give it an ordinary status`, { note: relative }));
    } else if (data.status !== undefined && !NOTE_STATUSES.includes(data.status)) findings.push(finding('invalid-note', `${relative} status ${data.status} is invalid`, { note: relative }));
    if (data.sensitivity !== undefined && !SENSITIVITIES.includes(data.sensitivity)) findings.push(finding('invalid-note', `${relative} sensitivity ${data.sensitivity} is invalid`, { note: relative }));
    if (data.knowledge_role !== undefined && !KNOWLEDGE_ROLES.includes(data.knowledge_role)) findings.push(finding('invalid-note', `${relative} knowledge_role ${data.knowledge_role} is invalid`, { note: relative }));
    if (data.last_verified !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(String(data.last_verified))) findings.push(finding('invalid-note', `${relative} last_verified must be YYYY-MM-DD`, { note: relative }));
    const sources = Array.isArray(data.source_paths) ? data.source_paths : [];
    for (const source of sources) {
      if (path.isAbsolute(source) || /^[A-Za-z]:[\\/]/.test(source) || source.split('/').includes('..')) {
        findings.push(finding('invalid-note', `${relative} source path ${source} must be repository-relative`, { note: relative }));
      }
    }
    // S-00V TK-00J: a live record is working context even when committed, so
    // neither a source path nor a body link may name one as provenance.
    const liveTargets = new Set();
    for (const source of sources) {
      const live = typeof source === 'string' ? liveRecordPath(root, source) : null;
      if (live) liveTargets.add(live);
    }
    for (const link of markdownLinkTargets(content)) {
      const live = liveRecordPath(root, path.resolve(path.dirname(file), link));
      if (live) liveTargets.add(live);
    }
    for (const target of liveTargets) {
      findings.push(finding('untracked-provenance', `${relative} cites live record ${target}; a notepad or handoff is working context even when committed, so cite the durable owner it was promoted into`, { note: relative, target }));
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
      if (!data.authorized_by) findings.push(finding('invalid-note', `${relative} must record authorized_by (the operation that authorized this article)`, { note: relative }));
      if (data.parent === undefined) findings.push(finding('invalid-note', `${relative} must declare parent (a route or none)`, { note: relative }));
      for (const section of ['Evidence and Sources', 'History']) {
        if (!new RegExp(`^## ${section}$`, 'm').test(content)) findings.push(finding('invalid-note', `${relative} must end with a ${section} section`, { note: relative }));
      }
    }
    if (inDrafts) findings.push(...draftArticleFindings(relative, path.relative(draftRoot, file).split(path.sep), data, body));
    const inFeatures = file.startsWith(features + path.sep);
    if (inFeatures && basename !== 'README') {
      if (data.type !== 'feature') findings.push(finding('invalid-note', `${relative} must declare type feature; it lives in the features collection ${featuresRelative}`, { note: relative }));
      for (const section of FEATURE_SECTIONS) {
        if (!new RegExp(`^## ${section}$`, 'm').test(content)) findings.push(finding('invalid-note', `${relative} must carry a ${section} section`, { note: relative }));
      }
    } else if (!inFeatures && data.type === 'feature') {
      findings.push(finding('invalid-note', `${relative} type feature belongs in ${featuresRelative}; move the article into the features collection`, { note: relative }));
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
// validator leaves it alone. A design-concept article still
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
  if (file.startsWith(path.join(lanePath(root, 'wiki'), DRAFT_COLLECTION) + path.sep)) return 'memory';
  for (const [collection, type] of [['guidebooks', 'guidebook'], ['design-concepts', 'design-concept'], ['features', 'feature']]) {
    if (file.startsWith(path.join(root, collectionRelative(root, collection)) + path.sep)) return type;
  }
  return 'meta';
}

// S-003W TK-001: the link-safe move of one Wiki note. A note moves to another
// declared collection, may be renamed and may be retyped in the same step, and
// every live Markdown link to it is rewritten so nothing dangles: the root
// controls, the Wiki, the skills lane, decision records, every Spec and Task
// record, and the landmark records and question cards. References inside a
// Spec's append-only evidence are history and stay as written; they are
// counted. The whole move is planned and checked before the first write, so a
// refusal changes nothing. `move-spec` and `move-task` do the same for their
// records; this is the Wiki's counterpart, built on the same link rewriter.
const COLLECTION_TYPES = Object.freeze({
  'design-concepts': ['design-concept'],
  features: ['feature'],
  guidebooks: ['guidebook'],
  archive: null
});

function noteBasenameError(name) {
  return /^[^/\\\0.][^/\\\0]*$/.test(name) && !/\.md$/i.test(name) ? null : 'name must be a plain note name (no path separators, no leading dot, no .md suffix)';
}

function setFrontmatterType(content, type) {
  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  const lines = content.split(eol);
  const close = lines.indexOf('---', 1);
  const index = lines.slice(1, close).findIndex((line) => /^type:/.test(line)) + 1;
  if (lines[0] !== '---' || close === -1 || index === 0) throw new Error('the note has no type property to retype');
  lines[index] = `type: ${type}`;
  return lines.join(eol);
}

function moveNoteReferenceFiles(root) {
  const files = new Set(collectRecordReferenceFiles(root));
  const walk = (directory, accept) => {
    if (!fs.existsSync(directory)) return;
    assertSafeReadPath(root, directory);
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.isSymbolicLink()) continue;
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full, accept);
      else if (entry.isFile() && accept(entry.name)) files.add(full);
    }
  };
  walk(lanePath(root, 'specs'), (name) => name.endsWith('.md'));
  // TRACKER.json is a generated projection of the cards; the cards are the source.
  walk(path.join(root, 'workbench', 'landmark-tracker'), (name) => (name.endsWith('.md') || name.endsWith('.json')) && name !== 'TRACKER.json');
  return [...files].sort();
}

export function moveNote(root, options = {}) {
  const { note, to, name, retype, dryRun = false } = options;
  if (typeof note !== 'string' || !note || typeof to !== 'string' || !to) throw new Error('move-note needs a note path and a destination collection');
  const wikiRoot = lanePath(root, 'wiki');
  const source = path.resolve(root, note);
  const relative = (file) => path.relative(root, file).split(path.sep).join('/');
  const inWiki = path.relative(wikiRoot, source);
  if (!inWiki || inWiki.startsWith('..') || path.isAbsolute(inWiki)) throw new Error(`${note} must be inside the wiki lane ${laneRelative(root, 'wiki')}`);
  assertSafeReadPath(root, source);
  if (!fs.existsSync(source) || !fs.lstatSync(source).isFile()) throw new Error(`${note} does not exist`);
  if (!source.endsWith('.md')) throw new Error(`${note} is not a Markdown note`);
  const wikiRelativePath = inWiki.split(path.sep).join('/');
  if (wikiRelativePath === 'MEMORY.md' || wikiContractFiles.includes(wikiRelativePath) || path.basename(source) === 'README.md') {
    throw new Error(`${note} is a router or contract file; router and contract files do not move`);
  }
  const content = fs.readFileSync(source, 'utf8');
  const { data } = parseFrontmatter(content);
  if (!data) throw new Error(`${note} has no frontmatter`);
  const type = retype ?? data.type;
  if (type === undefined) throw new Error(`${note} declares no type; name one with --retype`);
  if (!NOTE_TYPES.includes(type)) throw new Error(`type ${type} is not one of ${NOTE_TYPES.join(', ')}`);
  if (!Object.hasOwn(COLLECTION_TYPES, to)) throw new Error(`unknown destination collection ${to}; use one of ${Object.keys(COLLECTION_TYPES).join(', ')}`);
  const accepted = COLLECTION_TYPES[to];
  if (accepted && !accepted.includes(type)) throw new Error(`${to} does not accept type ${type}; it holds ${accepted.join(', ')} notes (use --retype to change the type in the same move)`);
  const oldBase = path.basename(source, '.md');
  const newBase = name === undefined ? oldBase : String(name);
  const nameError = name === undefined ? null : noteBasenameError(newBase);
  if (nameError) throw new Error(nameError);
  const destinationDir = path.join(root, collectionRelative(root, to));
  const destination = path.join(destinationDir, `${newBase}.md`);
  if (destination === source) throw new Error(`${note} already lives in ${to} under that name; nothing to move`);
  if (fs.existsSync(destination)) throw new Error(`${relative(destination)} already exists`);
  const wikiFiles = walkMarkdown(wikiRoot).filter((file) => file !== source);
  const clash = wikiFiles.filter((file) => path.basename(file, '.md') === newBase);
  if (clash.length > 0) throw new Error(`note basename ${newBase} is not unique: ${clash.map(relative).join(', ')}; basenames are unique across the wiki`);
  if (newBase !== oldBase) {
    const wikilink = new RegExp(`\\[\\[\\s*${oldBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(?:[|#\\]])`);
    const orphans = wikiFiles.filter((file) => wikilink.test(fs.readFileSync(file, 'utf8')));
    if (orphans.length > 0) throw new Error(`renaming ${oldBase} would orphan a wikilink in ${orphans.map(relative).join(', ')}; repair the wikilink first or keep the name`);
  }

  // Plan every byte before the first write.
  const totals = { referencesRewritten: {}, historicalReferencesLeft: {} };
  const writes = new Map();
  const retyped = type !== data.type;
  let moved = retyped ? setFrontmatterType(content, type) : content;
  // The moved note's own outgoing links are recomputed for its new directory,
  // but only those whose text no longer resolves to the same target from
  // there: a link that still resolves is left exactly as its author wrote it.
  // Each such target maps to itself so the rewriter recomputes the route, and
  // the note's own path maps to its destination.
  const outgoing = new Map([[source, destination]]);
  const directoryTargets = new Set();
  const oldDir = path.dirname(source);
  for (const target of markdownLinkTargets(moved)) {
    const absolute = path.resolve(oldDir, target);
    if (path.resolve(destinationDir, target) !== absolute && !outgoing.has(absolute)) outgoing.set(absolute, absolute);
    if (fs.existsSync(absolute) && fs.statSync(absolute).isDirectory()) directoryTargets.add(absolute);
  }
  moved = planReferenceRewrite(root, destination, moved, oldDir, destinationDir, outgoing, totals, { directoryTargets }) ?? moved;
  writes.set(destination, moved);
  const incoming = new Map([[source, destination]]);
  for (const file of moveNoteReferenceFiles(root)) {
    if (file === source) continue;
    const original = fs.readFileSync(file, 'utf8');
    const rewritten = planReferenceRewrite(root, file, original, path.dirname(file), path.dirname(file), incoming, totals);
    if (rewritten !== null) writes.set(file, rewritten);
  }
  assertSafeWritePath(root, destination);
  for (const file of writes.keys()) if (file !== destination) assertSafeWritePath(root, file);

  const tracked = spawnSync('git', ['-C', root, 'ls-files', '--error-unmatch', '--', relative(source)], { encoding: 'utf8' }).status === 0;
  const report = { from: relative(source), to: relative(destination), type, retyped, dryRun, usesGit: tracked, referencesRewritten: totals.referencesRewritten, historicalReferencesLeft: totals.historicalReferencesLeft };
  if (dryRun) return report;
  fs.mkdirSync(destinationDir, { recursive: true });
  if (tracked) {
    const result = spawnSync('git', ['-C', root, 'mv', relative(source), relative(destination)], { encoding: 'utf8' });
    if (result.status !== 0) throw new Error(`git mv failed for ${relative(source)}: ${(result.stderr || result.stdout || '').trim()}`);
  } else {
    fs.renameSync(source, destination);
  }
  for (const [file, text] of writes) writeSafeFile(root, file, text);
  // Stage exactly what this move changed so the candidate reads as one rename
  // with its link repairs; unrelated work is never swept in.
  if (tracked) spawnSync('git', ['-C', root, 'add', '--', ...[...writes.keys()].map(relative)], { encoding: 'utf8' });
  return report;
}

if (isMainModule(import.meta.url)) {
  try {
    const [command, ...rest] = process.argv.slice(2);
    const json = rest.includes('--json');
    const pathIndex = rest.indexOf('--path');
    const root = findRoot(pathIndex >= 0 ? rest[pathIndex + 1] : process.cwd());
    const dateIndex = rest.indexOf('--date');
    if (!['validate', 'normalize', 'move-note'].includes(command)) throw new Error('Usage: wiki.mjs validate [--path PROJECT] [--json] | normalize [--path PROJECT] [--date YYYY-MM-DD] [--json] | move-note NOTE --to COLLECTION [--name BASENAME] [--retype TYPE] [--dry-run] [--path PROJECT] [--json] (validate reports wiki facts only; the installed-state findings stale-seed and unverified-provenance come from doctor and are repaired with workbench-layout.mjs; see RUNBOOK.md)');
    if (command === 'move-note') {
      const valueOf = (flag) => { const index = rest.indexOf(flag); return index >= 0 ? rest[index + 1] : undefined; };
      const flagValues = new Set(['--to', '--name', '--retype', '--path'].map((flag) => rest.indexOf(flag) + 1).filter((index) => index > 0));
      const positional = rest.filter((item, index) => !item.startsWith('--') && !flagValues.has(index));
      if (positional.length !== 1 || !valueOf('--to')) throw new Error('Usage: wiki.mjs move-note NOTE --to COLLECTION [--name BASENAME] [--retype TYPE] [--dry-run] [--path PROJECT] [--json]');
      const result = moveNote(root, { note: positional[0], to: valueOf('--to'), name: valueOf('--name'), retype: valueOf('--retype'), dryRun: rest.includes('--dry-run') });
      const counts = (record) => Object.values(record).reduce((sum, count) => sum + count, 0);
      console.log(json ? JSON.stringify(result, null, 2) : `${result.dryRun ? 'would move' : 'moved'} ${result.from} -> ${result.to} (type ${result.type}); ${counts(result.referencesRewritten)} live link(s) rewritten in ${Object.keys(result.referencesRewritten).length} file(s); ${counts(result.historicalReferencesLeft)} historical reference(s) left as written`);
    } else if (command === 'normalize') {
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
