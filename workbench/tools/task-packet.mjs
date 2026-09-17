// S-00H TK-005: the Packet a Task loads at entry.
//
// ADR-000H "What a Task carries in and out" defines the Packet as exactly
// four required members - the Task record, the Spec acceptance lines that
// Task satisfies (or, for a corrective Task after Spec retirement, the
// reconciled Wiki capability claim it repairs), the cited source and test
// paths, and the Workbench Contract (`AGENTS.md`) - plus two optional
// members, a Scoped handoff and the objective's local JSON notepad, included
// only when they exist and always marked as working context rather than
// instruction or proof. Nothing else loads at entry; the Spec body is
// reached by traversal, not copied into the Packet.
//
// `task-record.mjs` has no field for cited source and test paths (noted at
// TK-005 handoff time; that module is out of bounds for this lane, since a
// concurrent lane may also touch it). Rather than adding one, this module
// derives citable paths from material the destination already resolves to:
//   - `spec-acceptance`: the file-shaped backtick spans inside the owning
//     Spec's own `## Testing Seams` section.
//   - `wiki-claim`: the resolved Wiki note's own frontmatter `source_paths`
//     list - the Wiki schema's own citation field (`workbench/wiki/SCHEMA.md`)
//     - so the corrective case cites paths without ever opening a `SPEC.md`.
// If a Task ever needs author-declared paths instead of derived ones, that is
// a new `task-record.mjs` field for its owning lane to add; this module does
// not add it.

import fs from 'node:fs';
import path from 'node:path';
import { readTaskRecord } from './task-record.mjs';
import { lanePath } from './workbench-paths.mjs';
import { parseFrontmatter } from './adr.mjs';

