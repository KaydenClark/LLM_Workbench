#!/usr/bin/env node
import { inspectSkills } from './skill-inspection.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { insideWorkTree, managedRuntimeDrift, permissionScopeDrift, permissionScopeMessage, provenanceFindings, readAtRef, resolveBranchRefs, seededDocumentFindings, validateManifest } from './workbench-layout.mjs';
import { isMainModule } from './workbench-paths.mjs';
import { escapeMarkdownTableCell, parseMarkdownTableRow } from './markdown-table.mjs';
import { parseSpecPacket } from './spec-packet.mjs';
import { blocksSelection, describe, finding } from './diagnostics.mjs';
import { assertSafeWritePath, writeSafeFile, collectionPath, declaredGit, lanePath, readManifest } from './workbench-paths.mjs';
import { validateAdrs } from './adr.mjs';
import { validateWiki } from './wiki.mjs';
import { allocateVisibleId, compareVisibleIds, visibleIdKey } from './visible-ids.mjs';
import { TASK_STATUSES, formatTaskRecord, listTaskRecords, parseTaskRecord, taskStatus, unmetBlockers, updateTaskFields } from './task-record.mjs';

// One closed status vocabulary for an execution slice, owned by the record
// reader and re-exported here so the lifecycle commands and the record share
// one set rather than two that can drift apart. TK-001 flagged the duplicate;
// this is the fold it asked for.
export { TASK_STATUSES };

const SPEC_STATUSES = new Set(['planned', 'active', 'blocked', 'needs-review', 'complete', 'superseded']);
const CATALOG_START = '<!-- spec-catalog:start -->';
const CATALOG_END = '<!-- spec-catalog:end -->';
const HOT_START = '<!-- hot-specs:start -->';
const HOT_END = '<!-- hot-specs:end -->';

export function nextWork(rootDir) {
  refuseBlockedRuntime(rootDir);
  return selectCandidate(loadSpecs(rootDir));
}

// An `all` effect is a refusal, not only a doctor exit code: the effect table
// says `next` and `claim` refuse to read the layout. Every other `all` finding
// is raised by `validateManifest`, which `loadSpecs` already runs, so this is
// the one `all` condition selection would otherwise walk past - and walking
// past it means dispatching a ticket to an agent whose runtime nobody
// verified. `doctor` still reports the finding instead of throwing, because
// reporting it is what `doctor` is for.
function refuseBlockedRuntime(rootDir) {
  const root = path.resolve(rootDir);
  const manifest = readManifest(root);
  if (!manifest || manifest.schemaVersion !== 2) return;
  const runtime = managedRuntimeDrift(root, { lane: manifest.lanes?.tools });
  if (!runtime || describe(runtime.code).blocks !== 'all') return;
  const error = new Error(`${runtime.code}: ${runtime.message}`);
  error.code = runtime.code;
  throw error;
}

function selectCandidate(specs, { specId, readyOnly = false } = {}) {
  const completed = new Set(specs.filter((spec) => ['complete', 'superseded'].includes(spec.status)).map((spec) => spec.id));
  const candidates = [];
  for (const spec of specs) {
    if (spec.status !== 'active' || (specId && spec.id !== specId)) continue;
    const satisfied = satisfiedIds(spec, completed);
    for (const slice of slicesOf(spec)) {
      const status = effectiveStatus(slice, satisfied);
      const resumable = !readyOnly && status === 'in-progress';
      const eligible = status === 'ready' && blockersSatisfied(slice.blockers, satisfied);
      if (!resumable && !eligible) continue;
      candidates.push({
        specId: spec.id,
        title: spec.title,
        ticketId: slice.id,
        slice: slice.slice,
        status,
        rank: resumable ? -1 : 0,
        priority: spec.priority,
        owner: spec.owner,
        path: spec.relativePath,
        nextGate: spec.nextGate
      });
    }
  }
  candidates.sort((a, b) => a.rank - b.rank || a.priority - b.priority || compareVisibleIds(a.specId, b.specId) || compareVisibleIds(a.ticketId, b.ticketId));
  if (candidates.length === 0) return null;
  const { rank: _rank, ...result } = candidates[0];
  return result;
}

export function showSpec(rootDir, id) {
  const spec = findSpec(rootDir, id);
  return { ...publicSpec(spec), body: spec.content };
}

