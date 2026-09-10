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
import { COLLECTIONS, LANES, SCHEMA_VERSION, IGNORED_COLLECTIONS, WIKI_PROFILES, declaredGit, assertSafeReadPath, assertSafeWritePath, writeSafeFile, isBranchName, isMainModule, isSafeRelative } from './workbench-paths.mjs';

const legacyCoreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tickets', 'tracer-bullet', 'update-harness'
];
const stanceSkills = ['builder', 'auditor', 'reviewer', 'reconciler'];
// `carry` and `notepad` join the workflow half of the bundle, ahead of the
// stances, so the frozen rows below and every `slice(-4)` stance read stay
// exact.
const notepadCoreSkills = [...legacyCoreSkills, 'carry', 'notepad', ...stanceSkills];
const initialV32CoreSkills = [...legacyCoreSkills, 'carry', 'notepad', 'save', 'promote', ...stanceSkills];
export const coreSkills = [...legacyCoreSkills, 'carry', 'notepad', 'save', 'promote', 'handoff', ...stanceSkills];
export const lanes = LANES;
export const collections = COLLECTIONS;
export const controls = ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'CLAUDE.md', 'README.md'];
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
const skillPolicy = { required: coreSkills, discovery: ['.agents/skills', '.claude/skills'], normalSetup: 'presence-only', updates: 'explicit-only' };
// Taskboard owns the generated projection; Blueprint is destination-only.
const generatedRegions = {
  'TASKBOARD.md': ['<!-- hot-specs:start -->', '<!-- hot-specs:end -->']
};
const templateVocabulary = new Set(templatePlaceholders);
export const wikiContractFiles = ['SCHEMA.md', 'AGENTS.md', 'design-concepts/README.md'];
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
const notepadCollections = Object.fromEntries(Object.entries(collections).filter(([name]) => name !== 'recovery'));
const legacyCollections = Object.fromEntries(Object.entries(notepadCollections).filter(([name]) => !['notepads', 'notepad-templates'].includes(name)));


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
  if (JSON.stringify(manifest.lanes) !== JSON.stringify(lanes)) {
    return fail('invalid-lane', 'Manifest lanes must exactly match the six v3.1 support lanes.', { lanes: manifest.lanes });
  }
  if (![collections, notepadCollections, legacyCollections].some(shape => JSON.stringify(manifest.collections) === JSON.stringify(shape))) {
    return fail('invalid-collection', 'Manifest collections must match the current layout or the preserved v3.1 collection set.', { collections: manifest.collections });
  }
  for (const lane of Object.values(manifest.lanes)) {
    if (!isSafeRelative(lane)) return fail('invalid-lane', `Manifest lane ${lane} is unsafe.`);
    if (!ordinaryDirectory(project, lane)) return fail('unsafe-lane', `Manifest lane ${lane} must be an ordinary directory.`);
  }
  for (const collection of Object.values(manifest.collections)) {
    if (!isSafeRelative(collection)) return fail('invalid-collection', `Manifest collection ${collection} is unsafe.`);
    if (!ordinaryDirectory(project, collection)) return fail('missing-collection', `Manifest collection ${collection} must be an ordinary directory; it may be empty.`);
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
  const legacyPolicy = { ...skillPolicy, required: legacyCoreSkills };
  const stancePolicy = { ...skillPolicy, required: [...legacyCoreSkills, ...stanceSkills] };
  const carryPolicy = { ...skillPolicy, required: [...legacyCoreSkills, 'carry', ...stanceSkills] };
  const supportedLegacy = { 'v3.0.0': legacyPolicy, 'v3.1.0': legacyPolicy, 'v3.1.1': stancePolicy, 'v3.1.2': stancePolicy, 'v3.1.3': carryPolicy, 'v3.1.4': { ...skillPolicy, required: notepadCoreSkills }, 'v3.2.0': { ...skillPolicy, required: initialV32CoreSkills } };
  const accepted = [skillPolicy, supportedLegacy[manifest.workbenchVersion]].filter(Boolean).map((policy) => JSON.stringify(policy));
  if (!accepted.includes(JSON.stringify(manifest.skillPolicy))) {
    return fail('invalid-skill-policy', 'Manifest skill policy must declare the closed missing-only core bundle.');
  }
  const ignored = verifyNotepadIgnores(project, manifest);
  if (ignored.failure) return ignored.failure;
  return report('valid', { manifest, ignoreVerification: ignored.verification });
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
  for (const relative of ['workbench', ...Object.values(lanes), ...Object.values(collections), ...extraDirectories]) {
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
      if (!fs.readdirSync(target).length) fs.writeFileSync(path.join(target, '.gitkeep'), '');
    }
    writeSessionsIgnore(project);
    const seeded = options.deferWikiSeed ? { wiki: false, reason: 'legacy wiki move pending' } : seedWiki(project, options);
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

export function seedWiki(project, options) {
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
  const written = [];
  for (const relative of wikiContractFiles) {
    const destination = path.join(project, lanes.wiki, relative);
    if (lstatOrNull(destination)) continue;
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, fillTemplate(fs.readFileSync(path.join(templates, 'wiki', relative), 'utf8'), values));
    written.push(`${lanes.wiki}/${relative}`);
  }
  return { wiki: true, written };
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

function validateManifestShape(manifest) {
  if (!/^v\d+\.\d+\.\d+$/.test(manifest.workbenchVersion ?? '')) return fail('invalid-version', 'Workbench version must use vMAJOR.MINOR.PATCH.');
  if (!['genesis', 'adoption', 'upgrade'].includes(manifest.provenance.lifecycle)) return fail('invalid-provenance', 'Provenance must be genesis, adoption, or upgrade.');
  if (!WIKI_PROFILES.includes(manifest.wiki.profile)) return fail('invalid-wiki-profile', `Wiki profile must be one of ${WIKI_PROFILES.join(', ')}.`);
  return null;
}

// Lossless schema 1 -> 2 migration: the five-lane layout renames its
// grilling lane into sessions, its tracked handoffs checkpoints into
// sessions/checkpoints, and gains docs, tools, and the seven collections.
export function migrate(options) {
  const project = path.resolve(options['--project']);
  return withIdentityLock(project, () => migrateUnlocked(options));
}

function migrateUnlocked(options) {
  const project = path.resolve(options['--project']);
  const { manifest, manifestPath, failure } = readManifestFile(project);
  if (failure) return failure;
  if (Object.hasOwn(manifest, 'workbenchId') && !isWorkbenchId(manifest.workbenchId)) return fail('invalid-workbench-identity', 'Malformed Workbench identity must be reconciled before migration.');
  if (manifest.schemaVersion === SCHEMA_VERSION) {
    const valid = validateManifest(project);
    if (valid.status !== 'valid') return valid;
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
    ['at least one ticket must be ready with blockers none', () => packet.tickets.some((ticket) => ticket.status === 'ready' && ticket.blockers === 'none')],
    [`the sections ${requiredSections.join(', ')} must all exist`, () => requiredSections.every((section) => new RegExp(`^## ${section}$`, 'm').test(content))],
    ['at least one acceptance criterion must remain unchecked', () => /^- \[ \] \S/m.test(content)]
  ];
  for (const [reason, holds] of predicates) {
    if (!holds()) return fail('invalid-first-spec', `The first spec is not an actionable version-matched Workbench packet: ${reason}.`, { specPath, reason });
  }
  return null;
}

export const TOOLS_RECEIPT = '.workbench-tools.json';

// The closed set of Workbench-managed runtime tools. Later capability tickets
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
  'diagnostics.mjs',
  'markdown-table.mjs',
  'notepads.mjs',
  'privacy.mjs',
  'project-evidence.mjs',
  'sessions.mjs',
  'session-transport.mjs',
  'spec-packet.mjs',
  'spec-workbench.mjs',
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
  const authorship = Object.entries(checked).filter(([name]) => name !== 'tools');
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
  if (fs.existsSync(path.join(project, 'skills'))) return fail('project-local-skills', 'Genesis must not create a project-local skills directory.');
  return report('valid', { manifest: result.manifest, controls });
}

