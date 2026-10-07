#!/usr/bin/env node
// S-004J TK-00JA: `domain-modeling` ships in every room's skills lane as the
// Align companion adapted from Matt Pocock's pinned glossary-based source. This
// scoped source test holds the lane SKILL.md to its operating contract: the
// upstream active moves and glossary format are preserved; the Workbench
// adapters (bounded upstream consequence trace, notepad capture and promotion
// instead of inline glossary or Canon writes, GLOSSARY.md-or-LEXICON.md
// vocabulary routing, ADR or DDR by the scope test through to-docs, companion
// rather than dependency, one vocabulary owner) are each present with a
// reason; the source pin and credit are kept; no shadow terminology or
// decision store is created; the upstream MIT notice ships inside the skill
// directory so every room that installs the lane receives it. It also checks the skill is declared in the
// bundle, discovered through both tracked adapters and reached from the
// operations index. Structural checks prove routing, not conversation.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { coordinationSkills, coreSkills } from '../workbench/tools/workbench-layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lane = 'workbench/skills/domain-modeling';
const skillPath = `${lane}/SKILL.md`;
const formatPath = `${lane}/GLOSSARY-FORMAT.md`;
const noticePath = `${lane}/NOTICE.md`;
const PIN = 'd81f3a183412e71a5b1e84ca21bc1a35eea03a60';
// sha256 of `skills/engineering/domain-modeling/GLOSSARY-FORMAT.md` at PIN.
const UPSTREAM_FORMAT_SHA256 = '21dcc40cdec8e151a829b98ab1517c1867bc444e3665134a98c6983411996801';

const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = (relative) => fs.existsSync(path.join(root, relative));
const flat = (text) => String(text).replace(/\s+/g, ' ').trim();
const skill = () => {
  assert.ok(exists(skillPath), `${skillPath} exists in the skills lane`);
  return read(skillPath);
};
// Headings outside fenced code with their own body text.
function sections(text) {
  const lines = text.split('\n');
  const found = [];
  let fence = false;
  lines.forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    if (fence) return;
    const match = line.match(/^(#{1,6}) (.+?)\s*$/);
    if (match) found.push({ level: match[1].length, title: match[2], line: index });
  });
  return found.map((heading, position) => {
    const end = position + 1 < found.length ? found[position + 1].line : lines.length;
    return { ...heading, body: flat(lines.slice(heading.line + 1, end).join('\n')) };
  });
}
const section = (text, title) => {
  const found = sections(text).find((heading) => heading.title === title);
  assert.ok(found, `${skillPath} has a "${title}" section`);
  return found.body;
};

test('the skill declares itself and joins the required bundle after improve-harness', () => {
  const text = skill();
  assert.match(text, /^---\nname: domain-modeling\ndescription: \S.{40,}\n---\n/, 'frontmatter names the skill and describes it');
  const manifest = JSON.parse(read('workbench/manifest.json'));
  assert.ok(manifest.skillPolicy.required.includes('domain-modeling'), 'skillPolicy.required declares domain-modeling');
  assert.ok(coreSkills.includes('domain-modeling'), 'the layout coreSkills bundle declares domain-modeling');
  assert.ok(!coordinationSkills.includes('domain-modeling'), 'domain-modeling is a workflow skill, not a coordination entry');
  assert.equal(coreSkills.indexOf('domain-modeling'), coreSkills.indexOf('improve-harness') + 1, 'it follows improve-harness, ahead of the coordination entries');
  assert.deepEqual(manifest.skillPolicy.required, coreSkills, 'the manifest policy and the layout bundle agree');
  const catalog = read('workbench/skills/README.md');
  const region = catalog.match(/<!-- core-skills:start -->([\s\S]*?)<!-- core-skills:end -->/)[1];
  assert.match(region, /^\| `domain-modeling` \| .{20,} \|$/m, 'the core catalog lists it with a purpose');
  const nonLane = catalog.match(/<!-- referenced-skills:start -->([\s\S]*?)<!-- referenced-skills:end -->/)[1];
  assert.doesNotMatch(nonLane, /^\| `domain-modeling` \|/m, 'a lane skill carries no non-lane disposition row');
});

