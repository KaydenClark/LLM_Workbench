#!/usr/bin/env node
// Manifest schema 2 layout: six lanes, additive collections, untracked-by-default
// session records, and the Genesis readiness gate. A schema 1 manifest is
// reported as `upgrade-required` and migrated once, losslessly.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { finding } from './diagnostics.mjs';
import { parseSpecPacket } from './spec-packet.mjs';
import { allocateWorkbenchId, isWorkbenchId } from './visible-ids.mjs';
import { templatePlaceholders } from './template-placeholders.mjs';
import { ADDITIVE_COLLECTIONS, COLLECTIONS, LANES, PRE_DDR_COLLECTIONS, PRE_FEATURE_COLLECTIONS, PRE_LANDMARK_COLLECTIONS, SIX_LANES, SCHEMA_VERSION, IGNORED_COLLECTIONS, WIKI_PROFILES, collectionRelative, declaredGit, laneRelative, assertSafeReadPath, assertSafeWritePath, writeSafeFile, isBranchName, isMainModule, isSafeRelative, trackerDeclaration } from './workbench-paths.mjs';

// Exported (not just used locally) so a test can build the exact historical
// v3.0.0-v3.2.0 fixture rows from this frozen array directly, rather than
// slicing the live `coreSkills` and assuming its first twelve names never
// diverge from this one - an assumption S-00H TK-004's rename broke once.
export const legacyCoreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tickets', 'tracer-bullet', 'update-harness'
];
const stanceSkills = ['builder', 'auditor', 'reviewer', 'reconciler'];
// `carry` and `notepad` join the workflow half of the bundle, ahead of the
// stances, so the frozen rows below and every `slice(-4)` stance read stay
// exact.
const notepadCoreSkills = [...legacyCoreSkills, 'carry', 'notepad', ...stanceSkills];
const initialV32CoreSkills = [...legacyCoreSkills, 'carry', 'notepad', 'save', 'promote', ...stanceSkills];
// S-00H TK-004: `to-tickets` renames to `to-tasks` in the live bundle only.
// `legacyCoreSkills` (and the frozen rows derived from it above) stays byte-
// identical, because it is what a real v3.0.0-v3.2.0 manifest's declared
// `skillPolicy.required` actually held; `validateManifest` below still needs
// to recognize that historical shape exactly as released.
const currentCoreSkills = legacyCoreSkills.map((name) => (name === 'to-tickets' ? 'to-tasks' : name));
// v3.2.1 stamped the twenty-one-skill bundle with `handoff`; it is frozen
// below. S-00Z grows the live bundle with `grill-me`, the repository-owned
// entry composing grilling with notepad, ahead of the stances so every
// `slice(-4)` stance read stays exact.
const handoffCoreSkills = [...currentCoreSkills, 'carry', 'notepad', 'save', 'promote', 'handoff', ...stanceSkills];
// Role and coordination-stance entries sit between the workflow skills and
// the four portable stances; each is a required core entry delivered by its
// own Spec. S-002C adds `director`, which leads the group as the top role;
// S-002D adds `dispatcher`; S-002F adds `spec-planner`, the stance a
// Dispatcher adopts at flight launch; S-002G adds `spec-manager`, the stance
// it adopts during Task execution. Exported so the tests derive the frozen
// v3.2.1 row by excluding this group rather than by naming each entry.
export const coordinationSkills = ['director', 'dispatcher', 'spec-planner', 'spec-manager'];
// S-004C TK-005J adds `workbench-runtime`, the workflow entry that carries the
// operations every room runs on its installed runtime tools (diagnostics, Wiki
// validation, installed state, visible identifiers, connection identity,
// configured-host checks, room-local skills), after `grill-me` and ahead of
// the coordination entries, so every coordination and stance slice stays exact.
// S-004L TK-008L adds `improve-harness`, the one workflow entry that carries
// harness improvement for one observed job (baseline, earliest gap, smallest
// owning intervention, native verification, fresh rerun, then retain, revise
// or remove), after `workbench-runtime` and ahead of the coordination entries.
// S-004J TK-00JA adds `domain-modeling`, the Align companion that challenges
// and sharpens vocabulary and traces an upstream choice to the owners it would
// reach before it settles, after `improve-harness` and ahead of the
// coordination entries, so every coordination and stance slice stays exact.
// S-002U TK-007V adds `pr`, the owner-required PR body-authoring entry, after
// `improve-harness` and ahead of the coordination entries.
export const coreSkills = [...currentCoreSkills, 'carry', 'notepad', 'save', 'promote', 'handoff', 'grill-me', 'workbench-runtime', 'improve-harness', 'domain-modeling', 'pr', 'writing-for-agents', 'retro', ...coordinationSkills, ...stanceSkills];
// The prior28 cohort: rooms built from integration before `pr` joined the
// required Core carry this exact lane policy under v3.2.1. Keep it readable so
// layout migration reaches the explicit skills update instead of rejecting its
// own starting room. A literal, not a derivation, so later Core growth never
// changes what it accepts. Each v3.2.1 transition cohort is one entry below.
const prior28CoreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tasks', 'tracer-bullet', 'update-harness',
  'carry', 'notepad', 'save', 'promote', 'handoff', 'grill-me', 'workbench-runtime',
  'improve-harness', 'director', 'dispatcher', 'spec-planner', 'spec-manager',
  'builder', 'auditor', 'reviewer', 'reconciler'
];
// Exact 29-skill cohorts from the two parents of the combined bundle.
const prior29PrCoreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tasks', 'tracer-bullet', 'update-harness',
  'carry', 'notepad', 'save', 'promote', 'handoff', 'grill-me', 'workbench-runtime',
  'improve-harness', 'pr', 'director', 'dispatcher', 'spec-planner', 'spec-manager',
  'builder', 'auditor', 'reviewer', 'reconciler'
];
const prior29DomainModelingCoreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tasks', 'tracer-bullet', 'update-harness',
  'carry', 'notepad', 'save', 'promote', 'handoff', 'grill-me', 'workbench-runtime',
  'improve-harness', 'domain-modeling', 'director', 'dispatcher', 'spec-planner', 'spec-manager',
  'builder', 'auditor', 'reviewer', 'reconciler'
];
const priorWritingRetroCoreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tasks', 'tracer-bullet', 'update-harness',
  'carry', 'notepad', 'save', 'promote', 'handoff', 'grill-me',
  'workbench-runtime', 'improve-harness', 'writing-for-agents', 'retro', 'director', 'dispatcher',
  'spec-planner', 'spec-manager', 'builder', 'auditor', 'reviewer', 'reconciler'
];
// Frozen manifest policy at c80cb282.
const priorPrDomainCoreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tasks', 'tracer-bullet', 'update-harness',
  'carry', 'notepad', 'save', 'promote', 'handoff', 'grill-me',
  'workbench-runtime', 'improve-harness', 'domain-modeling', 'pr', 'director', 'dispatcher',
  'spec-planner', 'spec-manager', 'builder', 'auditor', 'reviewer', 'reconciler'
];
// Frozen manifest policy at b1adee9d.
const priorPrWritingRetroCoreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tasks', 'tracer-bullet', 'update-harness',
  'carry', 'notepad', 'save', 'promote', 'handoff', 'grill-me',
  'workbench-runtime', 'improve-harness', 'pr', 'writing-for-agents', 'retro', 'director',
  'dispatcher', 'spec-planner', 'spec-manager', 'builder', 'auditor', 'reviewer',
  'reconciler'
];
const v321TransitionCoreSkills = [prior28CoreSkills, prior29PrCoreSkills, prior29DomainModelingCoreSkills, priorWritingRetroCoreSkills, priorPrDomainCoreSkills, priorPrWritingRetroCoreSkills];
export const lanes = LANES;
export const collections = COLLECTIONS;
// S-004O TK-009G: a room receives GLOSSARY.md and ARCHITECTURE.md from the
// Template in place of the retired LEXICON.md (DDR-001E).
export const controls = ['AGENTS.md', 'BLUEPRINT.md', 'GLOSSARY.md', 'ARCHITECTURE.md', 'RUNBOOK.md', 'TASKBOARD.md', 'CLAUDE.md', 'README.md'];
// The two controls the update route installs from the Template when a room
// still holds the Lexicon they replace, and the retired control itself.
export const vocabularyControls = ['GLOSSARY.md', 'ARCHITECTURE.md'];
export const RETIRED_LEXICON = 'LEXICON.md';
// The spaced `grilling diary/` name is a legacy path a stale installed skill
// may still write; denying it keeps a live notepad untrackable before the
// checkpoint privacy scan runs. `validate` does not require the line.
export const SESSIONS_IGNORE = `# Live session records stay local; checkpoint history is frozen.\ngrilling/*\n!grilling/.gitkeep\nhandoffs/*\n!handoffs/.gitkeep\n# Local typed notepads; reusable schema/examples remain tracked.\nnotepads/*\n!notepads/templates/\n!notepads/.gitkeep\n# Legacy notepad path a stale installed skill may still write; never tracked.\ngrilling diary/\n# Operational rollback material is local, not session history.\nrecovery/*\n!recovery/.gitkeep\n`;
// The managed skill marker every installed core skill carries; one reader for
// the installer, the explicit upgrade, and doctor. Schema 1 (source only) and
// schema 2 (source, release, commit, contentHash) both record management.
// Current schema 2 markers also declare compatibleRooms minimum/maximum;
// older markers keep their generation while compatibility remains unknown.
export const MANAGED_SKILL_MARKER = '.workbench-skill.json';
export const MANAGED_SKILL_SOURCE = 'LLM Workbench core';
export function readManagedSkillMarker(skillDirectory) {
  const file = path.join(skillDirectory, MANAGED_SKILL_MARKER);
  const entry = lstatOrNull(file);
  if (!entry?.isFile()) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return [1, 2].includes(parsed?.schemaVersion) && parsed.source === MANAGED_SKILL_SOURCE ? parsed : null;
  } catch { return null; }
}
const legacyLanes = { specs: 'workbench/specs', wiki: 'workbench/wiki', grilling: 'workbench/grilling', handoffs: 'workbench/handoffs', feedback: 'workbench/feedback' };
// S-00V TK-001: the core skills ship in the room's skills lane and the two
// discovery roots are tracked adapters into it, so setup lays the lane down
// (`lane-install`) and the ordinary Workbench update replaces it
// (`workbench-update`). The presence-only/explicit-only shape below is what
// every room up to v3.2.1 declared when the core lived in the provider home;
// it stays readable as a frozen row so those rooms validate until they update.
const skillPolicy = { required: coreSkills, discovery: ['.agents/skills', '.claude/skills'], normalSetup: 'lane-install', updates: 'workbench-update' };
const providerHomeSkillPolicy = { required: coreSkills, discovery: ['.agents/skills', '.claude/skills'], normalSetup: 'presence-only', updates: 'explicit-only' };
export const SKILLS_RECEIPT = '.workbench-skills.json';
// Taskboard owns the generated projection; Blueprint is destination-only.
const generatedRegions = {
  'TASKBOARD.md': ['<!-- hot-specs:start -->', '<!-- hot-specs:end -->']
};
const templateVocabulary = new Set(templatePlaceholders);
// S-00I TK-01U: the features collection README joins the contract so a new
// room is seeded with the collection's job and article shape, exactly as the
// design-concepts README already is.
export const wikiContractFiles = ['SCHEMA.md', 'AGENTS.md', 'design-concepts/README.md', 'features/README.md'];
// S-004O TK-009G: the Template Wiki's grouped vocabulary articles (one per
// glossary grouping) and its AI coding reference install flat beside the
// router with the room's GLOSSARY.md, at init, adoption and the update route.
// They are reported apart from the contract files (`articles`, not `written`).
export const wikiVocabularyFiles = [
  'ai-coding-reference.md',
  'vocabulary-chats-and-roles.md',
  'vocabulary-continuity-and-evidence-boundaries.md',
  'vocabulary-continuity-terms.md',
  'vocabulary-destination-and-direction.md',
  'vocabulary-feedback-disposition.md',
  'vocabulary-governance-core.md',
  'vocabulary-specs-and-tasks.md',
  'vocabulary-stance-terms.md',
  'vocabulary-workbench-meanings-of-ai-coding-terms.md',
  'vocabulary-workbench-room-and-artifacts.md',
  'vocabulary-workflow-verbs.md'
];
// Seeded lane documents are the third class of installed state, beside runtime
// tools and installed skills: the harness copies them out of the release to be
// read and, unlike a runtime tool, sometimes locally adjusted. Their generation
// is therefore a recorded release in a seed record beside the manifest, never a
// hash in the tools receipt, whose drift finding blocks everything.
export const SEED_RECORD = 'workbench/.workbench-seed.json';
export const SEED_SCHEMA_VERSION = 1;
export const SEED_SOURCE = 'LLM Workbench seeded documents';
export const seededLaneDocuments = [
  { lane: 'feedback', name: 'REPORT_FORMAT.md', template: 'feedback/REPORT_FORMAT.md' },
  ...['notepad.schema.json', 'work.example.json', 'grilling.example.json'].map(name => ({
    lane: 'sessions', name: `notepads/templates/${name}`, template: `sessions/notepads/templates/${name}`
  }))
];
// The preserved collection shapes derive from the pre-feature set, never the
// live one, so appending `features` cannot redefine what an older room held.
const notepadCollections = Object.fromEntries(Object.entries(PRE_FEATURE_COLLECTIONS).filter(([name]) => name !== 'recovery'));
const legacyCollections = Object.fromEntries(Object.entries(notepadCollections).filter(([name]) => !['notepads', 'notepad-templates'].includes(name)));
// S-00I TK-01U: every pre-feature shape stays valid exactly as stamped, and
// each may carry the additive `features` collection appended at its declared
// path. S-003X TK-004W: each may also carry `features` then `ddr`, the order a
// room gains them. S-003Z TK-008D: and then `landmarks`. The live
// `collections` is the fully appended current shape.
const allowedCollectionShapes = [PRE_FEATURE_COLLECTIONS, notepadCollections, legacyCollections]
  .flatMap((shape) => [
    shape,
    { ...shape, features: collections.features },
    { ...shape, features: collections.features, ddr: collections.ddr },
    { ...shape, features: collections.features, ddr: collections.ddr, landmarks: collections.landmarks }
  ]);
// S-003X TK-004W: the decision-record lifecycle folders the `ddr` collection
// is created with, the same closed set the ADR collection uses (ADR-000I):
// accepted records at the top, `proposed/` and the permanent `archive/`.
export const DECISION_RECORD_LIFECYCLE_FOLDERS = Object.freeze(['proposed', 'archive']);


