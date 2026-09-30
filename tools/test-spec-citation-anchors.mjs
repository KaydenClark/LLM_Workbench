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
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SPECS = path.join(root, 'workbench', 'specs');
const FIRST_ANCHORED = 36;

const FULL = /(?<![\w/.-])([A-Za-z0-9_.][A-Za-z0-9_./-]*):(\d+)(?:-(\d+))?/g;
const SHORT = /`:(\d+)(?:-(\d+))?`/g;
// A path put in scope for a following shorthand: backticked, or written bare
// with a directory separator, which these specs do inside table cells
// ("tools/test-diagnostics.mjs ... at `:477`").
const PATH_ONLY = /`([A-Za-z0-9_.][A-Za-z0-9_./-]*)`|(?<![`/\w.-])([A-Za-z0-9_.][A-Za-z0-9_./-]*\/[A-Za-z0-9_./-]+)(?![`\w])/g;
const KNOWN_PATHS = new Set(execFileSync('git', ['ls-tree', '-r', '--name-only', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim().split('\n'));
const KNOWN_BASENAMES = new Set([...KNOWN_PATHS].map((file) => path.posix.basename(file)));
const GIT_SHOW = /git show\s+[0-9a-f]{7,40}:[A-Za-z0-9_./-]+/g;
const ANCHOR = /\*\*Citation anchors\.\*\*\s*pre=`([0-9a-f]{7,40})`\s*post=`([0-9a-f]{7,40})`/;
// Pre-change sections describe the tree the work started from. Documentation
// Impact belongs here too: it is a plan written before the change, so it names
// the pre-change locations it intends to touch.
const PRE_SECTIONS = new Set([
  'Outcome', 'Why It Matters', 'Current Verified State', 'Desired Behavior', 'Documentation Impact',
]);
const EVIDENCE = 'Append-Only Evidence And Execution Log';

export function anchoredSpecs(directory = SPECS) {
  return fs.readdirSync(directory)
    .filter((name) => {
      const suffix = /^S-([0-9A-Za-z]{3,})-/.exec(name)?.[1];
      return suffix && (!/^\d+$/.test(suffix) || BigInt(suffix) >= BigInt(FIRST_ANCHORED));
    })
    .filter((d) => fs.existsSync(path.join(directory, d, 'SPEC.md')))
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
  let previousCitation = null;

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
  for (const m of para.matchAll(FULL)) {
    // Git trees supply extensionless paths; punctuation alone must not turn
    // an evidence token such as commitSHA:45 into a file citation.
    const cited = m[1];
    if (cited.includes('/') || cited.includes('.') || KNOWN_PATHS.has(cited)) {
      marks.push({ at: m.index, end: m.index + m[0].length, kind: 'full', cited, from: Number(m[2]), to: Number(m[3] ?? m[2]) });
    }
  }
  for (const m of para.matchAll(SHORT)) marks.push({ at: m.index, end: m.index + m[0].length, kind: 'short', from: Number(m[1]), to: Number(m[2] ?? m[1]) });
  // A path named without a line number still puts that path in scope for the
  // shorthand that follows it.
  for (const m of para.matchAll(PATH_ONLY)) {
    const cited = m[1] ?? m[2];
    // A dotted prose/version value is not a path. Bare repository filenames
    // still establish scope; qualified paths remain visible even if absent.
    if (cited.includes('/') || KNOWN_BASENAMES.has(cited)) {
      marks.push({ at: m.index, kind: 'path', cited });
    }
  }
  marks.sort((a, b) => a.at - b.at);

  for (const mark of marks) {
    if (mark.kind === 'anchor') { lastPath = mark.cited; lineBase = mark.sha; previousCitation = null; continue; }
    if (mark.kind === 'path') {
      if (lastPath !== mark.cited) lineBase = null;
      lastPath = mark.cited; continue;
    }
    if (mark.kind === 'full') {
      if (lastPath !== mark.cited) lineBase = null;
      lastPath = mark.cited;
    }
    const cited = mark.cited ?? lastPath;
    const lookback = para.slice(Math.max(0, mark.at - 40), mark.at).toLowerCase();
    // An explicit label covers the following comma/and-separated list, not
    // just its first member. New prose, path or explicit label ends that scope.
    const continuation = previousCitation?.cited === cited
      && /^[\s,`]*(?:(?:and|or)[\s,`]*)?$/.test(para.slice(previousCitation.end, mark.at));
    const shipped = /shipped[^:]*$/.test(lookback) || Boolean(continuation && previousCitation.shipped);
    const based = !shipped && (/\bbase\b[^:]*$/.test(lookback) || Boolean(continuation && previousCitation.based));
    out.push({ section, cited, from: mark.from, to: mark.to, shipped, based, lineBase,
               shorthand: mark.kind === 'short' });
    previousCitation = { cited, end: mark.end, shipped, based };
  }
  return out;
}

function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 << 20 });
}

