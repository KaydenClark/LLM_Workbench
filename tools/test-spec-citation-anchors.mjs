#!/usr/bin/env node
// A bare `path:line` citation names a position, and every merge into
// `integration` moves it. S-039 shipped nine such citations that were correct
// at the tree they were written against and point at unrelated content today -
// one of them behind a checked acceptance box with no fallback. The repair for
// that class is not a sweep, which goes stale again on the next merge, but a
// declared anchor: the spec says which tree its bare citations read at, and
// this test holds the declaration to the repository.
//
// Scope: specs numbered S-036 and above, where the convention starts. Earlier
// specs carry bare citations from before the rule existed and are grandfathered
// deliberately - retro-anchoring 65 citations across ten completed specs would
// be a large edit to accepted records for no reader benefit, and the convention
// only has to hold from here forward to stop the class recurring.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SPECS = path.join(root, 'workbench', 'specs');
const FIRST_ANCHORED = 36;

const CITE = /([A-Za-z0-9_./-]+\.(?:mjs|md|py|json)):(\d+)(?:-(\d+))?/g;
const ANCHOR = /\*\*Citation anchors\.\*\*\s*pre=`([0-9a-f]{7,40})`\s*post=`([0-9a-f]{7,40})`/;
const PRE_SECTIONS = new Set(['Outcome', 'Why It Matters', 'Current Verified State', 'Desired Behavior']);
const EVIDENCE = 'Append-Only Evidence And Execution Log';

export function anchoredSpecs() {
  return fs.readdirSync(SPECS)
    .filter((d) => /^S-\d{3}-/.test(d) && Number(d.slice(2, 5)) >= FIRST_ANCHORED)
    .filter((d) => fs.existsSync(path.join(SPECS, d, 'SPEC.md')))
    .sort();
}

// Live citations are the ones a reader is invited to follow now. Evidence rows
// are historical and self-dating, so they are read at the commit their own row
// names and are out of scope here.
export function liveCitations(text) {
  const out = [];
  let section = null;
  for (const line of text.split('\n')) {
    if (line.startsWith('## ')) section = line.slice(3).trim();
    if (section === EVIDENCE || line.includes('git show')) continue;
    for (const m of line.matchAll(CITE)) {
      out.push({ section, cited: m[1], from: Number(m[2]), to: Number(m[3] ?? m[2]) });
    }
  }
  return out;
}

// A bare SHA in a live section is the same promise as a `path:line`: a reader
// is invited to go and look. S-046 shipped three citations to commits that had
// been squashed away before the push - including, twice, inside the very row
// written to correct a previous wrong citation. A discarded commit is a real
// object until it is collected and then it is nothing, so "it resolved when I
// wrote it" is not the property that matters; reachability is.
const SHA = /`([0-9a-f]{7,40})`/g;

export function liveShas(text) {
  const out = [];
  let section = null;
  for (const line of text.split('\n')) {
    if (line.startsWith('## ')) section = line.slice(3).trim();
    if (section === EVIDENCE) continue;
    for (const m of line.matchAll(SHA)) out.push(m[1]);
  }
  return [...new Set(out)];
}

function gitOk(args) {
  try {
    return { ok: true, out: execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() };
  } catch {
    return { ok: false, out: '' };
  }
}

function commitReachable(sha, cache) {
  if (!cache.has(sha)) {
    // Absent is not a verdict. A single-branch or shallow clone simply does not
    // have every commit a spec may legitimately name - S-049 cites a merge on
    // `origin/main`, which this branch does not descend from - and failing on
    // what the checkout happens to lack would make a mandatory suite command
    // depend on the reviewer's ref set rather than on the content. What this
    // holds is the one case that is a defect wherever it is observed: the
    // object is present, it is a commit, and nothing points at it. That is what
    // a squash leaves behind, and what the collector eventually removes.
    if (!gitOk(['cat-file', '-e', `${sha}^{commit}`]).ok) cache.set(sha, 'absent');
    else {
      const branches = gitOk(['branch', '-a', '--contains', sha]);
      cache.set(sha, branches.ok && branches.out ? 'reachable' : 'unreachable');
    }
  }
  return cache.get(sha);
}

test('every commit a live spec section cites is reachable from this branch', () => {
  const cache = new Map();
  const orphaned = [];
  for (const dir of anchoredSpecs()) {
    for (const sha of liveShas(fs.readFileSync(path.join(SPECS, dir, 'SPEC.md'), 'utf8'))) {
      if (commitReachable(sha, cache) === 'unreachable') orphaned.push(`${dir} cites ${sha}`);
    }
  }
  assert.deepEqual(orphaned, [],
    'a live section cites a commit this checkout holds but no branch contains; a squashed or discarded commit cannot be followed and will be garbage-collected');
});

function treeFiles(sha, cache) {
  if (!cache.has(sha)) {
    cache.set(sha, execFileSync('git', ['ls-tree', '-r', '--name-only', sha], { cwd: root, encoding: 'utf8' }).split('\n'));
  }
  return cache.get(sha);
}

// A citation may name a bare filename. Prefer an exact top-level match, so
// `RUNBOOK.md` resolves to the root control rather than tying with
// `templates/RUNBOOK.md`.
function resolvePath(files, cited) {
  if (files.includes(cited)) return cited;
  const suffix = files.filter((f) => f.endsWith(`/${cited}`));
  return suffix.length === 1 ? suffix[0] : null;
}

function fileAt(sha, file, cache) {
  const key = `${sha}:${file}`;
  if (!cache.has(key)) {
    try {
      cache.set(key, execFileSync('git', ['show', key], { cwd: root, encoding: 'utf8', maxBuffer: 32 << 20 }).split('\n'));
    } catch { cache.set(key, null); }
  }
  return cache.get(key);
}

test('every spec from S-036 that carries a live bare citation declares its anchors', () => {
  for (const spec of anchoredSpecs()) {
    const text = fs.readFileSync(path.join(SPECS, spec, 'SPEC.md'), 'utf8');
    if (liveCitations(text).length === 0) continue;
    assert.match(text, ANCHOR,
      `${spec} carries a bare path:line citation in a live section and declares no Citation anchors block; ` +
      'add one naming the tree its bare citations read at, or anchor each citation with `git show <sha>:path`');
  }
});

test('every declared anchor still resolves the citations it covers', () => {
  const trees = new Map();
  const blobs = new Map();
  const failures = [];
  for (const spec of anchoredSpecs()) {
    const text = fs.readFileSync(path.join(SPECS, spec, 'SPEC.md'), 'utf8');
    const declared = text.match(ANCHOR);
    if (!declared) continue;
    const [, pre, post] = declared;
    for (const c of liveCitations(text)) {
      const sha = PRE_SECTIONS.has(c.section) ? pre : post;
      const file = resolvePath(treeFiles(sha, trees), c.cited);
      if (!file) { failures.push(`${spec} [${c.section}] ${c.cited}:${c.from} names no unique path at ${sha}`); continue; }
      const lines = fileAt(sha, file, blobs);
      if (!lines) { failures.push(`${spec} [${c.section}] ${file} is absent at ${sha}`); continue; }
      if (c.to > lines.length) {
        failures.push(`${spec} [${c.section}] ${c.cited}:${c.from}-${c.to} runs past ${file} at ${sha} (${lines.length} lines)`);
      }
    }
  }
  assert.deepEqual(failures, [],
    `declared citation anchors no longer resolve:\n  ${failures.join('\n  ')}`);
});
