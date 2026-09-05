#!/usr/bin/env node
// Manifest schema 2 layout: six lanes, seven collections, untracked-by-default
// session records, and the Genesis readiness gate. A schema 1 manifest is
// reported as `upgrade-required` and migrated once, losslessly.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSpecPacket } from './spec-packet.mjs';
import { templatePlaceholders } from './template-placeholders.mjs';
import { COLLECTIONS, LANES, SCHEMA_VERSION, UNTRACKED_COLLECTIONS, WIKI_PROFILES, writeSafeFile, isMainModule, isSafeRelative } from './workbench-paths.mjs';

const legacyCoreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tickets', 'tracer-bullet', 'update-harness'
];
export const coreSkills = [...legacyCoreSkills, 'builder', 'auditor', 'reviewer', 'reconciler'];
export const lanes = LANES;
export const collections = COLLECTIONS;
export const controls = ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'CLAUDE.md', 'README.md'];
export const SESSIONS_IGNORE = `# Live session records stay local; only checkpoints/ is durable evidence.\ngrilling/*\n!grilling/.gitkeep\nhandoffs/*\n!handoffs/.gitkeep\n`;
const legacyLanes = { specs: 'workbench/specs', wiki: 'workbench/wiki', grilling: 'workbench/grilling', handoffs: 'workbench/handoffs', feedback: 'workbench/feedback' };
const skillPolicy = { required: coreSkills, discovery: ['.agents/skills', '.claude/skills'], normalSetup: 'presence-only', updates: 'explicit-only' };
// The two projection controls must keep the regions spec-workbench renders.
const generatedRegions = {
  'BLUEPRINT.md': ['<!-- spec-catalog:start -->', '<!-- spec-catalog:end -->'],
  'TASKBOARD.md': ['<!-- hot-specs:start -->', '<!-- hot-specs:end -->']
};
const templateVocabulary = new Set(templatePlaceholders);
const wikiContractFiles = ['SCHEMA.md', 'AGENTS.md', 'design-concepts/README.md'];