function isCommit(sha) {
  try { git(['rev-parse', '--verify', `${sha}^{commit}`]); return true; } catch { return false; }
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
      if (!c.cited) { failures.push(`${where} has no scoped path`); continue; }
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


test('new alphanumeric and grown spec IDs remain in citation-anchor coverage', () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'citation-identities-'));
  try {
    for (const name of ['S-001-legacy', 'S-036-rule', 'S-00A-new', 'S-1000-grown']) {
      fs.mkdirSync(path.join(folder, name));
      fs.writeFileSync(path.join(folder, name, 'SPEC.md'), '# Fixture');
    }
    assert.deepEqual(anchoredSpecs(folder), ['S-00A-new', 'S-036-rule', 'S-1000-grown']);
  } finally { fs.rmSync(folder, { recursive: true, force: true }); }
});

// PR77 exact-head review reproducers: reject unresolved shorthand, bind an
// inline base only to its own path, and cover every repository file type.
test('a shorthand without a scoped path remains a visible unresolved citation', () => {
  const citations = liveCitations('## Current Verified State\n\nSee `:12`.');
  assert.equal(citations.length, 1);
  assert.equal(citations[0].cited, null);
});

test('a new path does not inherit the previous path inline base', () => {
  const citations = liveCitations('## Current Verified State\n\n`git show 1234567:tools/a.mjs`, then `tools/b.mjs` base `:12`.');
  assert.equal(citations.length, 1);
  assert.equal(citations[0].cited, 'tools/b.mjs');
  assert.equal(citations[0].lineBase, null);
});

test('citations cover shell, CommonJS, YAML and extensionless paths', () => {
  for (const cited of ['script.sh', 'config.cjs', '.github/workflows/check.yml', 'LICENSE']) {
    const citations = liveCitations('## Desired Behavior\n\n`' + cited + ':20`');
    assert.equal(citations.length, 1, cited);
    assert.equal(citations[0].cited, cited);
    assert.equal(citations[0].from, 20);
  }
});

// S002K: independently reproduced late PR77 findings, retained as durable reds.
test('an explicit tree label governs every citation in its list and stops at a new label or prose boundary', () => {
  const text = fs.readFileSync(path.join(SPECS, 'S-040-skill-gate-route-selection', 'SPEC.md'), 'utf8');
  const pair = liveCitations(text).filter((c) => c.cited === 'tools/workbench-upgrade.mjs' && [132, 133].includes(c.from));
  assert.equal(pair.length, 2);
  assert.deepEqual(pair.map((c) => c.shipped), [true, true], 'both actual S040 shipped lines must select post');
  const group = liveCitations('## Current Verified State\n\n`tools/test-diagnostics.mjs` (base `:12`, `:13`), shipped `:14` and `:15`; later `:16`.');
  assert.deepEqual(group.map((c) => [c.based, c.shipped]), [[true, false], [true, false], [false, true], [false, true], [false, false]]);
  const anchored = liveCitations('## Current Verified State\n\n`tools/test-diagnostics.mjs` shipped `:12`, `git show 1234567:tools/test-diagnostics.mjs` then `:13`.');
  assert.deepEqual(anchored.map((c) => c.shipped), [true, false], 'a new absolute anchor ends the old list label');
});

test('digit-leading bare filenames are citations just like qualified paths', () => {
  const basename = '0001-planes-classify-operations-not-artifacts.md';
  for (const cited of [basename, 'workbench/docs/adr/' + basename]) {
    const citations = liveCitations('## Desired Behavior\n\n`' + cited + ':999999`');
    assert.equal(citations.length, 1, cited + ' must not evade anchor and range enforcement');
    assert.equal(citations[0].cited, cited);
    assert.equal(citations[0].from, 999999);
  }
});

test('dotted non-path values do not replace a scoped file for shorthand', () => {
  for (const token of ['v3.1.2', '1.2.3', 'example.com']) {
    const citations = liveCitations('## Current Verified State\n\n`tools/test-diagnostics.mjs` supports `' + token + '`; see `:12`.');
    assert.equal(citations.length, 1);
    assert.equal(citations[0].cited, 'tools/test-diagnostics.mjs', token);
  }
  const basename = '0001-planes-classify-operations-not-artifacts.md';
  const bare = liveCitations('## Desired Behavior\n\n`' + basename + '` governs this; see `:12`.');
  assert.equal(bare[0].cited, basename, 'a genuine repository basename still establishes scope');
});