export function nextIdentity(rootDir, specId, options = {}) {
  refuseBlockedRuntime(rootDir);
  const specs = loadSpecs(rootDir);
  const prefix = options.prefix;
  if (!['S', 'TK'].includes(prefix)) throw new Error('--prefix must be S or TK');
  if (prefix === 'TK' && !specs.some(spec => spec.id === specId)) throw new Error('Ticket identity proposals require an existing assigned spec ID');
  if (prefix === 'S' && specId) throw new Error('A spec identity proposal takes no existing spec ID');
  const occupied = prefix === 'S'
    ? specs.map(spec => spec.id)
    : specs.flatMap(spec => [...spec.tickets, ...spec.tasks].map(ticket => ticket.id));
  // Letter-bearing new durable labels do not reuse removed historical decimal
  // IDs. Numeric tickets also retain their old spec-qualified interpretation.
  const reservations = [...new Map(occupied.map(id => [visibleIdKey(id), id])).values()];
  const id = allocateVisibleId(prefix, reservations, { requireLetter: true });
  return { status: 'proposed', id, reserved: false, ...(specId ? { specId } : {}) };
}

export function claimWork(rootDir, id, options) {
  refuseBlockedRuntime(rootDir);
  requireValue(options?.agent, '--agent is required');
  const date = validDate(options?.date ?? today());
  const specs = loadSpecs(rootDir);
  const matches = specs.filter((item) => item.id === id);
  if (matches.length !== 1) throw new Error(matches.length ? `Duplicate spec ID: ${id}` : `Unknown spec ID: ${id}`);
  const spec = matches[0];
  if (spec.status !== 'active') throw new Error(`${id} is ${spec.status}, not active`);
  const candidate = selectCandidate(specs, { specId: id, readyOnly: true });
  const slices = slicesOf(spec);
  const ticket = slices.find((item) => item.id === candidate?.ticketId);
  if (!ticket) {
    const satisfied = satisfiedIds(spec, new Set(specs.filter((item) => ['complete', 'superseded'].includes(item.status)).map((item) => item.id)));
    const blocked = slices.find((item) => item.declared === 'ready' || effectiveStatus(item, satisfied) === 'blocked');
    if (blocked) throw new Error(`${id}/${blocked.id} is blocked by ${blocked.blockers} (blocked-slice); claim refuses a slice whose declared dependency is unmet`);
    throw new Error(`${id} has no eligible ready ticket to claim`);
  }
  // A record-backed Spec's state lives on the record; only the Spec header's
  // owner and event fields move. The record is written first so a failure
  // while updating the header cannot leave the Spec announcing a claim that
  // the record never took.
  if (ticket.source === 'record') writeTaskStatus(ticket.record, { Status: 'in-progress' });
  const content = ticket.source === 'record'
    ? spec.content
    : updateTicket(spec.content, ticket.id, (cells) => {
      cells[2] = 'in-progress';
      return cells;
    });
  const updated = updateFields(content, {
    Owner: options.agent,
    Updated: date,
    'Latest event': `${ticket.id} claimed by ${options.agent}.`,
    'Next gate': `Close ${ticket.id} with verification and documentation proof.`
  });
  atomicWrite(spec.filePath, updated);
  return showSpec(rootDir, id);
}

export function closeTicket(rootDir, id, options) {
  const proof = requireValue(options?.proof, '--proof is required');
  const docs = requireValue(options?.docs, '--docs is required');
  const remainingGap = requireValue(options?.remainingGap, '--remaining-gap is required');
  const date = validDate(options?.date ?? today());
  const spec = findSpec(rootDir, id);
  const slices = slicesOf(spec);
  const ticket = slices.find((item) => item.declared === 'in-progress')
    ?? slices.find((item) => item.declared === 'ready');
  if (!ticket) throw new Error(`${id} has no open ticket to close`);
  // Proof text for a record goes on the record; the Spec's append-only
  // evidence row below is appended either way, because the Spec still owns
  // the evidence log whichever source its slices come from.
  let content = spec.content;
  if (ticket.source === 'record') writeTaskStatus(ticket.record, { Status: 'done', Proof: proof });
  else {
    content = updateTicket(spec.content, ticket.id, (cells) => {
      cells[2] = 'done';
      cells[4] = proof;
      return cells;
    });
  }
  const remaining = slices.find((item) => item.id !== ticket.id && item.declared !== 'done');
  content = updateFields(content, {
    Updated: date,
    'Latest event': `${ticket.id} closed with proof.`,
    'Next gate': remaining ? `Complete ${remaining.id}.` : 'Confirm acceptance criteria and completion result.'
  });
  content = appendEvidence(content, `| ${escapeCell(date)} | ${escapeCell(ticket.id)} | Ticket closed | ${escapeCell(proof)} | ${escapeCell(docs)} | ${escapeCell(remainingGap)} |`);
  atomicWrite(spec.filePath, content);
  return showSpec(rootDir, id);
}

