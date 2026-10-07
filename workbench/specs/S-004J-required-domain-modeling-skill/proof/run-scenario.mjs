#!/usr/bin/env node
// Drive one scripted-owner scenario as a fresh headless Claude Code session
// inside a disposable scenario room, one owner turn per `claude -p` call
// (turn 1 starts the session; later turns `--resume` it).
//
//   node run-scenario.mjs --room DIR --turns turns.json --out DIR [--model M] [--claude BIN]
//
// The session loads only project and local settings (`--setting-sources
// project,local`), so skills resolve from the room's own `.claude/skills`
// adapter, not a personal catalog. Permission checks are bypassed so a write
// is an observed choice, not a sandbox limit; use this ONLY in a disposable
// room. After every turn the runner records the raw event stream, the tool
// calls, the tracked and untracked room diff against the room's commit, and a
// copy of every local notepad. The summary lands in OUT/run.json.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
}
const room = path.resolve(arg('room', ''));
const turns = JSON.parse(fs.readFileSync(path.resolve(arg('turns', '')), 'utf8'));
const out = path.resolve(arg('out', ''));
const model = arg('model', 'claude-opus-5-5');
const claude = arg('claude', 'claude');
if (!fs.existsSync(path.join(room, '.git')) || !Array.isArray(turns) || !arg('out')) {
  console.error('usage: run-scenario.mjs --room DIR --turns turns.json --out DIR [--model M] [--claude BIN]');
  process.exit(2);
}
fs.mkdirSync(out, { recursive: true });

const sh = (cmd, args) => spawnSync(cmd, args, { cwd: room, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const base = sh('git', ['rev-parse', 'HEAD']).stdout.trim();
const cliVersion = sh(claude, ['--version']).stdout.trim();

function notepads() {
  const dir = path.join(room, 'workbench/sessions/notepads');
  const found = [];
  const walk = (d) => {
    for (const entry of fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }) : []) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) { if (entry.name !== 'templates') walk(full); }
      else if (entry.name.endsWith('.json')) found.push(full);
    }
  };
  walk(dir);
  return found;
}
function shadowStores() {
  const r = sh('find', ['.', '-path', './.git', '-prune', '-o', '(', '-name', 'CONTEXT.md', '-o', '-name', 'CONTEXT-MAP.md', '-o', '-name', 'UBIQUITOUS_LANGUAGE.md', '-o', '-name', 'GLOSSARY-MAP.md', '-o', '-path', './docs/adr', ')', '-print']);
  return r.stdout.split('\n').filter(Boolean);
}

const record = { room: path.basename(room), base, model, cliVersion, sessionId: null, turns: [] };
let sessionId = null;
turns.forEach((owner, index) => {
  const n = index + 1;
  const args = ['-p', owner, '--output-format', 'stream-json', '--verbose', '--model', model,
    '--setting-sources', 'project,local', '--dangerously-skip-permissions'];
  if (sessionId) args.push('--resume', sessionId);
  const started = Date.now();
  const r = sh(claude, args);
  fs.writeFileSync(path.join(out, `turn${n}.jsonl`), r.stdout);
  if (r.stderr) fs.writeFileSync(path.join(out, `turn${n}.stderr.txt`), r.stderr);
  const events = r.stdout.split('\n').filter(Boolean).map((line) => { try { return JSON.parse(line); } catch { return null; } }).filter(Boolean);
  const init = events.find((e) => e.type === 'system' && e.subtype === 'init');
  const result = events.find((e) => e.type === 'result');
  sessionId = result?.session_id ?? init?.session_id ?? sessionId;
  record.sessionId ??= sessionId;
  const tools = [];
  for (const e of events) {
    if (e.type !== 'assistant') continue;
    for (const block of e.message?.content ?? []) {
      if (block.type === 'tool_use') tools.push({ name: block.name, input: block.input });
    }
  }
  const status = sh('git', ['status', '--porcelain', '--untracked-files=all']).stdout;
  // Diff the working tree against the room's base commit, so a change the
  // session committed (on any branch it checked out) still shows.
  const diff = sh('git', ['diff', base]).stdout;
  const head = sh('git', ['rev-parse', 'HEAD']).stdout.trim();
  const branches = sh('git', ['branch', '--format=%(refname:short) %(objectname:short)']).stdout.trim().split('\n');
  const padDir = path.join(out, `notepads-turn${n}`);
  const pads = notepads().map((file) => {
    fs.mkdirSync(padDir, { recursive: true });
    const copy = path.join(padDir, path.basename(file));
    fs.copyFileSync(file, copy);
    return path.relative(room, file);
  });
  record.turns.push({
    n, owner, exit: r.status, seconds: Math.round((Date.now() - started) / 1000),
    sessionId, skillsAvailable: init?.skills ?? null,
    skillInvocations: tools.filter((t) => t.name === 'Skill').map((t) => t.input?.skill ?? t.input?.name ?? t.input),
    tools: tools.map((t) => ({ name: t.name, input: t.name === 'Write' || t.name === 'Edit' ? { file_path: t.input.file_path } : t.input })),
    agent: result?.result ?? null, costUsd: result?.total_cost_usd ?? null,
    head, headMoved: head !== base, branches, roomStatus: status, roomDiff: diff, notepads: pads, shadowStores: shadowStores()
  });
  fs.writeFileSync(path.join(out, 'run.json'), JSON.stringify(record, null, 2));
  console.log(`turn ${n}: exit ${r.status}, ${record.turns.at(-1).seconds}s, head ${head === base ? 'base' : head}, diff ${diff ? 'non-empty' : 'empty'}, status [${status.trim().replace(/\n/g, '; ')}], notepads ${pads.length}`);
});

// Which skill bodies the session actually loaded, and from where: the session
// transcript records "Base directory for this skill: PATH" for each one.
const projects = path.join(os.homedir(), '.claude', 'projects');
const transcript = fs.existsSync(projects) && sessionId
  ? fs.readdirSync(projects).map((d) => path.join(projects, d, `${sessionId}.jsonl`)).find((f) => fs.existsSync(f))
  : undefined;
if (transcript) {
  const text = fs.readFileSync(transcript, 'utf8');
  fs.copyFileSync(transcript, path.join(out, 'session-transcript.jsonl'));
  const loaded = [...text.matchAll(/Base directory for this skill: ([^\\"\n]+)/g)].map((m) => m[1]);
  const realRoom = fs.realpathSync(room);
  record.skillsLoaded = [...new Set(loaded)].map((p) => p.replace(realRoom, '<room>').replace(room, '<room>'));
} else {
  record.skillsLoaded = null;
}
record.roomName = path.basename(room);
fs.writeFileSync(path.join(out, 'run.json'), JSON.stringify(record, null, 2));
console.log(`session ${sessionId}; skills loaded: ${JSON.stringify(record.skillsLoaded)}`);
