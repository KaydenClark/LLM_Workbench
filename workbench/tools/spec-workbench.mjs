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
import { TASK_STATUSES, formatTaskRecord, listTaskRecords, parseTaskRecord, readTaskRecord, taskStatus, unmetBlockers, updateTaskFields } from './task-record.mjs';
import { appendReceiptRow, readReceiptFromFile } from './task-receipt.mjs';

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
// past it means dispatching a task to an agent whose runtime nobody
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
        taskId: slice.id,
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
  candidates.sort((a, b) => a.rank - b.rank || a.priority - b.priority || compareVisibleIds(a.specId, b.specId) || compareVisibleIds(a.taskId, b.taskId));
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
  if (prefix === 'TK' && !specs.some(spec => spec.id === specId)) throw new Error('Task identity proposals require an existing assigned spec ID');
  if (prefix === 'S' && specId) throw new Error('A spec identity proposal takes no existing spec ID');
  const occupied = prefix === 'S'
    ? specs.map(spec => spec.id)
    : specs.flatMap(spec => [...spec.rows, ...spec.records].map(item => item.id));
  // Letter-bearing new durable labels do not reuse removed historical decimal
  // IDs. Numeric tasks also retain their old spec-qualified interpretation.
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
  const task = slices.find((item) => item.id === candidate?.taskId);
  if (!task) {
    // `blocked-slice` names the one shape doctor also reports: a slice that
    // declares itself ready while its blockers are unmet. A slice that
    // declares itself blocked is ordinary sequencing on both sources, so it
    // gets the generic refusal rather than the name of a finding nobody
    // raised. A table row's refusal is unchanged, since a ready row reaching
    // here always has an unmet blocker.
    const satisfied = satisfiedIds(spec, new Set(specs.filter((item) => ['complete', 'superseded'].includes(item.status)).map((item) => item.id)));
    const blocked = slices.find((item) => item.declared === 'ready' && !blockersSatisfied(item.blockers, satisfied));
    if (blocked) throw new Error(`${id}/${blocked.id} is blocked by ${blocked.blockers} (blocked-slice); claim refuses a slice whose declared dependency is unmet`);
    throw new Error(`${id} has no eligible ready task to claim`);
  }
  // A record-backed Spec's state lives on the record; only the Spec header's
  // owner and event fields move. The record is written first so a failure
  // while updating the header cannot leave the Spec announcing a claim that
  // the record never took.
  if (task.source === 'record') writeTaskStatus(task.record, { Status: 'in-progress' });
  const content = task.source === 'record'
    ? spec.content
    : updateTaskRow(spec.content, task.id, (cells) => {
      cells[2] = 'in-progress';
      return cells;
    });
  const updated = updateFields(content, {
    Owner: options.agent,
    Updated: date,
    'Latest event': `${task.id} claimed by ${options.agent}.`,
    'Next gate': `Close ${task.id} with verification and documentation proof.`
  });
  atomicWrite(spec.filePath, updated);
  return showSpec(rootDir, id);
}

export function closeTask(rootDir, id, options) {
  const root = path.resolve(rootDir);
  const proof = requireValue(options?.proof, '--proof is required');
  const docs = requireValue(options?.docs, '--docs is required');
  const remainingGap = requireValue(options?.remainingGap, '--remaining-gap is required');
  const date = validDate(options?.date ?? today());
  const spec = findSpec(root, id);
  const slices = slicesOf(spec);
  const task = slices.find((item) => item.declared === 'in-progress')
    ?? slices.find((item) => item.declared === 'ready');
  if (!task) throw new Error(`${id} has no open task to close`);
  // Proof text for a record goes on the record; the Spec's append-only
  // evidence row below is appended either way, because the Spec still owns
  // the evidence log whichever source its slices come from. `close` is the
  // Receipt's first writer (ADR-000H): a record-backed Task's run gets its
  // one Receipt row here, with live Git facts, before the Spec's own
  // evidence row is appended; a table-backed Spec has no record to carry a
  // Receipt on, so it gets none.
  //
  // The Receipt append runs BEFORE the record is flipped to done. It fails
  // closed on a non-Git room or an altered earlier row (task-receipt.mjs's
  // own checksum chain), and it must fail before anything is written: doing
  // this the other way round left a record marked done, with Proof, but no
  // Receipt row and no Spec evidence row, on the exact failure this guards
  // against - and a rerun would then close a different Task entirely. The
  // record is re-read after the append so `writeTaskStatus` writes onto the
  // Receipt-bearing content just landed on disk, not a stale in-memory copy
  // from before the append.
  let content = spec.content;
  if (task.source === 'record') {
    appendReceiptRow(task.record.filePath, { repoRoot: root, testsRun: proof, docsTouched: docs, remainingGap });
    const receipted = readTaskRecord(task.record.filePath, task.record.root);
    writeTaskStatus(receipted, { Status: 'done', Proof: proof });
  } else {
    content = updateTaskRow(spec.content, task.id, (cells) => {
      cells[2] = 'done';
      cells[4] = proof;
      return cells;
    });
  }
  const remaining = slices.find((item) => item.id !== task.id && item.declared !== 'done');
  content = updateFields(content, {
    Updated: date,
    'Latest event': `${task.id} closed with proof.`,
    'Next gate': remaining ? `Complete ${remaining.id}.` : 'Confirm acceptance criteria and completion result.'
  });
  content = appendEvidence(content, `| ${escapeCell(date)} | ${escapeCell(task.id)} | Task closed | ${escapeCell(proof)} | ${escapeCell(docs)} | ${escapeCell(remainingGap)} |`);
  atomicWrite(spec.filePath, content);
  return showSpec(rootDir, id);
}