export function completeSpec(rootDir, id, options = {}) {
  const date = validDate(options.date ?? today());
  const spec = findSpec(rootDir, id);
  if (!['active', 'needs-review'].includes(spec.status)) throw new Error(`${id} is ${spec.status}, not completable`);
  if ([...slicesOf(spec), ...spec.tickets].some((slice) => (slice.declared ?? slice.status) !== 'done')) throw new Error(`${id} has an unfinished slice`);
  if (/^- \[ \]/m.test(section(spec.content, 'Acceptance Criteria'))) throw new Error(`${id} has unchecked acceptance criteria`);
  const completion = section(spec.content, 'Completion Result').trim();
  if (!completion || /^pending\.?$/i.test(completion)) throw new Error(`${id} has no completion result`);
  if (evidenceRows(spec.content).length === 0) throw new Error(`${id} has no execution evidence`);
  let content = updateFields(spec.content, {
    Status: 'complete',
    Updated: date,
    'Latest event': 'Spec completed and removed from the hot board.',
    'Next gate': 'none'
  });
  content = appendEvidence(content, `| ${escapeCell(date)} | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |`);
  atomicWrite(spec.filePath, content);
  return showSpec(rootDir, id);
}

export function render(rootDir) {
  const root = path.resolve(rootDir);
  const specs = loadSpecs(root);
  const blueprintPath = path.join(root, 'BLUEPRINT.md');
  const taskboardPath = path.join(root, 'TASKBOARD.md');
  const blueprint = fs.readFileSync(blueprintPath, 'utf8');
  const taskboard = fs.readFileSync(taskboardPath, 'utf8');
  if (blueprint.includes(CATALOG_START) || blueprint.includes(CATALOG_END)) {
    // Legacy rooms keep their declared projection until an explicit rebuild.
    atomicWrite(blueprintPath, replaceRegion(blueprint, CATALOG_START, CATALOG_END, renderCatalog(specs)));
  } else {
    const catalogPath = path.join(resolveSpecsRoot(root).specsRoot, 'CATALOG.md');
    assertSafeWritePath(root, catalogPath);
    const relativeCatalog = renderCatalog(specs).replaceAll(`](${resolveSpecsRoot(root).specsPrefix}/`, '](');
    writeSafeFile(root, catalogPath, `# Spec Catalog\n\nDerived from stable specs; includes completed history.\n\n${CATALOG_START}\n${relativeCatalog}\n${CATALOG_END}\n`);
  }
  atomicWrite(taskboardPath, replaceRegion(taskboard, HOT_START, HOT_END, renderHotBoard(specs)));
  return { specs: specs.length, active: specs.filter((spec) => isHot(spec)).length };
}

export function doctor(rootDir, options = {}) {
  const root = path.resolve(rootDir);
  const issues = [];
  let specs;
  try {
    specs = loadSpecs(root, { allowDuplicates: true });
  } catch (error) {
    return [finding(['upgrade-required', 'invalid-manifest'].includes(error.code) ? error.code : 'malformed-spec', error.message)];
  }
  issues.push(...packetFindings(specs, options));
  const blueprint = fs.existsSync(path.join(root, 'BLUEPRINT.md')) ? fs.readFileSync(path.join(root, 'BLUEPRINT.md'), 'utf8') : '';
  if (blueprint.includes(CATALOG_START) || blueprint.includes(CATALOG_END)) checkRender(root, 'BLUEPRINT.md', CATALOG_START, CATALOG_END, renderCatalog(specs), issues);
  else checkRender(root, path.relative(root, path.join(resolveSpecsRoot(root).specsRoot, 'CATALOG.md')), CATALOG_START, CATALOG_END, renderCatalog(specs).replaceAll(`](${resolveSpecsRoot(root).specsPrefix}/`, ']('), issues);
  checkRender(root, 'TASKBOARD.md', HOT_START, HOT_END, renderHotBoard(specs), issues);
  issues.push(...collectionFindings(root));
  issues.push(...skillFindings(root, options.home));
  issues.push(...gitFindings(root, specs));
  return issues;
}

// Validate proposed spec bytes without touching files or inspecting the host.
export function validateSpecCandidate(root, filePath, content) {
  const specs = loadSpecs(root, { allowDuplicates: true, contentOverrides: new Map([[path.resolve(filePath), content]]) });
  return packetFindings(specs);
}

