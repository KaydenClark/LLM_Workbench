// One answer to "where is the project root" and "where does lane or
// collection X live". Every runtime tool and every skill resolves paths
// through this module; nothing hardcodes a lane or collection.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const SCHEMA_VERSION = 2;
export const LANES = Object.freeze({
  docs: 'workbench/docs',
  specs: 'workbench/specs',
  wiki: 'workbench/wiki',
  sessions: 'workbench/sessions',
  feedback: 'workbench/feedback',
  tools: 'workbench/tools'
});
export const COLLECTIONS = Object.freeze({
  adr: 'workbench/docs/adr',
  'design-concepts': 'workbench/wiki/design-concepts',
  guidebooks: 'workbench/wiki/guidebooks',
  archive: 'workbench/wiki/archive',
  grilling: 'workbench/sessions/grilling',
  handoffs: 'workbench/sessions/handoffs',
  checkpoints: 'workbench/sessions/checkpoints'
});
// Live session collections stay untracked by default; only checkpoints are
// durable. A durable reference into an untracked collection is a defect.
export const UNTRACKED_COLLECTIONS = Object.freeze(['grilling', 'handoffs']);
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