// The Receipt's second, proactive writer (ADR-000H): appends one row to a
// named in-progress Task record as a run proceeds, on the same
// before-interruption discipline `AGENTS.md` requires for notepads - not
// deferred until a successful `close`. It touches only the named Task's
// Receipt: never that Task's own Status field, and never the owning Spec.
// Refuses a Task that carries no standalone record (a table row has none to
// append to) and a Task that is not in-progress, naming its actual status
// rather than silently appending to a Task no run is open on.
export function receiptTask(rootDir, id, options) {
  const root = path.resolve(rootDir);
  const taskId = requireValue(options?.task, '--task is required');
  const testsRun = requireValue(options?.tests, '--tests is required');
  const docsTouched = requireValue(options?.docs, '--docs is required');
  const remainingGap = requireValue(options?.remainingGap, '--remaining-gap is required');
  const spec = findSpec(root, id);
  const task = slicesOf(spec).find((item) => item.id === taskId);
  if (!task || task.source !== 'record') {
    throw new Error(`${id}/${taskId} has no Task record; the receipt verb appends only to a standalone record`);
  }
  if (task.declared !== 'in-progress') {
    throw new Error(`${id}/${taskId} is ${task.declared}, not in-progress; the receipt verb appends only to an in-progress Task`);
  }
  const row = appendReceiptRow(task.record.filePath, { repoRoot: root, testsRun, docsTouched, remainingGap });
  return { specId: id, taskId, row };
}

