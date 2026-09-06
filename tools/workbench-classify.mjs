#!/usr/bin/env node
// Read-only lifecycle classification for a room an agent has just arrived at.
// It reports which of `genesis`, `adoption`, or `upgrade` the room's own
// contents support, or `unclassifiable` when they support more than one, and
// it never selects a route, claims work, or authorizes a migration. The rule
// it implements is recorded in
// `workbench/specs/S-044-legacy-room-classification/SPEC.md`.
//
// It lives beside `workbench-adoption.mjs` and `workbench-upgrade.mjs` in the
// release checkout rather than in the installed runtime set, because the room
// it reads may carry no `workbench/tools/` at all - that absence is one of the
// facts it reports.
import fs from 'node:fs';
import path from 'node:path';
import { controls, versionStamp } from '../workbench/tools/workbench-layout.mjs';
import { RECEIPT_NAME, RUNTIME_TOOLS } from './workbench-tools.mjs';

// The v2 root paths Adoption knows how to move, plus the two root feedback
// names and the legacy project-local skills folder. Presence is reported as
// evidence; no single one of these decides a verdict.
const LEGACY_PATHS = [
  'specs', 'Wiki', 'MEMORY.md', 'feedback', 'grilling diary', 'handoffs',
  'WORKBENCH_FEEDBACK.md', 'HARNESS_FEEDBACK.md', 'skills'
];
const VERDICTS = ['genesis', 'adoption', 'upgrade', 'unclassifiable'];

function lstatOrNull(target) {
  try {
    return fs.lstatSync(target);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function fail(code, message, details = {}) {
  return { status: 'blocked', error: { code, message, ...details } };
}

function parseOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    if (!key?.startsWith('--') || !value || options[key]) throw new Error('Invalid arguments.');
    options[key] = value;
  }
  if (!options['--project']) throw new Error('Missing --project.');
  return options;
}

function manifestEvidence(project) {
  const relative = path.join('workbench', 'manifest.json');
  const manifestPath = path.join(project, relative);
  const entry = lstatOrNull(manifestPath);
  if (!entry) return { path: relative, present: false, readable: false, reason: 'no workbench/manifest.json' };
  if (!entry.isFile() || entry.isSymbolicLink()) {
    return { path: relative, present: true, readable: false, reason: 'workbench/manifest.json is not an ordinary file' };
  }
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    return { path: relative, present: true, readable: false, reason: `workbench/manifest.json does not parse: ${error.message}` };
  }
  return {
    path: relative,
    present: true,
    readable: true,
    schemaVersion: manifest.schemaVersion ?? null,
    workbenchVersion: manifest.workbenchVersion ?? null,
    lifecycle: manifest.provenance?.lifecycle ?? null
  };
}

function versionStampEvidence(project) {
  const stamped = [];
  const versions = [];
  for (const control of controls) {
    const controlPath = path.join(project, control);
    const entry = lstatOrNull(controlPath);
    if (!entry?.isFile() || entry.isSymbolicLink()) continue;
    const version = versionStamp(fs.readFileSync(controlPath, 'utf8'));
    if (!version) continue;
    stamped.push(control);
    if (!versions.includes(version)) versions.push(version);
  }
  return { stamped, versions };
}

function supportRootEvidence(project) {
  const entry = lstatOrNull(path.join(project, 'workbench'));
  return {
    path: 'workbench',
    present: Boolean(entry),
    ordinaryDirectory: Boolean(entry) && entry.isDirectory() && !entry.isSymbolicLink()
  };
}

// Two independent traces of a Workbench installation: the managed runtime lane
// with its receipt, and root `tools/` filenames from the managed set, which is
// what an older room that installed the tools at its root still carries.
function lifecycleToolsEvidence(project) {
  const lane = path.join(project, 'workbench', 'tools');
  const present = (root, name) => Boolean(lstatOrNull(path.join(root, name)));
  return {
    lane: 'workbench/tools',
    installed: RUNTIME_TOOLS.filter((name) => present(lane, name)),
    receipt: present(lane, RECEIPT_NAME),
    rootManagedNames: RUNTIME_TOOLS.filter((name) => present(path.join(project, 'tools'), name))
  };
}

function legacyControlShapesEvidence(project) {
  const presentControl = (control) => {
    const entry = lstatOrNull(path.join(project, control));
    return Boolean(entry) && entry.isFile() && !entry.isSymbolicLink();
  };
  return {
    controlsPresent: controls.filter(presentControl),
    controlsMissing: controls.filter((control) => !presentControl(control)),
    legacyPaths: LEGACY_PATHS.filter((relative) => Boolean(lstatOrNull(path.join(project, relative))))
  };
}

function roomContentsEvidence(project) {
  const entries = fs.readdirSync(project).filter((name) => name !== '.git');
  return { entryCount: entries.length, empty: entries.length === 0 };
}

