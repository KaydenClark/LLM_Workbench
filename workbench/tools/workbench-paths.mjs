// One answer to "where is the project root" and "where does lane or
// collection X live". Every runtime tool and every skill resolves paths
// through this module; nothing hardcodes a lane or collection.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const SCHEMA_VERSION = 2;
// S-00V TK-001: `skills` is the seventh lane. Every room carries the core
// skills it needs at `workbench/skills`, owned and versioned by LLM Workbench
// and replaced by the ordinary Workbench update, so a fresh clone discovers
// them without a provider home. Rooms stamped before the lane existed still
// declare the six-lane shape below; `validateManifest` reads both.
export const LANES = Object.freeze({
  docs: 'workbench/docs',
  specs: 'workbench/specs',
  wiki: 'workbench/wiki',
  sessions: 'workbench/sessions',
  feedback: 'workbench/feedback',
  tools: 'workbench/tools',
  skills: 'workbench/skills'
});
export const SIX_LANES = Object.freeze(Object.fromEntries(Object.entries(LANES).filter(([name]) => name !== 'skills')));
export const COLLECTIONS = Object.freeze({
  adr: 'workbench/docs/adr',
  'design-concepts': 'workbench/wiki/design-concepts',
  guidebooks: 'workbench/wiki/guidebooks',
  archive: 'workbench/wiki/archive',
  grilling: 'workbench/sessions/grilling',
  handoffs: 'workbench/sessions/handoffs',
  checkpoints: 'workbench/sessions/checkpoints',
  notepads: 'workbench/sessions/notepads',
  'notepad-templates': 'workbench/sessions/notepads/templates',
  recovery: 'workbench/sessions/recovery'
});
// Live records stay untracked. The templates subcollection is explicitly
// excluded from live-note operations and remains tracked in project Git.
export const UNTRACKED_COLLECTIONS = Object.freeze(['grilling', 'handoffs', 'notepads']);
// Operational recovery is private local state, but never a notepad collection.
export const IGNORED_COLLECTIONS = Object.freeze([...UNTRACKED_COLLECTIONS, 'recovery']);
export const WIKI_PROFILES = Object.freeze(['project', 'deployment']);

export function manifestPath(root) {
  return path.join(path.resolve(root), 'workbench', 'manifest.json');
}

export function readManifest(root) {
  const file = manifestPath(root);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    const failure = new Error(`${file} is unreadable: ${error.message}`);
    failure.code = 'invalid-manifest';
    throw failure;
  }
}