function packetFindings(specs, options = {}) {
  const issues = [];
  issues.push(...identityFindings(specs));
  const completed = new Set(specs.filter((spec) => ['complete', 'superseded'].includes(spec.status)).map((spec) => spec.id));
  for (const spec of specs) {
    if (!SPEC_STATUSES.has(spec.status)) issues.push(finding('invalid-state', `${spec.id} has invalid status ${spec.status}`, { specId: spec.id }));
    if (!spec.relativePath.startsWith(`${spec.specsPrefix}/${spec.id}-`)) issues.push(finding('unstable-path', `${spec.id} path must start ${spec.specsPrefix}/${spec.id}-`, { specId: spec.id }));
    const satisfied = satisfiedIds(spec, completed);
    const slices = slicesOf(spec);
    for (const slice of slices) {
      if (!TASK_STATUSES.includes(slice.declared)) issues.push(finding('invalid-state', `${spec.id}/${slice.id} has invalid status ${slice.declared}`, { specId: spec.id, ticketId: slice.id }));
      if (slice.declared === 'done' && (!slice.proof || /^pending$/i.test(slice.proof))) issues.push(finding('missing-evidence', `${spec.id}/${slice.id} is done without proof`, { specId: spec.id, ticketId: slice.id }));
    }
    // The selected slice is the first resumable or ready slice; a later slice
    // waiting on its predecessor is ordinary sequencing, not a finding. A
    // record's effective status already resolves its live blockers, so a
    // record-backed Spec raises this only when nothing at all is selectable.
    const head = slices.find((slice) => ['in-progress', 'ready'].includes(effectiveStatus(slice, satisfied)));
    const stalled = head ? null : slices.find((slice) => effectiveStatus(slice, satisfied) === 'blocked');
    const waiting = head?.declared === 'ready' && !blockersSatisfied(head.blockers, satisfied) ? head : stalled;
    if (spec.status === 'active' && waiting) {
      issues.push(finding('blocked-slice', `${spec.id}/${waiting.id} waits on ${waiting.blockers}`, { specId: spec.id, ticketId: waiting.id }));
    }
    if (['complete', 'superseded'].includes(spec.status) && slices.some((slice) => slice.declared !== 'done')) {
      issues.push(finding('contradictory-state', `${spec.id} is ${spec.status} with unfinished tickets`, { specId: spec.id }));
    }
    const updated = Date.parse(`${spec.updated}T00:00:00Z`);
    const now = Date.parse(`${options.today ?? today()}T00:00:00Z`);
    if (slices.some((slice) => slice.declared === 'in-progress') && Number.isFinite(updated) && now - updated > 86_400_000) {
      issues.push(finding('stale-claim', `${spec.id} has an in-progress ticket last updated ${spec.updated}`, { specId: spec.id }));
    }
    for (const link of localLinks(spec.content)) {
      const target = path.resolve(path.dirname(spec.filePath), link);
      if (!target.startsWith(spec.root + path.sep) || !fs.existsSync(target)) issues.push(finding('broken-link', `${spec.id} links to missing ${link}`, { specId: spec.id }));
    }
  }
  return issues;
}

// Inspection reports ownership and compatibility without changing the home.
function skillFindings(root, home) {
  return inspectSkills(readManifest(root), path.resolve(home ?? os.homedir()));
}

// The declared integration branch is the review gate's merge target. Its
// absence is an error every doctor run shows and none blocks: a room can
// create the branch in one command, and selection must not wait on it.
function gitFindings(root, specs) {
  const manifest = readManifest(root);
  if (!manifest || manifest.schemaVersion !== 2) return [];
  const declared = declaredGit(root);
  if (!declared) return [finding('integration-branch-undeclared', 'workbench/manifest.json declares no git.integrationBranch; declare the branch the independent review gate merges into')];
  if (!insideWorkTree(root)) {
    return [finding('integration-branch-missing', `the project is not inside a Git work tree, so declared integration branch ${declared.integrationBranch} cannot resolve; initialize the repository first`, { branch: declared.integrationBranch })];
  }
  const refs = resolveBranchRefs(root, declared.integrationBranch);
  if (refs.length === 0) {
    return [finding('integration-branch-missing', `declared integration branch ${declared.integrationBranch} resolves neither as a local head nor on a remote; create it from ${declared.defaultBranch}`, { branch: declared.integrationBranch })];
  }
  // A checkout behind its integration branch is told that the work next would
  // dispatch is already finished there. It still dispatches: a checkout may be
  // pinned deliberately, so the finding informs and never blocks.
  const selected = selectCandidate(specs);
  const spec = selected && specs.find((item) => item.id === selected.specId);
  for (const { ref, name } of spec ? refs : []) {
    const status = readAtRef(root, ref, spec.relativePath)?.match(/^\*\*Status:\*\*\s*(\S+)/m)?.[1];
    if (['complete', 'superseded'].includes(status)) {
      return [finding('complete-on-integration', `${spec.id} is ${status} at ${name}; this checkout still carries it ${spec.status}, so fetch or rebase before dispatching ${selected.ticketId}`, { specId: spec.id, ref: name })];
    }
  }
  return [];
}

