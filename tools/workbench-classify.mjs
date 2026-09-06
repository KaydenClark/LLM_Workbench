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
import { isMainModule } from '../workbench/tools/workbench-paths.mjs';
import { RECEIPT_NAME, RUNTIME_TOOLS } from './workbench-tools.mjs';

// The v2 root paths Adoption knows how to move, plus the two root feedback
// names and the legacy project-local skills folder. Presence is reported as
// evidence; no single one of these decides a verdict.
const LEGACY_PATHS = [
  'specs', 'Wiki', 'MEMORY.md', 'feedback', 'grilling diary', 'handoffs',
  'WORKBENCH_FEEDBACK.md', 'HARNESS_FEEDBACK.md', 'skills'
];
const VERDICTS = ['genesis', 'adoption', 'upgrade', 'unclassifiable'];
// An unfilled control and a banner whose version never resolved are facts about
// a copy of the templates rather than about an installed room, so both are
// reported. `workbench-adoption.mjs` refuses on the same placeholder shape.
const BRACKETED_PLACEHOLDER = /\[BRACKETED(?:_[A-Z]+)*\]/;
const UNRESOLVED_STAMP = /(?:Generated from|Part of) LLM Workbench (?!v\d+\.\d+\.\d+)(\S+)/;

// A path the room will not let us stat is a fact about the room, exactly as an
// absent path is: a lane at mode 000, a lane behind a symlink loop, or a name
// under a file are room conditions, never failed invocations. `null` means the
// room says the path is not there; UNREADABLE means the room will not say.
// Counting UNREADABLE as absent would report a lane the room may well carry as
// one it does not, so every caller distinguishes the two.
const UNREADABLE = Symbol('unreadable');
const ROOM_CONDITIONS = new Set(['EACCES', 'EPERM', 'ELOOP', 'ENOTDIR', 'ENAMETOOLONG']);

function lstatOrNull(target) {
  try {
    return fs.lstatSync(target);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    if (ROOM_CONDITIONS.has(error.code)) return UNREADABLE;
    throw error;
  }
}

// A lifecycle lane is read through directory components and reported as
// filenames, and both must be this room's own: `workbench/tools` linked out of
// the room, and a managed name inside it that is itself a link, each report
// another room's installation as this room's. `manifestEvidence` and
// `controlEvidence` already count only an ordinary file; these are the same
// convention for a lane's directory component and its leaves.
// `ownDirectory` is `null` when the room did not answer - absent, or a path it
// will not stat - because neither is a directory this room reads through.
function ownDirectory(target) {
  const entry = lstatOrNull(target);
  if (!entry || entry === UNREADABLE) return null;
  return entry.isDirectory() && !entry.isSymbolicLink();
}