function lstatOrNull(target) {
  try { return fs.lstatSync(target); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function report(status, details = {}) { return { status, ...details }; }
function fail(code, message, details = {}) { return report('invalid', { error: { code, message, ...details } }); }

function gitRead(project, args) {
  const result = spawnSync('git', ['-C', project, ...args], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

export function insideWorkTree(project) {
  return gitRead(project, ['rev-parse', '--is-inside-work-tree']) === 'true';
}

// S-00M TK-001: the repository state a completion claim can hide, read at one
// seam for `doctor` and `close`. It never throws, because a reader that throws
// turns a missing tool into a broken command: a host without Git, a directory
// outside any repository, or lanes the manifest cannot resolve all come back
// as `{ known: false, reason, detail }` with reason `git-unavailable`,
// `not-a-repository`, `git-failed` or `lanes-unresolved`. A known state is
// `{ known: true, head: { detached, branch }, dirty, untracked: { controls,
// adr, specs }, upstream }`. `dirty` lists tracked changes (staged, modified,
// deleted, renamed, conflicted) and `untracked` only the untracked files under
// the root controls, the ADR collection and the spec lane, as repository-root
// paths. `upstream` is null when none is configured, and otherwise
// `{ name, gone, ahead, behind }`, with null distance when the upstream ref is
// gone. `options.git` names the Git executable, so a test can make it absent.
//
// S-00M TK-003 adds three fields for `close`, leaving the shapes above as
// they were: `untrackedOther` lists every other untracked, non-ignored file
// (repository-relative, including files outside the room root), so `dirty`,
// the three lane lists and `untrackedOther` together are exactly what
// `git status --porcelain` shows and what the Receipt's Dirty column counts;
// `remotes` lists the configured remote names; and `pushed` is true only
// when some `refs/remotes/*` ref contains HEAD, so a commit that reached any
// remote counts as pushed with or without an upstream, and an unborn HEAD,
// a room with no remote, or a commit no remote has is not.
export function readRepositoryState(root, options = {}) {
  const unknown = (reason, detail) => ({ known: false, reason, detail: String(detail ?? '').trim() });
  try {
    const project = path.resolve(root);
    const git = options.git ?? 'git';
    const run = (args) => spawnSync(git, ['-C', project, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const probe = run(['rev-parse', '--is-inside-work-tree', '--show-prefix']);
    if (probe.error) return unknown(probe.error.code === 'ENOENT' ? 'git-unavailable' : 'git-failed', probe.error.message);
    const [inside, prefix = ''] = probe.stdout.split('\n');
    if (probe.status !== 0 || inside !== 'true') return unknown('not-a-repository', probe.stderr || `${project} is not inside a Git work tree`);
    let lanes;
    try {
      lanes = { adr: collectionRelative(project, 'adr'), specs: laneRelative(project, 'specs') };
    } catch (error) {
      return unknown('lanes-unresolved', error.message);
    }
    const status = run(['status', '--porcelain=v2', '--branch', '--untracked-files=all', '-z']);
    if (status.error || status.status !== 0) return unknown('git-failed', status.error?.message ?? status.stderr);
    const head = { detached: false, branch: null };
    let upstream = null;
    const dirty = [];
    const untracked = { controls: [], adr: [], specs: [] };
    const untrackedOther = [];
    const within = (file, lane) => file.startsWith(`${lane}/`);
    const entries = status.stdout.split('\0');
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      if (entry.startsWith('# branch.head ')) {
        const name = entry.slice('# branch.head '.length);
        if (name === '(detached)') head.detached = true;
        else head.branch = name;
      } else if (entry.startsWith('# branch.upstream ')) {
        upstream = { name: entry.slice('# branch.upstream '.length), gone: true, ahead: null, behind: null };
      } else if (entry.startsWith('# branch.ab ')) {
        const [, ahead, behind] = entry.match(/^# branch\.ab \+(\d+) -(\d+)$/) ?? [];
        if (upstream && ahead !== undefined) Object.assign(upstream, { gone: false, ahead: Number(ahead), behind: Number(behind) });
      } else if (entry.startsWith('1 ') || entry.startsWith('u ')) {
        dirty.push(entry.split(' ').slice(entry.startsWith('1 ') ? 8 : 10).join(' '));
      } else if (entry.startsWith('2 ')) {
        dirty.push(entry.split(' ').slice(9).join(' '));
        index += 1; // with -z a rename's original path is the next entry
      } else if (entry.startsWith('? ')) {
        const file = entry.slice(2);
        // Lanes are root-relative; porcelain paths are repository-relative.
        const relative = prefix && file.startsWith(prefix) ? file.slice(prefix.length) : (prefix ? null : file);
        if (relative === null) untrackedOther.push(file);
        else if (controls.includes(relative)) untracked.controls.push(file);
        else if (within(relative, lanes.adr)) untracked.adr.push(file);
        else if (within(relative, lanes.specs)) untracked.specs.push(file);
        else untrackedOther.push(file);
      }
    }
    for (const list of [dirty, untracked.controls, untracked.adr, untracked.specs, untrackedOther]) list.sort();
    const remoteList = run(['remote']);
    if (remoteList.error || remoteList.status !== 0) return unknown('git-failed', remoteList.error?.message ?? remoteList.stderr);
    const remotes = remoteList.stdout.split('\n').filter(Boolean).sort();
    let pushed = false;
    if (run(['rev-parse', '--verify', '--quiet', 'HEAD']).status === 0) {
      const containing = run(['for-each-ref', '--contains', 'HEAD', '--format=%(refname)', 'refs/remotes']);
      if (containing.error || containing.status !== 0) return unknown('git-failed', containing.error?.message ?? containing.stderr);
      pushed = containing.stdout.trim() !== '';
    }
    return { known: true, head, dirty, untracked, upstream, untrackedOther, remotes, pushed };
  } catch (error) {
    return unknown('git-failed', error?.message ?? error);
  }
}

function remoteNames(project) {
  return (gitRead(project, ['remote']) ?? '').split('\n').filter(Boolean);
}

function listRefs(project) {
  if (!insideWorkTree(project)) return [];
  return (gitRead(project, ['for-each-ref', '--format=%(refname)', 'refs/heads', 'refs/remotes']) ?? '').split('\n').filter(Boolean);
}

// The refs under which a branch name resolves in the repository containing
// the project: the local head first, then each configured remote. Names are
// compared exactly from the ref listing, so a case-insensitive filesystem
// cannot make `Integration` satisfy a declared `integration`. Nothing is
// fetched, and a project outside any Git work tree resolves nothing.
export function resolveBranchRefs(project, name) {
  if (!isBranchName(name)) return [];
  const refs = listRefs(project);
  const resolved = [];
  if (refs.includes(`refs/heads/${name}`)) resolved.push({ ref: `refs/heads/${name}`, name });
  for (const remote of remoteNames(project)) {
    const ref = `refs/remotes/${remote}/${name}`;
    if (refs.includes(ref)) resolved.push({ ref, name: `${remote}/${name}` });
  }
  return resolved;
}

// The content of a project-relative file at a ref the repository already
// has, or null when the ref or the file is absent. Nothing is fetched.
export function readAtRef(project, ref, relative) {
  const prefix = gitRead(project, ['rev-parse', '--show-prefix']);
  if (prefix === null) return null;
  return gitRead(project, ['show', `${ref}:${prefix}${relative}`]);
}

// Every branch name the repository knows locally or on a remote.
export function listBranchNames(project) {
  const remotes = remoteNames(project);
  const names = new Set();
  for (const ref of listRefs(project)) {
    if (ref.startsWith('refs/heads/')) { names.add(ref.slice('refs/heads/'.length)); continue; }
    const remote = remotes.find((candidate) => ref.startsWith(`refs/remotes/${candidate}/`));
    if (!remote) continue;
    const name = ref.slice(`refs/remotes/${remote}/`.length);
    if (name !== 'HEAD') names.add(name);
  }
  return [...names].sort();
}

// origin/HEAD names the default branch; a repository without one falls back
// to its checked-out branch, and a project outside Git to main.
export function defaultBranchName(project) {
  const originHead = gitRead(project, ['symbolic-ref', '--quiet', 'refs/remotes/origin/HEAD']);
  if (originHead?.startsWith('refs/remotes/origin/')) return originHead.slice('refs/remotes/origin/'.length);
  return gitRead(project, ['symbolic-ref', '--quiet', '--short', 'HEAD']) || 'main';
}

// The manifest git block init and migrate write: explicit flags win, then an
// existing integration-named branch by its exact case, then the defaults.
// Declaring never creates a branch; the Genesis gate and doctor check it.
function gitDeclaration(project, options) {
  for (const flag of ['--default-branch', '--integration-branch']) {
    if (options[flag] !== undefined && !isBranchName(options[flag])) return fail('invalid-branch', `${flag} must be a Git branch name; received ${options[flag]}.`);
  }
  const names = listBranchNames(project);
  const existing = names.find((name) => name === 'integration') ?? names.find((name) => name.toLowerCase() === 'integration');
  return report('declared', {
    git: {
      defaultBranch: options['--default-branch'] ?? defaultBranchName(project),
      integrationBranch: options['--integration-branch'] ?? existing ?? 'integration'
    }
  });
}

function parseOptions(args, required, flags = []) {
  const options = {};
  for (let index = 0; index < args.length;) {
    const key = args[index];
    if (flags.includes(key)) { options[key] = true; index += 1; continue; }
    const value = args[index + 1];
    if (!key?.startsWith('--') || !value || options[key]) throw new Error('Invalid arguments.');
    options[key] = value;
    index += 2;
  }
  for (const key of required) if (!options[key]) throw new Error(`Missing ${key}.`);
  return options;
}

export function containsPlaceholder(content) {
  for (const match of content.matchAll(/(?<!\[)\[(?!\[|[ xX]\])[^\]\n]+\](?!\()/g)) {
    if (templateVocabulary.has(match[0])) return true;
  }
  return false;
}

export function versionStamp(content) {
  return content.match(/(?:Generated from|Part of) LLM Workbench (v\d+\.\d+\.\d+)/)?.[1] ?? null;
}

function readManifestFile(project) {
  const manifestPath = path.join(project, 'workbench', 'manifest.json');
  try {
    return { manifest: JSON.parse(fs.readFileSync(manifestPath, 'utf8')), manifestPath };
  } catch (error) {
    return { failure: fail('invalid-manifest', `Cannot read ${manifestPath}: ${error.message}`) };
  }
}

function ordinaryDirectory(project, relative) {
  const entry = lstatOrNull(path.join(project, relative));
  return Boolean(entry) && !entry.isSymbolicLink() && entry.isDirectory();
}

// Git's own interpretation includes later negations, parent rules and host
// excludes. Outside a Git worktree we can check structure only; readiness
// subsequently requires Git and repeats this effective-boundary check.
function verifyNotepadIgnores(project, manifest) {
  if (!manifest.collections.notepads) return { verification: 'legacy-layout' };
  if (!insideWorkTree(project)) return { verification: 'not-a-git-worktree' };
  const base = manifest.collections.notepads;
  const localBases = [base, manifest.collections.recovery].filter(Boolean);
  const templates = manifest.collections['notepad-templates'];
  const live = new Set([`${base}/work/live.json`, `${base}/grilling/live.json`, `${base}/new-type/live.json`]);
  const tracked = new Set(seededLaneDocuments.filter(document => document.lane === 'sessions').map(document => `${lanes.sessions}/${document.name}`));
  function walk(relative, opaqueLinks = false) {
    if (relative === templates) return;
    live.add(`${relative}/.workbench-live-probe.json`);
    const directory = path.join(project, relative);
    assertSafeReadPath(project, directory);
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const child = `${relative}/${entry.name}`;
      if (entry.isSymbolicLink()) {
        if (!opaqueLinks) throw new Error(`Linked live path ${child} cannot establish ordinary note storage.`);
        // Backups preserve original links. Check that the link itself is
        // ignored, without reading or following its possibly external target.
        live.add(child);
        continue;
      }
      if (entry.isDirectory()) walk(child, opaqueLinks);
      else if (entry.name !== '.gitkeep') live.add(child);
    }
  }
  try { for (const relative of localBases) walk(relative, relative === manifest.collections.recovery); } catch (error) { return { failure: fail('sessions-not-ignored', error.message) }; }
  const paths = [...live, ...tracked];
  const checked = spawnSync('git', ['check-ignore', '--no-index', '-z', '--stdin'], { cwd: project, encoding: 'utf8', input: `${paths.join('\0')}\0` });
  if (![0, 1].includes(checked.status)) return { failure: fail('sessions-not-ignored', 'Git could not verify effective notepad ignore rules.') };
  const ignored = new Set(checked.stdout.split('\0').filter(Boolean));
  const leaked = [...live].filter(file => !ignored.has(file));
  const hidden = [...tracked].filter(file => ignored.has(file));
  const indexed = spawnSync('git', ['ls-files', '-z', '--', ...localBases], { cwd: project, encoding: 'utf8' });
  if (indexed.status !== 0) return { failure: fail('sessions-not-ignored', 'Git could not inspect already tracked notepad paths.') };
  const published = indexed.stdout.split('\0').filter(file => file && !file.startsWith(`${templates}/`) && !file.endsWith('/.gitkeep'));
  if (leaked.length || hidden.length || published.length) return { failure: fail('sessions-not-ignored', 'Live notepads and operational recovery must remain ignored and untracked; reusable schema/examples must remain trackable.', { leaked, hidden, published }) };
  return { verification: 'git' };
}

// S-004M TK-008T: the legibility surface. A room declares how an agent runs
// the product, operates it, inspects its state, sees its errors, exercises
// the user journey and measures whether it worked - six entries, each a
// command, a path or a short pointer the room's own tooling answers. The block
// is additive like the git block: absent is valid, malformed is a malformed
// manifest. An empty or bracketed-placeholder entry is valid here and is
// doctor's attention finding, so a drafted block can be committed and
// confirmed later; `confirmation: "pending"` is the marker setup writes and
// grilling removes. The declaration is routing, never authority.
export const LEGIBILITY_ENTRIES = Object.freeze(['run', 'operate', 'inspect', 'errors', 'journey', 'measure']);
export const LEGIBILITY_PENDING = 'pending';
const PLACEHOLDER_ENTRY = /^\[[^\]]*\]$/;

function legibilityShapeIssue(legibility) {
  if (!legibility || typeof legibility !== 'object' || Array.isArray(legibility)) return 'must be an object';
  const unknown = Object.keys(legibility).filter((key) => !LEGIBILITY_ENTRIES.includes(key) && key !== 'confirmation');
  if (unknown.length) return `carries unknown keys ${unknown.join(', ')}; the entries are ${LEGIBILITY_ENTRIES.join(', ')}`;
  for (const entry of LEGIBILITY_ENTRIES) {
    if (Object.hasOwn(legibility, entry) && typeof legibility[entry] !== 'string') return `entry ${entry} must be a string`;
  }
  if (Object.hasOwn(legibility, 'confirmation') && legibility.confirmation !== LEGIBILITY_PENDING) return `confirmation must be "${LEGIBILITY_PENDING}" or absent`;
  return null;
}

// Classify a manifest's declaration for its consumers (doctor, setup): which
// entries are declared, which are missing, empty or still a placeholder, and
// whether the block is a setup draft awaiting grilling confirmation.
export function legibilityState(manifest) {
  const legibility = manifest?.legibility;
  if (legibility === undefined) return { declared: false, present: [], undeclared: [...LEGIBILITY_ENTRIES], pending: false };
  if (legibilityShapeIssue(legibility)) return { declared: false, present: [], undeclared: [...LEGIBILITY_ENTRIES], pending: false, malformed: true };
  const present = LEGIBILITY_ENTRIES.filter((entry) => typeof legibility[entry] === 'string' && legibility[entry].trim() && !PLACEHOLDER_ENTRY.test(legibility[entry].trim()));
  return { declared: true, present, undeclared: LEGIBILITY_ENTRIES.filter((entry) => !present.includes(entry)), pending: legibility.confirmation === LEGIBILITY_PENDING };
}

export function validateManifest(project) {
  const { manifest, failure } = readManifestFile(project);
  if (failure) return failure;
  if (manifest.schemaVersion === 1) {
    return fail('upgrade-required', 'Manifest schema 1 is the v3.0 five-lane layout; run workbench-layout.mjs migrate --project PATH once.', { schemaVersion: 1 });
  }
  if (manifest.schemaVersion !== SCHEMA_VERSION || !/^v\d+\.\d+\.\d+$/.test(manifest.workbenchVersion ?? '')) {
    return fail('invalid-manifest', 'Manifest schemaVersion or workbenchVersion is invalid.');
  }
  if (Object.hasOwn(manifest, 'workbenchId') && !isWorkbenchId(manifest.workbenchId)) return fail('invalid-workbench-identity', 'Manifest workbenchId must be a WB connection identity; never regenerate malformed identity silently.');
  if (!['genesis', 'adoption', 'upgrade'].includes(manifest.provenance?.lifecycle)) {
    return fail('invalid-manifest', 'Manifest provenance.lifecycle is invalid.');
  }
  // The seven-lane shape is current; the six-lane shape is what every room
  // declared before the skills lane and stays readable until it updates.
  if (![lanes, SIX_LANES].some((shape) => JSON.stringify(manifest.lanes) === JSON.stringify(shape))) {
    return fail('invalid-lane', 'Manifest lanes must exactly match the seven support lanes, or the six lanes declared before the skills lane.', { lanes: manifest.lanes });
  }
  if (!allowedCollectionShapes.some(shape => JSON.stringify(manifest.collections) === JSON.stringify(shape))) {
    return fail('invalid-collection', `Manifest collections must match the current layout or a preserved earlier collection set; the additive features collection, when declared, is ${collections.features}.`, { collections: manifest.collections });
  }
  for (const lane of Object.values(manifest.lanes)) {
    if (!isSafeRelative(lane)) return fail('invalid-lane', `Manifest lane ${lane} is unsafe.`);
    if (!ordinaryDirectory(project, lane)) return fail('unsafe-lane', `Manifest lane ${lane} must be an ordinary directory.`);
  }
  for (const collection of Object.values(manifest.collections)) {
    if (!isSafeRelative(collection)) return fail('invalid-collection', `Manifest collection ${collection} is unsafe.`);
    if (!ordinaryDirectory(project, collection)) return fail('missing-collection', `Manifest collection ${collection} must be an ordinary directory; it may be empty.`);
  }
  // S-01T TK-01X: the Landmark Tracker block is additive. Absent, nothing here
  // runs and the report is byte-for-byte what it was; declared, the resolver's
  // closed shape must hold, the root must not sit inside (or contain) a lane or
  // collection - its records are tracked, never session state - and every
  // declared directory must exist as an ordinary directory.
  let tracker = null;
  try { tracker = trackerDeclaration(manifest); }
  catch (error) { return fail('invalid-collection', error.message, { landmarkTracker: manifest.landmarkTracker }); }
  if (tracker) {
    const owned = [...Object.values(manifest.lanes), ...Object.values(manifest.collections)];
    const overlap = owned.find((relative) => relative === tracker.root || tracker.root.startsWith(`${relative}/`) || relative.startsWith(`${tracker.root}/`));
    if (overlap) return fail('invalid-collection', `Manifest landmarkTracker root ${tracker.root} overlaps ${overlap}; the Tracker is its own root, not a lane or collection.`, { landmarkTracker: manifest.landmarkTracker });
    for (const relative of [tracker.root, ...Object.values(tracker.collections)]) {
      if (!ordinaryDirectory(project, relative)) return fail('missing-collection', `Manifest landmarkTracker directory ${relative} must be an ordinary directory; it may be empty.`);
    }
  }
  const ignore = path.join(project, lanes.sessions, '.gitignore');
  const ignoreEntry = lstatOrNull(ignore);
  if (!ignoreEntry?.isFile() || ignoreEntry.isSymbolicLink()) return fail('sessions-not-ignored', `${lanes.sessions}/.gitignore must keep live session records untracked.`);
  const ignoreContent = fs.readFileSync(ignore, 'utf8');
  for (const name of IGNORED_COLLECTIONS.filter(name => manifest.collections[name])) {
    if (!new RegExp(`^${name}/\\*?$`, 'm').test(ignoreContent)) return fail('sessions-not-ignored', `${lanes.sessions}/.gitignore must ignore ${name}/.`, { collection: name });
  }
  if (!WIKI_PROFILES.includes(manifest.wiki?.profile)) return fail('invalid-wiki-profile', `Manifest wiki.profile must be one of ${WIKI_PROFILES.join(', ')}.`);
  // The git block is an additive schema 2 field: absent is valid, malformed is not.
  if (manifest.git !== undefined && (!manifest.git || typeof manifest.git !== 'object' || Array.isArray(manifest.git) || !isBranchName(manifest.git.defaultBranch) || !isBranchName(manifest.git.integrationBranch))) {
    return fail('invalid-manifest', 'Manifest git block must declare defaultBranch and integrationBranch as Git branch names.', { git: manifest.git });
  }
  if (manifest.legibility !== undefined) {
    const issue = legibilityShapeIssue(manifest.legibility);
    if (issue) return fail('invalid-manifest', `Manifest legibility block ${issue}.`, { legibility: manifest.legibility });
  }
  // Earlier manifests remain readable at the policy their release declared:
  // v3.0.0 and v3.1.0 carried the twelve-skill bundle, v3.1.1 and v3.1.2 the
  // sixteen-skill bundle with the four stances. Each row is a frozen list,
  // never the live policy, so a later bundle change keeps older manifests
  // readable. Any other version must carry the current policy.
  //
  // v3.1.2 reached `main` and downstream rooms with the sixteen-skill bundle
  // before `carry` grew it, so v3.1.2 is frozen here and the seventeen-skill
  // bundle is v3.1.3 - the same handling the twelve-to-sixteen growth got when
  // it bumped v3.1.0 to v3.1.1 rather than redefining v3.1.0 (S-049). v3.1.3
  // is frozen for the same reason one step later: `notepad` grows the bundle
  // to eighteen in v3.1.4 (S-046). A label is frozen once it is stamped, not
  // once it is published - v3.1.0 was never released and was still frozen
  // rather than redefined.
  const stanceRequired = [...legacyCoreSkills, ...stanceSkills];
  const carryRequired = [...legacyCoreSkills, 'carry', ...stanceSkills];
  // Each frozen row is a required list; a room at that release validates with
  // it under either setup shape, because the provider-home shape is what the
  // release stamped and the lane shape is what the Workbench update writes
  // when it lays the lane into such a room before restamping it. v3.2.1 is
  // frozen for the same reason: rooms stamped v3.2.1 declared the
  // provider-home policy before the skills lane existed, and its
  // twenty-one-skill row stays exact now that `grill-me` grows the live
  // bundle (S-00Z).
  const supportedLegacy = { 'v3.0.0': legacyCoreSkills, 'v3.1.0': legacyCoreSkills, 'v3.1.1': stanceRequired, 'v3.1.2': stanceRequired, 'v3.1.3': carryRequired, 'v3.1.4': notepadCoreSkills, 'v3.2.0': initialV32CoreSkills, 'v3.2.1': handoffCoreSkills };
  const legacyRequired = supportedLegacy[manifest.workbenchVersion];
  // Transition cohorts are accepted only at their stamped version and only at
  // the lane-install policy their rooms actually carry.
  const transitionPolicies = manifest.workbenchVersion === 'v3.2.1'
    ? v321TransitionCoreSkills.map((required) => ({ ...skillPolicy, required }))
    : [];
  const accepted = [skillPolicy, ...transitionPolicies, ...(legacyRequired ? [{ ...skillPolicy, required: legacyRequired }, { ...providerHomeSkillPolicy, required: legacyRequired }] : [])].map((policy) => JSON.stringify(policy));
  if (!accepted.includes(JSON.stringify(manifest.skillPolicy))) {
    return fail('invalid-skill-policy', 'Manifest skill policy must declare the closed missing-only core bundle.');
  }
  const ignored = verifyNotepadIgnores(project, manifest);
  if (ignored.failure) return ignored.failure;
  return report('valid', { manifest, ignoreVerification: ignored.verification, ...(tracker ? { tracker } : {}) });
}

// ADR-000H "One Task, one context": the context unit is a declared host fact
// recorded in workbench/manifest.json with provenance, never a number
// restated in portable control prose. This reader is the one seam sizing
// guidance points at; it is a Plan goalpost only, so nothing in doctor, next,
// claim, close or validateManifest above may consult it, and an undeclared
// value fails explicitly rather than defaulting silently.
export class ContextUnitUndeclaredError extends Error {
  constructor(message) { super(message); this.name = 'ContextUnitUndeclaredError'; }
}

export function readContextUnit(project) {
  const { manifest, failure } = readManifestFile(project);
  if (failure) throw new ContextUnitUndeclaredError(failure.error.message);
  const manifestPath = path.join(project, 'workbench', 'manifest.json');
  const unit = manifest.contextUnit;
  if (!unit || typeof unit !== 'object' || Array.isArray(unit)) {
    throw new ContextUnitUndeclaredError(`${manifestPath} does not declare a contextUnit; sizing guidance has no declared value to read.`);
  }
  // ADR-000H requires the unit recorded "with provenance", so every provenance
  // field is required and type-checked, named individually so a malformed
  // field fails as loudly as an absent one.
  if (typeof unit.value !== 'number') throw new ContextUnitUndeclaredError(`${manifestPath} contextUnit.value must be a number.`);
  if (typeof unit.unit !== 'string' || !unit.unit) throw new ContextUnitUndeclaredError(`${manifestPath} contextUnit.unit must be a non-empty string.`);
  if (typeof unit.decisionDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(unit.decisionDate)) throw new ContextUnitUndeclaredError(`${manifestPath} contextUnit.decisionDate must be a YYYY-MM-DD string.`);
  if (typeof unit.source !== 'string' || !unit.source) throw new ContextUnitUndeclaredError(`${manifestPath} contextUnit.source must be a non-empty string.`);
  if (!Array.isArray(unit.consideredAlternatives) || unit.consideredAlternatives.length === 0 || !unit.consideredAlternatives.every((value) => typeof value === 'number')) {
    throw new ContextUnitUndeclaredError(`${manifestPath} contextUnit.consideredAlternatives must be an array of numbers.`);
  }
  if (typeof unit.reason !== 'string' || !unit.reason.trim()) throw new ContextUnitUndeclaredError(`${manifestPath} contextUnit.reason must be a non-empty string.`);
  return unit;
}

function templateRoot() {
  // The product checkout keeps copy-ready templates near the tools; a
  // downstream project carries none, so seeding is reported truthfully.
  let current = path.dirname(fileURLToPath(import.meta.url));
  for (let depth = 0; depth < 3; depth += 1) {
    current = path.dirname(current);
    const candidate = path.join(current, 'templates');
    if (fs.existsSync(path.join(candidate, 'wiki', 'SCHEMA.md'))) return candidate;
  }
  return null;
}

function fillTemplate(content, values) {
  let result = content;
  for (const [placeholder, value] of Object.entries(values)) result = result.replaceAll(placeholder, value);
  return result;
}

// Validate all layout parents and the ignore destination before any mkdir or
// migration move. A final-directory check alone misses linked ancestors.
function preflightLayout(project, extraDirectories = []) {
  for (const relative of ['workbench', ...Object.values(lanes), ...Object.values(collections), ...decisionRecordFolders(), ...extraDirectories]) {
    let current = project;
    for (const part of relative.split('/')) {
      current = path.join(current, part);
      const entry = lstatOrNull(current);
      if (entry && (!entry.isDirectory() || entry.isSymbolicLink())) {
        return fail('lane-collision', `${current} must be an ordinary directory.`);
      }
    }
  }
  for (const relative of ['workbench/manifest.json', `${lanes.sessions}/.gitignore`]) {
    const entry = lstatOrNull(path.join(project, relative));
    if (entry && (!entry.isFile() || entry.isSymbolicLink() || entry.nlink > 1)) {
      return fail('lane-collision', `${relative} must be an ordinary, unshared file.`);
    }
  }
  return null;
}

function writeSessionsIgnore(project) {
  const destination = path.join(project, lanes.sessions, '.gitignore');
  const current = lstatOrNull(destination) ? fs.readFileSync(destination, 'utf8') : '';
  // Retain project rules byte-for-byte, appending the required live-session block.
  const combined = current + (current && !current.endsWith('\n') ? '\n' : '') + SESSIONS_IGNORE;
  fs.writeFileSync(destination, combined);
}

export function initialize(options) {
  const project = path.resolve(options['--project']);
  const manifestPath = path.join(project, 'workbench', 'manifest.json');
  if (lstatOrNull(manifestPath)) return fail('manifest-exists', `${manifestPath} already exists.`);
  const projectEntry = lstatOrNull(project);
  if (!projectEntry || projectEntry.isSymbolicLink() || !projectEntry.isDirectory()) {
    return fail('invalid-project', `${project} must be an existing project directory.`);
  }
  const unsafe = preflightLayout(project);
  if (unsafe) return unsafe;
  const shape = validateManifestShape({ workbenchVersion: options['--version'], provenance: { lifecycle: options['--provenance'] }, wiki: { profile: options['--wiki-profile'] ?? 'project' } });
  if (shape) return shape;
  const declaration = gitDeclaration(project, options);
  if (declaration.status !== 'declared') return declaration;
  for (const relative of [...Object.values(lanes), ...Object.values(collections)]) {
    const entry = lstatOrNull(path.join(project, relative));
    if (entry && (entry.isSymbolicLink() || !entry.isDirectory())) return fail('lane-collision', `${path.join(project, relative)} is not a directory.`);
  }
  const source = sourceIdentity(options);
  if (source.status) return source;
  const seedFailure = preflightSeedDocuments(project, { notepadOnly: true });
  if (seedFailure) return seedFailure;
  return withIdentityLock(project, () => {
    if (lstatOrNull(manifestPath)) return fail('manifest-exists', `${manifestPath} already exists.`);
    const manifest = {
      schemaVersion: SCHEMA_VERSION,
      workbenchVersion: options['--version'],
      workbenchId: allocateWorkbenchId(),
      provenance: { lifecycle: options['--provenance'], source },
      git: declaration.git,
      lanes,
      collections,
      wiki: { profile: options['--wiki-profile'] ?? 'project' },
      skillPolicy
    };
    for (const relative of [...Object.values(lanes), ...Object.values(collections)]) {
      if (options.deferWikiSeed && relative.startsWith(`${lanes.wiki}/`)) continue;
      const target = path.join(project, relative);
      fs.mkdirSync(target, { recursive: true });
      if (relative === collections.ddr) createDecisionRecordFolders(project, relative);
      if (!fs.readdirSync(target).length) fs.writeFileSync(path.join(target, '.gitkeep'), '');
    }
    writeSessionsIgnore(project);
    const seeded = options.deferWikiSeed ? { wiki: false, reason: 'legacy wiki move pending' } : seedWiki(project, options, wikiContractFiles, wikiVocabularyFiles);
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    const documents = writeSeedDocuments(project, { ...options, notepadOnly: true });
    return report('initialized', { manifestPath, manifest, seeded, documents });
  }, { initialize: true });
}

function gitValue(cwd, args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : '';
}

function gitStatus(cwd, args) {
  return spawnSync('git', args, { cwd, encoding: 'utf8' });
}

// The manifest records the exact clean Workbench checkout that produced it.
// Explicit flags are assertions against that checkout, never replacements for
// evidence. A downstream partial copy therefore refuses rather than claiming
// caller-supplied strings as the identity of bytes it cannot verify.
function sourceIdentity(options) {
  const templates = templateRoot();
  const release = templates ? path.dirname(templates) : null;
  if (!release) return fail('invalid-source-identity', 'This copy is not inside a verified Workbench release checkout; source flags cannot establish the identity of relocated bytes.');
  const resolved = {
    repository: gitValue(release, ['remote', 'get-url', 'origin']),
    release: options['--version'],
    commit: gitValue(release, ['rev-parse', '--verify', 'HEAD'])
  };
  const topLevel = gitValue(release, ['rev-parse', '--show-toplevel']);
  if (!/^[0-9a-f]{40}$/.test(resolved.commit)) return fail('invalid-source-identity', `The Workbench release checkout at ${release} has no concrete HEAD commit.`);
  if (!topLevel || fs.realpathSync(topLevel) !== fs.realpathSync(release)) return fail('invalid-source-identity', `The Workbench release path ${release} is not the Git checkout root.`);
  if (!resolved.repository) return fail('invalid-source-identity', `The Workbench release checkout at ${release} has no origin repository URL.`);
  const sourceManifest = path.join(release, 'workbench', 'manifest.json');
  let checkoutVersion;
  try { checkoutVersion = JSON.parse(fs.readFileSync(sourceManifest, 'utf8')).workbenchVersion; }
  catch { return fail('invalid-source-identity', `${sourceManifest} is missing or unreadable.`); }
  if (checkoutVersion !== resolved.release) return fail('invalid-source-identity', `Requested source release ${resolved.release} does not match the verified checkout release ${checkoutVersion}.`);
  const status = gitStatus(release, ['status', '--porcelain', '--', 'workbench/manifest.json', 'workbench/tools', 'templates']);
  if (status.status !== 0) return fail('invalid-source-identity', 'Git status could not verify the Workbench manifest, runtime tools, and templates as a clean source.');
  if (status.stdout.trim()) return fail('invalid-source-identity', 'The Workbench manifest, runtime tools, or templates have uncommitted changes; commit the exact candidate before initialization.');
  for (const [field, flag] of [['commit', '--source-commit'], ['repository', '--source-repository']]) {
    if (!options[flag]) continue;
    if (field === 'commit' && !/^[0-9a-f]{40}$/.test(options[flag])) return fail('invalid-source-identity', `${flag} must be a full 40-character Git commit.`);
    if (options[flag] !== resolved[field]) return fail('invalid-source-identity', `${flag} does not match the verified checkout ${field}.`);
  }
  return resolved;
}

export function seedWiki(project, options, files = wikiContractFiles, articles = []) {
  for (const relative of Object.values(collections).filter(value => value.startsWith(`${lanes.wiki}/`))) {
    fs.mkdirSync(path.join(project, relative), { recursive: true });
  }
  const templates = templateRoot();
  if (!templates) return { wiki: false, reason: 'no copy-ready templates beside this tool; seed the wiki contract from the Workbench release' };
  const values = {
    '[HARNESS_VERSION]': options['--version'].replace(/^v/, ''),
    '[YYYY-MM-DD]': options['--date'] ?? new Date().toISOString().slice(0, 10),
    '[PROJECT_NAME]': options['--name'] ?? path.basename(project)
  };
  const write = (relative) => {
    const destination = path.join(project, lanes.wiki, relative);
    if (lstatOrNull(destination)) return false;
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, fillTemplate(fs.readFileSync(path.join(templates, 'wiki', relative), 'utf8'), values));
    return true;
  };
  const written = files.filter(write).map(relative => `${lanes.wiki}/${relative}`);
  if (!articles.length) return { wiki: true, written };
  return { wiki: true, written, articles: articles.filter(write).map(relative => `${lanes.wiki}/${relative}`) };
}

// S-004O TK-009G: the update route's Lexicon retirement (DDR-001E). A room
// that still holds `LEXICON.md` receives `GLOSSARY.md` and `ARCHITECTURE.md`
// from the Template when it has none, and the Template Wiki vocabulary
// articles beside its router; its Lexicon is then removed only when every
// line has landed. A line lands when it is blank or a heading (the landing
// check's exempt lines), when it matches a line of the Template Lexicon the
// room was generated from (generic content the Template glossary,
// architecture and Wiki now carry; a Template placeholder matches any filled
// value), or when its normalized text is present in the room's own
// `GLOSSARY.md`, `ARCHITECTURE.md` or Wiki. S-004O TK-009M: a generic
// Template line counts only while the room's vocabulary homes carry the
// Template content (`genericHomesMissing`), and a `| **Term** | Definition |
// Distinction |` row also lands in Matt's glossary format (`termRowLanded`).
// Normalization is the landing
// check's one rule (`tools/check-carrier-landing.mjs` normalizeText): trim and
// collapse whitespace runs to one space. Otherwise the Lexicon is kept and
// the unlanded lines are named in an attention finding, so nothing is lost. A
// removed Lexicon is first copied into the local recovery collection; the
// route's recorded Git commit remains the rollback. A room without a Lexicon
// is unchanged.
export function normalizeLandingText(text) {
  return String(text).replace(/\s+/g, ' ').trim();
}

function landingExempt(text) {
  const normalized = normalizeLandingText(text);
  return !normalized || /^#{1,6} /.test(normalized);
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The generic lines of the Template Lexicon: the one at the room's recorded
// source commit when this release checkout holds it, and the one beside this
// tool while the Template still ships it, or else the last one the release
// history shipped before deleting it. Only the identity stamps (name,
// version, review date, status) match any filled value; a line carrying any
// other placeholder is a slot the room fills with its own content (a term
// row): it matches only left unfilled, and its filled form is project-specific
// and must land in the room.
const LEXICON_STAMP_PLACEHOLDERS = ['[PROJECT_NAME]', '[HARNESS_VERSION]', '[YYYY-MM-DD]', '[active / partial / stale]'];

function templateLexiconMatchers(templates, manifest) {
  const release = path.dirname(templates);
  const sources = [];
  for (const commit of [manifest?.provenance?.source?.commit, manifest?.provenance?.layout?.source?.commit]) {
    if (!/^[0-9a-f]{40}$/.test(commit ?? '')) continue;
    const shown = spawnSync('git', ['show', `${commit}:templates/${RETIRED_LEXICON}`], { cwd: release, encoding: 'utf8' });
    if (shown.status === 0) sources.push(shown.stdout);
  }
  const current = path.join(templates, RETIRED_LEXICON);
  if (lstatOrNull(current)?.isFile()) sources.push(fs.readFileSync(current, 'utf8'));
  else {
    // Once the Template no longer ships the Lexicon, its last shipped text is
    // the parent of the commit that deleted it in this release's history.
    const relative = `${path.relative(release, templates).split(path.sep).join('/')}/${RETIRED_LEXICON}`;
    const deleted = spawnSync('git', ['log', '-1', '--format=%H', '--diff-filter=D', 'HEAD', '--', relative], { cwd: release, encoding: 'utf8' });
    const commit = deleted.status === 0 ? deleted.stdout.trim() : '';
    if (/^[0-9a-f]{40}$/.test(commit)) {
      const shown = spawnSync('git', ['show', `${commit}^:${relative}`], { cwd: release, encoding: 'utf8' });
      if (shown.status === 0) sources.push(shown.stdout);
    }
  }
  const exact = new Set();
  const patterns = [];
  for (const line of sources.flatMap(source => source.split(/\r?\n/))) {
    const normalized = normalizeLandingText(line);
    if (landingExempt(normalized)) continue;
    const tokens = templatePlaceholders.filter(token => normalized.includes(token));
    if (!tokens.length) { exact.add(normalized); continue; }
    if (tokens.some(token => !LEXICON_STAMP_PLACEHOLDERS.includes(token))) { exact.add(normalized); continue; }
    let pattern = escapeRegExp(normalized);
    for (const token of tokens) pattern = pattern.split(escapeRegExp(token)).join('.+?');
    patterns.push(new RegExp(`^${pattern}$`));
  }
  return { exact, patterns, sources: sources.length };
}

function roomLandingText(project, wikiLane) {
  const readFile = (file) => {
    const entry = lstatOrNull(file);
    return entry?.isFile() && !entry.isSymbolicLink() ? fs.readFileSync(file, 'utf8') : null;
  };
  const controls = vocabularyControls.map(name => readFile(path.join(project, name))).filter(text => text !== null);
  const wiki = [];
  const walk = (directory) => {
    const entry = lstatOrNull(directory);
    if (!entry?.isDirectory() || entry.isSymbolicLink()) return;
    for (const child of fs.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, child.name);
      if (child.isDirectory()) walk(full);
      else if (child.isFile() && child.name.endsWith('.md')) wiki.push(fs.readFileSync(full, 'utf8'));
    }
  };
  walk(path.join(project, wikiLane));
  return {
    all: [...controls, ...wiki].map(normalizeLandingText).join('\n'),
    glossary: readFile(path.join(project, 'GLOSSARY.md')) ?? '',
    wiki: wiki.join('\n')
  };
}

// S-004O TK-009M: a generic Template Lexicon line has landed only where the
// room's vocabulary homes carry the Template content: `GLOSSARY.md`,
// `ARCHITECTURE.md` and the Template Wiki vocabulary articles each hold every
// Template line that carries no placeholder, as they do when the update
// installed them from the Template in this run. A home the room wrote itself
// (a glossary started before the update, say) is named here, and the generic
// lines must then land in the room like its own.
function genericHomesMissing(project, templates, wikiLane) {
  const homes = [...vocabularyControls.map(name => [name, name]), ...wikiVocabularyFiles.map(name => [`wiki/${name}`, `${wikiLane}/${name}`])];
  const missing = [];
  for (const [source, destination] of homes) {
    const template = path.join(templates, source);
    if (!lstatOrNull(template)?.isFile()) continue;
    const required = fs.readFileSync(template, 'utf8').split(/\r?\n/).map(normalizeLandingText)
      .filter(line => !landingExempt(line) && !templatePlaceholders.some(token => line.includes(token)));
    const file = path.join(project, destination);
    const entry = lstatOrNull(file);
    const room = entry?.isFile() && !entry.isSymbolicLink() ? new Set(fs.readFileSync(file, 'utf8').split(/\r?\n/).map(normalizeLandingText)) : null;
    if (!room || required.some(line => !room.has(line))) missing.push(destination);
  }
  return missing;
}

// Markdown emphasis, code spans and links reduced to their text, so a
// definition reads the same in a table cell, the glossary and the Wiki.
function stripMarkup(text) {
  return normalizeLandingText(String(text)
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*|__|`/g, '')
    .replace(/(^|[^\w*])\*([^*\s][^*]*?)\*(?=[^\w*]|$)/g, '$1$2')
    .replace(/(^|[^\w])_([^_\s][^_]*?)_(?=[^\w]|$)/g, '$1$2'));
}

// S-004O TK-009M: a Lexicon term row `| **Term** | Definition | Distinction |`
// lands in Matt's glossary format when `GLOSSARY.md` has a `**Term**:` entry,
// the Definition (markup stripped) is in the glossary or the Wiki, and any
// Distinction is in the Wiki.
function termRowLanded(normalized, room) {
  const row = normalized.match(/^\|(.*)\|$/);
  if (!row) return false;
  const cells = row[1].split(/(?<!\\)\|/).map(cell => cell.trim());
  if (cells.length < 2 || cells.length > 3) return false;
  const term = cells[0].match(/^\*\*([^*]+)\*\*$/)?.[1];
  if (!term) return false;
  const entry = `**${normalizeLandingText(term)}**:`.toLowerCase();
  if (!room.glossary.split(/\r?\n/).some(line => normalizeLandingText(line).toLowerCase() === entry)) return false;
  const definition = stripMarkup(cells[1]);
  const distinction = stripMarkup(cells[2] ?? '');
  const glossary = stripMarkup(room.glossary);
  const wiki = stripMarkup(room.wiki);
  if (!definition || !(glossary.includes(definition) || wiki.includes(definition))) return false;
  return !distinction || wiki.includes(distinction);
}

export function lexiconLanding(project, options = {}) {
  const templates = options.templates ?? templateRoot();
  const manifest = options.manifest ?? readManifestFile(project).manifest;
  const lexicon = fs.readFileSync(path.join(project, RETIRED_LEXICON), 'utf8');
  const generic = templates ? templateLexiconMatchers(templates, manifest) : { exact: new Set(), patterns: [], sources: 0 };
  const wikiLane = manifest?.lanes?.wiki ?? lanes.wiki;
  const room = roomLandingText(project, wikiLane);
  const missingHomes = templates ? genericHomesMissing(project, templates, wikiLane) : [];
  const unlanded = [];
  lexicon.split(/\r?\n/).forEach((line, index) => {
    const normalized = normalizeLandingText(line);
    if (landingExempt(normalized)) return;
    // Identity stamps (name, version, review date, status) are not entries.
    if (generic.patterns.some(pattern => pattern.test(normalized))) return;
    const isGeneric = generic.exact.has(normalized);
    if (isGeneric && !missingHomes.length) return;
    if (room.all.includes(normalized) || termRowLanded(normalized, room)) return;
    unlanded.push(isGeneric ? { line: index + 1, text: normalized, generic: true } : { line: index + 1, text: normalized });
  });
  return { unlanded, templateSources: generic.sources, genericHomesMissing: missingHomes };
}

function lexiconFinding(unlanded, missingHomes = []) {
  const named = unlanded.slice(0, 5).map(item => `line ${item.line}: ${item.text}`).join('; ');
  const more = unlanded.length > 5 ? `; and ${unlanded.length - 5} more` : '';
  const homes = missingHomes.length
    ? `; ${missingHomes.join(', ')} ${missingHomes.length === 1 ? 'does' : 'do'} not carry the Template content, so the Template Lexicon's generic lines count only where the room holds them: restore the Template content there or land each generic entry`
    : '';
  return {
    code: 'lexicon-unlanded', severity: 'attention', blocks: 'none',
    message: `${RETIRED_LEXICON} is kept: ${unlanded.length} line(s) have not landed in GLOSSARY.md, ARCHITECTURE.md or the Wiki (${named}${more})${homes}; move each into its home, confirmed by grilling (a term row lands as a \`**Term**:\` glossary entry with its definition, its distinction in a Wiki article), remove each landed row from ${RETIRED_LEXICON}, then rerun the update to retire the Lexicon`,
    lines: unlanded
  };
}

export function retireLexicon(project, options = {}) {
  const lexiconPath = path.join(project, RETIRED_LEXICON);
  const entry = lstatOrNull(lexiconPath);
  if (!entry) return { status: 'absent' };
  if (!entry.isFile() || entry.isSymbolicLink() || entry.nlink > 1) {
    return { status: 'kept', installed: [], articles: [], unlanded: [], finding: { code: 'lexicon-unlanded', severity: 'attention', blocks: 'none', message: `${RETIRED_LEXICON} is kept: it is not an ordinary, unshared file, so its lines cannot be checked`, lines: [] } };
  }
  const templates = templateRoot();
  if (!templates) {
    return { status: 'kept', installed: [], articles: [], unlanded: [], finding: { code: 'lexicon-unlanded', severity: 'attention', blocks: 'none', message: `${RETIRED_LEXICON} is kept: run the update from the Workbench release checkout, whose Template carries GLOSSARY.md and ARCHITECTURE.md`, lines: [] } };
  }
  const { manifest } = readManifestFile(project);
  const lexicon = fs.readFileSync(lexiconPath, 'utf8');
  const values = {
    '[HARNESS_VERSION]': String(options['--version'] ?? manifest?.workbenchVersion ?? '').replace(/^v/, ''),
    '[YYYY-MM-DD]': options['--date'] ?? new Date().toISOString().slice(0, 10),
    '[PROJECT_NAME]': options['--name'] ?? lexicon.match(/^# (.+?) - Lexicon\s*$/m)?.[1] ?? path.basename(project)
  };
  const installed = [];
  for (const name of vocabularyControls) {
    const destination = path.join(project, name);
    if (lstatOrNull(destination)) continue;
    writeSafeFile(project, destination, fillTemplate(fs.readFileSync(path.join(templates, name), 'utf8'), values));
    installed.push(name);
  }
  const seeded = seedWiki(project, { '--version': values['[HARNESS_VERSION]'], '--date': values['[YYYY-MM-DD]'], '--name': values['[PROJECT_NAME]'] }, [], wikiVocabularyFiles);
  const articles = seeded.articles ?? [];
  const { unlanded, genericHomesMissing: missingHomes } = lexiconLanding(project, { templates, manifest });
  if (unlanded.length) return { status: 'kept', installed, articles, unlanded, genericHomesMissing: missingHomes, finding: lexiconFinding(unlanded, missingHomes) };
  const backupDirectory = `${collections.recovery}/lexicon-retirement`;
  let backup = `${backupDirectory}/${RETIRED_LEXICON}`;
  for (let index = 1; lstatOrNull(path.join(project, backup)); index += 1) backup = `${backupDirectory}/LEXICON.${index}.md`;
  fs.mkdirSync(path.join(project, backupDirectory), { recursive: true });
  writeSafeFile(project, path.join(project, backup), lexicon);
  fs.unlinkSync(lexiconPath);
  return { status: 'retired', installed, articles, backup };
}

// Bring the seeded lane documents this release carries into a room and record
// the generation of each one. Nothing here rewrites content it did not add: a
// document is written only when it is absent, or when its bytes still match the
// hash this command recorded when it last wrote it. A copy the room adjusted,
// or one whose generation this command cannot establish from bytes it can see,
// is retained untouched and reported by name.
export function seedLaneDocuments(project, options = {}) {
  const { manifest, failure } = readManifestFile(path.resolve(project));
  if (failure) return failure;
  const source = sourceIdentity({ ...options, '--version': options['--version'] ?? manifest.workbenchVersion });
  if (source.status) return source;
  const seedFailure = preflightSeedDocuments(project);
  if (seedFailure) return seedFailure;
  const unsafe = preflightSeedDocuments(project, options);
  if (unsafe) return unsafe;
  return writeSeedDocuments(project, { ...options, '--version': source.release });
}

// Check every consumed source and destination, including record-only paths,
// before a lifecycle command changes its manifest or ignore file.
function preflightSeedDocuments(project, options = {}) {
  const rootEntry = lstatOrNull(path.resolve(project));
  if (!rootEntry?.isDirectory() || rootEntry.isSymbolicLink()) return fail('invalid-project', 'Seed destination must be an ordinary project directory.');
  const templates = templateRoot();
  if (!templates) return fail('invalid-source-identity', 'A clean Workbench release checkout is required to seed documents.');
  try {
    assertSafeWritePath(project, path.join(project, SEED_RECORD));
    for (const document of seededLaneDocuments.filter(document => !options.notepadOnly || document.lane === 'sessions')) {
      const source = path.join(templates, document.template);
      assertSafeReadPath(path.dirname(templates), source);
      if (!lstatOrNull(source)?.isFile()) return fail('invalid-source-identity', `Missing ordinary seed source: ${document.template}`);
      const destination = path.join(project, lanes[document.lane], document.name);
      assertSafeReadPath(project, destination);
      assertSafeWritePath(project, destination);
    }
  } catch (error) { return fail('lane-collision', error.message); }
  return null;
}

function writeSeedDocuments(project, options) {
  const root = path.resolve(project);
  const templates = templateRoot();
  if (!templates) return fail('invalid-source-identity', 'This copy is not inside a verified Workbench release checkout; seeded lane documents cannot be copied from bytes it cannot verify.');
  const { manifest, failure } = readManifestFile(root);
  if (failure) return failure;
  if (manifest.schemaVersion === 1) return fail('upgrade-required', 'Manifest schema 1 is the v3.0 five-lane layout; run workbench-layout.mjs migrate --project PATH once.', { schemaVersion: 1 });
  if (manifest.schemaVersion !== SCHEMA_VERSION) return fail('invalid-manifest', 'Manifest schemaVersion is invalid.');
  const release = options['--version'] ?? manifest.workbenchVersion;
  const record = readSeedRecord(root) ?? { schemaVersion: SEED_SCHEMA_VERSION, source: SEED_SOURCE, documents: {} };
  const documents = { ...record.documents };
  const written = [];
  const retained = [];
  for (const document of seededLaneDocuments.filter(document => !options.notepadOnly || document.lane === 'sessions')) {
    const relative = `${lanes[document.lane]}/${document.name}`;
    const destination = path.join(root, relative);
    const source = path.join(templates, document.template);
    if (!lstatOrNull(source)) { retained.push({ document: relative, reason: `the release carries no ${document.template}` }); continue; }
    const bytes = fs.readFileSync(source);
    const contentHash = digest(bytes);
    const entry = lstatOrNull(destination);
    if (entry && (entry.isSymbolicLink() || !entry.isFile())) { retained.push({ document: relative, reason: 'the installed path is not an ordinary file' }); continue; }
    if (!entry) {
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      writeSafeFile(root, destination, bytes);
      documents[relative] = { release, contentHash };
      written.push({ document: relative, action: 'seeded' });
      continue;
    }
    const installed = digest(fs.readFileSync(destination));
    if (installed === contentHash) {
      // Byte equality with the release copy is evidence of the generation, so a
      // hand-copied document a room already carries can be recorded truthfully.
      documents[relative] = { release, contentHash };
      written.push({ document: relative, action: 'recorded' });
      continue;
    }
    if (documents[relative]?.contentHash === installed) {
      writeSafeFile(root, destination, bytes);
      documents[relative] = { release, contentHash };
      written.push({ document: relative, action: 'refreshed' });
      continue;
    }
    retained.push({ document: relative, reason: documents[relative] ? 'the installed copy was changed after it was seeded' : 'the installed copy matches no generation this command can verify' });
  }
  // A run that established nothing writes nothing: an empty record would claim
  // the room tracks generations it cannot actually name.
  if (written.length) writeSafeFile(root, path.join(root, SEED_RECORD), `${JSON.stringify({ schemaVersion: SEED_SCHEMA_VERSION, source: SEED_SOURCE, documents }, null, 2)}\n`);
  return report('seeded', { release, record: SEED_RECORD, written, retained });
}

function digest(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

// The seed record, or null when the room has none or carries a record this
// tool did not write. A foreign or malformed record records no generation.
export function readSeedRecord(project) {
  const target = path.join(path.resolve(project), SEED_RECORD);
  const entry = lstatOrNull(target);
  if (!entry?.isFile() || entry.isSymbolicLink()) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(target, 'utf8'));
    if (parsed?.schemaVersion !== SEED_SCHEMA_VERSION || parsed.source !== SEED_SOURCE) return null;
    return { ...parsed, documents: parsed.documents && typeof parsed.documents === 'object' ? parsed.documents : {} };
  } catch { return null; }
}

// A seeded lane document whose recorded release is not the manifest's is behind
// the release the room runs. Version equality, not content freshness: a room
// may adjust a seeded document locally and stay current.
export function seededDocumentFindings(project) {
  const root = path.resolve(project);
  const { manifest, failure } = readManifestFile(root);
  if (failure || manifest?.schemaVersion !== SCHEMA_VERSION) return [];
  const expected = manifest.workbenchVersion;
  const record = readSeedRecord(root);
  if (!expected || !record) return [];
  const findings = [];
  for (const [document, entry] of Object.entries(record.documents)) {
    const release = entry?.release;
    if (typeof release !== 'string' || release === expected) continue;
    findings.push(finding('stale-seed', `${document} was seeded from ${release} but the manifest runs ${expected}; re-copy it from the ${expected} release`, { document, release, expected }));
  }
  return findings;
}

// The manifest's recorded source identity is what lets a later review
// reproduce the installation. A placeholder, an absent field, or a release that
// disagrees with the room's own workbenchVersion is reported by name so the
// room can re-record it with `record-source`; none of it blocks.
export function provenanceFindings(project) {
  const root = path.resolve(project);
  const { manifest, failure } = readManifestFile(root);
  if (failure || manifest?.schemaVersion !== SCHEMA_VERSION) return [];
  const source = manifest.provenance?.source;
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return [finding('unverified-provenance', 'workbench/manifest.json records no provenance.source; run workbench-layout.mjs record-source from a clean release checkout')];
  }
  const findings = [];
  if (!/^[0-9a-f]{40}$/.test(String(source.commit ?? ''))) {
    findings.push(finding('unverified-provenance', `workbench/manifest.json provenance.source.commit ${JSON.stringify(source.commit ?? null)} is not a full 40-character Git commit; the recorded install cannot be reproduced`, { field: 'commit' }));
  }
  if (!String(source.repository ?? '').trim()) {
    findings.push(finding('unverified-provenance', 'workbench/manifest.json provenance.source.repository is empty; the recorded install names no origin', { field: 'repository' }));
  }
  if (String(source.release ?? '') !== String(manifest.workbenchVersion)) {
    findings.push(finding('unverified-provenance', `workbench/manifest.json provenance.source.release ${JSON.stringify(source.release ?? null)} disagrees with workbenchVersion ${manifest.workbenchVersion}`, { field: 'release', release: source.release ?? null, expected: manifest.workbenchVersion }));
  }
  return findings;
}

// Record verified source identity for a room that already exists, under the
// same clean-release-checkout verification `init` carries. Nothing else in the
// manifest changes, and a source it cannot verify is never written.
export function recordSource(options) {
  const project = path.resolve(options['--project']);
  return withIdentityLock(project, () => recordSourceUnlocked(options));
}

function recordSourceUnlocked(options) {
  const project = path.resolve(options['--project']);
  const { manifest, manifestPath, failure } = readManifestFile(project);
  if (failure) return failure;
  if (manifest.schemaVersion === 1) {
    return fail('upgrade-required', 'Manifest schema 1 is the v3.0 five-lane layout; run workbench-layout.mjs migrate --project PATH once.', { schemaVersion: 1 });
  }
  if (manifest.schemaVersion !== SCHEMA_VERSION) return fail('invalid-manifest', 'Manifest schemaVersion is invalid.');
  const version = options['--version'] ?? manifest.workbenchVersion;
  const source = sourceIdentity({ ...options, '--version': version });
  if (source.status) return source;
  const updated = { ...manifest, provenance: { ...manifest.provenance, source } };
  writeSafeFile(project, manifestPath, `${JSON.stringify(updated, null, 2)}\n`);
  return report('recorded', { manifestPath, source });
}

// Declare or replace the legibility surface of an existing room: all six
// entries at once (declare a bracketed placeholder rather than omit one, so
// the gap stays visible), optionally marked pending for grilling. Nothing else
// in the manifest changes, under the same lock every manifest writer takes.
export function declareLegibility(options) {
  const project = path.resolve(options['--project']);
  return withIdentityLock(project, () => declareLegibilityUnlocked(project, options));
}

function declareLegibilityUnlocked(project, options) {
  const { manifest, manifestPath, failure } = readManifestFile(project);
  if (failure) return failure;
  if (manifest.schemaVersion === 1) {
    return fail('upgrade-required', 'Manifest schema 1 is the v3.0 five-lane layout; run workbench-layout.mjs migrate --project PATH once.', { schemaVersion: 1 });
  }
  if (manifest.schemaVersion !== SCHEMA_VERSION) return fail('invalid-manifest', 'Manifest schemaVersion is invalid.');
  const legibility = {};
  for (const entry of LEGIBILITY_ENTRIES) {
    const value = options[`--${entry}`];
    if (typeof value !== 'string' || !value.trim()) return fail('invalid-invocation', `declare-legibility requires --${entry}; declare a bracketed placeholder such as [${entry.toUpperCase()}_COMMAND] rather than omit it.`, { entry });
    legibility[entry] = value;
  }
  if (options['--pending']) legibility.confirmation = LEGIBILITY_PENDING;
  writeSafeFile(project, manifestPath, `${JSON.stringify({ ...manifest, legibility }, null, 2)}\n`);
  return report('declared', { manifestPath, legibility });
}

// Assign once in an existing room. Commit this manifest before making clones
// of a legacy room so they share its connection identity. No machine path is
// stored in the project, and read-only validation never allocates an identity.
export function identify(options) {
  if (Object.keys(options).some(key => key !== '--project')) return fail('invalid-invocation', 'identify accepts only --project; independent rooms receive identity during initialization.');
  const project = path.resolve(options['--project']);
  return withIdentityLock(project, () => identifyUnlocked(project));
}

function withIdentityLock(project, operation, { initialize = false } = {}) {
  const manifestPath = path.join(project, 'workbench/manifest.json');
  const lock = path.join(project, 'workbench/.identity.lock');
  let descriptor;
  try {
    assertSafeWritePath(project, manifestPath);
    if (initialize) fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    else {
      const existing = readManifestFile(project);
      if (existing.failure) return existing.failure;
    }
    assertSafeWritePath(project, lock);
    descriptor = fs.openSync(lock, 'wx', 0o600);
    return operation();
  } catch (error) {
    return fail(error.code === 'EEXIST' ? 'identity-busy' : 'identity-write-failed', error.code === 'EEXIST' ? 'Identity assignment is already active; preserve the lock and retry after its owner finishes.' : error.message);
  } finally {
    if (descriptor !== undefined) { fs.closeSync(descriptor); fs.unlinkSync(lock); }
  }
}

function identifyUnlocked(project) {
  const current = validateManifest(project);
  if (current.status !== 'valid') return current;
  if (current.manifest.workbenchId) return report('current', { workbenchId: current.manifest.workbenchId });
  const workbenchId = allocateWorkbenchId();
  const updated = { ...current.manifest, workbenchId };
  const manifestPath = path.join(project, 'workbench/manifest.json');
  writeSafeFile(project, manifestPath, JSON.stringify(updated, null, 2) + '\n');
  if (JSON.parse(fs.readFileSync(manifestPath, 'utf8')).workbenchId !== workbenchId) throw new Error('Workbench identity read-back failed');
  return report('identified', { workbenchId });
}

// S-00I TK-01U: create the additive features collection as an ordinary
// directory, never through a link, and seed only its README (when absent) from
// the release templates. A refusal is returned before anything is written.
function addFeaturesCollection(project, manifest) {
  const relative = collections.features;
  try { assertSafeWritePath(project, path.join(project, relative, '.gitkeep')); }
  catch (error) { return fail('lane-collision', error.message); }
  const entry = lstatOrNull(path.join(project, relative));
  if (entry && (entry.isSymbolicLink() || !entry.isDirectory())) return fail('lane-collision', `${relative} must be an ordinary directory.`);
  fs.mkdirSync(path.join(project, relative), { recursive: true });
  const seeded = seedWiki(project, { '--version': manifest.workbenchVersion }, ['features/README.md']);
  if (!fs.readdirSync(path.join(project, relative)).length) fs.writeFileSync(path.join(project, relative, '.gitkeep'), '');
  return { seeded };
}

// S-003X TK-004W: the `ddr` collection's lifecycle folders, as
// project-relative paths, so layout preflight checks them like any other
// declared directory.
function decisionRecordFolders() {
  return DECISION_RECORD_LIFECYCLE_FOLDERS.map(folder => `${collections.ddr}/${folder}`);
}

// Create each missing lifecycle folder of a decision-record collection as an
// ordinary directory kept by a `.gitkeep`; an existing folder and anything
// already in it are left exactly as they are. Callers check every path first.
function createDecisionRecordFolders(project, relative) {
  for (const folder of DECISION_RECORD_LIFECYCLE_FOLDERS) {
    const target = path.join(project, relative, folder);
    fs.mkdirSync(target, { recursive: true });
    if (!fs.readdirSync(target).length) fs.writeFileSync(path.join(target, '.gitkeep'), '');
  }
}

// S-003X TK-004W: check every directory the named additive collections would
// create before the first one writes, so a refusal leaves the room unchanged.
function additivePreflight(project, names) {
  for (const name of names) {
    if (!ADDITIVE_COLLECTIONS.includes(name)) throw new Error(`${name} is not an additive collection`);
    for (const directory of name === 'ddr' ? [collections.ddr, ...decisionRecordFolders()] : [collections[name]]) {
      try { assertSafeWritePath(project, path.join(project, directory, '.gitkeep')); }
      catch (error) { return fail('lane-collision', error.message); }
      const entry = lstatOrNull(path.join(project, directory));
      if (entry && (entry.isSymbolicLink() || !entry.isDirectory())) return fail('lane-collision', `${directory} must be an ordinary directory.`);
    }
  }
  return null;
}

// S-003X TK-004W: add the additive ddr collection to an existing room. Every
// path it would create is checked before anything is written: the collection
// and its lifecycle folders must each be an ordinary directory or absent. An
// existing folder is adopted with its contents untouched; only missing
// lifecycle folders are created. ADR records are never read or written.
function addDdrCollection(project) {
  const relative = collections.ddr;
  for (const directory of [relative, ...decisionRecordFolders()]) {
    try { assertSafeWritePath(project, path.join(project, directory, '.gitkeep')); }
    catch (error) { return fail('lane-collision', error.message); }
    const entry = lstatOrNull(path.join(project, directory));
    if (entry && (entry.isSymbolicLink() || !entry.isDirectory())) return fail('lane-collision', `${directory} must be an ordinary directory.`);
  }
  fs.mkdirSync(path.join(project, relative), { recursive: true });
  createDecisionRecordFolders(project, relative);
  return {};
}

// S-003Z TK-008D: add the additive landmarks collection to an existing room:
// the empty folder, kept by a `.gitkeep`, and nothing else. An existing
// ordinary folder is adopted with its contents untouched; `LANDMARK.md`
// artifacts are never read or written here, and the Tracker's JSON landmark
// records are a different collection that stays where it is.
function addLandmarksCollection(project) {
  const relative = collections.landmarks;
  try { assertSafeWritePath(project, path.join(project, relative, '.gitkeep')); }
  catch (error) { return fail('lane-collision', error.message); }
  const entry = lstatOrNull(path.join(project, relative));
  if (entry && (entry.isSymbolicLink() || !entry.isDirectory())) return fail('lane-collision', `${relative} must be an ordinary directory.`);
  fs.mkdirSync(path.join(project, relative), { recursive: true });
  if (!fs.readdirSync(path.join(project, relative)).length) fs.writeFileSync(path.join(project, relative, '.gitkeep'), '');
  return {};
}

function validateManifestShape(manifest) {
  if (!/^v\d+\.\d+\.\d+$/.test(manifest.workbenchVersion ?? '')) return fail('invalid-version', 'Workbench version must use vMAJOR.MINOR.PATCH.');
  if (!['genesis', 'adoption', 'upgrade'].includes(manifest.provenance.lifecycle)) return fail('invalid-provenance', 'Provenance must be genesis, adoption, or upgrade.');
  if (!WIKI_PROFILES.includes(manifest.wiki.profile)) return fail('invalid-wiki-profile', `Wiki profile must be one of ${WIKI_PROFILES.join(', ')}.`);
  return null;
}

// Lossless schema 1 -> 2 migration: the five-lane layout renames its
// grilling lane into sessions, its tracked handoffs checkpoints into
// sessions/checkpoints, and gains docs, tools, and the seven collections.
// S-004O TK-009G: the managed update route also retires a room's Lexicon once
// its lines have landed (`retireLexicon`); a room without one is unchanged.
export function migrate(options) {
  const project = path.resolve(options['--project']);
  return withIdentityLock(project, () => {
    const result = migrateUnlocked(options);
    if (!['migrated', 'current'].includes(result.status) || result.manifest?.schemaVersion !== SCHEMA_VERSION) return result;
    const lexicon = retireLexicon(project, options);
    if (lexicon.status === 'absent') return result;
    const changed = lexicon.status === 'retired' || lexicon.installed.length > 0 || lexicon.articles.length > 0;
    return { ...result, status: changed ? 'migrated' : result.status, lexicon };
  });
}

function migrateUnlocked(options) {
  const project = path.resolve(options['--project']);
  const { manifest, manifestPath, failure } = readManifestFile(project);
  if (failure) return failure;
  if (Object.hasOwn(manifest, 'workbenchId') && !isWorkbenchId(manifest.workbenchId)) return fail('invalid-workbench-identity', 'Malformed Workbench identity must be reconciled before migration.');
  if (manifest.schemaVersion === SCHEMA_VERSION) {
    const valid = validateManifest(project);
    if (valid.status !== 'valid') return valid;
    // S-00V: a room stamped before the skills lane declares six lanes and the
    // provider-home skill policy. Migration declares the seventh lane and
    // the lane policy (the required list is untouched) and creates the empty
    // lane, so `workbench-skills.mjs install` can lay the skills down next.
    if (!manifest.lanes.skills) {
      // The placeholder path checks every ancestor (workbench/, the lane) as
      // an ordinary directory or absent; the lane itself may already exist,
      // empty or holding room-local skills, and is checked explicitly next.
      try { assertSafeWritePath(project, path.join(project, lanes.skills, '.gitkeep')); }
      catch (error) { return fail('lane-collision', error.message); }
      const laneEntry = lstatOrNull(path.join(project, lanes.skills));
      if (laneEntry && (laneEntry.isSymbolicLink() || !laneEntry.isDirectory())) return fail('lane-collision', `${lanes.skills} must be an ordinary directory.`);
      fs.mkdirSync(path.join(project, lanes.skills), { recursive: true });
      if (!fs.readdirSync(path.join(project, lanes.skills)).length) fs.writeFileSync(path.join(project, lanes.skills, '.gitkeep'), '');
      const updated = { ...manifest, lanes: { ...manifest.lanes, skills: lanes.skills }, skillPolicy: { ...skillPolicy, required: manifest.skillPolicy.required } };
      writeSafeFile(project, manifestPath, `${JSON.stringify(updated, null, 2)}\n`);
      return report('migrated', { manifestPath, manifest: updated, moved: [], added: ['lanes.skills'], next: 'run workbench-skills.mjs install --project PATH from the release checkout' });
    }
    // S-00I TK-01U: a room stamped with the current pre-feature collection
    // set gains the features collection additively: the directory is created
    // (seeded with its README when the release templates are beside this
    // tool) and the declaration is appended; nothing else changes.
    // S-003X TK-004W: the same route appends every later additive collection
    // the room lacks, in declaration order, so a pre-feature room also gains
    // `ddr` and a room stamped with the pre-DDR set gains `ddr` onward.
    // S-003Z TK-008D: a room stamped with the current pre-landmark set gains
    // only `landmarks`. Every addition is checked before the first one writes.
    const additive = JSON.stringify(manifest.collections) === JSON.stringify(PRE_FEATURE_COLLECTIONS) ? ['features', 'ddr', 'landmarks']
      : JSON.stringify(manifest.collections) === JSON.stringify(PRE_DDR_COLLECTIONS) ? ['ddr', 'landmarks']
      : JSON.stringify(manifest.collections) === JSON.stringify(PRE_LANDMARK_COLLECTIONS) ? ['landmarks'] : null;
    if (additive) {
      const blocked = additivePreflight(project, additive);
      if (blocked) return blocked;
      let seeded;
      if (additive.includes('features')) {
        const added = addFeaturesCollection(project, manifest);
        if (added.status) return added;
        seeded = added.seeded;
      }
      if (additive.includes('ddr')) {
        const addedDdr = addDdrCollection(project);
        if (addedDdr.status) return addedDdr;
      }
      const addedLandmarks = addLandmarksCollection(project);
      if (addedLandmarks.status) return addedLandmarks;
      const updated = { ...manifest, collections };
      writeSafeFile(project, manifestPath, `${JSON.stringify(updated, null, 2)}\n`);
      return report('migrated', { manifestPath, manifest: updated, moved: [], added: additive.map(name => `collections.${name}`), ...(seeded ? { seeded } : {}) });
    }
    if (JSON.stringify(manifest.collections) === JSON.stringify(collections)) {
      try { assertSafeReadPath(project, path.join(project, SEED_RECORD)); }
      catch (error) { return fail('lane-collision', error.message); }
      const seeds = readSeedRecord(project);
      const missing = seededLaneDocuments.filter(document => document.lane === 'sessions').map(document => `${lanes.sessions}/${document.name}`)
        .filter(relative => !seeds?.documents?.[relative] || !lstatOrNull(path.join(project, relative))?.isFile());
      if (missing.length) return fail('missing-collection', 'Notepad layout seeding is incomplete; run seed-documents from the clean release checkout before retrying migrate.', { missing });
      if (!manifest.workbenchId) {
        const assigned = identifyUnlocked(project);
        if (!['identified', 'current'].includes(assigned.status)) return assigned;
        return report('migrated', { manifestPath, manifest: { ...manifest, workbenchId: assigned.workbenchId }, moved: [] });
      }
      return report('current', { manifestPath, manifest });
    }
    const unsafe = preflightLayout(project);
    if (unsafe) return unsafe;
    const recovery = path.join(project, collections.recovery);
    if (!manifest.collections.recovery && lstatOrNull(recovery) && fs.readdirSync(recovery).some(name => name !== '.gitkeep')) {
      return fail('lane-collision', 'The undeclared operational recovery location contains existing material; reconcile it before migration.');
    }
    const source = sourceIdentity({ ...options, '--version': options['--version'] ?? manifest.workbenchVersion });
    if (source.status) return source;
    const seedFailure = preflightSeedDocuments(project);
    if (seedFailure) return seedFailure;
    for (const name of ['notepads', 'notepad-templates', 'recovery']) fs.mkdirSync(path.join(project, collections[name]), { recursive: true });
    const addedFeatures = addFeaturesCollection(project, manifest);
    if (addedFeatures.status) return addedFeatures;
    const addedDdr = addDdrCollection(project);
    if (addedDdr.status) return addedDdr;
    const addedLandmarks = addLandmarksCollection(project);
    if (addedLandmarks.status) return addedLandmarks;
    writeSessionsIgnore(project);
    const updated = { ...manifest, workbenchId: manifest.workbenchId ?? allocateWorkbenchId(), collections, provenance: { ...manifest.provenance, layout: { source } } };
    writeSafeFile(project, manifestPath, `${JSON.stringify(updated, null, 2)}\n`);
    const documents = writeSeedDocuments(project, { '--version': source.release });
    return report('migrated', { manifestPath, manifest: updated, moved: [], documents });
  }
  if (manifest.schemaVersion !== 1) return fail('invalid-manifest', 'Only schema 1 manifests can be migrated.');
  if (JSON.stringify(manifest.lanes) !== JSON.stringify(legacyLanes)) return fail('invalid-lane', 'Schema 1 lanes are not the v3.0 layout; reconcile them before migrating.');
  const unsafe = preflightLayout(project, Object.values(legacyLanes));
  if (unsafe) return unsafe;
  const shape = validateManifestShape({ workbenchVersion: options['--version'] ?? manifest.workbenchVersion, provenance: manifest.provenance, wiki: { profile: options['--wiki-profile'] ?? 'project' } });
  if (shape) return shape;
  const declaration = gitDeclaration(project, options);
  if (declaration.status !== 'declared') return declaration;
  const moves = [
    { from: legacyLanes.grilling, to: collections.grilling },
    { from: legacyLanes.handoffs, to: collections.checkpoints }
  ];
  for (const move of moves) {
    if (lstatOrNull(path.join(project, move.to))) return fail('lane-collision', `${move.to} already exists; migration must not overwrite it.`);
  }
  for (const relative of [lanes.docs, lanes.tools, lanes.sessions]) {
    const entry = lstatOrNull(path.join(project, relative));
    if (entry && (entry.isSymbolicLink() || !entry.isDirectory())) return fail('lane-collision', `${relative} is not a directory.`);
  }
  const source = sourceIdentity({ ...options, '--version': options['--version'] ?? manifest.workbenchVersion });
  if (source.status) return source;
  const seedFailure = preflightSeedDocuments(project);
  if (seedFailure) return seedFailure;
  const moved = [];
  fs.mkdirSync(path.join(project, lanes.sessions), { recursive: true });
  for (const move of moves) {
    const source = path.join(project, move.from);
    if (!lstatOrNull(source)) continue;
    fs.renameSync(source, path.join(project, move.to));
    moved.push(move);
  }
  for (const relative of [...Object.values(lanes), ...Object.values(collections)]) {
    const target = path.join(project, relative);
    fs.mkdirSync(target, { recursive: true });
    if (relative === collections.ddr) createDecisionRecordFolders(project, relative);
    if (!fs.readdirSync(target).length) fs.writeFileSync(path.join(target, '.gitkeep'), '');
  }
  writeSessionsIgnore(project);
  const migrated = {
    schemaVersion: SCHEMA_VERSION,
    workbenchVersion: options['--version'] ?? manifest.workbenchVersion,
    workbenchId: manifest.workbenchId ?? allocateWorkbenchId(),
    provenance: { ...manifest.provenance, migratedFrom: 1, source },
    git: declaration.git,
    lanes,
    collections,
    wiki: { profile: options['--wiki-profile'] ?? 'project' },
    skillPolicy
  };
  writeSafeFile(project, manifestPath, `${JSON.stringify(migrated, null, 2)}\n`);
  const seeded = seedWiki(project, { '--version': migrated.workbenchVersion, ...options });
  const validation = validateManifest(project);
  if (validation.status !== 'valid') return report('partial', { moved, error: validation.error });
  const documents = writeSeedDocuments(project, { '--version': migrated.workbenchVersion });
  return report('migrated', { manifestPath, manifest: migrated, moved, seeded, documents });
}

function validateGenesisControl(project, control, expectedVersion) {
  const target = path.join(project, control);
  const entry = lstatOrNull(target);
  if (!entry || entry.isSymbolicLink() || !entry.isFile()) return fail('unsafe-control', `${control} must be an ordinary file.`, { control });
  const content = fs.readFileSync(target, 'utf8');
  const trimmed = content.trim();
  if (!trimmed || trimmed === control || containsPlaceholder(content)) {
    return fail('unfilled-control', `${control} must be filled and contain no template placeholders.`, { control });
  }
  if (control === 'CLAUDE.md') {
    if (trimmed !== '@AGENTS.md') return fail('unfilled-control', 'CLAUDE.md must be exactly `@AGENTS.md`.', { control });
    return null;
  }
  if (!/^#\s+\S/m.test(content) || !/^##\s+\S/m.test(content)) return fail('unfilled-control', `${control} must contain filled control content.`, { control });
  for (const marker of generatedRegions[control] ?? []) {
    if (!content.includes(marker)) return fail('unfilled-control', `${control} must keep the generated region marker ${marker} so render and doctor can project the first spec.`, { control, reason: `missing generated region marker ${marker}` });
  }
  if (control !== 'BLUEPRINT.md' && versionStamp(content) !== expectedVersion) return fail('version-mismatch', `${control} must match manifest Workbench version ${expectedVersion}.`, { control });
  return null;
}

function validateFirstSpec(project, expectedVersion) {
  const specsRoot = path.join(project, lanes.specs);
  const entries = fs.readdirSync(specsRoot, { withFileTypes: true }).filter((entry) => !entry.name.startsWith('.') && !(entry.name === 'CATALOG.md' && entry.isFile()));
  const names = entries.map((entry) => entry.name).sort();
  if (entries.length === 0) return fail('missing-first-spec', 'Genesis must create a first spec in workbench/specs.');
  if (entries.length !== 1 || !entries[0].isDirectory() || !/^S-[0-9A-Za-z]{3,}-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entries[0].name)) {
    return fail('invalid-first-spec', 'Genesis must create one stable S-###-slug/SPEC.md packet.', { entries: names, reason: `the specs lane must contain exactly one stable S-###-slug directory; found ${names.join(', ')}` });
  }
  const expectedId = entries[0].name.match(/^(S-[0-9A-Za-z]+)-/)[1];
  const specPath = path.join(specsRoot, entries[0].name, 'SPEC.md');
  const specEntry = lstatOrNull(specPath);
  if (!specEntry || specEntry.isSymbolicLink() || !specEntry.isFile()) return fail('invalid-first-spec', 'The first spec must be an ordinary SPEC.md file.', { specPath, reason: 'SPEC.md is missing, a symlink, or not a regular file' });
  const content = fs.readFileSync(specPath, 'utf8');
  const requiredSections = ['Outcome', 'Vertical Implementation Slices', 'Acceptance Criteria', 'Completion Result'];
  let packet;
  try { packet = parseSpecPacket(content, specPath, project); } catch (error) {
    return fail('invalid-first-spec', error.message, { specPath, reason: error.message });
  }
  const predicates = [
    ['the packet must contain no template placeholder', () => !containsPlaceholder(content)],
    [`the packet must carry the Generated from LLM Workbench ${expectedVersion} stamp`, () => versionStamp(content) === expectedVersion],
    [`Spec ID must be ${expectedId} to match its directory`, () => packet.id === expectedId],
    [`the packet must live at ${lanes.specs}/${entries[0].name}/SPEC.md`, () => packet.relativePath === `${lanes.specs}/${entries[0].name}/SPEC.md`],
    ['Status must be active so the work loop can select it', () => packet.status === 'active'],
    ['Priority must be a single digit 0-9', () => Number.isInteger(packet.priority) && packet.priority >= 0 && packet.priority <= 9],
    ['at least one task must be ready with blockers none', () => packet.rows.some((row) => row.status === 'ready' && row.blockers === 'none')],
    [`the sections ${requiredSections.join(', ')} must all exist`, () => requiredSections.every((section) => new RegExp(`^## ${section}$`, 'm').test(content))],
    ['at least one acceptance criterion must remain unchecked', () => /^- \[ \] \S/m.test(content)]
  ];
  for (const [reason, holds] of predicates) {
    if (!holds()) return fail('invalid-first-spec', `The first spec is not an actionable version-matched Workbench packet: ${reason}.`, { specPath, reason });
  }
  return null;
}

export const TOOLS_RECEIPT = '.workbench-tools.json';

// The closed set of Workbench-managed runtime tools. Later capability tasks
// append to this list; the product lane must contain exactly these files.
//
// It lives here, in a tool every room installs, rather than in the release-side
// installer `tools/workbench-tools.mjs`, which is never copied into a room.
// Deriving the expected set from the lane's own contents instead left one
// condition unreachable from inside a room: a managed file deleted together
// with its receipt key leaves nothing on disk to be missed. Ten of the twelve
// tools are in `doctor`'s own import graph, so deleting one of those fails
// loudly at import time - but `sessions.mjs` and `notepads.mjs` are imported
// by none of them, and deleting one was a silent clean run. A room now carries the authoritative
// set, and it is no less trustworthy than the check that reads it: this file
// is itself managed, so rewriting the list means rewriting a managed file,
// which the receipt hash comparison reports.
export const RUNTIME_TOOLS = Object.freeze([
  'adr.mjs',
  'claim-coordination.mjs',
  'diagnostics.mjs',
  'github-coordination.mjs',
  'host-floor.mjs',
  'landmark-artifact.mjs',
  'landmark-tracker.mjs',
  'landmark-wiki.mjs',
  'markdown-table.mjs',
  'notepads.mjs',
  'optional-capabilities.mjs',
  'privacy.mjs',
  'project-evidence.mjs',
  'self-drift.mjs',
  'sessions.mjs',
  'session-transport.mjs',
  'spec-packet.mjs',
  'spec-report.mjs',
  'spec-workbench.mjs',
  'task-packet.mjs',
  'task-receipt.mjs',
  'task-record.mjs',
  'taskboard.mjs',
  'template-placeholders.mjs',
  'visible-ids.mjs',
  'skill-inspection.mjs',
  'wiki.mjs',
  'workbench-layout.mjs',
  'workbench-paths.mjs'
]);

// Readiness also needs the Workbench-managed runtime tools: an installed lane
// whose receipt names the same release as the manifest.
function validateGenesisRuntime(project, expectedVersion) {
  const receiptPath = path.join(project, lanes.tools, TOOLS_RECEIPT);
  const receiptEntry = lstatOrNull(receiptPath);
  if (!receiptEntry?.isFile() || receiptEntry.isSymbolicLink()) {
    return fail('tools-receipt-missing', `${lanes.tools} must carry the Workbench tools receipt; run workbench-tools.mjs install from the release checkout.`, { control: lanes.tools });
  }
  let receipt;
  try { receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8')); } catch (error) {
    return fail('tools-receipt-missing', `${lanes.tools}/${TOOLS_RECEIPT} is unreadable: ${error.message}`, { control: lanes.tools });
  }
  if (receipt.source?.release !== expectedVersion) {
    return fail('version-mismatch', `Tools receipt release ${receipt.source?.release} must match manifest Workbench version ${expectedVersion}.`, { control: lanes.tools, reason: 'runtime tools receipt release differs from the manifest' });
  }
  for (const relative of ['MEMORY.md', ...wikiContractFiles]) {
    const control = `${lanes.wiki}/${relative}`;
    const entry = lstatOrNull(path.join(project, lanes.wiki, relative));
    if (!entry?.isFile() || entry.isSymbolicLink()) return fail('unfilled-control', `${control} must exist as an ordinary file; copy the wiki router and contract from the release templates.`, { control });
    const content = fs.readFileSync(path.join(project, lanes.wiki, relative), 'utf8');
    if (containsPlaceholder(content)) return fail('unfilled-control', `${control} must contain no template placeholders.`, { control });
    if (control !== 'BLUEPRINT.md' && versionStamp(content) !== expectedVersion) return fail('version-mismatch', `${control} must match manifest Workbench version ${expectedVersion}.`, { control, reason: 'wiki stamp differs from the manifest' });
  }
  return null;
}

// Drift alone cannot be acted on: a receipt that has gone stale and a runtime
// somebody edited both report `tools-receipt-drift` and take opposite
// remedies. The comparison that separates them is the installed bytes against
// the release source - not the receipt against the release source, which says
// nothing about what is actually installed. A room carries no release
// checkout, so there the comparison is reported as unavailable rather than
// guessed at.
export const DRIFT_STATES = Object.freeze({
  'receipt-stale': 'the installed bytes are the release source\'s, so the receipt hash is the stale fact; refresh it with `workbench-tools.mjs update --project PATH --explicit-update`, which backs the replaced files up under the user home and records the backup path in the receipt',
  'runtime-modified': 'the installed bytes match neither the receipt nor the release source; restore them with `workbench-tools.mjs rollback --project PATH --backup PATH` from a backup the receipt records, or replace them with `workbench-tools.mjs update --project PATH --explicit-update` once the difference is reviewed',
  'runtime-authentic': 'the installed bytes match both the receipt and the release source, so only the file mode drifted; restore mode 0644 on the managed file',
  'source-unavailable': 'no release source was available to compare the installed bytes against; run `node tools/workbench-tools.mjs verify --project PATH` from a release checkout to classify this drift'
});

function driftState(laneDir, tool, installed, matchesReceipt, sourceLane) {
  if (!sourceLane) return 'source-unavailable';
  const sourceFile = path.join(sourceLane, tool);
  const sourceEntry = lstatOrNull(sourceFile);
  if (!sourceEntry?.isFile() || sourceEntry.isSymbolicLink()) return 'source-unavailable';
  if (installed === null || installed !== sha256(sourceFile)) return 'runtime-modified';
  return matchesReceipt ? 'runtime-authentic' : 'receipt-stale';
}

// A receipt key names one managed file inside the lane. `path.join` on an
// unchecked key resolves `../../AGENTS.md` against the lane, so a receipt
// naming a root control with that control's own true hash would satisfy a
// managed-lane check. A key is a plain lane-relative name or it is not a
// managed file at all.
function isLaneRelativeName(tool) {
  if (typeof tool !== 'string' || tool.length === 0) return false;
  if (path.isAbsolute(tool) || tool.includes('\\')) return false;
  if (tool !== path.posix.normalize(tool)) return false;
  const segments = tool.split('/');
  return !segments.includes('..') && !segments.includes('.') && !segments.includes('');
}

// The managed file map the integrity check reads. A receipt with no map, an
// empty map, or a key outside the lane records nothing verifiable: saying so
// is the only honest answer, because returning no drift from it would read as
// a clean runtime and switch the whole check off.
export function managedReceiptFiles(receipt) {
  const files = receipt?.files;
  if (!files || typeof files !== 'object' || Array.isArray(files)) return { error: 'records no managed file hashes' };
  const entries = Object.entries(files);
  if (entries.length === 0) return { error: 'records no managed file hashes' };
  const escaping = entries.map(([tool]) => tool).filter((tool) => !isLaneRelativeName(tool));
  if (escaping.length) return { error: `names ${escaping.join(', ')} outside the managed lane` };
  return { entries };
}

// Refusing an empty or out-of-lane map still left the receipt in charge of the
// check's SCOPE: the drift report names the file it found, so deleting that one
// key switched the check off for exactly that file while every remaining key
// went on verifying. Nothing compared the receipt's key set against the files
// actually managed. Both entry points now run this comparison against
// `RUNTIME_TOOLS`, so the receipt scopes nothing.
//
// Two conditions, not one, because they have different repairs and a single
// message named a remedy that works for only the first:
//
// `unaccounted` - a managed tool the receipt has no key for, whether or not the
// file is still on disk. The expected set is `RUNTIME_TOOLS`, so a file deleted
// along with its key is named rather than silently leaving the expected set.
// Refreshing the receipt with `update --explicit-update` rewrites the key and
// restores the file, so the remedy named is one that works.
//
// `foreign` - an ordinary lane entry the managed runtime does not include.
// `update`'s changed set is derived from `RUNTIME_TOOLS`, so it can never adopt
// such a file: it reports `current` and changes nothing. The only repair is to
// move the file out of the managed lane, which is what the message must say.
//
// Dotted entries are skipped on both sides: the receipt itself, the installer's
// transient `.receipt-*` staging directory, and editor or VCS droppings are not
// managed runtime.
export function laneCoverage(laneDir, files) {
  const named = new Set(files.entries.map(([tool]) => tool));
  const unaccounted = RUNTIME_TOOLS.filter((tool) => !named.has(tool));
  let entries;
  try { entries = fs.readdirSync(laneDir, { withFileTypes: true }); } catch { entries = []; }
  const foreign = entries
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith('.') && !named.has(name) && !RUNTIME_TOOLS.includes(name))
    .sort();
  return { unaccounted, foreign };
}

// The managed-runtime integrity check, kept in a tool every room carries. The
// installer that writes the receipt (`tools/workbench-tools.mjs`) is never
// copied into a room, so without this the registered `all` effect of
// `tools-receipt-drift` would be unreachable from the room executing the
// runtime. The cost is bounded: at most the managed files the receipt names,
// each read and hashed once, and only when a receipt exists; the release
// source is read only for a file that already drifted.
export function receiptDrift(laneDir, receipt, options = {}) {
  const files = managedReceiptFiles(receipt);
  // Fail loudly rather than return an empty drift list a caller would read as
  // a clean runtime. Both callers classify the same condition first.
  if (files.error) throw new Error(`the managed runtime receipt ${files.error}`);
  const sourceLane = options.sourceLane ?? null;
  const drift = [];
  const entryFor = (tool, reason, installed, matchesReceipt) => {
    const state = driftState(laneDir, tool, installed, matchesReceipt, sourceLane);
    return { tool, reason, state, remedy: DRIFT_STATES[state] };
  };
  for (const [tool, expected] of files.entries) {
    const file = path.join(laneDir, tool);
    const entry = lstatOrNull(file);
    if (!entry?.isFile() || entry.isSymbolicLink()) { drift.push(entryFor(tool, 'missing-or-not-a-file', null, false)); continue; }
    const installed = sha256(file);
    if ((entry.mode & 0o111) !== 0) drift.push(entryFor(tool, 'executable-bit', installed, installed === expected));
    if (installed !== expected) drift.push(entryFor(tool, 'hash', installed, false));
  }
  return drift;
}

// Doctor's half of the same check. A lane with no receipt is not a managed
// runtime and is reported by the Genesis readiness gate, not here; a receipt
// that exists and cannot be read, records no file hashes, or names a file
// outside the lane is reported, because none of those may silently switch the
// integrity check off.
function coverageFinding(relative, reason, remedy) {
  return { code: 'tools-receipt-missing', message: `${relative}/${TOOLS_RECEIPT} ${reason}; ${remedy}`, lane: relative };
}

export function managedRuntimeDrift(project, options = {}) {
  const relative = options.lane ?? lanes.tools;
  const laneDir = path.join(project, relative);
  const receiptPath = path.join(laneDir, TOOLS_RECEIPT);
  const entry = lstatOrNull(receiptPath);
  if (!entry) return null;
  const unreadable = (reason) => ({ code: 'tools-receipt-missing', message: `${relative}/${TOOLS_RECEIPT} ${reason}; reinstall the managed runtime from the release checkout`, lane: relative });
  if (!entry.isFile() || entry.isSymbolicLink()) return unreadable('must be an ordinary file');
  let receipt;
  try { receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8')); } catch (error) { return unreadable(`is unreadable: ${error.message}`); }
  const files = managedReceiptFiles(receipt);
  if (files.error) return unreadable(files.error);
  // Coverage before content: a receipt that does not account for the whole
  // managed runtime cannot scope a trustworthy drift report over part of it,
  // and both conditions block identically, so the operator loses nothing by
  // being told the more fundamental one first. Each condition names the repair
  // that works for it; `reinstall` works for neither, because `install` refuses
  // a lane that already carries a receipt.
  const coverage = laneCoverage(laneDir, files);
  if (coverage.unaccounted.length) {
    return coverageFinding(relative, `does not account for ${coverage.unaccounted.join(', ')}`,
      'refresh it with `workbench-tools.mjs update --project PATH --explicit-update` from a release checkout');
  }
  if (coverage.foreign.length) {
    return coverageFinding(relative, `does not account for ${coverage.foreign.join(', ')}, which the managed runtime does not include`,
      `move it out of ${relative} after reviewing it; \`update\` cannot adopt a file the managed runtime does not include`);
  }
  const drift = receiptDrift(laneDir, receipt);
  if (drift.length === 0) return null;
  const named = drift.map((item) => `${item.tool} (${item.reason}, ${item.state})`).join(', ');
  return { code: 'tools-receipt-drift', message: `${relative} differs from the hashes ${TOOLS_RECEIPT} recorded: ${named}`, lane: relative, drift };
}

// The permission file is the mechanical half of the prose Edit Scope. Claude
// Code applies Edit rules to every built-in tool that edits files; path-scoped
// Write rules are not a second creation permission. The bounded matcher
// recognises the documented project-relative forms and reports any restrictive
// pattern it cannot safely interpret instead of returning a false clear.
export const PERMISSION_FILE = '.claude/settings.json';
const permissionBuckets = ['allow', 'ask', 'deny'];

function parsePermissionRule(rule) {
  if (rule === 'Edit' || rule === 'Write') return { tool: rule, bare: true };
  const match = typeof rule === 'string' ? rule.match(/^(Edit|Write)\((.*)\)$/) : null;
  if (!match) return null;
  return { tool: match[1], bare: false, pattern: match[2] };
}

function normalizedPermissionPaths(pattern, lane, project) {
  const absoluteLane = path.resolve(project, lane).replaceAll('\\', '/');
  if (pattern.startsWith('//')) {
    return { candidate: path.normalize(pattern.slice(1)).replaceAll('\\', '/'), lane: absoluteLane };
  }
  if (pattern.startsWith('~/')) {
    return { candidate: path.resolve(os.homedir(), pattern.slice(2)).replaceAll('\\', '/'), lane: absoluteLane };
  }
  return { candidate: pattern.replace(/^\.\//, '').replace(/^\//, ''), lane };
}

function pathRelation(pattern, lane, project) {
  const { candidate: relative, lane: comparedLane } = normalizedPermissionPaths(pattern, lane, project);
  if (!relative || relative === '**') return 'covers';
  const simple = relative.match(/^([^*?{}\[\]!]+)\/\*\*$/);
  if (simple) {
    const prefix = simple[1].replace(/\/$/, '');
    if (prefix === comparedLane || comparedLane.startsWith(`${prefix}/`)) return 'covers';
    if (prefix.startsWith(`${comparedLane}/`)) return 'intersects';
    return 'disjoint';
  }
  if (!/[*?{}\[\]!]/.test(relative)) {
    if (relative === comparedLane || relative.startsWith(`${comparedLane}/`)) return 'intersects';
    return 'disjoint';
  }
  const fixed = relative.slice(0, relative.search(/[*?{}\[\]!]/)).replace(/\/$/, '');
  // An unfilled template placeholder is a different top-level path. Once the
  // template is filled the resulting literal path is evaluated normally.
  if (!fixed && /^\[[A-Z][A-Z0-9_]*\]/.test(relative)) return 'disjoint';
  if (!fixed || fixed === comparedLane || fixed.startsWith(`${comparedLane}/`) || comparedLane.startsWith(`${fixed}/`)) return 'uncertain';
  return 'disjoint';
}

function ruleRelation(rule, lane, project) {
  const parsed = parsePermissionRule(rule);
  if (!parsed) return null;
  if (parsed.bare) return 'covers';
  const relation = pathRelation(parsed.pattern, lane, project);
  // Claude Code documents path-scoped file permissions through Edit. A
  // path-scoped Write restriction is therefore uncertainty when it may touch
  // the lane, never a second mechanically proven restriction.
  return parsed.tool === 'Write' && relation !== 'disjoint' ? 'uncertain' : relation;
}

function coveringEdit(rules, lane, project) {
  return rules.some((rule) => parsePermissionRule(rule)?.tool === 'Edit' && ruleRelation(rule, lane, project) === 'covers');
}

function restrictions(rules, lane, project) {
  const matched = [];
  for (const rule of rules) {
    const parsed = parsePermissionRule(rule);
    if (!parsed) continue;
    const relation = ruleRelation(rule, lane, project);
    if (relation === 'covers' || relation === 'intersects' || relation === 'uncertain') {
      matched.push({ rule, relation, uncertain: relation === 'uncertain' });
    }
  }
  return matched;
}

// Null when the file is absent or grants every declared lane; otherwise the
// withheld lanes, each with the reason, so a finding can name them.
export function permissionScopeDrift(project, declaredLanes = lanes) {
  const file = path.join(path.resolve(project), PERMISSION_FILE);
  if (!lstatOrNull(file)) return null;
  // A null declaration falls back to the default lanes: the check never
  // throws and never silently checks nothing.
  const checked = declaredLanes ?? lanes;
  const authorship = Object.entries(checked).filter(([name]) => name !== 'tools' && name !== 'skills');
  let buckets;
  try {
    const permissions = JSON.parse(fs.readFileSync(file, 'utf8'))?.permissions ?? {};
    buckets = Object.fromEntries(permissionBuckets.map((bucket) => [bucket, Array.isArray(permissions[bucket]) ? permissions[bucket] : []]));
  } catch (error) {
    const reason = `the file is unreadable, so it grants nothing: ${error.message}`;
    return { control: PERMISSION_FILE, lanes: authorship.map(([lane, relative]) => ({ lane, path: relative, reason })) };
  }
  const withheld = [];
  for (const [lane, relative] of Object.entries(checked)) {
    // The skills lane holds managed core (replaced only by the Workbench
    // update) beside room-owned extensions, so neither an Edit grant nor an
    // ask hold on it is drift; the permission file decides it per room.
    if (lane === 'skills') continue;
    const reasons = [];
    const denied = restrictions(buckets.deny, relative, project)[0];
    const askedRestrictions = restrictions(buckets.ask, relative, project);
    const asked = askedRestrictions[0];
    const coveringAsk = askedRestrictions.some((entry) => entry.relation === 'covers');
    const allowed = coveringEdit(buckets.allow, relative, project);
    if (lane === 'tools') {
      if (allowed && denied) reasons.push(denied.uncertain
        ? `deny rule cannot safely interpret whether it restricts the lane: ${denied.rule}`
        : `lane is covered or intersected by a deny rule: ${denied.rule}`);
      if (allowed && !coveringAsk) reasons.push(asked
        ? `Edit is broadly granted in allow, but the ask rule does not cover the whole tools lane: ${asked.rule}`
        : 'Edit is granted in allow; hold the whole tools lane in ask');
    } else if (denied) {
      reasons.push(denied.uncertain
        ? `deny rule cannot safely interpret whether it restricts the lane: ${denied.rule}`
        : `lane is covered or intersected by a deny rule: ${denied.rule}`);
    } else if (asked) {
      reasons.push(asked.uncertain
        ? `ask rule cannot safely interpret whether it restricts the lane: ${asked.rule}`
        : `lane is covered or intersected by an ask rule: ${asked.rule}`);
    } else if (!allowed) reasons.push('no covering Edit allow rule');
    if (reasons.length) withheld.push({ lane, path: relative, reason: reasons.join('; ') });
  }
  return withheld.length ? { control: PERMISSION_FILE, lanes: withheld } : null;
}

export function permissionScopeMessage(drift) {
  return `${drift.control} withholds declared lanes: ${drift.lanes.map((entry) => `${entry.lane} (${entry.path}: ${entry.reason})`).join('; ')}`;
}

// Readiness needs the review gate's merge target: a declared integration
// branch that resolves as a local head or on a remote. Steady-state doctor
// reports the same two conditions without blocking selection.
function validateGenesisGit(project) {
  const declared = declaredGit(project);
  if (!declared) {
    return fail('integration-branch-undeclared', 'workbench/manifest.json must declare git.integrationBranch, the branch the independent review gate merges into; run init with --integration-branch or add the git block.', { reason: 'the manifest has no git block' });
  }
  if (!insideWorkTree(project)) {
    return fail('integration-branch-missing', `The project is not inside a Git work tree, so declared integration branch ${declared.integrationBranch} cannot resolve; initialize the repository and create the branch from ${declared.defaultBranch}.`, { branch: declared.integrationBranch, reason: 'the project is not inside a Git work tree' });
  }
  if (resolveBranchRefs(project, declared.integrationBranch).length === 0) {
    return fail('integration-branch-missing', `Declared integration branch ${declared.integrationBranch} resolves neither as a local head nor on a remote; create it from ${declared.defaultBranch} and push it, or record the omission reason in the owning spec.`, { branch: declared.integrationBranch, reason: `no refs/heads/${declared.integrationBranch} and no remote carries ${declared.integrationBranch}` });
  }
  return null;
}

export function validate(options, requireGenesis) {
  const project = path.resolve(options['--project']);
  const result = validateManifest(project);
  if (result.status !== 'valid' || !requireGenesis) return result;
  for (const control of controls) {
    const controlIssue = validateGenesisControl(project, control, result.manifest.workbenchVersion);
    if (controlIssue) return controlIssue;
  }
  const specIssue = validateFirstSpec(project, result.manifest.workbenchVersion);
  if (specIssue) return specIssue;
  const runtimeIssue = validateGenesisRuntime(project, result.manifest.workbenchVersion);
  if (runtimeIssue) return runtimeIssue;
  const drift = permissionScopeDrift(project, result.manifest.lanes);
  if (drift) return fail('permission-scope-drift', permissionScopeMessage(drift), { control: drift.control, lanes: drift.lanes, reason: drift.lanes.map((entry) => `${entry.lane}: ${entry.reason}`).join('; ') });
  const gitIssue = validateGenesisGit(project);
  if (gitIssue) return gitIssue;
  if (fs.existsSync(path.join(project, 'skills'))) return fail('project-local-skills', 'A root skills/ directory shadows the skills lane; move its contents into the lane or remove it.');
  const skillsIssue = validateGenesisSkills(project, result.manifest);
  if (skillsIssue) return skillsIssue;
  return report('valid', { manifest: result.manifest, controls, ...(result.tracker ? { tracker: result.tracker } : {}) });
}

// Readiness also needs the skills lane laid down from the release: every
// required skill present with a receipt naming the manifest's release, and
// both discovery adapters resolving into the lane. Doctor reports the same
// conditions without blocking on the receipt (see skill-inspection.mjs).
function validateGenesisSkills(project, manifest) {
  const lane = manifest.lanes.skills;
  if (!lane) return fail('skill-lane-missing', 'The manifest declares no skills lane; run workbench-layout.mjs migrate --project PATH once.', { control: 'workbench/skills' });
  const receiptPath = path.join(project, lane, SKILLS_RECEIPT);
  const receiptEntry = lstatOrNull(receiptPath);
  if (!receiptEntry?.isFile() || receiptEntry.isSymbolicLink()) {
    return fail('skill-lane-missing', `${lane} must carry the Workbench skills receipt; run workbench-skills.mjs install from the release checkout.`, { control: lane });
  }
  let receipt;
  try { receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8')); } catch (error) {
    return fail('skill-lane-missing', `${lane}/${SKILLS_RECEIPT} is unreadable: ${error.message}`, { control: lane });
  }
  if (receipt.source?.release !== manifest.workbenchVersion) {
    return fail('skill-lane-missing', `${lane}/${SKILLS_RECEIPT} names release ${receipt.source?.release ?? 'none'}; the manifest declares ${manifest.workbenchVersion}.`, { control: lane });
  }
  for (const skill of manifest.skillPolicy.required) {
    if (!lstatOrNull(path.join(project, lane, skill, 'SKILL.md'))?.isFile()) return fail('skill-lane-missing', `${lane}/${skill}/SKILL.md is missing.`, { control: lane, skill });
    for (const discoveryRoot of manifest.skillPolicy.discovery) {
      const adapter = path.join(project, discoveryRoot, skill, 'SKILL.md');
      let resolved;
      try { resolved = fs.realpathSync(adapter); } catch { resolved = null; }
      if (resolved !== fs.realpathSync(path.join(project, lane, skill, 'SKILL.md'))) {
        return fail('skill-adapter-broken', `${discoveryRoot}/${skill} does not resolve into ${lane}; run workbench-skills.mjs install from the release checkout.`, { control: discoveryRoot, skill });
      }
    }
  }
  return null;
}

if (isMainModule(import.meta.url)) {
  try {
    const [command, ...args] = process.argv.slice(2);
    let result;
    if (command === 'init') result = initialize(parseOptions(args, ['--project', '--provenance', '--version']));
    else if (command === 'migrate') result = migrate(parseOptions(args, ['--project']));
    else if (command === 'identify') result = identify(parseOptions(args, ['--project']));
    else if (command === 'record-source') result = recordSource(parseOptions(args, ['--project']));
    else if (command === 'declare-legibility') result = declareLegibility(parseOptions(args, ['--project', ...LEGIBILITY_ENTRIES.map((entry) => `--${entry}`)], ['--pending']));
    else if (command === 'seed-documents') {
      const options = parseOptions(args, ['--project']);
      result = seedLaneDocuments(options['--project'], options);
    }
    else if (command === 'validate') {
      const requireGenesis = args.includes('--genesis');
      result = validate(parseOptions(args.filter((arg) => arg !== '--genesis'), ['--project']), requireGenesis);
    } else throw new Error('Usage: workbench-layout.mjs init --project PATH --provenance genesis --version v3.2.1 [--source-commit SHA] [--source-repository URL] [--wiki-profile project|deployment] [--name NAME] [--default-branch NAME] [--integration-branch NAME] | migrate --project PATH [--version v3.2.1] [--source-commit SHA] [--source-repository URL] [--default-branch NAME] [--integration-branch NAME] | identify --project PATH | record-source --project PATH [--version v3.2.1] [--source-commit SHA] [--source-repository URL] | declare-legibility --project PATH --run CMD --operate CMD --inspect CMD --errors CMD --journey CMD --measure CMD [--pending] | seed-documents --project PATH [--version v3.2.1] | validate --project PATH [--genesis] (source flags assert the clean release checkout\'s resolved HEAD and origin; a relocated partial copy cannot establish provenance)');
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (!['initialized', 'valid', 'migrated', 'current', 'recorded', 'declared', 'seeded', 'identified'].includes(result.status)) process.exitCode = 1;
  } catch (error) {
    process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
    process.exitCode = 1;
  }
}
