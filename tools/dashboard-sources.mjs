// Dashboard adapters read native owners. The caller supplies its safe reader;
// this module never writes records or generated projections.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { readTaskboard } from '../workbench/tools/spec-workbench.mjs';
import { showTracker } from '../workbench/tools/landmark-tracker.mjs';
import { assertSafeReadPath } from '../workbench/tools/workbench-paths.mjs';

const GROUPS = [
  ['specs', 'Specs'], ['tasks', 'Tasks'], ['dqcs', 'Destination Question Cards'],
  ['wiki', 'Wiki'], ['skills', 'Skills and procedures'], ['landmarks', 'Landmarks'],
  ['architecture', 'Architecture'], ['glossary', 'Glossary']
].map(([id, title]) => ({ id, title }));
const toRelative = (root, file) => path.relative(root, file).split(path.sep).join('/');
const heading = text => text.match(/^#\s+(.+)$/m)?.[1];
const fields = text => Object.fromEntries([...text.matchAll(/^\*\*([^*]+):\*\*\s*(.+)$/gm)].map(match => [match[1], match[2].trim()]));

export function dashboardSources(rootDir, { readSource, catalogOnly = false } = {}) {
  if (typeof readSource !== 'function') throw new TypeError('dashboardSources requires the board safe readSource(root, path) function');
  const root = path.resolve(rootDir);
  const result = { schema: 'workbench-dashboard/sources@1', groups: GROUPS.map(group => ({ ...group })), artifacts: [], taskboard: null, tracker: null, errors: [] };
  const known = new Set();
  const failed = (source, error, file) => {
    const failure = { source, ...(file ? { path: file } : {}), code: error.code ?? 'source-error', message: error.message };
    result.errors.push(failure);
    return failure;
  };
  let manifest;
  try {
    manifest = JSON.parse(readSource(root, 'workbench/manifest.json'));
    if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw Object.assign(new Error('Manifest must be a JSON object'), { code: 'invalid-manifest' });
  }
  catch (error) {
    const failure = failed('manifest', error, 'workbench/manifest.json');
    result.taskboard = { status: 'error', error: failure };
    result.tracker = { status: 'error', error: failure };
    return result;
  }

  function artifact(file, group, kind) {
    if (known.has(file)) return;
    try {
      const text = readSource(root, file);
      const json = file.endsWith('.json') ? JSON.parse(text) : null;
      const metadata = json ? {} : fields(text);
      const id = json?.id ?? metadata['Task ID'] ?? metadata['Spec ID'] ?? metadata['Landmark ID'];
      const parent = metadata['Spec ID'] ?? metadata['Landmark ID'];
      const revision = json?.revision ?? createHash('sha256').update(text).digest('hex');
      const relationships = json?.related ?? (kind === 'task' && parent ? [{ type: parent.startsWith('LMK-') ? 'landmark' : 'spec', id: parent }] : []);
      const source = {
        group, kind, path: file, title: json?.title ?? heading(text) ?? path.basename(file),
        ...(id ? { id } : {}), identity: kind === 'task' ? `task:${parent ?? 'unknown'}/${id ?? file}:${file}` : `${kind}:${id ?? file}:${file}`,
        status: json ? (json.confirmation ? 'confirmation recorded; inspect revision' : 'current source') : metadata.Status ?? (file.includes('/archive/') || file.includes('/retired/') ? 'historical source' : 'current source'),
        format: json ? 'json' : 'markdown', revision,
        sources: json?.sources ?? [{ path: file }], relationships,
        history: json?.history ?? [],
        ...(json?.schema ? { schema: json.schema } : {}),
        ...(json?.landmarks ? { landmarks: json.landmarks } : {})
      };
      result.artifacts.push(source);
      known.add(file);
    } catch (error) { failed(group, error, file); }
  }

  // Walk declared public lanes only; never follow a linked file or directory.
  // Hidden entries and private sessions are not a catalog discovery route.
  function scan(relative, source, select) {
    if (!relative) return;
    if (typeof relative !== 'string') {
      failed(source, Object.assign(new Error('Declared collection must be a relative path string'), { code: 'invalid-manifest' }));
      return;
    }
    const directory = path.resolve(root, relative);
    function walk(dir) {
      const rel = toRelative(root, dir);
      try {
        if (rel.split('/').some(part => part.startsWith('.')) || /(?:^|\/)sessions\/(?:notepads|handoffs)(?:\/|$)/.test(rel)) throw Object.assign(new Error('Private working collections are not cataloged'), { code: 'unsafe-path' });
        assertSafeReadPath(root, dir);
        const stat = fs.lstatSync(dir);
        if (stat.isSymbolicLink() || !stat.isDirectory()) throw Object.assign(new Error('Collection must be an ordinary directory'), { code: 'unsafe-path' });
        for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
          if (entry.name.startsWith('.')) continue;
          const file = path.join(dir, entry.name), itemPath = toRelative(root, file);
          if (entry.isSymbolicLink()) { failed(source, Object.assign(new Error('Linked catalog entries are not served'), { code: 'unsafe-path' }), itemPath); continue; }
          if (entry.isDirectory()) walk(file);
          else if (entry.isFile()) {
            const selected = select(itemPath, entry.name);
            if (selected) artifact(itemPath, selected.group, selected.kind);
          }
        }
      } catch (error) { failed(source, error, rel || relative); }
    }
    if (fs.existsSync(directory)) walk(directory);
    else failed(source, Object.assign(new Error(`Declared collection ${relative} is missing`), { code: 'missing-collection' }), relative);
  }
  const ownerSelector = (_file, name) => name === 'SPEC.md' ? { group: 'specs', kind: 'spec' } : name === 'TASK.md' ? { group: 'tasks', kind: 'task' } : name === 'LANDMARK.md' ? { group: 'landmarks', kind: 'landmark' } : null;
  scan(manifest.lanes?.specs, 'taskboard', ownerSelector);
  scan(manifest.collections?.landmarks, 'taskboard', ownerSelector);
  scan(manifest.landmarkTracker?.collections?.['destination-questions'], 'tracker', (_file, name) => /^DQC-[0-9A-Za-z]+\.json$/.test(name) ? { group: 'dqcs', kind: 'dqc' } : null);
  scan(manifest.landmarkTracker?.collections?.landmarks, 'tracker', (_file, name) => /^LMK-[0-9A-Za-z]+\.json$/.test(name) ? { group: 'landmarks', kind: 'landmark' } : null);
  scan(manifest.lanes?.wiki, 'wiki', (_file, name) => /\.(md|json)$/.test(name) ? { group: 'wiki', kind: 'wiki' } : null);
  scan(manifest.lanes?.skills, 'skills', (_file, name) => /\.md$/.test(name) ? { group: 'skills', kind: 'skill' } : null);
  for (const [file, group] of [['ARCHITECTURE.md', 'architecture'], ['GLOSSARY.md', 'glossary']]) if (fs.existsSync(path.join(root, file))) artifact(file, group, group);

  result.artifacts.sort((a, b) => a.group.localeCompare(b.group) || a.title.localeCompare(b.title) || a.path.localeCompare(b.path));
  if (catalogOnly) {
    result.taskboard = { status: 'not-requested' };
    result.tracker = { status: 'not-requested' };
    return result;
  }

  try {
    if (result.errors.some(error => error.source === 'taskboard' || ['specs', 'tasks', 'landmarks'].includes(error.source))) throw Object.assign(new Error('A Taskboard source is unreadable; inspect the source errors'), { code: 'unreadable-source' });
    const board = readTaskboard(root, { qualified: true });
    result.taskboard = { status: 'available', board, semantics: 'Native execution lanes; approval and verification remain in source records.' };
  } catch (error) { result.taskboard = { status: 'error', error: failed('taskboard', error), semantics: 'Source records remain readable; no substitute execution projection is manufactured.' }; }
  try {
    const tracker = showTracker(root).tracker;
    result.tracker = { status: 'available', tracker, semantics: 'Native understanding distribution; assessed coverage does not establish delivery completion.' };
  } catch (error) { result.tracker = { status: 'error', error: failed('tracker', error) }; }
  return result;
}