// The one-time migration from an embedded slice table to standalone Task
// records, for one active Spec. It writes a `TASK.md` per unfinished row and
// removes that row, so no identifier is ever held in two places, and leaves
// every `done` row where it is: those rows are the Spec's completed history,
// carrying proof that the append-only evidence log already cites.
//
// A completed Spec is refused outright rather than converted quietly, and a
// second run is refused by the existing `tasks/` directory, so this cannot
// half-convert a Spec someone already migrated.
//
// `destinations` maps a slice id to the destination its record declares.
// Which acceptance line a slice advances is a judgment no parser can make;
// carrying the whole acceptance list onto every record would assert the same
// false destination for all of them, so an unsupplied id names the Spec's
// Acceptance Criteria section, which is true of every slice, and the caller
// supplies the specific line where it knows it.
export function convertSpecSlices(rootDir, id, options = {}) {
  const root = path.resolve(rootDir);
  const spec = findSpec(root, id);
  if (spec.status !== 'active') {
    throw new Error(`${id} is ${spec.status}, not active; only an active Spec is converted and a completed Spec's historical table is never rewritten`);
  }
  const specDir = path.dirname(spec.filePath);
  const tasksDir = path.join(specDir, 'tasks');
  if (fs.existsSync(tasksDir)) {
    throw new Error(`${id} already has ${path.relative(root, tasksDir).split(path.sep).join('/')}; conversion runs once and refuses to run again`);
  }
  const pending = spec.rows.filter((row) => row.status !== 'done');
  if (pending.length === 0) throw new Error(`${id} has no unfinished slice-table row to convert`);
  const destinations = options.destinations ?? {};
  // Every record is rendered and parsed back before anything is written, so a
  // row the record vocabulary cannot carry - a blocker outside the `S-`/`TK-`
  // form, for instance - stops the conversion by name instead of silently
  // dropping the dependency on the way into the record.
  const staged = pending.map((row) => {
    const filePath = path.join(tasksDir, row.id, 'TASK.md');
    const content = formatTaskRecord({
      id: row.id,
      specId: id,
      slice: row.slice,
      status: row.status,
      blockers: row.blockers,
      destination: destinations[row.id] ?? `spec-acceptance: ${id} Acceptance Criteria`,
      // An unfinished row's Proof cell holds the verification the slice plans
      // to run, not proof it ran: every row converted here is by definition
      // not done. It lands in `Planned verification`, and `Proof` stays
      // absent until `close` writes it, so nothing downstream - the Packet
      // TK-005 assembles, `show --json`, a reader - can read the plan as
      // evidence.
      plannedVerification: /^pending\.?$/i.test(row.proof ?? '') ? null : row.proof
    });
    try {
      parseTaskRecord(content, filePath, root);
    } catch (error) {
      throw new Error(`${id}/${row.id} cannot be converted: ${error.message}`);
    }
    return { row, filePath, content };
  });
  const converted = [];
  for (const { filePath, content } of staged) {
    assertSafeWritePath(root, filePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    atomicWrite(filePath, content);
    converted.push(path.relative(root, filePath).split(path.sep).join('/'));
  }
  const convertedIds = new Set(staged.map((item) => item.row.id));
  atomicWrite(spec.filePath, removeSliceRows(spec.content, convertedIds));
  return {
    specId: id,
    converted,
    retained: spec.rows.filter((row) => row.status === 'done').map((row) => row.id)
  };
}

export function completeSpec(rootDir, id, options = {}) {
  const date = validDate(options.date ?? today());
  const spec = findSpec(rootDir, id);
  if (!['active', 'needs-review'].includes(spec.status)) throw new Error(`${id} is ${spec.status}, not completable`);
  // Both sources are checked, not only the one selection reads: a Spec cannot
  // complete while a retained table row or a Task record is unfinished.
  const unfinished = [...slicesOf(spec).map((slice) => slice.declared), ...spec.rows.map((row) => row.status)];
  if (unfinished.some((status) => status !== 'done')) throw new Error(`${id} has an unfinished slice`);
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
    // A row/record collision is reported by name and this spec's remaining
    // slice checks are skipped - `slicesOf` refuses to resolve one source of
    // truth for it - but every other spec and every other doctor scope below
    // still runs; the collision is one finding among many, not a reason to
    // abort the room.
    if (spec.sliceConflict) {
      issues.push(finding('row-record-collision', `${spec.id} carries both a slice-table row and a Task record for ${spec.sliceConflict.id}`, { specId: spec.id, taskId: spec.sliceConflict.id }));
      continue;
    }
    const satisfied = satisfiedIds(spec, completed);
    const slices = slicesOf(spec);
    for (const slice of slices) {
      if (!TASK_STATUSES.includes(slice.declared)) issues.push(finding('invalid-state', `${spec.id}/${slice.id} has invalid status ${slice.declared}`, { specId: spec.id, taskId: slice.id }));
      if (slice.declared === 'done' && (!slice.proof || /^pending$/i.test(slice.proof))) issues.push(finding('missing-evidence', `${spec.id}/${slice.id} is done without proof`, { specId: spec.id, taskId: slice.id }));
      // A malformed Receipt or an altered earlier row fails closed on read
      // (task-receipt.mjs's own checksum chain); reported here by name so
      // doctor keeps reporting every other spec, slice and scope instead of
      // the raw exception this used to throw straight through the board.
      if (slice.source === 'record') {
        try {
          readReceiptFromFile(slice.record.filePath);
        } catch (error) {
          issues.push(finding('receipt-corrupt', `${spec.id}/${slice.id} Receipt: ${error.message}`, { specId: spec.id, taskId: slice.id }));
        }
      }
    }
    // The selected slice is the first resumable or ready slice; a later slice
    // waiting on its predecessor is ordinary sequencing, not a finding. The
    // rule reads declared status on both sources, so a table-only Spec raises
    // exactly what it raised before. A record declared `blocked` is the same
    // ordinary sequencing, and a record declared `ready` whose live blockers
    // are unmet is the same contradiction a ready row is - so this never
    // fires falsely on a record-backed Spec whose blockers are satisfied.
    const head = slices.find((slice) => ['in-progress', 'ready'].includes(slice.declared));
    if (spec.status === 'active' && head?.declared === 'ready' && !blockersSatisfied(head.blockers, satisfied)) {
      issues.push(finding('blocked-slice', `${spec.id}/${head.id} waits on ${head.blockers}`, { specId: spec.id, taskId: head.id }));
    }
    if (['complete', 'superseded'].includes(spec.status) && slices.some((slice) => slice.declared !== 'done')) {
      issues.push(finding('contradictory-state', `${spec.id} is ${spec.status} with unfinished tasks`, { specId: spec.id }));
    }
    const updated = Date.parse(`${spec.updated}T00:00:00Z`);
    const now = Date.parse(`${options.today ?? today()}T00:00:00Z`);
    if (slices.some((slice) => slice.declared === 'in-progress') && Number.isFinite(updated) && now - updated > 86_400_000) {
      issues.push(finding('stale-claim', `${spec.id} has an in-progress task last updated ${spec.updated}`, { specId: spec.id }));
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
  //
  // A room with an unresolved row/record collision on an active Spec already
  // carries that finding from `packetFindings`; `selectCandidate` refuses to
  // resolve a candidate through it (via `slicesOf`, which throws only for
  // that one reason), and this informational check simply has nothing to
  // report rather than taking the whole doctor run down with it. The guard
  // names that exact condition instead of catching every exception
  // `selectCandidate` could ever raise, so an unrelated bug here still
  // surfaces instead of being read as "no candidate".
  const hasActiveSliceConflict = specs.some((item) => item.status === 'active' && item.sliceConflict);
  const selected = hasActiveSliceConflict ? null : selectCandidate(specs);
  const spec = selected && specs.find((item) => item.id === selected.specId);
  for (const { ref, name } of spec ? refs : []) {
    const status = readAtRef(root, ref, spec.relativePath)?.match(/^\*\*Status:\*\*\s*(\S+)/m)?.[1];
    if (['complete', 'superseded'].includes(status)) {
      return [finding('complete-on-integration', `${spec.id} is ${status} at ${name}; this checkout still carries it ${spec.status}, so fetch or rebase before dispatching ${selected.taskId}`, { specId: spec.id, ref: name })];
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
    const records = listTaskRecords(specDir, root);
    const recordBacked = fs.existsSync(path.join(specDir, 'tasks'));
    const content = options.contentOverrides?.get(filePath) ?? fs.readFileSync(filePath, 'utf8');
    const spec = { ...parseSpecPacket(content, filePath, root, { recordBacked }), specsPrefix, records, recordBacked };
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
// only, which `close` and the Spec's evidence log still own. An unfinished
// retained row is a genuinely broken shape with no recoverable reading, so it
// still fails closed here. A row/record collision on the same id is
// different - the Spec parses fine, the contradiction is only which source to
// believe - so it is recorded on the spec as `sliceConflict` instead of
// thrown here: `slicesOf` refuses to resolve slices through it (which is what
// makes a lifecycle command refuse the spec), while `loadSpecs` itself keeps
// building every other spec so `doctor` can still report on the rest of the
// room. See `packetFindings`'s `row-record-collision` finding.
function assertOneSliceTruth(spec) {
  if (!spec.recordBacked) return;
  const recorded = new Map(spec.records.map((task) => [visibleIdKey(task.id), task.id]));
  for (const row of spec.rows) {
    const collision = recorded.get(visibleIdKey(row.id));
    if (collision) {
      spec.sliceConflict = { id: collision };
      return;
    }
    if (row.status !== 'done') {
      throw new Error(`${spec.id} is record-backed but its slice table still holds the unfinished row ${row.id}; a retained table is completed history only`);
    }
  }
}

// The slices selection, claim, close, render and doctor read: the Task
// records for a record-backed Spec, the embedded table rows otherwise. A
// table slice keeps its cells verbatim, so a table-only room behaves exactly
// as it did before this migration. A spec whose row and record collide on one
// id (`assertOneSliceTruth`) has no single source to resolve, so this refuses
// by name rather than picking a source silently.
function slicesOf(spec) {
  if (spec.sliceConflict) {
    throw new Error(`${spec.id} carries both a slice-table row and a Task record for ${spec.sliceConflict.id}; one Spec has one source of slice truth`);
  }
  if (!spec.recordBacked) {
    return spec.rows.map((row) => ({
      id: row.id,
      slice: row.slice,
      declared: row.status,
      blockerIds: splitBlockers(row.blockers),
      blockers: row.blockers,
      proof: row.proof,
      source: 'table'
    }));
  }
  return spec.records.map((task) => ({
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
    ...spec.rows.filter((row) => row.status === 'done').map((row) => row.id),
    ...spec.records.filter((task) => taskStatus(task) === 'done').map((task) => task.id)
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

// Removes converted rows from the slice table and from nowhere else. A
// `| TK-### |` row also appears in the append-only evidence log, where it is
// frozen history, and may appear in a Spec's prose; a whole-file filter would
// quietly delete those too.
function removeSliceRows(content, ids) {
  const heading = '## Vertical Implementation Slices';
  const start = content.indexOf(heading);
  if (start < 0) throw new Error(`Missing ${heading}`);
  const bodyStart = start + heading.length;
  const nextHeading = content.indexOf('\n## ', bodyStart);
  const end = nextHeading < 0 ? content.length : nextHeading;
  const body = content.slice(bodyStart, end).split('\n').filter((line) => {
    const row = /^\|\s*(TK-[0-9A-Za-z]+)\s*\|/.exec(line);
    return !row || !ids.has(row[1]);
  }).join('\n');
  return `${content.slice(0, bodyStart)}${body}${content.slice(end)}`;
}

function publicSlice(slice) {
  return { id: slice.id, slice: slice.slice, status: slice.declared, blockers: slice.blockers, proof: slice.proof ?? null };
}

function identityFindings(specs) {
  const findings = [];
  const specIds = new Map();
  const globalTasks = new Map();
  for (const spec of specs) {
    const specKey = visibleIdKey(spec.id);
    if (specIds.has(specKey)) findings.push(finding('duplicate-id', `Duplicate spec ID: ${spec.id} conflicts with ${specIds.get(specKey)}`, { specId: spec.id }));
    else specIds.set(specKey, spec.id);
    // Local duplicates are checked per source: two rows sharing an id, or two
    // records sharing an id (already refused earlier by `listTaskRecords`, so
    // this never actually fires for records), are a genuine data error. A row
    // and a record sharing one id is the different, friendlier-named
    // row/record collision `assertOneSliceTruth` already reports as
    // `sliceConflict`; merging the two sources here would report the same
    // coexistence twice, under the wrong name, before that dedicated check
    // ever gets a chance to run.
    for (const source of [spec.rows, spec.records ?? []]) {
      const localTasks = new Map();
      for (const item of source) {
        const key = visibleIdKey(item.id);
        if (localTasks.has(key)) findings.push(finding('duplicate-id', `Duplicate task ID: ${spec.id}/${item.id}`, { specId: spec.id, taskId: item.id }));
        localTasks.set(key, item.id);
      }
    }
    // The global (cross-spec) reservation is deduplicated within this spec
    // first: a letter-bearing id held by both a row and a record here is the
    // row/record collision above, already reported once by name, not a
    // second spec reusing the label. Comparing the raw combined list instead
    // would meet this spec's own id twice and report it as conflicting with
    // itself.
    const idsInSpec = new Map([...spec.rows, ...(spec.records ?? [])].map((item) => [visibleIdKey(item.id), item.id]));
    for (const [key, id] of idsInSpec) {
      if (/^TK-\d+$/.test(id)) continue;
      if (globalTasks.has(key)) findings.push(finding('duplicate-id', `Duplicate task ID: ${spec.id}/${id} conflicts with ${globalTasks.get(key)}`, { specId: spec.id, taskId: id }));
      else globalTasks.set(key, `${spec.id}/${id}`);
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
    // A row/record collision already carries its own `row-record-collision`
    // finding from `packetFindings`; the board falls back to the owner-gate
    // cell here rather than calling `slicesOf` a second time and throwing
    // partway through rendering the rest of the board.
    if (spec.sliceConflict) {
      lines.push(`| [${spec.id}](${spec.relativePath}) | Acceptance / owner gate | ${escapeCell(spec.owner)} | ${escapeCell(spec.blockers)} | ${escapeCell(spec.latestEvent)} | ${escapeCell(spec.nextGate)} |`);
      continue;
    }
    const slices = slicesOf(spec).map((item) => ({ ...item, status: effectiveStatus(item, satisfiedIds(spec, completed)) }));
    // The acceptance line names each *active* Task's own signal, not one
    // slice per Spec: a Spec with more than one in-progress Task lists every
    // one of them (visible-id order), each with its own status and signal,
    // and never mixes in a ready or blocked Task once there is more than
    // one in-progress. A Spec with zero or one in-progress Task keeps the
    // exact single-cell shape this board always rendered.
    const inProgress = slices.filter((item) => item.status === 'in-progress').sort((a, b) => compareVisibleIds(a.id, b.id));
    const task = inProgress[0]
      ?? slices.find((item) => item.status === 'ready')
      ?? slices.find((item) => item.status === 'blocked');
    let slice;
    if (inProgress.length > 1) {
      slice = inProgress.map((item) => {
        const itemSignal = receiptSignal(item);
        return `${item.id}: ${item.slice} (${item.status}${itemSignal ? `; ${itemSignal}` : ''})`;
      }).join('; ');
    } else {
      const signal = task ? receiptSignal(task) : null;
      slice = task ? `${task.id}: ${task.slice} (${task.status}${signal ? `; ${signal}` : ''})` : 'Acceptance / owner gate';
    }
    const blocker = task?.blockers && task.blockers !== 'none' ? task.blockers : spec.blockers;
    lines.push(`| [${spec.id}](${spec.relativePath}) | ${escapeCell(slice)} | ${escapeCell(spec.owner)} | ${escapeCell(blocker)} | ${escapeCell(spec.latestEvent)} | ${escapeCell(spec.nextGate)} |`);
  }
  return lines.join('\n');
}

// The board's derived Receipt signal for one selected Task: the run count
// and the latest run's branch, short SHA (seven characters) and dirty-file
// count - the symptom ADR-000H's "What the board shows" names, never the full
// run table or any Receipt row itself. A table-backed slice carries no
// Receipt at all, and a record with no Receipt rows yet (no run has appended
// one) returns `null` so the board renders exactly as it did before this
// signal existed.
// A malformed Receipt or an altered earlier row (task-receipt.mjs's own
// checksum chain, by design) must never crash the board: `doctor` already
// reports the same condition as `receipt-corrupt` (packetFindings, below),
// so the render path falls back to a `receipt unreadable` marker in place of
// the signal rather than throwing the raw error through `render`/`doctor`.
function receiptSignal(task) {
  if (task.source !== 'record') return null;
  let rows;
  try {
    rows = readReceiptFromFile(task.record.filePath);
  } catch {
    return 'receipt unreadable';
  }
  if (rows.length === 0) return null;
  const latest = rows[rows.length - 1];
  return `runs ${rows.length}, ${latest.branch} @ ${latest.headSha.slice(0, 7)}, dirty ${latest.dirty}`;
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
    tasks: slicesOf(spec).map(publicSlice)
  };
}

// A string replacement expands `$&`, `` $` ``, `$'` and `$$` against the line
// it replaces, so a header value naming one of those literally - `close
// --proof "see $& output"` reaching an evidence-adjacent header field, for
// instance - would corrupt itself. `task-record.mjs`'s `updateTaskFields`
// already uses a function replacer for the same reason (S-00H TK-001); this
// is the matching fix for a Spec's own header fields (S-00H TK-002 remaining
// gap).
function updateFields(content, values) {
  let result = content;
  for (const [name, value] of Object.entries(values)) {
    const pattern = new RegExp(`^\\*\\*${escapeRegExp(name)}:\\*\\*\\s*.+$`, 'm');
    if (!pattern.test(result)) throw new Error(`Missing field: ${name}`);
    result = result.replace(pattern, () => `**${name}:** ${value}`);
  }
  return result;
}

function updateTaskRow(content, taskId, transform) {
  let found = false;
  const updated = content.split('\n').map((line) => {
    if (!line.startsWith(`| ${taskId} |`)) return line;
    found = true;
    return `| ${transform(splitRow(line)).map(escapeCell).join(' | ')} |`;
  }).join('\n');
  if (!found) throw new Error(`Unknown task: ${taskId}`);
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
  else if (command === 'close') result = closeTask(root, id, options);
  else if (command === 'receipt') result = receiptTask(root, id, options);
  else if (command === 'complete') result = completeSpec(root, id, options);
  else if (command === 'convert-tasks') result = convertSpecSlices(root, id, { destinations: options.destinations ? JSON.parse(options.destinations) : undefined });
  else if (command === 'render') result = render(root);
  else if (command === 'doctor') {
    result = doctor(root, options);
    if (blocksSelection(result)) process.exitCode = 1;
  } else {
    throw new Error('Usage: spec-workbench.mjs next|next-id|show|claim|close|receipt|complete|convert-tasks|render|doctor [S-###] [options]');
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
