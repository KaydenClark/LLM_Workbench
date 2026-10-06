#!/usr/bin/env node
// S-003Z TK-008D: the LANDMARK.md artifact, the record one size above a Spec
// (ADR-000U). A landmark lives at `<landmarks collection>/LMK-###-slug/` on the
// active roster or under one of the collection's lifecycle folders, and its
// child Specs and direct Tasks nest beside it. This module parses and
// validates one artifact the way spec-packet.mjs parses a Spec packet, lists
// the roster at both homes, and reports doctor's findings for the collection.
// Nesting, the link-safe move, the review rung and retirement are later
// Tasks of the same Spec; nothing here reads a child Spec or Task.
import fs from 'node:fs';
import path from 'node:path';
import { collectionPath, collectionRelative, findRoot, isMainModule } from './workbench-paths.mjs';
import { finding } from './diagnostics.mjs';
import { visibleIdKey } from './visible-ids.mjs';

export const LANDMARK_PREFIX = 'LMK';
export const LANDMARK_FILE = 'LANDMARK.md';
// The closed status set. The lifecycle folder, not a status, says a landmark
// is retired, exactly as a Spec's does.
export const LANDMARK_STATUSES = Object.freeze(['planned', 'active', 'reached']);
// The closed set of lifecycle subfolders beneath the collection's top level,
// the same transient terminal folder a Spec has (SPEC_LIFECYCLE_FOLDERS).
export const LANDMARK_LIFECYCLE_FOLDERS = Object.freeze(['retired']);
export const REQUIRED_LANDMARK_FIELDS = Object.freeze(['Status', 'Priority', 'Owner', 'Updated', 'Catalog description', 'Blockers', 'Latest event', 'Next gate']);
export const REQUIRED_LANDMARK_SECTIONS = Object.freeze(['Direction', 'What Success Looks Like', 'Decision Records', 'Append-Only Evidence And Execution Log', 'Reached Result']);
// Sections the template ships and this reader parses when present.
export const OPTIONAL_LANDMARK_SECTIONS = Object.freeze(['Why It Matters', 'Child Specs', 'Direct Tasks', 'Verification Procedure', 'Supersession']);
const LANDMARK_ID = new RegExp(`^${LANDMARK_PREFIX}-[0-9A-Za-z]{3,}$`);
// A blocker is a Spec, Task or landmark identifier, with the Spec blocker
// grammar's optional qualifier (`S-###:delivered`); prose is refused.
const BLOCKER_ID = /^(?:S|TK|LMK)-[0-9A-Za-z]{3,}(?::[a-z-]+)?$/;

function section(content, heading) {
  const match = new RegExp(`^## ${escapeRegExp(heading)}[ \\t]*$`, 'm').exec(content);
  if (!match) return null;
  const bodyStart = match.index + match[0].length;
  const end = content.indexOf('\n## ', bodyStart);
  return content.slice(bodyStart, end < 0 ? content.length : end).trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseBlockers(value, id) {
  if (value === 'none') return [];
  const entries = value.split(',').map(entry => entry.trim());
  if (entries.some(entry => !BLOCKER_ID.test(entry))) {
    throw new Error(`${id} has Blockers "${value}"; it must be none or a comma-separated list of S-, TK- or ${LANDMARK_PREFIX}- identifiers`);
  }
  return entries;
}

// The reached checks: every `- [ ]` / `- [x]` list item in the section.
function parseChecks(body) {
  return [...(body ?? '').matchAll(/^\s*- \[([ xX])\] (.+)$/gm)].map(match => ({ text: match[2].trim(), done: match[1] !== ' ' }));
}

// The linked list items of a section: `- [title](target)` lines. A `- none`
// line lists nothing.
function parseLinks(body) {
  return [...(body ?? '').matchAll(/^\s*- \[([^\]\n]+)\]\(([^)\s]+)\)/gm)].map(match => {
    const title = match[1].trim();
    const target = match[2].trim();
    const id = `${title} ${target}`.match(/\b(?:S|TK)-[0-9A-Za-z]{3,}\b/)?.[0] ?? null;
    return { title, target, ...(id ? { id } : {}) };
  });
}