// Schema 2 projects also carry decision records; their findings ride along so
// one doctor run reports the whole support root. The ADR, wiki, and permission
// codes are all registered `none` and block nothing. The managed-runtime codes
// are registered `all`, and this is their only emitter, so `refuseBlockedRuntime`
// enforces that effect for `next` and `claim` separately.
function collectionFindings(root) {
  const manifest = readManifest(root);
  if (!manifest || manifest.schemaVersion !== 2) return [];
  const findings = [];
  try {
    if (fs.existsSync(collectionPath(root, 'adr'))) findings.push(...validateAdrs(root));
  } catch (error) {
    findings.push(finding('invalid-adr', `ADR validation failed: ${error.message}`));
  }
  try {
    if (fs.existsSync(lanePath(root, 'wiki'))) findings.push(...validateWiki(root));
  } catch (error) {
    findings.push(finding('invalid-note', `wiki validation failed: ${error.message}`));
  }
  // S-045 TK-002: the two installed-state checks a room's own manifest and seed
  // record answer. They were emitted from the wiki validator, which made
  // `wiki.mjs validate` report a feedback-lane fact and a manifest fact to
  // anyone checking the wiki; S-042 recorded that placement as interim. They
  // are emitted here, beside the managed-runtime check, because the scope that
  // matches them is the room's installed state, not any one lane. Both remain
  // registered `none` and block nothing.
  findings.push(...seededDocumentFindings(root));
  findings.push(...provenanceFindings(root));
  // The runtime a room executes is checked against the receipt that installed
  // it, from the room itself; a lane with no receipt is not a managed runtime
  // and is the Genesis readiness gate's business, not doctor's.
  const runtime = managedRuntimeDrift(root, { lane: manifest.lanes?.tools });
  if (runtime) findings.push(finding(runtime.code, runtime.message, { lane: runtime.lane, ...(runtime.drift ? { drift: runtime.drift } : {}) }));
  // The permission file is the mechanical half of the prose Edit Scope; a
  // declared lane it withholds is named, never rewritten, and never blocks.
  const drift = permissionScopeDrift(root, manifest.lanes);
  if (drift) findings.push(finding('permission-scope-drift', permissionScopeMessage(drift), { control: drift.control, lanes: drift.lanes }));
  return findings;
}