function gather(project) {
  return {
    manifest: manifestEvidence(project),
    versionStamp: versionStampEvidence(project),
    supportRoot: supportRootEvidence(project),
    lifecycleTools: lifecycleToolsEvidence(project),
    legacyControlShapes: legacyControlShapesEvidence(project),
    roomContents: roomContentsEvidence(project)
  };
}

// The recorded rule, ordered, first match wins. Each branch states the evidence
// that produced it; nothing here decides a route or authorizes a migration.
function decide(evidence) {
  const { manifest, versionStamp: stamp, supportRoot, lifecycleTools, legacyControlShapes, roomContents } = evidence;
  if (supportRoot.present && !manifest.readable) {
    return {
      verdict: 'unclassifiable',
      reasons: [
        `workbench/ exists but its own authority cannot be read (${manifest.reason}), so the room is neither a readable installation nor a clean adoption target.`,
        'Adoption already refuses this room as support-root-exists; inspect and reconcile workbench/ by hand, then re-run this classification.'
      ]
    };
  }
  if (manifest.readable) {
    return {
      verdict: 'upgrade',
      reasons: [
        `${manifest.path} reads as schemaVersion ${manifest.schemaVersion} at ${manifest.workbenchVersion}, recording lifecycle ${manifest.lifecycle}, so the room is an installed Workbench room: not a genesis, and not a second adoption.`,
        'Whether it needs a schema migration, a version upgrade, or nothing at all is workbench-layout.mjs validate\'s answer, not this command\'s.'
      ]
    };
  }
  const harnessShaped = legacyControlShapes.controlsMissing.length === 0 || lifecycleTools.rootManagedNames.length > 0;
  if (!stamp.stamped.length && harnessShaped) {
    const shape = legacyControlShapes.controlsMissing.length === 0
      ? `all ${controls.length} root controls`
      : `root tools/ files from the managed runtime set (${lifecycleTools.rootManagedNames.join(', ')})`;
    return {
      verdict: 'unclassifiable',
      reasons: [
        `The room carries ${shape}, the shape a Workbench installation leaves behind, but no manifest and no version stamp records that any release installed here.`,
        'An unstamped Workbench room (upgrade) and an independent dialect reusing the same names (adoption) produce exactly this evidence, and the room does not say which.',
        'Establish which from outside the room - its history, its remote, or the owner - rather than guessing; treating an unstamped first adoption as an upgrade loses the live truth an adoption would reconcile.'
      ]
    };
  }
  if (stamp.stamped.length) {
    return {
      verdict: 'upgrade',
      reasons: [
        `${stamp.stamped.join(', ')} carry a Workbench version stamp (${stamp.versions.join(', ')}) and the room has no manifest, so a release installed here and left the v2 root behind.`,
        'This is the already-adopted room workbench-upgrade.mjs upgrade --layout-only exists for; it records lifecycle upgrade rather than a second adoption.'
      ]
    };
  }
  if (roomContents.empty) {
    return {
      verdict: 'genesis',
      reasons: [
        'The room is empty apart from .git: no manifest, no version stamp, no support root, no root control, and no legacy lane.',
        'There is nothing to derive filled controls from, so the founding prompt is the only available source.'
      ]
    };
  }
  const found = [
    legacyControlShapes.controlsPresent.length ? `root controls ${legacyControlShapes.controlsPresent.join(', ')}` : null,
    legacyControlShapes.legacyPaths.length ? `legacy paths ${legacyControlShapes.legacyPaths.join(', ')}` : null
  ].filter(Boolean);
  return {
    verdict: 'adoption',
    reasons: [
      `The room holds ${roomContents.entryCount} top-level ${roomContents.entryCount === 1 ? 'entry' : 'entries'}${found.length ? `, including ${found.join(' and ')}` : ''}, so there is a working repository to derive filled controls from.`,
      'No manifest, no version stamp, and no Workbench-shaped control set: there is no installation to upgrade and no ambiguity about one.'
    ]
  };
}

export function classify(projectPath) {
  const project = path.resolve(projectPath);
  const entry = lstatOrNull(project);
  if (!entry || entry.isSymbolicLink() || !entry.isDirectory()) {
    return fail('invalid-project', `${project} must be an existing ordinary project directory.`);
  }
  const evidence = gather(project);
  const { verdict, reasons } = decide(evidence);
  return { status: 'classified', project, verdict, reasons, evidence };
}

try {
  const [command, ...args] = process.argv.slice(2);
  if (command !== 'classify') throw new Error(`Usage: workbench-classify.mjs classify --project PROJECT (read-only; reports ${VERDICTS.join(' | ')} with its evidence and writes nothing)`);
  const result = classify(parseOptions(args)['--project']);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  // Every verdict is an answer, `unclassifiable` included: only an unreadable
  // invocation or a project that is not a directory is a failure.
  if (result.status !== 'classified') process.exitCode = 1;
} catch (error) {
  process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
  process.exitCode = 1;
}
