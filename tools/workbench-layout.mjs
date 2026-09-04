#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseSpecPacket } from './spec-packet.mjs';
import { templatePlaceholders } from './template-placeholders.mjs';

export const coreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tickets', 'tracer-bullet', 'update-harness'
];
export const lanes = {
  specs: 'workbench/specs',
  wiki: 'workbench/wiki',
  grilling: 'workbench/grilling',
  handoffs: 'workbench/handoffs',
  feedback: 'workbench/feedback'
};
export const controls = ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'CLAUDE.md', 'README.md'];
// The two projection controls must keep the regions spec-workbench renders;
// without them doctor reports broken-render-target on an otherwise valid
// Genesis project.
const generatedRegions = {
  'BLUEPRINT.md': ['<!-- spec-catalog:start -->', '<!-- spec-catalog:end -->'],
  'TASKBOARD.md': ['<!-- hot-specs:start -->', '<!-- hot-specs:end -->']
};
const templateVocabulary = new Set(templatePlaceholders);

function lstatOrNull(target) {
  try {
    return fs.lstatSync(target);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function report(status, details = {}) {
  return { status, ...details };
}

function fail(code, message, details = {}) {
  return report('invalid', { error: { code, message, ...details } });
}

function parseOptions(args, required) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    if (!key?.startsWith('--') || !value || options[key]) throw new Error('Invalid arguments.');
    options[key] = value;
  }
  for (const key of required) if (!options[key]) throw new Error(`Missing ${key}.`);
  return options;
}

function isSafeRelative(value) {
  return typeof value === 'string' && !path.isAbsolute(value) && value === path.posix.normalize(value)
    && !value.split('/').includes('..') && value.startsWith('workbench/');
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

function validateGenesisControl(project, control, expectedVersion) {
  const target = path.join(project, control);
  const entry = lstatOrNull(target);
  if (!entry || entry.isSymbolicLink() || !entry.isFile()) {
    return fail('unsafe-control', `${control} must be an ordinary file.`, { control });
  }
  const content = fs.readFileSync(target, 'utf8');
  const trimmed = content.trim();
  if (!trimmed || trimmed === control || containsPlaceholder(content)) {
    return fail('unfilled-control', `${control} must be filled and contain no template placeholders.`, { control });
  }
  if (control === 'CLAUDE.md') {
    if (trimmed !== '@AGENTS.md') {
      return fail('unfilled-control', 'CLAUDE.md must be exactly `@AGENTS.md`.', { control });
    }
    return null;
  }
  if (!/^#\s+\S/m.test(content) || !/^##\s+\S/m.test(content)) {
    return fail('unfilled-control', `${control} must contain filled control content.`, { control });
  }
  for (const marker of generatedRegions[control] ?? []) {
    if (!content.includes(marker)) {
      return fail('unfilled-control', `${control} must keep the generated region marker ${marker} so render and doctor can project the first spec.`, { control, reason: `missing generated region marker ${marker}` });
    }
  }
  if (versionStamp(content) !== expectedVersion) {
    return fail('version-mismatch', `${control} must match manifest Workbench version ${expectedVersion}.`, { control });
  }
  return null;
}

function validateFirstSpec(project, expectedVersion) {
  const specsRoot = path.join(project, lanes.specs);
  // Dotfiles (the tracked .gitkeep placeholder, editor and Finder metadata)
  // are not spec packets and never decide readiness.
  const entries = fs.readdirSync(specsRoot, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.'));
  const names = entries.map((entry) => entry.name).sort();
  if (entries.length === 0) return fail('missing-first-spec', 'Genesis must create a first spec in workbench/specs.');
  if (entries.length !== 1 || !entries[0].isDirectory() || !/^S-\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entries[0].name)) {
    return fail('invalid-first-spec', 'Genesis must create one stable S-###-slug/SPEC.md packet.', {
      entries: names,
      reason: `the specs lane must contain exactly one stable S-###-slug directory; found ${names.join(', ')}`
    });
  }
  const expectedId = entries[0].name.slice(0, 5);
  const specPath = path.join(specsRoot, entries[0].name, 'SPEC.md');
  const specEntry = lstatOrNull(specPath);
  if (!specEntry || specEntry.isSymbolicLink() || !specEntry.isFile()) {
    return fail('invalid-first-spec', 'The first spec must be an ordinary SPEC.md file.', { specPath, reason: 'SPEC.md is missing, a symlink, or not a regular file' });
  }
  const content = fs.readFileSync(specPath, 'utf8');
  const requiredSections = ['Outcome', 'Vertical Implementation Slices', 'Acceptance Criteria', 'Completion Result'];
  let packet;
  try {
    packet = parseSpecPacket(content, specPath, project);
  } catch (error) {
    return fail('invalid-first-spec', error.message, { specPath, reason: error.message });
  }
  // Each predicate names the failing requirement so a downstream Genesis agent
  // can repair the packet without reading this validator.
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
    if (!holds()) {
      return fail('invalid-first-spec', `The first spec is not an actionable version-matched Workbench packet: ${reason}.`, { specPath, reason });
    }
  }
  return null;
}