function loadSpecs(rootDir, options = {}) {
  const root = path.resolve(rootDir);
  const { specsRoot, specsPrefix } = resolveSpecsRoot(root);
  if (!fs.existsSync(specsRoot)) return [];
  const paths = [];
  for (const entry of fs.readdirSync(specsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const filePath = path.join(specsRoot, entry.name, 'SPEC.md');
    if (fs.existsSync(filePath)) paths.push(filePath);
  }
  const specs = paths.sort().map((filePath) => {
    const specDir = path.dirname(filePath);
    const tasks = listTaskRecords(specDir, root);
    const recordBacked = fs.existsSync(path.join(specDir, 'tasks'));
    const content = options.contentOverrides?.get(filePath) ?? fs.readFileSync(filePath, 'utf8');
    const spec = { ...parseSpecPacket(content, filePath, root, { recordBacked }), specsPrefix, tasks, recordBacked };
    assertOneSliceTruth(spec);
    return spec;
  });
  if (!options.allowDuplicates) {
    const collision = identityFindings(specs)[0];
    if (collision) throw new Error(collision.message);
  }
  return specs;
}

// One source of slice truth per Spec. A Spec is record-backed when its own
// `tasks/` directory exists; its embedded table then holds completed history
// only, which `close` and the Spec's evidence log still own. Both failures
// below are refusals rather than findings a reader could walk past, because
// each one would otherwise let a single slice be counted twice - once as a
// live row and once as a live record - and selection would follow whichever
// the code happened to read first.
function assertOneSliceTruth(spec) {
  if (!spec.recordBacked) return;
  const recorded = new Map(spec.tasks.map((task) => [visibleIdKey(task.id), task.id]));
  for (const ticket of spec.tickets) {
    const collision = recorded.get(visibleIdKey(ticket.id));
    if (collision) {
      throw new Error(`${spec.id} carries both a slice-table row and a Task record for ${collision}; one Spec has one source of slice truth`);
    }
    if (ticket.status !== 'done') {
      throw new Error(`${spec.id} is record-backed but its slice table still holds the unfinished row ${ticket.id}; a retained table is completed history only`);
    }
  }
}

// The slices selection, claim, close, render and doctor read: the Task
// records for a record-backed Spec, the embedded table rows otherwise. A
// table slice keeps its cells verbatim, so a table-only room behaves exactly
// as it did before this migration.
function slicesOf(spec) {
  if (!spec.recordBacked) {
    return spec.tickets.map((ticket) => ({
      id: ticket.id,
      slice: ticket.slice,
      declared: ticket.status,
      blockerIds: splitBlockers(ticket.blockers),
      blockers: ticket.blockers,
      proof: ticket.proof,
      source: 'table'
    }));
  }
  return spec.tasks.map((task) => ({
    id: task.id,
    slice: task.slice,
    declared: taskStatus(task),
    blockerIds: task.blockers,
    blockers: task.blockers.length > 0 ? task.blockers.join(', ') : 'none',
    proof: task.proof,
    source: 'record',
    record: task
  }));
}

// The ids a slice may declare as satisfied: completed Specs, plus every done
// slice of this Spec. A record-backed Spec's retained done rows count here,
// which is how a record can name a predecessor that closed before the Spec
// was converted.
function satisfiedIds(spec, completed) {
  const done = [
    ...spec.tickets.filter((ticket) => ticket.status === 'done').map((ticket) => ticket.id),
    ...spec.tasks.filter((task) => taskStatus(task) === 'done').map((task) => task.id)
  ];
  return new Set([...completed, ...done]);
}

// A table row's status cell is its status, unchanged. A record's `ready` and
// `blocked` are resolved against its live blockers instead: a record whose
// declared blockers are all satisfied is ready without anyone editing a
// status cell, and one whose blockers are unmet is blocked even if its cell
// says ready. This is a derivation of the record's own two authored fields,
// not a second status written anywhere.
function effectiveStatus(slice, satisfied) {
  if (slice.source !== 'record') return slice.declared;
  if (slice.declared !== 'ready' && slice.declared !== 'blocked') return slice.declared;
  return unmetBlockers(slice.record, satisfied).length === 0 ? 'ready' : 'blocked';
}

function splitBlockers(value) {
  if (!value || value === 'none') return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

// Writes back the frontmatter fields a lifecycle command owns, then parses
// the result before it lands: a record this refuses to produce is never
// written, so the reader never meets bytes it would fail closed on.
function writeTaskStatus(record, values) {
  const content = updateTaskFields(record.content, values);
  parseTaskRecord(content, record.filePath, record.root);
  atomicWrite(record.filePath, content);
  return content;
}

function publicSlice(slice) {
  return { id: slice.id, slice: slice.slice, status: slice.declared, blockers: slice.blockers, proof: slice.proof ?? null };
}

function identityFindings(specs) {
  const findings = [];
  const specIds = new Map();
  const globalTickets = new Map();
  for (const spec of specs) {
    const specKey = visibleIdKey(spec.id);
    if (specIds.has(specKey)) findings.push(finding('duplicate-id', `Duplicate spec ID: ${spec.id} conflicts with ${specIds.get(specKey)}`, { specId: spec.id }));
    else specIds.set(specKey, spec.id);
    const localTickets = new Map();
    for (const ticket of [...spec.tickets, ...(spec.tasks ?? [])]) {
      const key = visibleIdKey(ticket.id);
      if (localTickets.has(key)) findings.push(finding('duplicate-id', `Duplicate ticket ID: ${spec.id}/${ticket.id}`, { specId: spec.id, ticketId: ticket.id }));
      localTickets.set(key, ticket.id);
      if (/^TK-\d+$/.test(ticket.id)) continue;
      if (globalTickets.has(key)) findings.push(finding('duplicate-id', `Duplicate ticket ID: ${spec.id}/${ticket.id} conflicts with ${globalTickets.get(key)}`, { specId: spec.id, ticketId: ticket.id }));
      else globalTickets.set(key, `${spec.id}/${ticket.id}`);
    }
  }
  return findings;
}

function resolveSpecsRoot(root) {
  const manifestPath = path.join(root, 'workbench', 'manifest.json');
  if (!fs.existsSync(manifestPath)) return { specsRoot: path.join(root, 'specs'), specsPrefix: 'specs' };
  const validation = validateManifest(root);
  if (validation.status !== 'valid') {
    const error = new Error(`Workbench manifest is invalid: ${validation.error?.message ?? 'unknown validation failure'}`);
    error.code = validation.error?.code === 'upgrade-required' ? 'upgrade-required' : 'invalid-manifest';
    throw error;
  }
  return {
    specsRoot: path.join(root, validation.manifest.lanes.specs),
    specsPrefix: validation.manifest.lanes.specs
  };
}

function renderCatalog(specs) {
  const lines = [
    '| Spec | Description | Status |',
    '|---|---|---|'
  ];
  for (const spec of specs.sort((a, b) => compareVisibleIds(a.id, b.id))) {
    lines.push(`| [${spec.id} - ${escapeCell(spec.title)}](${spec.relativePath}) | ${escapeCell(spec.description)} | ${escapeCell(spec.status)} |`);
  }
  if (specs.length === 0) lines.push('| none | No specs recorded yet. | n/a |');
  return lines.join('\n');
}

function renderHotBoard(specs) {
  const hot = specs.filter((spec) => isHot(spec)).sort((a, b) => a.priority - b.priority || compareVisibleIds(a.id, b.id));
  const lines = [
    '| Spec | Current slice | Owner | Blocker | Latest meaningful event | Next gate |',
    '|---|---|---|---|---|---|'
  ];
  if (hot.length === 0) {
    lines.push('| none | No active slice | unassigned | none | All completed specs are cold. | Activate a planned spec explicitly. |');
    return lines.join('\n');
  }
  // The current-slice cell is derived from the Spec's own slices - its Task
  // records where it has them - so a Spec objective with no active Task shows
  // the owner gate rather than a slice. That derivation is what makes the
  // board show whether an objective is active; the Spec header Status stays
  // the Spec's lifecycle truth and no command writes a second one.
  const completed = new Set(specs.filter((spec) => ['complete', 'superseded'].includes(spec.status)).map((spec) => spec.id));
  for (const spec of hot) {
    const slices = slicesOf(spec).map((item) => ({ ...item, status: effectiveStatus(item, satisfiedIds(spec, completed)) }));
    const ticket = slices.find((item) => item.status === 'in-progress')
      ?? slices.find((item) => item.status === 'ready')
      ?? slices.find((item) => item.status === 'blocked');
    const slice = ticket ? `${ticket.id}: ${ticket.slice} (${ticket.status})` : 'Acceptance / owner gate';
    const blocker = ticket?.blockers && ticket.blockers !== 'none' ? ticket.blockers : spec.blockers;
    lines.push(`| [${spec.id}](${spec.relativePath}) | ${escapeCell(slice)} | ${escapeCell(spec.owner)} | ${escapeCell(blocker)} | ${escapeCell(spec.latestEvent)} | ${escapeCell(spec.nextGate)} |`);
  }
  return lines.join('\n');
}

function isHot(spec) {
  return ['active', 'blocked', 'needs-review'].includes(spec.status);
}

function blockersSatisfied(value, completed) {
  if (!value || value === 'none') return true;
  return value.split(',').map((item) => item.trim()).filter(Boolean).every((id) => completed.has(id));
}

function findSpec(rootDir, id) {
  const matches = loadSpecs(rootDir).filter((spec) => spec.id === id);
  if (matches.length !== 1) throw new Error(matches.length ? `Duplicate spec ID: ${id}` : `Unknown spec ID: ${id}`);
  return matches[0];
}

function publicSpec(spec) {
  return {
    id: spec.id,
    title: spec.title,
    status: spec.status,
    priority: spec.priority,
    owner: spec.owner,
    updated: spec.updated,
    description: spec.description,
    blockers: spec.blockers,
    latestEvent: spec.latestEvent,
    nextGate: spec.nextGate,
    path: spec.relativePath,
    tickets: slicesOf(spec).map(publicSlice)
  };
}

function updateFields(content, values) {
  let result = content;
  for (const [name, value] of Object.entries(values)) {
    const pattern = new RegExp(`^\\*\\*${escapeRegExp(name)}:\\*\\*\\s*.+$`, 'm');
    if (!pattern.test(result)) throw new Error(`Missing field: ${name}`);
    result = result.replace(pattern, `**${name}:** ${value}`);
  }
  return result;
}

function updateTicket(content, ticketId, transform) {
  let found = false;
  const updated = content.split('\n').map((line) => {
    if (!line.startsWith(`| ${ticketId} |`)) return line;
    found = true;
    return `| ${transform(splitRow(line)).map(escapeCell).join(' | ')} |`;
  }).join('\n');
  if (!found) throw new Error(`Unknown ticket: ${ticketId}`);
  return updated;
}

function appendEvidence(content, row) {
  const heading = '## Append-Only Evidence And Execution Log';
  const start = content.indexOf(heading);
  if (start < 0) throw new Error('Missing evidence log');
  const nextHeading = content.indexOf('\n## ', start + heading.length);
  const end = nextHeading < 0 ? content.length : nextHeading;
  const before = content.slice(0, end).trimEnd();
  const after = content.slice(end);
  return `${before}\n${row}\n${after}`;
}

function evidenceRows(content) {
  return section(content, 'Append-Only Evidence And Execution Log').split('\n').filter((line) => /^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line));
}

function section(content, heading) {
  const marker = `## ${heading}`;
  const start = content.indexOf(marker);
  if (start < 0) return '';
  const bodyStart = start + marker.length;
  const end = content.indexOf('\n## ', bodyStart);
  return content.slice(bodyStart, end < 0 ? content.length : end).trim();
}

function splitRow(line) {
  return parseMarkdownTableRow(line);
}

function replaceRegion(content, startMarker, endMarker, body) {
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker);
  if (start < 0 || end < start) throw new Error(`Missing generated region ${startMarker} ... ${endMarker}`);
  return `${content.slice(0, start)}${startMarker}\n${body}\n${endMarker}${content.slice(end + endMarker.length)}`;
}

