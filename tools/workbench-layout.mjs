#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const coreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tickets', 'tracer-bullet', 'update-harness'
];
const lanes = {
  specs: 'workbench/specs',
  wiki: 'workbench/wiki',
  grilling: 'workbench/grilling',
  handoffs: 'workbench/handoffs',
  feedback: 'workbench/feedback'
};
const controls = ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'CLAUDE.md', 'README.md'];

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

function hasSpec(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const candidate = path.join(directory, entry.name);
    if (entry.isFile() && entry.name === 'SPEC.md') return true;
    if (entry.isDirectory() && hasSpec(candidate)) return true;
  }
  return false;
}

function validateManifest(project) {
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
    if (!fs.statSync(path.join(project, lane)).isDirectory()) {
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

function initialize(options) {
  const project = path.resolve(options['--project']);
  const workbench = path.join(project, 'workbench');
  const manifestPath = path.join(workbench, 'manifest.json');
  if (fs.existsSync(manifestPath)) return fail('manifest-exists', `${manifestPath} already exists.`);
  if (!fs.existsSync(project) || !fs.statSync(project).isDirectory()) {
    return fail('invalid-project', `${project} must be an existing project directory.`);
  }
  for (const lane of Object.values(lanes)) {
    const target = path.join(project, lane);
    if (fs.existsSync(target) && !fs.statSync(target).isDirectory()) {
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

function validate(options, requireGenesis) {
  const project = path.resolve(options['--project']);
  const result = validateManifest(project);
  if (result.status !== 'valid' || !requireGenesis) return result;
  for (const control of controls) {
    if (!fs.existsSync(path.join(project, control))) return fail('missing-control', `${control} is missing.`);
  }
  if (!hasSpec(path.join(project, lanes.specs))) return fail('missing-first-spec', 'Genesis must create a first spec in workbench/specs.');
  if (fs.existsSync(path.join(project, 'skills'))) return fail('project-local-skills', 'Genesis must not create a project-local skills directory.');
  return report('valid', { manifest: result.manifest, controls });
}

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