if (isMainModule(import.meta.url)) {
  try {
    const [command, ...args] = process.argv.slice(2);
    let result;
    if (command === 'init') result = initialize(parseOptions(args, ['--project', '--provenance', '--version']));
    else if (command === 'migrate') result = migrate(parseOptions(args, ['--project']));
    else if (command === 'identify') result = identify(parseOptions(args, ['--project']));
    else if (command === 'record-source') result = recordSource(parseOptions(args, ['--project']));
    else if (command === 'seed-documents') {
      const options = parseOptions(args, ['--project']);
      result = seedLaneDocuments(options['--project'], options);
    }
    else if (command === 'validate') {
      const requireGenesis = args.includes('--genesis');
      result = validate(parseOptions(args.filter((arg) => arg !== '--genesis'), ['--project']), requireGenesis);
    } else throw new Error('Usage: workbench-layout.mjs init --project PATH --provenance genesis --version v3.2.1 [--source-commit SHA] [--source-repository URL] [--wiki-profile project|deployment] [--name NAME] [--default-branch NAME] [--integration-branch NAME] | migrate --project PATH [--version v3.2.1] [--source-commit SHA] [--source-repository URL] [--default-branch NAME] [--integration-branch NAME] | identify --project PATH | record-source --project PATH [--version v3.2.1] [--source-commit SHA] [--source-repository URL] | seed-documents --project PATH [--version v3.2.1] | validate --project PATH [--genesis] (source flags assert the clean release checkout\'s resolved HEAD and origin; a relocated partial copy cannot establish provenance)');
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (!['initialized', 'valid', 'migrated', 'current', 'recorded', 'seeded', 'identified'].includes(result.status)) process.exitCode = 1;
  } catch (error) {
    process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
    process.exitCode = 1;
  }
}