export function parseLandmarkArtifact(content, filePath, root) {
  const relativePath = path.relative(root, filePath).split(path.sep).join('/');
  const fields = {};
  for (const match of content.matchAll(/^\*\*([^*]+):\*\*\s*(.+)$/gm)) fields[match[1].trim()] = match[2].trim();
  const id = fields['Landmark ID'];
  if (!id || !LANDMARK_ID.test(id)) throw new Error(`${relativePath} has an invalid or missing Landmark ID`);
  const titleMatch = content.match(new RegExp(`^# ${escapeRegExp(id)} - (.+)$`, 'm'));
  if (!titleMatch || !titleMatch[1].trim()) throw new Error(`${id} has no matching title`);
  for (const name of REQUIRED_LANDMARK_FIELDS) if (!fields[name]) throw new Error(`${id} is missing ${name}`);
  if (!LANDMARK_STATUSES.includes(fields.Status)) throw new Error(`${id} has Status ${fields.Status}; the closed set is ${LANDMARK_STATUSES.join(', ')}`);
  const priority = Number(fields.Priority);
  if (!Number.isInteger(priority) || priority < 0) throw new Error(`${id} has Priority ${fields.Priority}; it must be a nonnegative integer`);
  const blockers = parseBlockers(fields.Blockers, id);
  for (const heading of REQUIRED_LANDMARK_SECTIONS) {
    if (section(content, heading) === null) throw new Error(`${id} is missing the ${heading} section`);
  }
  const successChecks = parseChecks(section(content, 'What Success Looks Like'));
  if (successChecks.length === 0) throw new Error(`${id} has no reached check (a \`- [ ]\` item) in What Success Looks Like`);
  return {
    root,
    filePath,
    relativePath,
    content,
    id,
    title: titleMatch[1].trim(),
    status: fields.Status,
    priority,
    owner: fields.Owner,
    updated: fields.Updated,
    description: fields['Catalog description'],
    blockers,
    latestEvent: fields['Latest event'],
    nextGate: fields['Next gate'],
    successChecks,
    decisionRecords: parseLinks(section(content, 'Decision Records')),
    childSpecs: parseLinks(section(content, 'Child Specs')),
    directTasks: parseLinks(section(content, 'Direct Tasks'))
  };
}