// The practical subset of git-check-ref-format for a branch name, checked
// without spawning Git so a manifest can be validated anywhere.
export function isBranchName(value) {
  return typeof value === 'string'
    && value.length > 0
    && !/[\s~^:?*[\\\x00-\x1f\x7f]/.test(value)
    && !value.startsWith('-') && !value.startsWith('/') && !value.startsWith('.')
    && !value.endsWith('/') && !value.endsWith('.') && !value.endsWith('.lock')
    && !value.includes('..') && !value.includes('//') && !value.includes('/.') && !value.includes('@{')
    && value !== '@'
    // Git refuses `git branch HEAD`; accepting it would let the origin/HEAD symref satisfy a declaration.
    && value !== 'HEAD';
}

// The declared Git facts: the default branch and the branch the independent
// review gate merges into, by exact name. A manifest without the block
// declares nothing and stays valid; a malformed block is a malformed manifest.
export function declaredGit(root) {
  const declared = readManifest(root)?.git;
  if (declared === undefined) return null;
  if (!declared || typeof declared !== 'object' || Array.isArray(declared) || !isBranchName(declared.defaultBranch) || !isBranchName(declared.integrationBranch)) {
    const failure = new Error('manifest git block must declare defaultBranch and integrationBranch as Git branch names');
    failure.code = 'invalid-manifest';
    throw failure;
  }
  return { defaultBranch: declared.defaultBranch, integrationBranch: declared.integrationBranch };
}

export function isSafeRelative(value) {
  return typeof value === 'string'
    && !path.isAbsolute(value)
    && !/[\\\s]/.test(value)
    && value === value.toLowerCase()
    && value === path.posix.normalize(value)
    && !value.split('/').includes('..')
    && value.startsWith('workbench/');
}

// Walk up from `start` to the nearest directory that declares a workbench,
// falling back to the nearest Git checkout, then to `start` itself.
export function findRoot(start = process.cwd()) {
  let current = path.resolve(start);
  if (fs.existsSync(current) && !fs.statSync(current).isDirectory()) current = path.dirname(current);
  let gitRoot = null;
  for (;;) {
    if (fs.existsSync(path.join(current, 'workbench', 'manifest.json'))) return current;
    if (gitRoot === null && fs.existsSync(path.join(current, '.git'))) gitRoot = current;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return gitRoot ?? path.resolve(start);
}

export function laneRelative(root, name) {
  if (!Object.hasOwn(LANES, name)) throw new Error(`unknown lane: ${name}`);
  const declared = readManifest(root)?.lanes?.[name];
  if (declared !== undefined && !isSafeRelative(declared)) {
    const failure = new Error(`manifest lane ${name} is unsafe: ${declared}`);
    failure.code = 'invalid-lane';
    throw failure;
  }
  return declared ?? LANES[name];
}

export function collectionRelative(root, name) {
  if (!Object.hasOwn(COLLECTIONS, name)) throw new Error(`unknown collection: ${name}`);
  const declared = readManifest(root)?.collections?.[name];
  if (declared !== undefined && !isSafeRelative(declared)) {
    const failure = new Error(`manifest collection ${name} is unsafe: ${declared}`);
    failure.code = 'invalid-collection';
    throw failure;
  }
  return declared ?? COLLECTIONS[name];
}

// S-01T TK-01X: the Landmark Tracker root is an additive manifest block,
// `landmarkTracker`, beside `git` - never an eighth lane and never a change to
// the exact collection sets above, so a room without the block resolves and
// validates exactly as before. The block names the root and its two flat JSON
// collections; the generated projection is always `<root>/TRACKER.json`.
// The shape is closed: an unknown key or collection is a malformed manifest,
// and an undeclared room has no Tracker rather than a defaulted one.
export const TRACKER_COLLECTIONS = Object.freeze(['destination-questions', 'landmarks']);
export const TRACKER_PROJECTION = 'TRACKER.json';

function invalidTracker(message) {
  const failure = new Error(`manifest landmarkTracker ${message}`);
  failure.code = 'invalid-tracker';
  return failure;
}

// Validates the declaration's shape without touching the filesystem; returns
// null when the manifest declares no Tracker.
export function trackerDeclaration(manifest) {
  const declared = manifest?.landmarkTracker;
  if (declared === undefined) return null;
  if (!declared || typeof declared !== 'object' || Array.isArray(declared)) throw invalidTracker('must be an object with root and collections');
  const keys = Object.keys(declared).sort();
  if (JSON.stringify(keys) !== JSON.stringify(['collections', 'root'])) throw invalidTracker(`must declare exactly root and collections; found ${keys.join(', ') || 'nothing'}`);
  if (!isSafeRelative(declared.root)) throw invalidTracker(`root is unsafe: ${declared.root}`);
  const collections = declared.collections;
  if (!collections || typeof collections !== 'object' || Array.isArray(collections)) throw invalidTracker('collections must be an object');
  const names = Object.keys(collections).sort();
  if (JSON.stringify(names) !== JSON.stringify([...TRACKER_COLLECTIONS].sort())) throw invalidTracker(`collections must be exactly ${TRACKER_COLLECTIONS.join(', ')}; found ${names.join(', ') || 'nothing'}`);
  for (const name of TRACKER_COLLECTIONS) {
    const value = collections[name];
    if (!isSafeRelative(value)) throw invalidTracker(`collection ${name} is unsafe: ${value}`);
    if (path.posix.dirname(value) !== declared.root) throw invalidTracker(`collection ${name} must be a flat directory directly under ${declared.root}: ${value}`);
    if (path.posix.basename(value) === TRACKER_PROJECTION) throw invalidTracker(`collection ${name} cannot take the projection name`);
  }
  if (collections['destination-questions'] === collections.landmarks) throw invalidTracker('collections must be distinct directories');
  return {
    root: declared.root,
    projection: `${declared.root}/${TRACKER_PROJECTION}`,
    collections: Object.fromEntries(TRACKER_COLLECTIONS.map(name => [name, collections[name]]))
  };
}

export function declaredTracker(root) {
  return trackerDeclaration(readManifest(root));
}

function requireTracker(root) {
  const declared = declaredTracker(root);
  if (!declared) {
    const failure = new Error('this room declares no Landmark Tracker root; add a landmarkTracker block to workbench/manifest.json first');
    failure.code = 'tracker-undeclared';
    throw failure;
  }
  return declared;
}

export function trackerRootPath(root) {
  return path.resolve(path.resolve(root), requireTracker(root).root);
}

export function trackerCollectionPath(root, name) {
  if (!TRACKER_COLLECTIONS.includes(name)) throw new Error(`unknown Tracker collection: ${name}`);
  return path.resolve(path.resolve(root), requireTracker(root).collections[name]);
}

export function trackerProjectionPath(root) {
  return path.resolve(path.resolve(root), requireTracker(root).projection);
}

export function lanePath(root, name) {
  return path.resolve(path.resolve(root), laneRelative(root, name));
}

export function collectionPath(root, name) {
  return path.resolve(path.resolve(root), collectionRelative(root, name));
}

export function toolPath(root, tool) {
  return path.join(lanePath(root, 'tools'), tool);
}

// True when the module at `importMetaUrl` is the script Node was asked to run.
// Resolves symlinked and relative argv paths, and never throws when argv[1] is
// absent or not a real file (piped module input, embedding, or a REPL).
export function isMainModule(importMetaUrl) {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return importMetaUrl === pathToFileURL(fs.realpathSync(entry)).href;
  } catch {
    return importMetaUrl === pathToFileURL(path.resolve(entry)).href;
  }
}

// The read boundary for a promotion source: it must resolve inside the
// project and no component of its path may be a symbolic link, so a linked
// directory cannot reach outside. A missing component is left for the caller
// to report; this only refuses what a later lstat would misread.
export function assertSafeReadPath(root, source) {
  const base = path.resolve(root);
  const relative = path.relative(base, path.resolve(source));
  if (!relative || relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) throw new Error(`the source must stay inside the repository root ${base}`);
  let current = base;
  for (const part of relative.split(path.sep)) {
    current = path.join(current, part);
    let entry;
    try { entry = fs.lstatSync(current); } catch (error) { if (error.code === 'ENOENT') return; throw error; }
    if (entry.isSymbolicLink()) throw new Error(`${current} is a symbolic link; a source must be an ordinary path inside the repository root ${base}`);
  }
}

// Refuse linked destination ancestors and nonregular targets before a writer
// creates directories or touches data. Missing descendants may be created.
export function assertSafeWritePath(root, destination) {
  const base = path.resolve(root);
  const relative = path.relative(base, path.resolve(destination));
  if (!relative || relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) throw new Error('Write destination must stay inside the project');
  let current = base;
  const parts = relative.split(path.sep);
  for (let index = 0; index < parts.length; index += 1) {
    current = path.join(current, parts[index]);
    let entry;
    try { entry = fs.lstatSync(current); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    const final = index === parts.length - 1;
    if (entry.isSymbolicLink() || (final ? !entry.isFile() || entry.nlink > 1 : !entry.isDirectory())) {
      throw new Error(`Unsafe write destination: ${current}`);
    }
  }
}

export function writeSafeFile(root, destination, content, { exclusive = false } = {}) {
  assertSafeWritePath(root, destination);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const temporaryDir = fs.mkdtempSync(path.join(path.dirname(destination), '.write-'));
  try {
    const temporary = path.join(temporaryDir, 'content');
    fs.writeFileSync(temporary, content, { mode: 0o644, flag: 'wx' });
    // link is an atomic no-replace publication for a new ADR or checkpoint.
    if (exclusive) fs.linkSync(temporary, destination);
    else fs.renameSync(temporary, destination);
  } finally { fs.rmSync(temporaryDir, { recursive: true, force: true }); }
}
