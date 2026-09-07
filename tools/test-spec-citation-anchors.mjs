#!/usr/bin/env node
// A bare `path:line` citation names a position, and every merge into
// `integration` moves it. S-039 shipped citations that were correct at the tree
// they were written against and point at unrelated content today - one behind a
// checked acceptance box. The repair is not a sweep, which goes stale again on
// the next merge, but a declared anchor: the spec says which tree its bare
// citations read at, and this test holds the declaration to the repository.
//
// Two things make that harder than a section lookup, and both were found by
// review rather than guessed:
//
//   1. These specs cite with an inline pair - "base `:N`" and "shipped `:M`" -
//      so one line routinely carries citations meant at BOTH trees. The label
//      immediately before a citation therefore wins over the section default;
//      a blanket per-section rule mis-anchored seven live citations.
//   2. Most references are the shorthand `:NN`, not `path.ext:NN`. Matching only
//      the long form left 43 references unchecked, including the one the whole
//      repair is named for. A shorthand resolves against the nearest path in
//      scope, which is usually the one named by a `git show <sha>:path` anchor
//      earlier in the same sentence - so those anchors establish the path and
//      the base sha rather than being skipped.
//
// Scope: specs numbered S-036 and above, where the convention starts. Earlier
// specs carry bare citations from before the rule existed and are grandfathered
// deliberately - retro-anchoring accepted records buys no reader anything.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SPECS = path.join(root, 'workbench', 'specs');
const FIRST_ANCHORED = 36;

const FULL = /([A-Za-z0-9_./-]+\.(?:mjs|md|py|json)):(\d+)(?:-(\d+))?/g;
const SHORT = /`:(\d+)(?:-(\d+))?`/g;
// A path put in scope for a following shorthand: backticked, or written bare
// with a directory separator, which these specs do inside table cells
// ("tools/test-diagnostics.mjs ... at `:477`").
const PATH_ONLY = /`([A-Za-z0-9_./-]+\.(?:mjs|md|py|json))`|(?<![`/\w.-])([A-Za-z0-9_-]+\/[A-Za-z0-9_./-]*\.(?:mjs|md|py|json))(?![`\w])/g;
const GIT_SHOW = /git show\s+[0-9a-f]{7,40}:[A-Za-z0-9_./-]+/g;
const ANCHOR = /\*\*Citation anchors\.\*\*\s*pre=`([0-9a-f]{7,40})`\s*post=`([0-9a-f]{7,40})`/;
// Pre-change sections describe the tree the work started from. Documentation
// Impact belongs here too: it is a plan written before the change, so it names
// the pre-change locations it intends to touch.
const PRE_SECTIONS = new Set([
  'Outcome', 'Why It Matters', 'Current Verified State', 'Desired Behavior', 'Documentation Impact',
]);
const EVIDENCE = 'Append-Only Evidence And Execution Log';

export function anchoredSpecs() {
  return fs.readdirSync(SPECS)
    .filter((d) => /^S-\d{3}-/.test(d) && Number(d.slice(2, 5)) >= FIRST_ANCHORED)
    .filter((d) => fs.existsSync(path.join(SPECS, d, 'SPEC.md')))
    .sort();
}

// Live citations are the ones a reader is invited to follow now. Evidence rows
// are historical and self-dating, so they read at the commit their own row names
// and are out of scope. A `git show <sha>:path` token is absolute; it is removed
// from the line rather than causing the whole line to be skipped, so a bare
// citation sharing that line is still checked.
export function liveCitations(text) {
  const out = [];
  // Scanned by bullet or paragraph rather than by line: these specs wrap at ~80
  // columns, so a label and the citation it governs routinely land on different
  // physical lines ("... base `:848`, shipped\n`:855`, guards ..."). A new list
  // item starts a new unit, so a path named in one bullet never puts itself in
  // scope for a shorthand in the next.
  let section = null;
  let buffer = [];
  const flush = () => {
    if (buffer.length) out.push(...scanParagraph(buffer.join(' '), section));
    buffer = [];
  };
  for (const raw of text.split('\n')) {
    if (raw.startsWith('#')) { flush(); if (raw.startsWith('## ')) section = raw.slice(3).trim(); continue; }
    if (raw.trim() === '') { flush(); continue; }
    if (/^\s*(?:[-*]\s|\d+\.\s)/.test(raw)) flush();     // a new list item is a new unit
    if (section !== EVIDENCE) buffer.push(raw.trim());
  }
  flush();
  return out;
}