function ordinaryFile(entry) {
  return entry.isFile() && !entry.isSymbolicLink();
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

function manifestEvidence(project, supportRoot) {
  const relative = path.join('workbench', 'manifest.json');
  // Reading through a support root that is not an ordinary directory would
  // report whatever room the link points at as this room's own authority, so
  // nothing under it is opened.
  if (supportRoot.present && !supportRoot.ordinaryDirectory) {
    return {
      path: relative,
      present: null,
      readable: false,
      reason: 'workbench/ is not an ordinary directory, so nothing under it was read'
    };
  }
  const manifestPath = path.join(project, relative);
  const entry = lstatOrNull(manifestPath);
  if (entry === UNREADABLE) {
    return {
      path: relative,
      present: null,
      readable: false,
      reason: 'workbench/ does not permit reaching workbench/manifest.json, so the room\'s own authority is undetermined'
    };
  }
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
  // Parsing is not reading. An unrelated JSON object, an array, or a bare
  // `null` is valid JSON and no room's authority; Rule 1 routes it to
  // `unclassifiable` rather than reporting an installed Workbench room. Every
  // Workbench manifest records `schemaVersion` as an integer and
  // `workbench-layout.mjs validate` accepts nothing else, so a room whose
  // schemaVersion is absent, null, a string, an array, or an object is not
  // carrying one: it is a near neighbour of a manifest, not this room's
  // authority.
  if (manifest === null || typeof manifest !== 'object' || Array.isArray(manifest) || !Number.isInteger(manifest.schemaVersion)) {
    return {
      path: relative,
      present: true,
      readable: false,
      reason: 'workbench/manifest.json parses but is not a Workbench manifest object carrying an integer schemaVersion'
    };
  }
  return {
    path: relative,
    present: true,
    readable: true,
    schemaVersion: manifest.schemaVersion,
    workbenchVersion: manifest.workbenchVersion ?? null,
    lifecycle: manifest.provenance?.lifecycle ?? null
  };
}

// Every present root control is read once, and the same bytes answer three
// questions: whether a release stamped the room, whether a stamp is present but
// unresolved, and whether the control is still an unfilled template copy. A
// control the room will not let us read is a fact about the room, never a
// failed invocation.
function controlEvidence(project) {
  const read = { present: [], missing: [], unreadable: [], bracketed: [], stamped: [], versions: [], unresolved: [] };
  for (const control of controls) {
    const controlPath = path.join(project, control);
    const entry = lstatOrNull(controlPath);
    // A control the room will not even stat is present-or-absent unknown, so it
    // is recorded as unreadable rather than counted among the missing.
    if (entry === UNREADABLE) {
      read.present.push(control);
      read.unreadable.push(control);
      continue;
    }
    if (!entry?.isFile() || entry.isSymbolicLink()) {
      read.missing.push(control);
      continue;
    }
    read.present.push(control);
    let content;
    try {
      content = fs.readFileSync(controlPath, 'utf8');
    } catch {
      read.unreadable.push(control);
      continue;
    }
    if (BRACKETED_PLACEHOLDER.test(content)) read.bracketed.push(control);
    const version = versionStamp(content);
    if (version) {
      read.stamped.push(control);
      if (!read.versions.includes(version)) read.versions.push(version);
      continue;
    }
    const unresolved = content.match(UNRESOLVED_STAMP)?.[1]?.replace(/\.$/, '');
    if (unresolved) read.unresolved.push(`${control} (${unresolved})`);
  }
  return read;
}

function versionStampEvidence(read) {
  return { stamped: read.stamped, versions: read.versions, unresolved: read.unresolved, unreadable: read.unreadable };
}

function supportRootEvidence(project) {
  const entry = lstatOrNull(path.join(project, 'workbench'));
  // A room that will not let its own root be stat-ed says nothing about whether
  // it holds a support root, so `present` is neither true nor false. Rule 1
  // needs a support root the room actually reported.
  if (entry === UNREADABLE) return { path: 'workbench', present: null, ordinaryDirectory: false };
  return {
    path: 'workbench',
    present: Boolean(entry),
    ordinaryDirectory: Boolean(entry) && entry.isDirectory() && !entry.isSymbolicLink()
  };
}

// Names the room reported as there, and names it would not answer for, kept
// apart: a lane at mode 000 or behind a symlink loop holds neither an installed
// tool nor an absent one until the room says. `accept` decides what the room
// reporting a name means for that lane: an installed lifecycle tool is an
// ordinary file, while a legacy lane shape is any entry the room reported.
function laneReading(lane, names, accept = () => true) {
  const found = [];
  const unreadable = [];
  for (const name of names) {
    const entry = lstatOrNull(path.join(lane, name));
    if (entry === UNREADABLE) unreadable.push(name);
    else if (entry && accept(entry)) found.push(name);
  }
  return { found, unreadable };
}

// Two independent traces of a Workbench installation: the managed runtime lane
// with its receipt, and root `tools/` filenames from the managed set, which is
// what an older room that installed the tools at its root still carries.
function lifecycleToolsEvidence(project, supportRoot) {
  const rootLane = laneReading(path.join(project, 'tools'), RUNTIME_TOOLS, ordinaryFile);
  // A root `tools/` that is a link out of the room holds another room's files
  // under this room's path, and that shape corroborates the harness-shaped
  // reading. The names are still reported, as borrowed rather than as this
  // room's own, because a name dropped in silence is evidence the reader loses.
  const rootBorrowed = ownDirectory(path.join(project, 'tools')) === false;
  const root = {
    lane: 'workbench/tools',
    rootManagedNames: rootBorrowed ? [] : rootLane.found,
    rootBorrowedNames: rootBorrowed ? rootLane.found : [],
    rootUnreadable: rootLane.unreadable
  };
  // The managed lane is under the support root, so it is gated exactly as the
  // manifest is: following a `workbench/` symlink would report the receipt and
  // installed tools of the room the link points at as this room's own managed
  // runtime lane, which is a lane this room does not carry.
  if (supportRoot.present && !supportRoot.ordinaryDirectory) {
    return {
      ...root,
      read: false,
      installed: null,
      receipt: null,
      unreadable: [],
      reason: 'workbench/ is not an ordinary directory, so nothing under it was read'
    };
  }
  // The gate one level down: an ordinary `workbench/` whose `tools` is a link
  // reaches the same borrowed lane by the second component of the same path.
  const managedLane = path.join(project, 'workbench', 'tools');
  if (ownDirectory(managedLane) === false) {
    return {
      ...root,
      read: false,
      installed: null,
      receipt: null,
      unreadable: [],
      reason: 'workbench/tools is not an ordinary directory, so nothing under it was read'
    };
  }
  const managed = laneReading(managedLane, [...RUNTIME_TOOLS, RECEIPT_NAME], ordinaryFile);
  return {
    ...root,
    read: true,
    installed: managed.found.filter((name) => name !== RECEIPT_NAME),
    receipt: managed.found.includes(RECEIPT_NAME),
    unreadable: managed.unreadable
  };
}

function legacyControlShapesEvidence(project, read) {
  // A legacy lane the room will not stat is undetermined exactly as an
  // unreadable control is, so it gets its own bucket rather than being filtered
  // into the same emptiness as a lane the room said is not there.
  const legacy = laneReading(project, LEGACY_PATHS);
  return {
    controlsPresent: read.present,
    controlsMissing: read.missing,
    controlsBracketed: read.bracketed,
    legacyPaths: legacy.found,
    legacyPathsUnreadable: legacy.unreadable
  };
}

function roomContentsEvidence(project) {
  let entries;
  try {
    entries = fs.readdirSync(project).filter((name) => name !== '.git');
  } catch (error) {
    if (!ROOM_CONDITIONS.has(error.code)) throw error;
    // Whether the room is empty or holds a working repository is exactly what
    // this listing answers, so a room that refuses it leaves both readings open.
    return { readable: false, entryCount: null, empty: false };
  }
  return { readable: true, entryCount: entries.length, empty: entries.length === 0 };
}

function gather(project) {
  const supportRoot = supportRootEvidence(project);
  const read = controlEvidence(project);
  return {
    manifest: manifestEvidence(project, supportRoot),
    versionStamp: versionStampEvidence(read),
    supportRoot,
    lifecycleTools: lifecycleToolsEvidence(project, supportRoot),
    legacyControlShapes: legacyControlShapesEvidence(project, read),
    roomContents: roomContentsEvidence(project)
  };
}

// An unfilled control and a banner that never resolved describe a copy of the
// templates rather than a room a release installed. That reading is open under
// more than one verdict, so it is stated once and offered by every branch it
// applies to: an agent reads the reasons, and a reading only the evidence
// carries is a reading the reasons hid.
function unfilledCopyReading(legacyControlShapes, stamp) {
  const unfilled = [
    legacyControlShapes.controlsBracketed.length ? `${legacyControlShapes.controlsBracketed.join(', ')} still ${legacyControlShapes.controlsBracketed.length === 1 ? 'carries' : 'carry'} an unfilled [BRACKETED] placeholder` : null,
    stamp.unresolved.length ? `an unresolved version banner in ${stamp.unresolved.join(', ')}` : null
  ].filter(Boolean);
  return unfilled.length ? unfilled.join(', and ') : null;
}

// The recorded rule, ordered, first match wins. Each branch states the evidence
// that produced it; nothing here decides a route or authorizes a migration.
function decide(evidence) {
  const { manifest, versionStamp: stamp, supportRoot, lifecycleTools, legacyControlShapes, roomContents } = evidence;
  if (supportRoot.present && (!supportRoot.ordinaryDirectory || !manifest.readable)) {
    return {
      verdict: 'unclassifiable',
      reasons: [
        `workbench/ exists but its own authority cannot be read (${manifest.reason}), so the room is neither a readable installation nor a clean adoption target.`,
        stamp.stamped.length
          ? `${stamp.stamped.join(', ')} carry a Workbench version stamp (${stamp.versions.join(', ')}), so a release did write here, but nothing readable says which release the support root belongs to.`
          : 'No root control carries a Workbench version stamp either, so nothing outside workbench/ corroborates an installation.',
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
  // A control that will not open leaves the stamp evidence incomplete, and a
  // room that will not list itself leaves the genesis and adoption readings
  // open: on either partial read the room cannot be told from an unstamped one.
  if (!stamp.stamped.length && (stamp.unreadable.length || !roomContents.readable)) {
    const undetermined = [
      stamp.unreadable.length ? `${stamp.unreadable.join(', ')} could not be read` : null,
      roomContents.readable ? null : 'the room would not list its own top-level contents'
    ].filter(Boolean);
    return {
      verdict: 'unclassifiable',
      reasons: [
        `${undetermined.join(', and ')}, so this room's evidence is incomplete and no readable control settles whether a release stamped it.`,
        'Restore read access to what is named and re-run this classification rather than classifying a room on partial evidence.'
      ]
    };
  }
  // The seven controls are the Workbench's exact closed set, so the whole set
  // corroborates itself. A managed runtime-tool filename does not: those names
  // are ordinary (`privacy.mjs`, `sessions.mjs`), and one of them under a root
  // `tools/` says nothing on its own. That limb counts only when the room also
  // carries more of the control set than it is missing.
  const controlMajority = legacyControlShapes.controlsPresent.length > legacyControlShapes.controlsMissing.length;
  const harnessShaped = legacyControlShapes.controlsMissing.length === 0
    || (lifecycleTools.rootManagedNames.length > 0 && controlMajority);
  if (!stamp.stamped.length && harnessShaped) {
    const shape = legacyControlShapes.controlsMissing.length === 0
      ? `all ${controls.length} root controls`
      : `${legacyControlShapes.controlsPresent.length} of ${controls.length} root controls and root tools/ files from the managed runtime set (${lifecycleTools.rootManagedNames.join(', ')})`;
    const reasons = [
      `The room carries ${shape}, the shape a Workbench installation leaves behind, but no manifest and no version stamp records that any release installed here.`,
      'An unstamped Workbench room (upgrade) and an independent dialect reusing the same names (adoption) produce exactly this evidence, and the room does not say which.',
      'Establish which from outside the room - its history, its remote, or the owner - rather than guessing; treating an unstamped first adoption as an upgrade loses the live truth an adoption would reconcile.'
    ];
    const unfilled = unfilledCopyReading(legacyControlShapes, stamp);
    if (unfilled) {
      reasons.push(`A third reading is open: ${unfilled}, which is what an unfilled copy of the templates looks like rather than a room any release installed.`);
    }
    return { verdict: 'unclassifiable', reasons };
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
  const reasons = [
    `The room holds ${roomContents.entryCount} top-level ${roomContents.entryCount === 1 ? 'entry' : 'entries'}${found.length ? `, including ${found.join(' and ')}` : ''}, so there is a working repository to derive filled controls from.`,
    'No manifest, no version stamp, and no Workbench-shaped control set: there is no installation to upgrade and no ambiguity about one.'
  ];
  // A straight copy of `templates/` lands here, because `templates/` carries no
  // CLAUDE.md and so is never harness-shaped. Its controls are the templates
  // themselves, not truth to derive filled controls from, so the reading is
  // stated rather than left for a reader to find in the evidence.
  const unfilled = unfilledCopyReading(legacyControlShapes, stamp);
  if (unfilled) {
    reasons.push(`A second reading is open: ${unfilled}, which is what an unfilled copy of the templates looks like rather than a repository carrying its own truth.`);
  }
  return { verdict: 'adoption', reasons };
}

export function classify(projectPath) {
  const project = path.resolve(projectPath);
  const entry = lstatOrNull(project);
  // The project path is the invocation, not a room condition: if it cannot even
  // be stat-ed there is no room to report on.
  if (!entry || entry === UNREADABLE || entry.isSymbolicLink() || !entry.isDirectory()) {
    return fail('invalid-project', `${project} must be an existing ordinary project directory.`);
  }
  const evidence = gather(project);
  const { verdict, reasons } = decide(evidence);
  return { status: 'classified', project, verdict, reasons, evidence };
}

if (isMainModule(import.meta.url)) {
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
}
