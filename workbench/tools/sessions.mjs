#!/usr/bin/env node
// Session records: promote a live notepad or handoff into the tracked
// checkpoints collection after a fail-closed privacy scan.
//
// Live grilling and handoff records are untracked by default; only a
// promoted checkpoint is durable evidence. A scan hit stops promotion with the
// line number and writes nothing.
import fs from 'node:fs';
import path from 'node:path';
import { finding } from './diagnostics.mjs';
import { assertSafeWritePath, writeSafeFile, collectionPath, collectionRelative, findRoot, isMainModule } from './workbench-paths.mjs';
import { scanPrivacy } from './privacy.mjs';

function lstatOrNull(target) {
  try { return fs.lstatSync(target); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

export function checkpoint(root, options) {
  const source = path.resolve(root, requireValue(options.from, '--from is required'));
  const topic = requireValue(options.topic, '--topic is required');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic)) throw new Error('--topic must be a lowercase slug');
  const entry = lstatOrNull(source);
  if (!entry || entry.isSymbolicLink() || !entry.isFile()) {
    return { status: 'blocked', error: finding('invalid-note', `${source} must be an ordinary file`) };
  }
  const content = fs.readFileSync(source, 'utf8');
  const hits = scanPrivacy(content);
  if (hits.length > 0) {
    return { status: 'blocked', error: finding('secret-like-content', `refused to promote ${path.relative(root, source)}: ${hits.map((hit) => `line ${hit.line} (${hit.label})`).join(', ')}`), hits };
  }
  const date = options.date ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Invalid date: ${date}`);
  const directory = collectionPath(root, 'checkpoints');
  const destination = path.join(directory, `${topic}-${date}.md`);
  assertSafeWritePath(root, destination);
  if (lstatOrNull(destination)) return { status: 'blocked', error: finding('invalid-note', `${path.relative(root, destination)} already exists; promote under a new date or topic`) };
  const stamped = content.startsWith('<!-- checkpoint')
    ? content
    : `<!-- checkpoint: promoted ${date} from ${path.relative(root, source).split(path.sep).join('/')} -->\n${content}`;
  writeSafeFile(root, destination, stamped, { exclusive: true });
  return { status: 'promoted', source: path.relative(root, source).split(path.sep).join('/'), checkpoint: `${collectionRelative(root, 'checkpoints')}/${topic}-${date}.md` };
}

export function scanFile(root, target) {
  const file = path.resolve(root, target);
  const hits = scanPrivacy(fs.readFileSync(file, 'utf8'));
  return { status: hits.length ? 'blocked' : 'clean', file: path.relative(root, file), hits };
}

function requireValue(value, message) {
  if (!value || !String(value).trim()) throw new Error(message);
  return String(value).trim();
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg.startsWith('--')) options[arg.slice(2)] = rest[++index];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return { command, options };
}

if (isMainModule(import.meta.url)) {
  try {
    const { command, options } = parseArgs(process.argv.slice(2));
    const root = findRoot(options.path ?? process.cwd());
    let result;
    if (command === 'checkpoint') result = checkpoint(root, options);
    else if (command === 'scan') result = scanFile(root, requireValue(options.file, '--file is required'));
    else throw new Error('Usage: sessions.mjs checkpoint --from LIVE_RECORD --topic slug [--date YYYY-MM-DD] | scan --file PATH');
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (result.status === 'blocked') process.exitCode = 1;
  } catch (error) {
    process.stdout.write(`${JSON.stringify({ status: 'blocked', error: { code: 'invalid-invocation', message: error.message } })}\n`);
    process.exitCode = 1;
  }
}