const SPEC_ACCEPTANCE_PATTERN = /^(S-[0-9A-Za-z]+)\s+(.+)$/;
const WIKI_CLAIM_PATTERN = /^([^#]+\.md)#(.+)$/;

// Assembles one Task's Packet. `taskRecordPath` is the path to that Task's
// `TASK.md` (absolute, or relative to `root`); nothing here locates a Task by
// identifier alone, because a corrective Task's owning Spec may no longer
// have a stable directory to search (S-00I retirement).
//
// `options.handoffPath` and `options.notepadPath` name the optional members,
// each relative to `root` or absolute. Neither is discovered automatically:
// no naming convention ties a Scoped handoff or a JSON notepad to a Task
// identifier today, and guessing one here would risk silently attaching the
// wrong local file as working context. A caller that knows which handoff or
// notepad applies passes its path; a caller that does not, or whose path does
// not exist on this clone, gets a Packet built from the required members
// alone - which is the property this slice must prove.
export function assembleTaskPacket(root, taskRecordPath, options = {}) {
  const base = path.resolve(root);
  const resolvedRecordPath = path.resolve(base, taskRecordPath);
  if (!fs.existsSync(resolvedRecordPath)) {
    throw new Error(`Packet is missing its required Task record member: no TASK.md at ${resolvedRecordPath}`);
  }
  const record = readTaskRecord(resolvedRecordPath, base);

  const destination = resolveDestination(base, record);
  const citedPaths = resolveCitedPaths(base, record, destination);
  const contract = resolveContract(base, record.id);

  const packet = { record, destination, citedPaths, contract };

  const handoff = resolveOptionalMember(base, options.handoffPath);
  if (handoff) packet.handoff = handoff;
  const notepad = resolveOptionalMember(base, options.notepadPath, { json: true });
  if (notepad) packet.notepad = notepad;

  return packet;
}

function resolveDestination(root, record) {
  const { type, reference } = record.destination;
  if (type === 'spec-acceptance') return resolveSpecAcceptance(root, reference, record.id);
  if (type === 'wiki-claim') return resolveWikiClaim(root, reference, record.id);
  // task-record.mjs already closes the destination-type vocabulary, so this
  // is unreachable through a record it parsed; it stays named rather than
  // silently falling through if that vocabulary ever widens without this
  // resolver following it.
  throw new Error(`${record.id} Packet is missing its required destination member: unresolvable destination type "${type}"`);
}

function resolveSpecAcceptance(root, reference, taskId) {
  const match = SPEC_ACCEPTANCE_PATTERN.exec(reference.trim());
  if (!match) {
    throw new Error(`${taskId} Packet is missing its required destination member: unreadable spec-acceptance reference "${reference}"`);
  }
  const [, specId, heading] = match;
  const specPath = findSpecFile(root, specId);
  if (!specPath) {
    throw new Error(`${taskId} Packet is missing its required destination member: no SPEC.md exists for ${specId}; a corrective Task after retirement must use a wiki-claim destination instead`);
  }
  const content = fs.readFileSync(specPath, 'utf8');
  const text = section(content, heading);
  if (!text) {
    throw new Error(`${taskId} Packet is missing its required destination member: ${relative(root, specPath)} has no "${heading}" section`);
  }
  return { type: 'spec-acceptance', specId, heading, specPath: relative(root, specPath), text };
}

function resolveWikiClaim(root, reference, taskId) {
  const match = WIKI_CLAIM_PATTERN.exec(reference.trim());
  if (!match) {
    throw new Error(`${taskId} Packet is missing its required destination member: unreadable wiki-claim reference "${reference}"; expected "<note path>#<claim heading>"`);
  }
  const [, notePathRaw, heading] = match;
  const wikiRoot = lanePath(root, 'wiki');
  const resolved = path.resolve(root, notePathRaw.trim());
  const withinWiki = path.relative(wikiRoot, resolved);
  if (withinWiki.startsWith('..') || path.isAbsolute(withinWiki)) {
    throw new Error(`${taskId} Packet is missing its required destination member: wiki-claim note "${notePathRaw}" must stay inside the Wiki collection`);
  }
  if (!fs.existsSync(resolved)) {
    throw new Error(`${taskId} Packet is missing its required destination member: wiki-claim note "${notePathRaw}" does not exist`);
  }
  const content = fs.readFileSync(resolved, 'utf8');
  const text = section(content, heading);
  if (!text) {
    throw new Error(`${taskId} Packet is missing its required destination member: ${notePathRaw} has no "${heading}" claim heading`);
  }
  return { type: 'wiki-claim', notePath: relative(root, resolved), heading, text };
}

function findSpecFile(root, specId) {
  const specsRoot = lanePath(root, 'specs');
  if (!fs.existsSync(specsRoot)) return null;
  for (const entry of fs.readdirSync(specsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith(`${specId}-`)) continue;
    const candidate = path.join(specsRoot, entry.name, 'SPEC.md');
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function resolveCitedPaths(root, record, destination) {
  if (destination.type === 'spec-acceptance') return citedPathsFromTestingSeams(root, destination, record.id);
  return citedPathsFromWikiNote(root, destination, record.id);
}

function citedPathsFromTestingSeams(root, destination, taskId) {
  const content = fs.readFileSync(path.resolve(root, destination.specPath), 'utf8');
  const seams = section(content, 'Testing Seams');
  if (!seams) {
    throw new Error(`${taskId} Packet is missing its required cited-paths member: ${destination.specPath} has no "Testing Seams" section`);
  }
  const paths = extractPathSpans(seams);
  if (paths.length === 0) {
    throw new Error(`${taskId} Packet is missing its required cited-paths member: ${destination.specPath}'s Testing Seams section names no citable path`);
  }
  return paths;
}

function citedPathsFromWikiNote(root, destination, taskId) {
  const content = fs.readFileSync(path.resolve(root, destination.notePath), 'utf8');
  const { data } = parseFrontmatter(content);
  const sourcePaths = data?.source_paths;
  if (!Array.isArray(sourcePaths) || sourcePaths.length === 0) {
    throw new Error(`${taskId} Packet is missing its required cited-paths member: ${destination.notePath} has no source_paths`);
  }
  return [...sourcePaths];
}

function resolveContract(root, taskId) {
  const contractPath = path.join(root, 'AGENTS.md');
  if (!fs.existsSync(contractPath)) {
    throw new Error(`${taskId} Packet is missing its required Contract member: no AGENTS.md at ${root}`);
  }
  return { path: 'AGENTS.md', text: fs.readFileSync(contractPath, 'utf8') };
}

// An optional member enters as working context only: a caller must never be
// able to mistake a present handoff or notepad for instruction or for proof,
// so the shape says so explicitly rather than relying on a reader to know
// the rule. Absent (no path given) and missing (path given but not on this
// clone, exactly the fresh-clone/another-machine case ADR-000H names) are
// treated alike: both leave the Packet without the member, never an error,
// because these two members are optional by definition.
function resolveOptionalMember(root, memberPath, { json = false } = {}) {
  if (!memberPath) return null;
  const resolved = path.resolve(root, memberPath);
  if (!fs.existsSync(resolved)) return null;
  const raw = fs.readFileSync(resolved, 'utf8');
  let content = raw;
  if (json) {
    try {
      content = JSON.parse(raw);
    } catch (error) {
      throw new Error(`optional notepad member ${memberPath} is not valid JSON: ${error.message}`);
    }
  }
  return {
    path: relative(root, resolved),
    content,
    workingContext: true,
    instruction: false,
    proof: false
  };
}

function extractPathSpans(text) {
  const spans = [...text.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
  return [...new Set(spans.filter((span) => !/\s/.test(span) && /[./]/.test(span)))];
}

function section(content, heading) {
  const marker = `## ${heading}`;
  const start = content.indexOf(marker);
  if (start < 0) return '';
  const bodyStart = start + marker.length;
  const end = content.indexOf('\n## ', bodyStart);
  return content.slice(bodyStart, end < 0 ? content.length : end).trim();
}

function relative(root, target) {
  return path.relative(root, target).split(path.sep).join('/');
}