// The artifact paths under one folder: each immediate subdirectory holding a
// LANDMARK.md, sorted. A folder that does not exist holds nothing.
function artifactPaths(folderRoot) {
  if (!fs.existsSync(folderRoot)) return [];
  const paths = [];
  for (const entry of fs.readdirSync(folderRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const filePath = path.join(folderRoot, entry.name, LANDMARK_FILE);
    if (fs.existsSync(filePath)) paths.push(filePath);
  }
  return paths.sort();
}

// Every artifact location in the collection with the lifecycle folder it sits
// in (`null` for the active roster), read without parsing.
function locateArtifacts(root) {
  const base = path.resolve(root);
  const prefix = collectionRelative(base, 'landmarks');
  const collection = collectionPath(base, 'landmarks');
  const located = artifactPaths(collection).map(filePath => ({ filePath, prefix, lifecycleFolder: null }));
  for (const folder of LANDMARK_LIFECYCLE_FOLDERS) {
    located.push(...artifactPaths(path.join(collection, folder)).map(filePath => ({ filePath, prefix, lifecycleFolder: folder })));
  }
  return located;
}

function readArtifact(root, { filePath, prefix, lifecycleFolder }) {
  const content = fs.readFileSync(filePath, 'utf8');
  const landmark = parseLandmarkArtifact(content, filePath, path.resolve(root));
  return { ...landmark, landmarksPrefix: prefix, lifecycleFolder };
}

// The active roster: top-level folders of the collection. A malformed
// artifact refuses the load, as a malformed Spec packet refuses `loadSpecs`.
export function loadLandmarks(root) {
  return locateArtifacts(root).filter(item => item.lifecycleFolder === null).map(item => readArtifact(root, item));
}

// The historical route: every lifecycle folder, mirroring `loadRetiredSpecs`.
export function loadRetiredLandmarks(root) {
  return locateArtifacts(root).filter(item => item.lifecycleFolder !== null).map(item => readArtifact(root, item));
}

function expectedPathPrefix(landmark) {
  return landmark.lifecycleFolder
    ? `${landmark.landmarksPrefix}/${landmark.lifecycleFolder}/${landmark.id}-`
    : `${landmark.landmarksPrefix}/${landmark.id}-`;
}

// The identity an artifact declares, read without the full parse so a
// malformed one is still named by its own id (or, lacking one, its folder).
function declaredId(content, filePath) {
  return content.match(/^\*\*Landmark ID:\*\*\s*(\S+)/m)?.[1] ?? path.basename(path.dirname(filePath));
}

// Doctor's findings for the collection, tolerant of malformed artifacts so
// every landmark is reported and the rest of the room still runs:
// `malformed-landmark` names each artifact that fails its contract,
// `unstable-path` a folder off the `<collection>/<folder>/LMK-###-` shape, and
// `duplicate-id` two artifacts claiming one identity.
export function landmarkFindings(root) {
  const base = path.resolve(root);
  const findings = [];
  const seen = new Map();
  for (const item of locateArtifacts(base)) {
    const relativePath = path.relative(base, item.filePath).split(path.sep).join('/');
    let landmark;
    try {
      landmark = readArtifact(base, item);
    } catch (error) {
      const landmarkId = declaredId(fs.readFileSync(item.filePath, 'utf8'), item.filePath);
      findings.push(finding('malformed-landmark', `${landmarkId} at ${relativePath}: ${error.message}`, { landmarkId, path: relativePath }));
      continue;
    }
    const key = visibleIdKey(landmark.id);
    if (seen.has(key)) {
      findings.push(finding('duplicate-id', `Duplicate landmark ID: ${landmark.id} at ${relativePath} conflicts with ${seen.get(key)}`, { landmarkId: landmark.id, path: relativePath }));
    } else {
      seen.set(key, relativePath);
    }
    const expected = expectedPathPrefix(landmark);
    if (!landmark.relativePath.startsWith(expected)) {
      findings.push(finding('unstable-path', `${landmark.id} path must start ${expected}`, { landmarkId: landmark.id, path: relativePath }));
    }
  }
  return findings;
}

export function publicLandmark(landmark) {
  return {
    id: landmark.id,
    title: landmark.title,
    status: landmark.status,
    priority: landmark.priority,
    owner: landmark.owner,
    updated: landmark.updated,
    description: landmark.description,
    blockers: landmark.blockers,
    latestEvent: landmark.latestEvent,
    nextGate: landmark.nextGate,
    path: landmark.relativePath,
    lifecycleFolder: landmark.lifecycleFolder,
    successChecks: landmark.successChecks,
    decisionRecords: landmark.decisionRecords,
    childSpecs: landmark.childSpecs,
    directTasks: landmark.directTasks
  };
}

// One landmark by identity, active roster first and then the lifecycle
// folders. The artifact is located by the id it declares and then parsed, so
// a malformed landmark refuses with its own error rather than another's.
export function findLandmark(root, id) {
  const base = path.resolve(root);
  if (!id || !LANDMARK_ID.test(id)) throw new Error(`A landmark identity must match ${LANDMARK_PREFIX}-###: ${id ?? 'none given'}`);
  const key = visibleIdKey(id);
  for (const item of locateArtifacts(base)) {
    const content = fs.readFileSync(item.filePath, 'utf8');
    if (visibleIdKey(declaredId(content, item.filePath)) !== key) continue;
    return { ...parseLandmarkArtifact(content, item.filePath, base), landmarksPrefix: item.prefix, lifecycleFolder: item.lifecycleFolder };
  }
  throw new Error(`Unknown landmark ID: ${id}`);
}

// Validate one landmark by identity, or the whole collection when no identity
// is given. A single validation throws on the first contract failure; the
// whole-collection form returns doctor's findings instead.
export function validateLandmark(root, id) {
  if (id) return { status: 'valid', landmark: publicLandmark(findLandmark(root, id)) };
  const findings = landmarkFindings(root);
  return { status: findings.length ? 'invalid' : 'valid', collection: collectionRelative(path.resolve(root), 'landmarks'), findings };
}

export function listLandmarks(root) {
  const base = path.resolve(root);
  return {
    collection: collectionRelative(base, 'landmarks'),
    active: loadLandmarks(base).map(publicLandmark),
    retired: loadRetiredLandmarks(base).map(publicLandmark)
  };
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  let id;
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === '--json') options.json = true;
    else if (arg === '--path') options.path = rest[++index];
    else if (arg.startsWith('--')) throw new Error(`Unknown option: ${arg}`);
    else if (id === undefined) id = arg;
    else throw new Error(`Unexpected argument: ${arg}`);
  }
  return { command, id, options };
}

function formatLandmarkLine(landmark) {
  return `${landmark.id} ${landmark.status} ${landmark.path}${landmark.lifecycleFolder ? ` (${landmark.lifecycleFolder})` : ''}`;
}

function main() {
  const { command, id, options } = parseArgs(process.argv.slice(2));
  const root = options.path ? path.resolve(options.path) : findRoot(process.cwd());
  let result;
  if (command === 'validate') result = validateLandmark(root, id);
  else if (command === 'list') {
    if (id) throw new Error('list takes no landmark identity');
    result = listLandmarks(root);
  } else {
    throw new Error('Usage: landmark-artifact.mjs validate [LMK-###]|list [--path ROOT] [--json]');
  }
  if (options.json) console.log(JSON.stringify(result, null, 2));
  else if (command === 'list') {
    const lines = [...result.active.map(formatLandmarkLine), ...result.retired.map(formatLandmarkLine)];
    console.log(lines.length ? lines.join('\n') : `No landmarks in ${result.collection}.`);
  } else if (result.landmark) console.log(`valid ${formatLandmarkLine(result.landmark)}`);
  else console.log(result.findings.length ? result.findings.map(item => `${item.code}: ${item.message}`).join('\n') : `valid: every landmark in ${result.collection}`);
  if (result.status === 'invalid') process.exitCode = 1;
}

if (isMainModule(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}