function scanParagraph(text, section) {
  const out = [];
  let lastPath = null;
  let lineBase = null;

  // A `git show <sha>:path` anchor is absolute: not itself a bare citation, but
  // it names the path and base tree the shorthand AFTER it refers to. It is
  // collected as a positional mark, not applied up front, because one bullet can
  // name two anchors and a shorthand belongs to whichever precedes it.
  const anchors = [];
  const para = text.replace(GIT_SHOW, (tok, at) => {
    const parsed = /git show\s+([0-9a-f]{7,40}):([A-Za-z0-9_./-]+)/.exec(tok);
    if (parsed) anchors.push({ at, kind: 'anchor', sha: parsed[1], cited: parsed[2] });
    return ' '.repeat(tok.length);
  });

  const marks = [...anchors];
  for (const m of para.matchAll(FULL)) marks.push({ at: m.index, kind: 'full', cited: m[1], from: Number(m[2]), to: Number(m[3] ?? m[2]) });
  for (const m of para.matchAll(SHORT)) marks.push({ at: m.index, kind: 'short', from: Number(m[1]), to: Number(m[2] ?? m[1]) });
  // A path named without a line number still puts that path in scope for the
  // shorthand that follows it.
  for (const m of para.matchAll(PATH_ONLY)) marks.push({ at: m.index, kind: 'path', cited: m[1] ?? m[2] });
  marks.sort((a, b) => a.at - b.at);

  for (const mark of marks) {
    if (mark.kind === 'anchor') { lastPath = mark.cited; lineBase = mark.sha; continue; }
    if (mark.kind === 'path') { lastPath = mark.cited; continue; }
    if (mark.kind === 'full') lastPath = mark.cited;
    const cited = mark.cited ?? lastPath;
    if (!cited) continue;                              // shorthand with no path in scope
    const lookback = para.slice(Math.max(0, mark.at - 40), mark.at).toLowerCase();
    const shipped = /shipped[^:]*$/.test(lookback);
    const based = /\bbase\b[^:]*$/.test(lookback);
    out.push({ section, cited, from: mark.from, to: mark.to, shipped, based, lineBase,
               shorthand: mark.kind === 'short' });
  }
  return out;
}

function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 << 20 });
}

function isCommit(sha) {
  try { git(['rev-parse', '--verify', `${sha}^{commit}`]); return true; } catch { return false; }
}

function treeFiles(sha, cache) {
  if (!cache.has(sha)) cache.set(sha, git(['ls-tree', '-r', '--name-only', sha]).split('\n'));
  return cache.get(sha);
}

// A citation may name a bare filename. Prefer an exact top-level match, so
// `RUNBOOK.md` resolves to the root control rather than `templates/RUNBOOK.md`.
function resolvePath(files, cited) {
  if (files.includes(cited)) return cited;
  const suffix = files.filter((f) => f.endsWith(`/${cited}`));
  return suffix.length === 1 ? suffix[0] : null;
}

function fileLines(sha, file, cache) {
  const key = `${sha}:${file}`;
  if (!cache.has(key)) {
    let lines = null;
    try {
      lines = git(['show', key]).split('\n');
      if (lines.length && lines[lines.length - 1] === '') lines.pop();  // trailing newline is not a line
    } catch { /* absent at this tree */ }
    cache.set(key, lines);
  }
  return cache.get(key);
}

test('every spec from S-036 that carries a live bare citation declares its anchors', () => {
  for (const spec of anchoredSpecs()) {
    const text = fs.readFileSync(path.join(SPECS, spec, 'SPEC.md'), 'utf8');
    if (liveCitations(text).length === 0) continue;
    assert.match(text, ANCHOR,
      `${spec} carries a bare citation in a live section and declares no Citation anchors block; ` +
      'add one naming the tree its bare citations read at, or anchor each citation with `git show <sha>:path`');
  }
});

test('both declared anchors are commits in this repository', () => {
  const failures = [];
  for (const spec of anchoredSpecs()) {
    const declared = fs.readFileSync(path.join(SPECS, spec, 'SPEC.md'), 'utf8').match(ANCHOR);
    if (!declared) continue;
    // Checked independently of whether any citation happens to use that side,
    // or a spec whose citations all fall on one side could declare a garbage
    // sha on the other and stay green.
    for (const [label, sha] of [['pre', declared[1]], ['post', declared[2]]]) {
      if (!isCommit(sha)) failures.push(`${spec} declares ${label}=${sha}, which is not a commit in this repository`);
    }
  }
  assert.deepEqual(failures, [], `undeclarable citation anchors:\n  ${failures.join('\n  ')}`);
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
    if (!isCommit(pre) || !isCommit(post)) continue;   // reported by the case above
    for (const c of liveCitations(text)) {
      // An inline label names the tree explicitly and wins over the section
      // default, which is how these specs actually cite. `base` resolves to the
      // sha of the `git show` anchor that introduced the path, when there is one.
      const sha = c.shipped ? post
        : c.based ? (c.lineBase ?? pre)
        : (PRE_SECTIONS.has(c.section) ? pre : post);
      const where = `${spec} [${c.section}]${c.shorthand ? ' (shorthand)' : ''} ${c.cited}:${c.from}`;
      const file = resolvePath(treeFiles(sha, trees), c.cited);
      if (!file) { failures.push(`${where} names no unique path at ${sha}`); continue; }
      const lines = fileLines(sha, file, blobs);
      if (!lines) { failures.push(`${where}: ${file} is absent at ${sha}`); continue; }
      if (c.to > lines.length) {
        failures.push(`${where}-${c.to} runs past ${file} at ${sha} (${lines.length} lines)`);
      }
    }
  }
  assert.deepEqual(failures, [],
    `declared citation anchors no longer resolve:\n  ${failures.join('\n  ')}`);
});