function lstatOrNull(target) {
  try { return fs.lstatSync(target); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function report(status, details = {}) { return { status, ...details }; }
function fail(code, message, details = {}) { return report('invalid', { error: { code, message, ...details } }); }

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

function containsPlaceholder(content) {
  for (const match of content.matchAll(/(?<!\[)\[(?!\[|[ xX]\])[^\]\n]+\](?!\()/g)) {
    if (templateVocabulary.has(match[0])) return true;
  }
  return false;
}

function versionStamp(content) {
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

export function validateManifest(project) {
  const { manifest, failure } = readManifestFile(project);
  if (failure) return failure;
  if (manifest.schemaVersion === 1) {
    return fail('upgrade-required', 'Manifest schema 1 is the v3.0 five-lane layout; run workbench-layout.mjs migrate --project PATH once.', { schemaVersion: 1 });
  }
  if (manifest.schemaVersion !== SCHEMA_VERSION || !/^v\d+\.\d+\.\d+$/.test(manifest.workbenchVersion ?? '')) {
    return fail('invalid-manifest', 'Manifest schemaVersion or workbenchVersion is invalid.');
  }
  if (!['genesis', 'adoption', 'upgrade'].includes(manifest.provenance?.lifecycle)) {
    return fail('invalid-manifest', 'Manifest provenance.lifecycle is invalid.');
  }
  if (JSON.stringify(manifest.lanes) !== JSON.stringify(lanes)) {
    return fail('invalid-lane', 'Manifest lanes must exactly match the six v3.1 support lanes.', { lanes: manifest.lanes });
  }
  if (JSON.stringify(manifest.collections) !== JSON.stringify(collections)) {
    return fail('invalid-collection', 'Manifest collections must exactly match the seven v3.1 collections.', { collections: manifest.collections });
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
  for (const name of UNTRACKED_COLLECTIONS) {
    if (!new RegExp(`^${name}/\\*?$`, 'm').test(ignoreContent)) return fail('sessions-not-ignored', `${lanes.sessions}/.gitignore must ignore ${name}/.`, { collection: name });
  }
  if (!WIKI_PROFILES.includes(manifest.wiki?.profile)) return fail('invalid-wiki-profile', `Manifest wiki.profile must be one of ${WIKI_PROFILES.join(', ')}.`);
  // Existing v3.0/v3.1 manifests remain readable; v3.1.1 must include stances.
  const legacyPolicy = { ...skillPolicy, required: legacyCoreSkills };
  const supportedLegacy = ['v3.0.0', 'v3.1.0'].includes(manifest.workbenchVersion)
    && JSON.stringify(manifest.skillPolicy) === JSON.stringify(legacyPolicy);
  if (JSON.stringify(manifest.skillPolicy) !== JSON.stringify(skillPolicy) && !supportedLegacy) {
    return fail('invalid-skill-policy', 'Manifest skill policy must declare the closed missing-only core bundle.');
  }
  return report('valid', { manifest });
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
  for (const relative of [...Object.values(lanes), ...Object.values(collections)]) {
    const entry = lstatOrNull(path.join(project, relative));
    if (entry && (entry.isSymbolicLink() || !entry.isDirectory())) return fail('lane-collision', `${path.join(project, relative)} is not a directory.`);
  }
  const manifest = {
    schemaVersion: SCHEMA_VERSION,
    workbenchVersion: options['--version'],
    provenance: { lifecycle: options['--provenance'], source: sourceIdentity(options) },
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
  return report('initialized', { manifestPath, manifest, seeded });
}

function sourceIdentity(options) {
  return {
    repository: options['--source-repository'] ?? 'https://github.com/KaydenClark/LLM_Workbench',
    release: options['--version'],
    commit: options['--source-commit'] ?? 'unrecorded'
  };
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
  const { manifest, manifestPath, failure } = readManifestFile(project);
  if (failure) return failure;
  if (manifest.schemaVersion === SCHEMA_VERSION) return report('current', { manifestPath, manifest });
  if (manifest.schemaVersion !== 1) return fail('invalid-manifest', 'Only schema 1 manifests can be migrated.');
  if (JSON.stringify(manifest.lanes) !== JSON.stringify(legacyLanes)) return fail('invalid-lane', 'Schema 1 lanes are not the v3.0 layout; reconcile them before migrating.');
  const unsafe = preflightLayout(project, Object.values(legacyLanes));
  if (unsafe) return unsafe;
  const shape = validateManifestShape({ workbenchVersion: options['--version'] ?? manifest.workbenchVersion, provenance: manifest.provenance, wiki: { profile: options['--wiki-profile'] ?? 'project' } });
  if (shape) return shape;
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
    provenance: { ...manifest.provenance, migratedFrom: 1, source: sourceIdentity({ '--version': options['--version'] ?? manifest.workbenchVersion, ...options }) },
    lanes,
    collections,
    wiki: { profile: options['--wiki-profile'] ?? 'project' },
    skillPolicy
  };
  writeSafeFile(project, manifestPath, `${JSON.stringify(migrated, null, 2)}\n`);
  const seeded = seedWiki(project, { '--version': migrated.workbenchVersion, ...options });
  const validation = validateManifest(project);
  if (validation.status !== 'valid') return report('partial', { moved, error: validation.error });
  return report('migrated', { manifestPath, manifest: migrated, moved, seeded });
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
  if (versionStamp(content) !== expectedVersion) return fail('version-mismatch', `${control} must match manifest Workbench version ${expectedVersion}.`, { control });
  return null;
}

function validateFirstSpec(project, expectedVersion) {
  const specsRoot = path.join(project, lanes.specs);
  const entries = fs.readdirSync(specsRoot, { withFileTypes: true }).filter((entry) => !entry.name.startsWith('.'));
  const names = entries.map((entry) => entry.name).sort();
  if (entries.length === 0) return fail('missing-first-spec', 'Genesis must create a first spec in workbench/specs.');
  if (entries.length !== 1 || !entries[0].isDirectory() || !/^S-\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entries[0].name)) {
    return fail('invalid-first-spec', 'Genesis must create one stable S-###-slug/SPEC.md packet.', { entries: names, reason: `the specs lane must contain exactly one stable S-###-slug directory; found ${names.join(', ')}` });
  }
  const expectedId = entries[0].name.slice(0, 5);
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

// Readiness also needs the Workbench-managed runtime tools: an installed lane
// whose receipt names the same release as the manifest.
function validateGenesisRuntime(project, expectedVersion) {
  const receiptPath = path.join(project, lanes.tools, '.workbench-tools.json');
  const receiptEntry = lstatOrNull(receiptPath);
  if (!receiptEntry?.isFile() || receiptEntry.isSymbolicLink()) {
    return fail('tools-receipt-missing', `${lanes.tools} must carry the Workbench tools receipt; run workbench-tools.mjs install from the release checkout.`, { control: lanes.tools });
  }
  let receipt;
  try { receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8')); } catch (error) {
    return fail('tools-receipt-missing', `${lanes.tools}/.workbench-tools.json is unreadable: ${error.message}`, { control: lanes.tools });
  }
  if (receipt.source?.release !== expectedVersion) {
    return fail('version-mismatch', `Tools receipt release ${receipt.source?.release} must match manifest Workbench version ${expectedVersion}.`, { control: lanes.tools, reason: 'runtime tools receipt release differs from the manifest' });
  }
  for (const relative of ['MEMORY.md', ...wikiContractFiles]) {
    const control = `${lanes.wiki}/${relative}`;
    const entry = lstatOrNull(path.join(project, lanes.wiki, relative));
    if (!entry?.isFile() || entry.isSymbolicLink()) return fail('unfilled-control', `${control} must exist as an ordinary file; copy the wiki router and contract from the release templates.`, { control });
    if (containsPlaceholder(fs.readFileSync(path.join(project, lanes.wiki, relative), 'utf8'))) return fail('unfilled-control', `${control} must contain no template placeholders.`, { control });
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
  if (fs.existsSync(path.join(project, 'skills'))) return fail('project-local-skills', 'Genesis must not create a project-local skills directory.');
  return report('valid', { manifest: result.manifest, controls });
}

if (isMainModule(import.meta.url)) {
  try {
    const [command, ...args] = process.argv.slice(2);
    let result;
    if (command === 'init') result = initialize(parseOptions(args, ['--project', '--provenance', '--version']));
    else if (command === 'migrate') result = migrate(parseOptions(args, ['--project']));
    else if (command === 'validate') {
      const requireGenesis = args.includes('--genesis');
      result = validate(parseOptions(args.filter((arg) => arg !== '--genesis'), ['--project']), requireGenesis);
    } else throw new Error('Usage: workbench-layout.mjs init --project PATH --provenance genesis --version v3.1.1 [--wiki-profile project|deployment] [--name NAME] | migrate --project PATH [--version v3.1.1] | validate --project PATH [--genesis]');
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (!['initialized', 'valid', 'migrated', 'current'].includes(result.status)) process.exitCode = 1;
  } catch (error) {
    process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
    process.exitCode = 1;
  }
}
