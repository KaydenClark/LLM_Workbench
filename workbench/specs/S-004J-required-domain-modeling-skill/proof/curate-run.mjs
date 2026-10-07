#!/usr/bin/env node
// Reduce one raw scenario run (run-scenario.mjs OUT directory) to a curated,
// path-sanitized record for the Spec's proof folder:
//
//   node curate-run.mjs --run OUT --room ROOM --to proof/scenarios/NAME/runN.json
//
// Keeps per turn: the owner turn, the agent's final reply, skills invoked,
// tool calls (inputs cut to 400 characters), the room status, diff against
// the room's base commit, branch heads, and each notepad's entries
// (kind, topic, content, interpretation, corrects). Absolute room and scratch paths
// become <room> and <scratch>; the raw event streams stay in scratch.
import fs from 'node:fs';
import path from 'node:path';

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
}
const runDir = path.resolve(arg('run'));
const room = path.resolve(arg('room'));
const to = path.resolve(arg('to'));
const scratch = path.dirname(path.dirname(room));
const variants = [fs.realpathSync(room), room, fs.realpathSync(scratch), scratch].sort((a, b) => b.length - a.length);
function clean(text) {
  if (typeof text !== 'string') return text;
  let out = text;
  for (const p of variants) out = out.split(p).join(p.includes('/rooms/') ? '<room>' : '<scratch>');
  return out.replace(/\/Users\/[^/\s"']+/g, '<home>').replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '<email>');
}
const raw = JSON.parse(fs.readFileSync(path.join(runDir, 'run.json'), 'utf8'));
const curated = {
  room: raw.roomName ?? raw.room,
  base: raw.base,
  model: raw.model,
  cliVersion: raw.cliVersion,
  sessionId: raw.sessionId,
  skillsLoaded: raw.skillsLoaded,
  turns: raw.turns.map((t) => {
    const padDir = path.join(runDir, `notepads-turn${t.n}`);
    const notepads = fs.existsSync(padDir) ? fs.readdirSync(padDir).map((f) => {
      const note = JSON.parse(fs.readFileSync(path.join(padDir, f), 'utf8'));
      return {
        file: f,
        current: note.current,
        entries: (note.entries ?? []).map((e) => ({ id: e.id, kind: e.kind, topic: e.topic, content: clean(e.content), interpretation: clean(e.interpretation), corrects: e.corrects }))
      };
    }) : [];
    return {
      n: t.n,
      owner: t.owner,
      exit: t.exit,
      skillInvocations: t.skillInvocations,
      tools: t.tools.map((x) => ({ name: x.name, input: clean(JSON.stringify(x.input)).slice(0, 400) })),
      agent: clean(t.agent),
      head: t.head ?? null,
      headMoved: t.headMoved ?? null,
      branches: t.branches ?? null,
      roomStatus: t.roomStatus,
      roomDiff: clean(t.roomDiff),
      notepadPaths: t.notepads,
      notepads,
      shadowStores: t.shadowStores
    };
  })
};
fs.mkdirSync(path.dirname(to), { recursive: true });
fs.writeFileSync(to, `${JSON.stringify(curated, null, 2)}\n`);
console.log(to);