test('both tracked discovery adapters resolve the lane source', () => {
  const real = fs.realpathSync(path.join(root, skillPath));
  for (const adapter of ['.agents/skills', '.claude/skills']) {
    const file = path.join(root, adapter, 'domain-modeling', 'SKILL.md');
    assert.ok(fs.existsSync(file), `${adapter}/domain-modeling/SKILL.md resolves`);
    assert.equal(fs.realpathSync(file), real, `${adapter} resolves into the lane, not a copy`);
  }
});

test('an operations index row in the root and template Runbooks points to the skill', () => {
  for (const runbook of ['RUNBOOK.md', 'templates/RUNBOOK.md']) {
    const index = read(runbook).split('\n## ')[1];
    const row = index.split('\n').find((line) => line.includes('](workbench/skills/domain-modeling/SKILL.md#'));
    assert.ok(row, `${runbook} has an index row pointing into domain-modeling`);
    const fragment = row.match(/domain-modeling\/SKILL\.md#([a-z0-9-]+)/)[1];
    const slugs = sections(skill()).map((heading) => heading.title.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-'));
    assert.ok(slugs.includes(fragment), `${runbook} pointer #${fragment} names a heading in the skill`);
  }
});

test("Matt's active moves are preserved under their upstream headings", () => {
  const text = skill();
  const challenge = section(text, 'Challenge against the glossary');
  assert.match(challenge, /call it out immediately/, 'a conflicting term is challenged at once');
  const sharpen = section(text, 'Sharpen fuzzy language');
  assert.match(sharpen, /overloaded/);
  assert.match(sharpen, /propose a precise canonical term/, 'an overloaded term is split into a precise name');
  const scenarios = section(text, 'Discuss concrete scenarios');
  assert.match(scenarios, /probe edge cases/, 'a relationship is probed with a concrete edge case');
  const code = section(text, 'Cross-reference with code');
  assert.match(code, /check whether the code agrees/, 'a stated behavior is checked against source');
  for (const condition of ['agreement', 'documentation drift', 'implementation gap', 'unresolved contradiction']) {
    assert.ok(code.toLowerCase().includes(condition), `a checked claim can be classified as ${condition}`);
  }
  assert.match(code, /`AGENTS\.md` State Resolution/, 'the classes follow the State Resolution names');
  assert.match(code, /tests?/, 'the check reads tests as well as source');
  assert.match(flat(text), /one question at a time/i, 'it asks one question at a time');
  assert.ok(text.includes('](GLOSSARY-FORMAT.md)'), 'the skill links the glossary format it keeps');
});

test("Matt's glossary format is kept verbatim beneath a Workbench adapter note", () => {
  assert.ok(exists(formatPath), `${formatPath} exists`);
  const format = read(formatPath);
  const start = format.indexOf('# GLOSSARY.md Format\n');
  assert.ok(start > 0, 'an adapter note precedes the upstream format');
  const upstream = format.slice(start);
  assert.equal(crypto.createHash('sha256').update(upstream).digest('hex'), UPSTREAM_FORMAT_SHA256, `the upstream format at ${PIN} is preserved byte for byte`);
  const note = flat(format.slice(0, start).replace(/^> ?/gm, ''));
  assert.ok(note.includes(PIN), 'the adapter note pins the source revision');
  assert.match(note, /promot/i, 'glossary entries are written by promotion, not by this skill');
  assert.match(note, /GLOSSARY-MAP\.md/, 'the adapter note says how a context map is treated');
  assert.ok(note.includes('](NOTICE.md)'), 'the adapter note points at the notice that ships beside it');
  assert.match(note, /create a root `GLOSSARY\.md` lazily[^.]*does not apply/, "upstream's lazy glossary creation is explicitly set aside");
  assert.match(note, /promotion creates or updates/i, 'promotion, not this skill, creates or updates the owner');
});

test('the upstream MIT notice ships inside the skill directory', () => {
  assert.ok(exists(noticePath), `${noticePath} exists, so every room that installs the lane receives the notice`);
  const notice = read(noticePath);
  const flatNotice = flat(notice);
  for (const line of [
    'Copyright (c) 2026 Matt Pocock',
    'Permission is hereby granted, free of charge, to any person obtaining a copy',
    'The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.',
    'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND'
  ]) assert.ok(flatNotice.includes(line), `the notice carries: ${line}`);
  const license = notice.slice(notice.indexOf('MIT License\n'));
  const repositoryNotice = read('THIRD_PARTY_NOTICES.md');
  assert.ok(repositoryNotice.includes(license.trimEnd()), 'the in-directory license text matches the repository notice verbatim');
  assert.ok(flatNotice.includes(PIN), 'the notice pins the upstream revision');
  assert.ok(flatNotice.includes('skills/engineering/domain-modeling'), 'the notice names the upstream path');
  for (const file of ['`SKILL.md`', '`GLOSSARY-FORMAT.md`']) assert.ok(flatNotice.includes(file), `the notice says how ${file} derives from upstream`);
  const credit = flat(section(skill(), 'Source and credit'));
  assert.ok(credit.includes('](NOTICE.md)'), 'the credit points at the in-directory notice');
});

test('upstream consequences are traced to named owners before a choice settles, bounded', () => {
  const trace = section(skill(), 'Trace consequences upstream');
  for (const owner of ['`GLOSSARY.md`', '`LEXICON.md`', 'Spec', 'acceptance', 'decision record', 'Wiki', 'source identifier', 'test']) {
    assert.ok(trace.includes(owner), `the trace follows the choice to ${owner}`);
  }
  assert.match(trace, /before .*settles/i, 'the trace runs before the name, boundary or relationship settles');
  assert.match(trace, /name, boundary or relationship/);
  assert.match(trace, /file or line/, 'each consequence names the file or line behind it');
  assert.match(trace, /Name each owner you list by its path, and a test by its file and test name/,
    'every listed owner is named by its path, and a test by its file and test name');
  assert.match(trace, /"the tests" names nothing/, 'a vague "the tests" does not count as tracing them');
  assert.match(trace, /could change the choice/, 'only consequences that could change the choice are raised');
  assert.match(trace, /bounded/i);
  assert.match(trace, /not an audit/, 'the trace is not a whole-room audit');
});

test('pending meaning stays in the notepad; settled meaning reaches its owner only by promotion', () => {
  const text = skill();
  const capture = section(text, 'Capture, then promote');
  assert.match(capture, /`notepad` skill/, "pending interpretations go to the objective's notepad");
  assert.match(capture, /pending/);
  assert.match(capture, /correction/);
  assert.match(capture, /explicit confirmation/i, 'only explicit confirmation settles meaning');
  assert.match(capture, /`promote` skill/, 'promotion carries settled meaning to its owner');
  assert.match(capture, /no inline/i, 'the skill makes no inline write');
  assert.ok(capture.includes("Matt's source updates the glossary inline the moment a term resolves; here there is no inline write."),
    "the contrast with Matt's inline update keeps 'here there is no inline write'");
  assert.ok(capture.includes('No inline glossary, Lexicon, Spec, control or decision-record write happens while aligning, so the tracked room diff stays empty until promotion.'),
    'the full write boundary names every owner and keeps the room diff empty until promotion');
  assert.match(capture, /Settled meaning reaches its owner through the ordinary promotion route \(the \[`promote` skill\]\([^)]+\), or `to-docs` within an authorized documentation pass\)/,
    'settled meaning moves only by promote, or to-docs in an authorized pass');
  assert.match(capture, /confirmed canonical vocabulary to `GLOSSARY\.md`, or to `LEXICON\.md` where the room has no glossary yet/,
    'with no glossary, confirmed vocabulary is promoted to the current Lexicon');
  assert.match(capture, /Saving is not settling: only the owner's explicit confirmation settles a meaning/,
    'saving is not settling; only explicit owner confirmation settles meaning');
  assert.doesNotMatch(capture, /confirmation is optional|saving settles/i, 'saving never settles meaning');
  assert.match(capture, /Don't batch these up: capture them as they happen/, "Matt's capture timing is kept for the notepad");
  for (const owner of ['`GLOSSARY.md`', 'Spec', 'Wiki']) assert.ok(capture.includes(owner), `promotion routes to ${owner}`);
  assert.doesNotMatch(flat(text), /update `GLOSSARY\.md` right there/i, "Matt's inline glossary update is replaced");
  assert.doesNotMatch(flat(text), /create one when the first term is resolved/i, 'the skill does not create the glossary itself');
  const routing = flat(section(text, 'Where vocabulary lives'));
  assert.match(routing, /`GLOSSARY\.md` when it exists, otherwise .*`LEXICON\.md`/, 'vocabulary is read from the glossary when present, else the current Lexicon');
});

test('decision records are offered sparingly and chosen as ADR or DDR by the scope test', () => {
  const offer = section(skill(), 'Offer decision records sparingly');
  for (const condition of ['Hard to reverse', 'Surprising without context', 'real trade-off']) assert.ok(offer.includes(condition), `the offer requires ${condition}`);
  assert.match(offer, /say which test failed/, 'a failed offer names the test that failed');
  assert.match(offer, /rebuilt differently/, 'the scope test asks whether the choice survives a different architecture');
  assert.match(offer, /rebuilt differently\? Yes selects a DDR[^;]*; no selects an ADR/, 'still holds if rebuilt differently selects a DDR; otherwise an ADR');
  assert.match(offer, /DDR/);
  assert.match(offer, /ADR/);
  assert.match(offer, /`to-docs`/, 'records are written through to-docs');
  assert.match(offer, /adr\.mjs/, 'with the manifest-aware adr.mjs');
  assert.match(offer, /`workbench\/manifest\.json`/, 'collections come from the manifest');
  assert.match(offer, /`workbench\/docs\/adr`/);
  assert.match(offer, /`workbench\/docs\/ddr`/);
});

test('the skill is a companion, keeps one vocabulary owner and records each adapter with its reason', () => {
  const text = skill();
  assert.match(flat(text), /companion, not a dependency/i);
  assert.match(flat(text), /grilling .*complete[s]? without it/i, 'grilling and the question-card flow complete without it');
  const grilling = flat(read('workbench/skills/grilling/SKILL.md'));
  assert.doesNotMatch(grilling, /(must|always) (invoke|load|use) `?domain-modeling/i, 'grilling does not require the skill');
  const adapters = section(text, 'Workbench adapters');
  for (const adapter of ['consequence', 'notepad', '`LEXICON.md`', 'DDR', 'companion', 'vocabulary owner']) {
    assert.ok(adapters.includes(adapter), `the adapters section records ${adapter}`);
  }
  assert.ok((adapters.match(/ because /g) ?? []).length >= 5, 'each adapter states its reason');
  for (const [change, pattern] of [
    ['the rewritten description and trigger', /description and trigger/i],
    ['one question at a time inside grilling', /one question at a time/i],
    ['quoting the definition and its file', /quoting the definition and its file/i],
    ['reading tests as well as code', /tests as well/i],
    ['saying which test failed', /which test failed/i],
    ['the dropped lazy file creation', /lazy file creation/i],
    ['the dropped upstream file-structure trees', /file-structure/i],
    ['capture timing kept', /as they happen/i]
  ]) assert.match(adapters, pattern, `the adapters section records ${change}`);
  for (const policy of [/supplies a method, never authority/i, /not evidence that a feature exists/i]) {
    assert.doesNotMatch(flat(text), policy, 'unrelated Workbench policy stays out of the imported body');
  }
  const credit = flat(section(text, 'Source and credit'));
  for (const token of [PIN, 'mattpocock/skills', 'Matt Pocock', 'MIT', 'NOTICE.md']) assert.ok(credit.includes(token), `the credit keeps ${token}`);
  assert.match(read('THIRD_PARTY_NOTICES.md'), /Copyright \(c\) 2026 Matt Pocock/, 'the notice owner carries the upstream license');
});

test('no shadow terminology or decision store, and nothing that only this repository has', () => {
  const text = skill();
  assert.deepEqual(fs.readdirSync(path.join(root, lane)).sort(), ['GLOSSARY-FORMAT.md', 'NOTICE.md', 'SKILL.md'], 'the lane directory holds the skill, its format and the upstream notice only');
  for (const shadow of [/CONTEXT\.md/, /UBIQUITOUS_LANGUAGE\.md/, /(?<!workbench\/)docs\/adr\//, /ADR-FORMAT\.md/]) {
    assert.doesNotMatch(text, shadow, `the skill names no ${shadow} store`);
  }
  assert.match(flat(text), /no second glossary/i, 'the skill forbids a parallel vocabulary store');
  assert.match(flat(text), /`GLOSSARY-MAP\.md`/, 'a context map is never inferred');
  assert.doesNotMatch(text, /workbench\/specs\/|node tools\/test-|\/Users\/|skills-pending/, 'it ships to every room: no repository Spec path, maintainer test or private path');
});
