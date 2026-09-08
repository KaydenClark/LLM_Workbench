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

// A withdrawn check, recorded rather than silently dropped. This branch cited
// three commits it had squashed away, so a test was added here requiring every
// commit a live spec section names to be contained in some branch. It fails in
// an ordinary clone on correct content: `git clone` copies the whole object
// store but only `refs/heads/*`, so S-049's legitimate citation of a merge on
// `origin/main` arrives as an object no ref in the clone contains, because the
// clone's `origin/main` is the source's local `main`, not the remote's. Skipping
// absent objects does not help - the object is present. The property is only
// checkable where the orphan exists, the authoring repository, and a mandatory
// suite command that goes red on a correct spec in every clone is worse than no
// check at all. The practice it was meant to enforce is kept as a practice:
// verify `git branch -a --contains` before writing a commit into a durable
// record. S-046 records the withdrawal and its reason.
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