export function validateManifest(project) {
  const manifestPath = path.join(project, 'workbench', 'manifest.json');
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    return fail('invalid-manifest', `Cannot read ${manifestPath}: ${error.message}`);
  }
  if (manifest.schemaVersion !== 1 || !/^v\d+\.\d+\.\d+$/.test(manifest.workbenchVersion ?? '')) {
    return fail('invalid-manifest', 'Manifest schemaVersion or workbenchVersion is invalid.');
  }
  if (!['genesis', 'adoption', 'upgrade'].includes(manifest.provenance?.lifecycle)) {
    return fail('invalid-manifest', 'Manifest provenance.lifecycle is invalid.');
  }
  if (JSON.stringify(manifest.lanes) !== JSON.stringify(lanes)) {
    return fail('invalid-lane', 'Manifest lanes must exactly match the v3 support paths.', { lanes: manifest.lanes });
  }
  for (const lane of Object.values(manifest.lanes)) {
    if (!isSafeRelative(lane)) return fail('invalid-lane', `Manifest lane ${lane} is unsafe.`);
    const entry = lstatOrNull(path.join(project, lane));
    if (entry?.isSymbolicLink() || !entry?.isDirectory()) {
      return fail('unsafe-lane', `Manifest lane ${lane} must be an ordinary directory.`);
    }
    if (!entry.isDirectory()) {
      return fail('missing-lane', `Manifest lane ${lane} is missing.`);
    }
  }
  const policy = manifest.skillPolicy;
  if (JSON.stringify(policy?.required) !== JSON.stringify(coreSkills)
      || JSON.stringify(policy?.discovery) !== JSON.stringify(['.agents/skills', '.claude/skills'])
      || policy?.normalSetup !== 'presence-only' || policy?.updates !== 'explicit-only') {
    return fail('invalid-skill-policy', 'Manifest skill policy must declare the closed missing-only core bundle.');
  }
  return report('valid', { manifest });
}

export function initialize(options) {
  const project = path.resolve(options['--project']);
  const workbench = path.join(project, 'workbench');
  const manifestPath = path.join(workbench, 'manifest.json');
  if (fs.existsSync(manifestPath)) return fail('manifest-exists', `${manifestPath} already exists.`);
  const projectEntry = lstatOrNull(project);
  if (!projectEntry || projectEntry.isSymbolicLink() || !projectEntry.isDirectory()) {
    return fail('invalid-project', `${project} must be an existing project directory.`);
  }
  for (const lane of Object.values(lanes)) {
    const target = path.join(project, lane);
    const entry = lstatOrNull(target);
    if (entry && (entry.isSymbolicLink() || !entry.isDirectory())) {
      return fail('lane-collision', `${target} is not a directory.`);
    }
  }
  const manifest = {
    schemaVersion: 1,
    workbenchVersion: options['--version'],
    provenance: { lifecycle: options['--provenance'] },
    lanes,
    skillPolicy: {
      required: coreSkills,
      discovery: ['.agents/skills', '.claude/skills'],
      normalSetup: 'presence-only',
      updates: 'explicit-only'
    }
  };
  if (validateManifestShape(manifest)) return validateManifestShape(manifest);
  for (const lane of Object.values(lanes)) {
    const target = path.join(project, lane);
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, '.gitkeep'), '');
  }
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return report('initialized', { manifestPath, manifest });
}

function validateManifestShape(manifest) {
  if (!/^v\d+\.\d+\.\d+$/.test(manifest.workbenchVersion ?? '')) {
    return fail('invalid-version', 'Workbench version must use vMAJOR.MINOR.PATCH.');
  }
  if (!['genesis', 'adoption', 'upgrade'].includes(manifest.provenance.lifecycle)) {
    return fail('invalid-provenance', 'Provenance must be genesis, adoption, or upgrade.');
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
  if (fs.existsSync(path.join(project, 'skills'))) return fail('project-local-skills', 'Genesis must not create a project-local skills directory.');
  return report('valid', { manifest: result.manifest, controls });
}

if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) {
  try {
    const [command, ...args] = process.argv.slice(2);
    let result;
    if (command === 'init') result = initialize(parseOptions(args, ['--project', '--provenance', '--version']));
    else if (command === 'validate') {
      const requireGenesis = args.includes('--genesis');
      result = validate(parseOptions(args.filter((arg) => arg !== '--genesis'), ['--project']), requireGenesis);
    } else throw new Error('Usage: workbench-layout.mjs init --project PATH --provenance genesis --version v3.0.0 | validate --project PATH [--genesis]');
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (!['initialized', 'valid'].includes(result.status)) process.exitCode = 1;
  } catch (error) {
    process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
    process.exitCode = 1;
  }
}