function checkRender(root, relative, startMarker, endMarker, expected, issues) {
  const filePath = path.join(root, relative);
  if (!fs.existsSync(filePath)) {
    issues.push(finding('broken-render-target', `${relative} is missing`));
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    const actual = normalizeLineEndings(regionBody(content, startMarker, endMarker));
    if (actual !== normalizeLineEndings(expected)) {
      issues.push(finding('render-drift', `${relative} generated region is stale`));
    }
  } catch (error) {
    issues.push(finding('broken-render-target', `${relative}: ${error.message}`));
  }
}

function normalizeLineEndings(value) {
  return value.replaceAll('\r\n', '\n');
}

function regionBody(content, startMarker, endMarker) {
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker);
  if (start < 0 || end < start) throw new Error(`missing ${startMarker}`);
  return content.slice(start + startMarker.length, end).trim();
}

function localLinks(content) {
  const links = [];
  for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const value = match[1].split('#')[0];
    if (!value || /^(?:https?:|mailto:)/.test(value)) continue;
    links.push(decodeURIComponent(value));
  }
  return links;
}

function atomicWrite(filePath, content) {
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, content.endsWith('\n') ? content : `${content}\n`);
  fs.renameSync(temporary, filePath);
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(`${value}T00:00:00Z`))) throw new Error(`Invalid date: ${value}`);
  return value;
}

function requireValue(value, message) {
  if (!value || !String(value).trim()) throw new Error(message);
  return String(value).trim();
}

function escapeCell(value) {
  return escapeMarkdownTableCell(value);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// The plain report is grouped by the consequence the registry assigns each
// finding, so a room whose findings block nothing does not read as failed.
// Presentation only: the effect is the registry's (workbench/tools/diagnostics.mjs),
// severity follows the effect in the line rather than leading it, and --json
// is untouched. Every registered effect must appear in exactly one group.
// Exported so a test can bind this to the diagnostics EFFECTS vocabulary.
// Every effect must land in exactly one group; an effect added to EFFECTS with
// no group here makes formatDoctorReport throw and prints no findings at all,
// which is a total doctor outage rather than a missing line.
export const DOCTOR_GROUPS = Object.freeze([
  Object.freeze({ name: 'blocking', effects: Object.freeze(['all', 'selection']), consequence: 'doctor exits 1 until repaired' }),
  Object.freeze({ name: 'selected slice', effects: Object.freeze(['selected-slice']), consequence: 'next excludes the slice and claim refuses it' }),
  Object.freeze({ name: 'informational', effects: Object.freeze(['none']), consequence: 'reported only; nothing is blocked' })
]);

export function formatDoctorReport(findings) {
  if (findings.length === 0) return 'ok - spec workbench doctor passed';
  const ungrouped = findings.filter((item) => !DOCTOR_GROUPS.some((group) => group.effects.includes(item.blocks)));
  if (ungrouped.length > 0) throw new Error(`Unreportable diagnostic effect: ${[...new Set(ungrouped.map((item) => item.blocks))].join(', ')}`);
  const lines = [];
  for (const group of DOCTOR_GROUPS) {
    const members = findings.filter((item) => group.effects.includes(item.blocks));
    if (members.length === 0) continue;
    lines.push(`${group.name} (${members.length}) - ${group.consequence}`);
    for (const item of members) lines.push(`  ${item.code} [blocks ${item.blocks}, ${item.severity}]: ${item.message}`);
  }
  if (!blocksSelection(findings)) lines.push('ok - no blocking finding; attention and slice findings above stay visible');
  return lines.join('\n');
}

export function parseCliArgs(argv) {
  const command = argv[0];
  let index = 1;
  const id = argv[index] && !argv[index].startsWith('--') ? argv[index++] : null;
  const rest = argv.slice(index);
  const options = {};
  for (let optionIndex = 0; optionIndex < rest.length; optionIndex += 1) {
    const arg = rest[optionIndex];
    if (arg === '--json') options.json = true;
    else if (arg.startsWith('--')) options[toCamel(arg.slice(2))] = rest[++optionIndex];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return { command, id, options };
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

async function main() {
  const { command, id, options } = parseCliArgs(process.argv.slice(2));
  const root = options.path ?? process.cwd();
  let result;
  if (command === 'next') result = nextWork(root);
  else if (command === 'next-id') result = nextIdentity(root, id, options);
  else if (command === 'show') result = showSpec(root, id);
  else if (command === 'claim') result = claimWork(root, id, options);
  else if (command === 'close') result = closeTicket(root, id, options);
  else if (command === 'complete') result = completeSpec(root, id, options);
  else if (command === 'render') result = render(root);
  else if (command === 'doctor') {
    result = doctor(root, options);
    if (blocksSelection(result)) process.exitCode = 1;
  } else {
    throw new Error('Usage: spec-workbench.mjs next|next-id|show|claim|close|complete|render|doctor [S-###] [options]');
  }
  if (options.json) console.log(JSON.stringify(result, null, 2));
  else if (command === 'show') console.log(result.body);
  else if (command === 'doctor') console.log(formatDoctorReport(result));
  else console.log(result === null ? 'No eligible work.' : JSON.stringify(result, null, 2));
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  });
}
