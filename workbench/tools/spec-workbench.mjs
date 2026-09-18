#!/usr/bin/env node
import { inspectSkills } from './skill-inspection.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { insideWorkTree, managedRuntimeDrift, permissionScopeDrift, permissionScopeMessage, provenanceFindings, readAtRef, resolveBranchRefs, seededDocumentFindings, validateManifest } from './workbench-layout.mjs';
import { isMainModule } from './workbench-paths.mjs';
import { escapeMarkdownTableCell, parseMarkdownTableRow } from './markdown-table.mjs';
import { parseSpecPacket } from './spec-packet.mjs';
import { blocksSelection, describe, finding } from './diagnostics.mjs';
import { assertSafeWritePath, writeSafeFile, collectionPath, declaredGit, lanePath, readManifest } from './workbench-paths.mjs';
import { parseFrontmatter, rewriteAdrLinks, rewriteCanonicalizedIn, splitEvidenceSection, validateAdrs, writeRegister } from './adr.mjs';
import { validateWiki } from './wiki.mjs';
import { allocateVisibleId, compareVisibleIds, visibleIdKey } from './visible-ids.mjs';
import { TASK_LIFECYCLE_FOLDERS, TASK_STATUSES, formatTaskRecord, listRetiredTaskRecords, listTaskRecords, parseTaskRecord, readTaskRecord, taskStatus, unmetBlockers, updateTaskFields } from './task-record.mjs';
import { appendReceiptRow, readReceiptFromFile } from './task-receipt.mjs';
import { assembleSpecReport, formatSpecReport, recordReviewVerdict } from './spec-report.mjs';

// One closed status vocabulary for an execution slice, owned by the record
// reader and re-exported here so the lifecycle commands and the record share
// one set rather than two that can drift apart. TK-001 flagged the duplicate;
// this is the fold it asked for.
export { TASK_STATUSES };
// S-00I TK-004: the Task lifecycle folder set, owned by the record reader
// (task-record.mjs) exactly as `TASK_STATUSES` above is, and re-exported
// here so `move-task`'s CLI and this module's own callers use the one
// closed set rather than a second copy.
export { TASK_LIFECYCLE_FOLDERS };

const SPEC_STATUSES = new Set(['planned', 'active', 'blocked', 'needs-review', 'complete', 'superseded']);
const CATALOG_START = '<!-- spec-catalog:start -->';
const CATALOG_END = '<!-- spec-catalog:end -->';
const HOT_START = '<!-- hot-specs:start -->';
const HOT_END = '<!-- hot-specs:end -->';

// S-00I: the closed set of lifecycle subfolders a Spec directory may move
// into, beneath the specs lane's top level (the active roster `loadSpecs`
// still reads unchanged). ADR-000I reserves permanent `archive` for ADRs
// alone; a Spec and its Tasks are transient working artifacts, so their one
// terminal folder here is the transient `retired` staging area. Adding a
// folder to this set is a lifecycle decision (another ADR), never a silent
// tool change.
export const SPEC_LIFECYCLE_FOLDERS = Object.freeze(['retired']);

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
  // S-00J TK-004: complete refuses without a passed review verdict bound to
  // the Spec's current content digest (spec-report.mjs), naming exactly
  // what is missing. Shared with `gate` through reviewGapReason so the two
  // can never disagree about what "reviewed" means for the same Spec.
  const gapReason = reviewGapReason(assembleSpecReport(rootDir, id));
  if (gapReason) throw new Error(`${id} cannot complete: ${gapReason}`);
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

// S-00J TK-004: the one place "no passed verdict on the current content" is
// diagnosed, shared by `completeSpec` and `gate` so the two can never name
// the gap differently. `report.latestVerdict` is already resolved against
// `report.specDigest` by spec-report.mjs, so this never re-derives digest
// matching itself - only reads what the report already decided. Returns
// `null` when nothing is missing (a passed verdict for the current content
// exists), otherwise a string naming exactly one of: no verdict at all,
// every recorded verdict is for earlier content (a stale digest - the Spec
// has changed since it was reviewed), or the latest verdict for the current
// content is a fail.
function reviewGapReason(report) {
  if (report.verdicts.length === 0) {
    return `no review verdict is recorded for ${report.id}`;
  }
  if (!report.latestVerdict) {
    return `${report.id}'s recorded verdicts are all for earlier content - the current digest ${report.specDigest.slice(0, 12)} matches none of them, so the Spec must be reviewed again`;
  }
  if (report.latestVerdict.result !== 'pass') {
    return `${report.id}'s latest verdict for the current content is fail, recorded ${report.latestVerdict.date} by ${report.latestVerdict.reviewer}`;
  }
  return null;
}

// The Task-PR exemption text is a named constant this room's code carries,
// not a live read of S-00O's own Spec file: it mirrors the exemption 2 text
// recorded in
// workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md ("Bootstrap
// exemptions" - WF-7 deferred, so every Task in this rollout lands as its
// own Task PR straight into `integration` while its Spec stays open). No
// manifest flag exists for exemption 2, so there is nothing to read at
// runtime; this constant is retired (and the Task-PR path removed) once
// Spec-branch tooling lands and ends the exemption.
const TASK_PR_EXEMPTION = 'S-00O exemption 2 (WF-7 deferred): every Task lands as its own Task PR into the integration branch while its Spec stays open, so the gate reports the Spec\'s assembled state rather than refusing it for being incomplete';

// S-00J TK-004: the review gate the harness's own merge-preparation workflow
// requires before branches combine into `integration` (AGENTS.md Branch
// Completion). Binds the harness's own process; it does not and cannot make
// GitHub itself refuse a merge opened by some other path.
//
// The discriminator is what the invoker presents, never which checkout runs
// the command: a Spec ID with a candidate SHA (`--spec S-### --candidate
// <sha>`) is a Spec candidate, refused when the candidate does not exist, the
// assembled Spec is incomplete, or its latest verdict for the current
// content is not a pass. A Task ID with its Spec still open (`--task TK-###
// --spec S-###`) is a Task PR (TASK_PR_EXEMPTION above) and is reported,
// never refused for the Spec's own completeness - but review corrective: it
// is still refused by name when the named Task ID names no record or
// retained row under that Spec at all, or when the Spec is already
// complete (a Task PR is only ever presented while its Spec is open), since
// neither is "the Spec is incomplete", the one thing exemption 2 protects.
//
// The integration branch is resolved through `declaredGit` (workbench-
// paths.mjs), reading `git.integrationBranch` from the manifest, never a
// hardcoded literal; it is carried in the result for the caller to see, and
// is `null` when the manifest declares none.
export function gate(rootDir, options = {}) {
  const root = path.resolve(rootDir);
  const specId = requireValue(options.spec, 'gate requires --spec S-###');
  const taskId = options.task ?? null;
  const integrationBranch = declaredGit(root)?.integrationBranch ?? null;

  if (taskId) {
    const report = assembleSpecReport(root, specId, options.candidate ? { candidate: options.candidate } : {});
    let reason = null;
    if (!report.tasks.some((task) => task.id === taskId)) {
      reason = `No Task record or retained row named ${taskId} exists under ${specId}; a Task PR must name a Task that actually belongs to the Spec it presents.`;
    } else if (report.status === 'complete') {
      reason = `${specId} is already complete; a Task PR is reported only while its Spec is still open (S-00O exemption 2 protects an incomplete Spec, not a closed one).`;
    }
    return {
      mode: 'task-pr',
      taskId,
      specId,
      integrationBranch,
      exemption: TASK_PR_EXEMPTION,
      specComplete: report.complete,
      specDigest: report.specDigest,
      latestVerdict: report.latestVerdict,
      refused: reason !== null,
      reason
    };
  }

  const candidate = requireValue(options.candidate, 'gate --spec requires --candidate <sha>');
  const report = assembleSpecReport(root, specId, { candidate });
  let reason;
  if (!report.candidate.existsInRepository) {
    reason = `Candidate ${candidate} does not exist in this repository; a Spec candidate must bind to a real commit, never an invented or mistyped SHA.`;
  } else if (!report.complete) {
    reason = `${specId} is not complete: ${report.gaps.join('; ')}`;
  } else {
    reason = reviewGapReason(report);
  }
  return {
    mode: 'spec-candidate',
    specId,
    candidate,
    integrationBranch,
    specComplete: report.complete,
    specDigest: report.specDigest,
    latestVerdict: report.latestVerdict,
    refused: reason !== null,
    reason
  };
}

export function render(rootDir) {
  const root = path.resolve(rootDir);
  const specs = loadSpecs(root);
  const retired = loadRetiredSpecs(root);
  const blueprintPath = path.join(root, 'BLUEPRINT.md');
  const taskboardPath = path.join(root, 'TASKBOARD.md');
  const blueprint = fs.readFileSync(blueprintPath, 'utf8');
  const taskboard = fs.readFileSync(taskboardPath, 'utf8');
  if (blueprint.includes(CATALOG_START) || blueprint.includes(CATALOG_END)) {
    // Legacy rooms keep their declared projection until an explicit rebuild.
    atomicWrite(blueprintPath, replaceRegion(blueprint, CATALOG_START, CATALOG_END, renderCatalog(specs, retired)));
  } else {
    const catalogPath = path.join(resolveSpecsRoot(root).specsRoot, 'CATALOG.md');
    assertSafeWritePath(root, catalogPath);
    const relativeCatalog = renderCatalog(specs, retired).replaceAll(`](${resolveSpecsRoot(root).specsPrefix}/`, '](');
    writeSafeFile(root, catalogPath, `# Spec Catalog\n\nDerived from stable specs; includes completed history.\n\n${CATALOG_START}\n${relativeCatalog}\n${CATALOG_END}\n`);
  }
  atomicWrite(taskboardPath, replaceRegion(taskboard, HOT_START, HOT_END, renderHotBoard(specs)));
  return { specs: specs.length, active: specs.filter((spec) => isHot(spec)).length, retired: retired.length };
}

export function doctor(rootDir, options = {}) {
  const root = path.resolve(rootDir);
  const issues = [];
  let specs;
  let retired;
  try {
    specs = loadSpecs(root, { allowDuplicates: true });
    retired = loadRetiredSpecs(root);
  } catch (error) {
    return [finding(['upgrade-required', 'invalid-manifest'].includes(error.code) ? error.code : 'malformed-spec', error.message)];
  }
  issues.push(...packetFindings(specs, options, retired));
  const blueprint = fs.existsSync(path.join(root, 'BLUEPRINT.md')) ? fs.readFileSync(path.join(root, 'BLUEPRINT.md'), 'utf8') : '';
  if (blueprint.includes(CATALOG_START) || blueprint.includes(CATALOG_END)) checkRender(root, 'BLUEPRINT.md', CATALOG_START, CATALOG_END, renderCatalog(specs, retired), issues);
  else checkRender(root, path.relative(root, path.join(resolveSpecsRoot(root).specsRoot, 'CATALOG.md')), CATALOG_START, CATALOG_END, renderCatalog(specs, retired).replaceAll(`](${resolveSpecsRoot(root).specsPrefix}/`, ']('), issues);
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

function packetFindings(specs, options = {}, retiredSpecs = []) {
  const issues = [];
  issues.push(...identityFindings(specs, retiredSpecs));
  // S-00I TK-003: a retired Spec is outside ordinary selection, so it gets
  // only the two checks that matter once a record is out of the active
  // roster - its id cannot be reused (folded into identityFindings above,
  // which already saw both arrays) and its own path must be stable for the
  // folder it actually lives in - plus the one retirement-specific fact
  // nothing else surfaces: a retired Spec whose own header still disagrees
  // that it is complete. None of the active-roster checks below (slice
  // status, blockers, stale-claim, broken-link) apply to a Spec `next`,
  // `claim` and `render` never see again.
  for (const spec of retiredSpecs) {
    if (!spec.relativePath.startsWith(`${spec.specsPrefix}/${spec.lifecycleFolder}/${spec.id}-`)) {
      issues.push(finding('unstable-path', `${spec.id} path must start ${spec.specsPrefix}/${spec.lifecycleFolder}/${spec.id}-`, { specId: spec.id }));
    }
    if (spec.status !== 'complete') {
      issues.push(finding('retired-not-complete', `${spec.id} is retired in ${spec.lifecycleFolder}/ but its Status is ${spec.status}, not complete`, { specId: spec.id }));
    }
  }
  // S-00I TK-004: the Task analogue of the retired-Spec check above, run over
  // every Spec (active roster and retired alike, since a Spec can retire its
  // own Tasks individually before or independently of its own retirement).
  // `retiredRecords` is never read by `slicesOf`, so this is the one place a
  // retired Task's own disagreeing Status becomes visible.
  for (const spec of [...specs, ...retiredSpecs]) {
    for (const task of spec.retiredRecords ?? []) {
      if (taskStatus(task) !== 'done') {
        issues.push(finding('retired-task-not-done', `${spec.id}/${task.id} is retired in tasks/${task.lifecycleFolder}/ but its Status is ${taskStatus(task)}, not done`, { specId: spec.id, taskId: task.id }));
      }
    }
  }
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

// `loadSpecs`, `slicesOf` and `findSpec` (below) are exported so a separate
// reader - S-00J TK-001's assembled-Spec report - composes this module's own
// parsing and one-slice-truth resolution rather than reimplementing it. No
// lifecycle command in this file changed to use a different reading path.
export function loadSpecs(rootDir, options = {}) {
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
    // S-00I TK-004: a Task's own historical route, read alongside the active
    // roster exactly as `loadRetiredSpecs` reads a Spec's - never merged into
    // `records`, so `slicesOf` (selection, claim, close, render, the hot
    // board) never sees a retired Task, while identity checks and `show`
    // still can.
    const retiredRecords = listRetiredTaskRecords(specDir, root);
    const recordBacked = fs.existsSync(path.join(specDir, 'tasks'));
    const content = options.contentOverrides?.get(filePath) ?? fs.readFileSync(filePath, 'utf8');
    const spec = { ...parseSpecPacket(content, filePath, root, { recordBacked }), specsPrefix, records, retiredRecords, recordBacked };
    assertOneSliceTruth(spec);
    return spec;
  });
  if (!options.allowDuplicates) {
    const collision = identityFindings(specs)[0];
    if (collision) throw new Error(collision.message);
  }
  return specs;
}

// S-00I TK-003: the explicit historical route. `loadSpecs` above deliberately
// keeps reading only the top level - the active roster `next`, `claim`,
// `render` and the hot board select from - so a retired Spec never re-enters
// selection through a shared reading path. This is the one other place a
// retired Spec is read from, for `findSpec`/`show` and for doctor's identity
// and retired-status checks. It mirrors `loadSpecs`'s own directory scan,
// rooted one level deeper under each folder in `SPEC_LIFECYCLE_FOLDERS`, and
// returns `[]` for a room that has never retired anything rather than
// treating an absent `retired/` directory as an error.
export function loadRetiredSpecs(rootDir) {
  const root = path.resolve(rootDir);
  const { specsRoot, specsPrefix } = resolveSpecsRoot(root);
  const specs = [];
  for (const folder of SPEC_LIFECYCLE_FOLDERS) {
    const folderRoot = path.join(specsRoot, folder);
    if (!fs.existsSync(folderRoot)) continue;
    const paths = [];
    for (const entry of fs.readdirSync(folderRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const filePath = path.join(folderRoot, entry.name, 'SPEC.md');
      if (fs.existsSync(filePath)) paths.push(filePath);
    }
    for (const filePath of paths.sort()) {
      const specDir = path.dirname(filePath);
      const records = listTaskRecords(specDir, root);
      const retiredRecords = listRetiredTaskRecords(specDir, root);
      const recordBacked = fs.existsSync(path.join(specDir, 'tasks'));
      const content = fs.readFileSync(filePath, 'utf8');
      const spec = { ...parseSpecPacket(content, filePath, root, { recordBacked }), specsPrefix, records, retiredRecords, recordBacked, lifecycleFolder: folder };
      assertOneSliceTruth(spec);
      specs.push(spec);
    }
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
  // S-00I TK-004: a retired Task record still holds its id against a retained
  // row claiming the same identifier - the row/record collision this
  // function already refuses, extended to the historical route so an id
  // cannot be reused once its Task has retired.
  const retired = new Map((spec.retiredRecords ?? []).map((task) => [visibleIdKey(task.id), task.id]));
  for (const row of spec.rows) {
    const collision = recorded.get(visibleIdKey(row.id)) ?? retired.get(visibleIdKey(row.id));
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
export function slicesOf(spec) {
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

// S-00I TK-004: a retired Task record, shaped like `publicSlice` above but
// read straight off the record (there is no "slice" resolution for it - a
// retired Task is out of `slicesOf` entirely). Kept under its own key on
// `show`'s output, never folded into `tasks`, so a retired Task cannot be
// mistaken for one still on the active roster.
function publicRetiredTask(task) {
  return {
    id: task.id,
    slice: task.slice,
    status: taskStatus(task),
    blockers: task.blockers.length > 0 ? task.blockers.join(', ') : 'none',
    proof: task.proof ?? null
  };
}

// S-00I TK-003: `retiredSpecs` (default `[]`) joins the same identity checks
// as the active roster, so a retired Spec still holds its id against reuse
// and a retired Task still holds its id against a new Spec claiming it -
// `loadSpecs`'s own duplicate guard above calls this with one argument and
// is unaffected.
function identityFindings(specs, retiredSpecs = []) {
  const findings = [];
  const specIds = new Map();
  const globalTasks = new Map();
  for (const spec of [...specs, ...retiredSpecs]) {
    const specKey = visibleIdKey(spec.id);
    if (specIds.has(specKey)) findings.push(finding('duplicate-id', `Duplicate spec ID: ${spec.id} conflicts with ${specIds.get(specKey)}`, { specId: spec.id }));
    else specIds.set(specKey, spec.id);
    // Local duplicates are checked per source: two rows sharing an id, two
    // records sharing an id, or two retired records sharing an id (each
    // already refused earlier by `listTaskRecords`/`listRetiredTaskRecords`,
    // so this never actually fires within one of those three), are a
    // genuine data error. A row and a record sharing one id is the
    // different, friendlier-named row/record collision `assertOneSliceTruth`
    // already reports as `sliceConflict`; merging the sources here would
    // report the same coexistence twice, under the wrong name, before that
    // dedicated check ever gets a chance to run.
    for (const source of [spec.rows, spec.records ?? [], spec.retiredRecords ?? []]) {
      const localTasks = new Map();
      for (const item of source) {
        const key = visibleIdKey(item.id);
        if (localTasks.has(key)) findings.push(finding('duplicate-id', `Duplicate task ID: ${spec.id}/${item.id}`, { specId: spec.id, taskId: item.id }));
        localTasks.set(key, item.id);
      }
    }
    // S-00I TK-004: an id held by an active record AND its own Spec's
    // `retiredRecords` is a genuine reuse - a retired Task's id must never
    // reappear on the active roster, so this is reported by the same name
    // as any other duplicate rather than a bespoke "reused" finding.
    const activeIds = new Set((spec.records ?? []).map((item) => visibleIdKey(item.id)));
    for (const task of spec.retiredRecords ?? []) {
      const key = visibleIdKey(task.id);
      if (activeIds.has(key)) findings.push(finding('duplicate-id', `Duplicate task ID: ${spec.id}/${task.id} is both active and retired`, { specId: spec.id, taskId: task.id }));
    }
    // The global (cross-spec) reservation is deduplicated within this spec
    // first: a letter-bearing id held by both a row and a record here is the
    // row/record collision above, already reported once by name, not a
    // second spec reusing the label. Comparing the raw combined list instead
    // would meet this spec's own id twice and report it as conflicting with
    // itself. Retired records join the same reservation, so a different Spec
    // (or this one, later) cannot claim an id this Spec already retired.
    const idsInSpec = new Map([...spec.rows, ...(spec.records ?? []), ...(spec.retiredRecords ?? [])].map((item) => [visibleIdKey(item.id), item.id]));
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

// S-00I TK-003: `retired` (default `[]`) is what keeps `CATALOG.md`'s claim
// to "include completed history" true once a completed Spec's directory
// leaves the top level - `loadSpecs` never returns it, so the main table
// above can no longer name it. A separate heading, populated only when a
// room has actually retired something, names each one by its historical
// route instead; an empty `retired` list renders no heading at all, so a
// room that has never retired a Spec gets byte-identical output to before
// this heading existed.
function renderCatalog(specs, retired = []) {
  const lines = [
    '| Spec | Description | Status |',
    '|---|---|---|'
  ];
  for (const spec of specs.sort((a, b) => compareVisibleIds(a.id, b.id))) {
    lines.push(`| [${spec.id} - ${escapeCell(spec.title)}](${spec.relativePath}) | ${escapeCell(spec.description)} | ${escapeCell(spec.status)} |`);
  }
  if (specs.length === 0) lines.push('| none | No specs recorded yet. | n/a |');
  if (retired.length > 0) {
    lines.push('', '### Retired', '', 'Reconciled into durable owners and moved out of ordinary discovery; still reachable by their historical route.', '', '| Spec | Description | Historical route |', '|---|---|---|');
    for (const spec of retired.slice().sort((a, b) => compareVisibleIds(a.id, b.id))) {
      lines.push(`| ${spec.id} - ${escapeCell(spec.title)} | ${escapeCell(spec.description)} | [${spec.relativePath}](${spec.relativePath}) |`);
    }
  }
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

// The active roster is tried first, unchanged; a retired Spec is reachable
// only once nothing in the active roster claims the id, so a retired id can
// never shadow a live one. `show` is this function's only caller, which is
// how S-00I TK-003 satisfies "show finds a retired Spec by an explicit
// historical route" without changing what `next`, `claim` or `render` see.
export function findSpec(rootDir, id) {
  const matches = loadSpecs(rootDir).filter((spec) => spec.id === id);
  if (matches.length > 1) throw new Error(`Duplicate spec ID: ${id}`);
  if (matches.length === 1) return matches[0];
  const retired = loadRetiredSpecs(rootDir).filter((spec) => spec.id === id);
  if (retired.length > 1) throw new Error(`Duplicate spec ID: ${id}`);
  if (retired.length === 1) return retired[0];
  throw new Error(`Unknown spec ID: ${id}`);
}

// Every live Markdown surface a Spec move must repair a reference in: the
// same external classes TK-002's ADR migration rewrote (root controls, the
// Wiki, `skills/`, `team templates/`), plus the ADR collection itself - an
// accepted ADR naming a live Spec path is exactly the reference class this
// Spec's own Decisions section names for ADRs, the inverse direction - and
// every Spec's `SPEC.md` and standalone `tasks/**/TASK.md` Task record,
// walked recursively so a nested lifecycle folder (an already-retired Spec,
// or its own already-retired Task) is covered without a second walker.
// `excludeDir`, when given, drops anything already under a directory the
// caller is handling separately (the Spec directory that is itself moving).
function collectSpecReferenceFiles(root, excludeDir) {
  const files = [];
  for (const name of ['AGENTS.md', 'RUNBOOK.md', 'LEXICON.md', 'BLUEPRINT.md', 'TASKBOARD.md', 'README.md', 'CLAUDE.md']) {
    const file = path.join(root, name);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) files.push(file);
  }
  const walk = (dir, match) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, match);
      else if (entry.isFile() && match(entry.name)) files.push(full);
    }
  };
  walk(path.join(root, 'workbench', 'wiki'), (name) => name.endsWith('.md'));
  walk(path.join(root, 'skills'), (name) => name.endsWith('.md'));
  walk(path.join(root, 'team templates'), (name) => name.endsWith('.md'));
  walk(path.join(root, 'workbench', 'docs', 'adr'), (name) => name.endsWith('.md'));
  walk(resolveSpecsRoot(root).specsRoot, (name) => name === 'SPEC.md' || name === 'TASK.md');
  const seen = new Set();
  return files.filter((file) => {
    if (excludeDir && (file === excludeDir || file.startsWith(excludeDir + path.sep))) return false;
    if (seen.has(file)) return false;
    seen.add(file);
    return true;
  });
}

// Every ordinary file beneath `dir`, recursively, as absolute paths. Used to
// snapshot a Spec directory's contents before it moves, so the move can build
// an old-path -> new-path map for every file it carries, not only `SPEC.md`.
function collectDirectoryFiles(dir) {
  const files = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) files.push(full);
    }
  };
  walk(dir);
  return files;
}

// Rewrites one file in place against `locations` (old absolute path -> new
// absolute path, and - critically - every entry that did NOT move mapped to
// itself, exactly as TK-002's own `locations` map does), protecting its
// Append-Only Evidence And Execution Log (a Spec's own frozen history)
// exactly as TK-002 protects the same heading: the section is carried
// through untouched, its own link matches are counted as `historical` rather
// than rewritten, and the file is only written back when a live match
// outside that section actually changed. Also rewrites a
// `canonicalized_in` frontmatter target (an ADR-only fact, harmless to check
// on any other file since it is a no-op without frontmatter). Reused for
// both halves of a Spec move - the moved files' own outgoing links, and
// every external file's incoming ones - so the two passes cannot drift
// apart. Mapping only the moving files, and leaving every unmoved target out
// of `locations`, was corrective review finding 1: a moved file's own
// outgoing link to an unmoved sibling still needs its relative depth
// recomputed (the moved file sits one folder deeper now), and
// `rewriteAdrLinks` can only do that when the unmoved target is in the map,
// mapped to itself.
function rewriteReferenceFile(root, filePath, oldDir, newDir, locations, totals) {
  const original = fs.readFileSync(filePath, 'utf8');
  const { prefix, evidence, suffix } = splitEvidenceSection(original);
  const canonicalized = rewriteCanonicalizedIn(prefix, root, locations);
  const rewrittenPrefix = rewriteAdrLinks(canonicalized.content, oldDir, newDir, locations);
  const rewrittenSuffix = rewriteAdrLinks(suffix, oldDir, newDir, locations);
  const skippedInEvidence = rewriteAdrLinks(evidence, oldDir, newDir, locations).count;
  const relative = path.relative(root, filePath).split(path.sep).join('/');
  if (skippedInEvidence > 0) totals.historicalReferencesLeft[relative] = (totals.historicalReferencesLeft[relative] ?? 0) + skippedInEvidence;
  const rewritten = rewrittenPrefix.count + rewrittenSuffix.count + canonicalized.count;
  if (rewritten > 0) {
    const finalContent = rewrittenPrefix.content + evidence + rewrittenSuffix.content;
    assertSafeWritePath(root, filePath);
    writeSafeFile(root, filePath, finalContent);
    totals.referencesRewritten[relative] = (totals.referencesRewritten[relative] ?? 0) + rewritten;
  }
}

// S-00I TK-003: moves a completed Spec's whole directory (Task records and
// all) from the top level into a `SPEC_LIFECYCLE_FOLDERS` folder, with `git
// mv` semantics, and repairs every live Markdown reference the move would
// otherwise dangle - reusing TK-002's own rewriter (`rewriteAdrLinks`,
// `splitEvidenceSection`, and now `rewriteCanonicalizedIn`) rather than a
// second implementation. Refuses a dirty working tree (the moved candidate
// must be reviewable as the rename it produces), a Spec that is not
// `complete` (only reconciled work retires), a folder outside the closed
// set, or a room with no Git working tree at all - corrective review finding
// 3: a move outside Git cannot be recovered, unlike the ADR migration this
// reuses, which supports a non-Git room because a whole-file rename there is
// otherwise reversible by hand; a Spec move also rewrites content, which is
// not. Moves no other Spec, and never touches `archive`, which ADR-000I
// reserves for ADRs alone.
//
// S-00I TK-004 decision: a Spec whose own Task records are not yet
// individually retired is NOT refused here. `git mv` already carries the
// whole directory - `tasks/`, any Task still on its own active roster, and
// any Task already under its own `tasks/retired/` - to the Spec's new
// location in one move, and the reference rewrite below repairs every live
// link either kind of Task record carries, exactly as it already did for
// TK-003's own record-backed fixture. Retiring a Spec's Tasks individually
// first (`moveTaskRecord`) is ordinary practice under WF-8E, never a
// precondition this seam enforces: the alternative (refusing the Spec move
// while any Task is unretired) would make `move-task` before `move-spec` a
// second implicit rule this file must remember to check, for no reachability
// this move does not already provide on its own.
export function moveSpecDirectory(rootDir, specId, folder) {
  const root = path.resolve(rootDir);
  if (!SPEC_LIFECYCLE_FOLDERS.includes(folder)) {
    throw new Error(`move-spec refuses folder "${folder}"; the closed set is ${SPEC_LIFECYCLE_FOLDERS.join(', ')}`);
  }
  const specs = loadSpecs(root);
  const matches = specs.filter((item) => item.id === specId);
  if (matches.length > 1) throw new Error(`Duplicate spec ID: ${specId}`);
  if (matches.length === 0) {
    const alreadyRetired = loadRetiredSpecs(root).some((item) => item.id === specId);
    throw new Error(alreadyRetired ? `${specId} is already retired` : `Unknown spec ID: ${specId}`);
  }
  const spec = matches[0];
  if (spec.status !== 'complete') {
    throw new Error(`${specId} is ${spec.status}, not complete; only a completed Spec may move to ${folder}`);
  }
  const gitStatus = spawnSync('git', ['-C', root, 'status', '--porcelain'], { encoding: 'utf8' });
  if (gitStatus.status !== 0) {
    throw new Error('move-spec requires a Git working tree so the move is recoverable; none was found');
  }
  if (gitStatus.stdout.trim() !== '') {
    throw new Error('move-spec refuses a dirty working tree; commit or stash first so the candidate shows only this move');
  }
  const { specsRoot, specsPrefix } = resolveSpecsRoot(root);
  const oldSpecDir = path.dirname(spec.filePath);
  if (path.dirname(oldSpecDir) !== specsRoot) {
    throw new Error(`${specId} is not at the top level of ${specsPrefix}; move-spec only moves an active-roster Spec`);
  }
  const destinationRoot = path.join(specsRoot, folder);
  const newSpecDir = path.join(destinationRoot, path.basename(oldSpecDir));
  if (fs.existsSync(newSpecDir)) throw new Error(`move-spec destination already exists: ${path.relative(root, newSpecDir)}`);

  // Snapshot every file the move carries before touching the filesystem;
  // `oldSpecDir` will not exist once the directory itself has moved.
  const movingFiles = collectDirectoryFiles(oldSpecDir);

  fs.mkdirSync(destinationRoot, { recursive: true });
  const moveResult = spawnSync('git', ['-C', root, 'mv', path.relative(root, oldSpecDir), path.relative(root, newSpecDir)], { encoding: 'utf8' });
  if (moveResult.status !== 0) throw new Error(`git mv failed for ${specId}: ${(moveResult.stderr || moveResult.stdout || '').trim()}`);

  // Corrective review finding 1: `locations` must carry every reference
  // target this move can touch, not only the ones that are moving - a moved
  // file's own outgoing link to an unmoved sibling Spec or ADR still needs
  // its relative path recomputed, because the moved file itself now sits one
  // folder deeper. `collectSpecReferenceFiles` is called once, after the
  // move, excluding the Spec's own new directory (its files are mapped
  // old-path -> new-path immediately below, not to themselves).
  const locations = new Map();
  for (const file of collectSpecReferenceFiles(root, newSpecDir)) {
    locations.set(file, file);
  }
  for (const file of movingFiles) {
    locations.set(file, path.join(newSpecDir, path.relative(oldSpecDir, file)));
  }

  const totals = { referencesRewritten: {}, historicalReferencesLeft: {} };
  for (const oldFile of movingFiles) {
    const newFile = locations.get(oldFile);
    if (!newFile.endsWith('.md')) continue;
    rewriteReferenceFile(root, newFile, path.dirname(oldFile), path.dirname(newFile), locations, totals);
  }
  for (const file of collectSpecReferenceFiles(root, newSpecDir)) {
    rewriteReferenceFile(root, file, path.dirname(file), path.dirname(file), locations, totals);
  }

  // Corrective review finding 1 (second round): REGISTER.md and HISTORY.md
  // echo every ADR's canonicalized_in targets as bare comma-separated table
  // text, which the rewrite passes above never touch (they rewrite Markdown
  // links and frontmatter, not a derived projection's own generated cells).
  // The move just rewrote at least one ADR's canonicalized_in above, so the
  // projections are now stale by construction; regenerate them here, from
  // the corrected frontmatter now on disk, rather than leaving that for a
  // separate `adr register` call the move's own candidate would otherwise
  // need. A room with no ADR collection at all is left alone - nothing here
  // may conjure one into existence.
  if (fs.existsSync(collectionPath(root, 'adr'))) writeRegister(root);

  // Corrective review finding 3: `git mv` already stages the rename; leaving
  // the content rewrites above unstaged would show the candidate as a mix
  // (staged rename, unstaged edits) rather than one reviewable change. Stage
  // everything instead of leaving everything unstaged, because the dirty-tree
  // refusal above already guarantees that anything unstaged at this point is
  // exactly what this move just produced - nothing pre-existing can be swept
  // in by a wide `add`.
  spawnSync('git', ['-C', root, 'add', '-A']);

  return {
    specId,
    folder,
    from: path.relative(root, oldSpecDir).split(path.sep).join('/'),
    to: path.relative(root, newSpecDir).split(path.sep).join('/'),
    usesGit: true,
    referencesRewritten: totals.referencesRewritten,
    historicalReferencesLeft: totals.historicalReferencesLeft
  };
}

// S-00I TK-004: moves one done Task's own directory (`<specDir>/tasks/<id>`)
// into a `TASK_LIFECYCLE_FOLDERS` folder beneath the same `tasks/`, with
// `git mv` semantics, reusing exactly the reference-repair machinery
// `moveSpecDirectory` above uses (`collectSpecReferenceFiles`,
// `rewriteReferenceFile`, the same old-path -> new-path `locations` map
// discipline, including every unmoved target mapped to itself so the moved
// record's own outgoing links are recomputed for its new depth). It never
// moves the owning Spec, and it never carries a second Task with it - the
// unit that moves is the one Task directory. Refuses:
//   - a folder outside the closed set (`archive` is ADR-only, ADR-000I);
//   - an unknown Spec or Task id, and a Task already retired;
//   - a Task that is not `done` (only reconciled work retires, exactly as
//     `moveSpecDirectory` refuses an incomplete Spec);
//   - a dirty working tree (the moved candidate must be reviewable as the
//     rename it produces) or a room with no Git working tree at all (an
//     unrecoverable move, exactly as `moveSpecDirectory` refuses one);
//   - a Task whose Receipt carries no run AND whose Proof field is empty
//     (both absent, not either alone) - "nothing to carry" into its own
//     historical record, the Task analogue of refusing an incomplete Spec.
export function moveTaskRecord(rootDir, specId, taskId, folder) {
  const root = path.resolve(rootDir);
  if (!TASK_LIFECYCLE_FOLDERS.includes(folder)) {
    throw new Error(`move-task refuses folder "${folder}"; the closed set is ${TASK_LIFECYCLE_FOLDERS.join(', ')}`);
  }
  const spec = findSpec(root, specId);
  const activeTask = (spec.records ?? []).find((task) => task.id === taskId);
  if (!activeTask) {
    const alreadyRetired = (spec.retiredRecords ?? []).some((task) => task.id === taskId);
    throw new Error(alreadyRetired ? `${specId}/${taskId} is already retired` : `Unknown Task ID: ${specId}/${taskId}`);
  }
  if (taskStatus(activeTask) !== 'done') {
    throw new Error(`${specId}/${taskId} is ${taskStatus(activeTask)}, not done; only a done Task may move to ${folder}`);
  }
  const gitStatus = spawnSync('git', ['-C', root, 'status', '--porcelain'], { encoding: 'utf8' });
  if (gitStatus.status !== 0) {
    throw new Error('move-task requires a Git working tree so the move is recoverable; none was found');
  }
  if (gitStatus.stdout.trim() !== '') {
    throw new Error('move-task refuses a dirty working tree; commit or stash first so the candidate shows only this move');
  }
  // "Nothing to carry": a Receipt with no run AND an empty Proof field
  // together mean this Task's own record holds no evidence a later reader
  // could rely on - the retirement move exists to relocate reconciled work,
  // not to hide an unproven one behind a historical-looking path. Either
  // half alone is still evidence: a long Proof with zero Receipt rows is the
  // real room's ordinary shape for a Task that predates Receipts (e.g.
  // S-00H/TK-003), and a Receipt run with no Proof field is still a run
  // record. Only refuse when both halves are absent.
  let receiptRows;
  try {
    receiptRows = readReceiptFromFile(activeTask.filePath);
  } catch (error) {
    throw new Error(`${specId}/${taskId} Receipt could not be read: ${error.message}`);
  }
  if (!activeTask.proof && receiptRows.length === 0) {
    throw new Error(`${specId}/${taskId} has no Receipt run and no Proof to carry; move-task refuses a Task with nothing to carry`);
  }
  const specDir = path.dirname(spec.filePath);
  const tasksDir = path.join(specDir, 'tasks');
  const oldTaskDir = path.dirname(activeTask.filePath);
  if (path.dirname(oldTaskDir) !== tasksDir) {
    throw new Error(`${specId}/${taskId} is not at the top level of tasks/; move-task only moves an active-roster Task`);
  }
  const destinationRoot = path.join(tasksDir, folder);
  const newTaskDir = path.join(destinationRoot, path.basename(oldTaskDir));
  if (fs.existsSync(newTaskDir)) throw new Error(`move-task destination already exists: ${path.relative(root, newTaskDir)}`);

  // Snapshot every file the move carries before touching the filesystem;
  // `oldTaskDir` will not exist once the directory itself has moved.
  const movingFiles = collectDirectoryFiles(oldTaskDir);

  fs.mkdirSync(destinationRoot, { recursive: true });
  const moveResult = spawnSync('git', ['-C', root, 'mv', path.relative(root, oldTaskDir), path.relative(root, newTaskDir)], { encoding: 'utf8' });
  if (moveResult.status !== 0) throw new Error(`git mv failed for ${specId}/${taskId}: ${(moveResult.stderr || moveResult.stdout || '').trim()}`);

  const locations = new Map();
  for (const file of collectSpecReferenceFiles(root, newTaskDir)) {
    locations.set(file, file);
  }
  for (const file of movingFiles) {
    locations.set(file, path.join(newTaskDir, path.relative(oldTaskDir, file)));
  }

  const totals = { referencesRewritten: {}, historicalReferencesLeft: {} };
  for (const oldFile of movingFiles) {
    const newFile = locations.get(oldFile);
    if (!newFile.endsWith('.md')) continue;
    rewriteReferenceFile(root, newFile, path.dirname(oldFile), path.dirname(newFile), locations, totals);
  }
  for (const file of collectSpecReferenceFiles(root, newTaskDir)) {
    rewriteReferenceFile(root, file, path.dirname(file), path.dirname(file), locations, totals);
  }

  // Corrective review finding 2 (S-00I TK-004 review): mirror
  // `moveSpecDirectory`'s own regeneration above - a Task's canonicalized_in
  // frontmatter target can be rewritten by the pass above too (an ADR can
  // name a Task path), which leaves REGISTER.md's derived projection stale
  // by construction exactly as a Spec move does. A room with no ADR
  // collection at all is left alone.
  // Corrective review finding 2 (S-00I TK-004 review): mirror
  // `moveSpecDirectory`'s own regeneration above - a Task's canonicalized_in
  // frontmatter target can be rewritten by the pass above too (an ADR can
  // name a Task path), which leaves REGISTER.md's derived projection stale
  // by construction exactly as a Spec move does. A room with no ADR
  // collection at all is left alone.
  if (fs.existsSync(collectionPath(root, 'adr'))) writeRegister(root);

  // Corrective review finding 3 from TK-003, reused unchanged here: `git mv`
  // already stages the rename; stage the content rewrites above too, so the
  // candidate shows one reviewable move rather than a mix of staged and
  // unstaged changes.
  spawnSync('git', ['-C', root, 'add', '-A']);

  return {
    specId,
    taskId,
    folder,
    from: path.relative(root, oldTaskDir).split(path.sep).join('/'),
    to: path.relative(root, newTaskDir).split(path.sep).join('/'),
    usesGit: true,
    referencesRewritten: totals.referencesRewritten,
    historicalReferencesLeft: totals.historicalReferencesLeft
  };
}

// S-00I TK-005: reconciles a completed Spec's surviving current claims into
// their named durable owner (a Wiki capability record - `wiki.mjs`'s own
// `copied-task-state` and property validation is the enforcement, never
// re-implemented here) and then retires the whole Spec directory (its Tasks
// travel with it, per the TK-004 decision `moveSpecDirectory` already
// implements) with `moveSpecDirectory`, cleans up the contained branches its
// Tasks' Receipt rows name, and appends one evidence row naming the move.
//
// Every precondition below is refused by name before any write:
//   - the Spec must exist on the active roster (never already retired, never
//     unknown, never a duplicate id - the same three-way check
//     `moveSpecDirectory` makes, run here first so a Wiki-note problem is
//     never reported before a more basic identity problem);
//   - `spec.status` must be `complete`;
//   - `assembleSpecReport`'s own `gaps` (S-00J TK-001) must be empty - this
//     is the one seam that already names an unfinished Task record (active,
//     retained-row or already-retired alike), an unchecked acceptance line,
//     and a missing or placeholder Completion Result, so this function does
//     not re-derive any of those three itself and cannot drift from what
//     `report`/`gate` already call complete;
//   - the named Wiki note must exist under the Wiki lane, declare `type`
//     design-concept or guidebook and `knowledge_role` canonical or curated,
//     name this Spec's own post-retirement historical route in its
//     `source_paths`, and pass `validateWiki` with no `copied-task-state` or
//     `invalid-note` finding against it - "transform, never copy" is
//     `wiki.mjs`'s own enforcement, checked here rather than duplicated.
//
// Owner approval: at this room's pre anchor, `spec-report.mjs` exports no
// `recordOwnerApproval` (grep confirms it; the sibling S-00J TK-005 lane
// owns adding it). Per the lane handoff's named fallback for exactly this
// case, retirement here gates on `complete` only, and the receipt records
// which case applied rather than silently assuming the gate exists.
//
// Order of operations, and why it is not the reverse of the evidence row's
// own wording ("before the move so the row travels with it"): the branch
// names a Task's Receipt carries are read from the Spec's *pre-move* records
// (their files stop existing at the old path once the directory moves), so
// they must be gathered first regardless. The evidence row's own two derived
// cells - the real count of references the move rewrote, and which branches
// actually proved contained - can only be known once `moveSpecDirectory` and
// the branch cleanup have actually run. Nothing is committed by this
// function (matching `moveSpecDirectory`'s own contract): the move, the
// evidence-row write and `render`'s own output are all staged together by
// the final `git add -A`, so from the git history the row still "travels
// with" the move - both land in the one commit the caller makes from this
// function's staged result, exactly as a supported move already left for its
// caller to commit.
export function retireSpec(rootDir, specId, options = {}) {
  const root = path.resolve(rootDir);
  const wikiNoteGiven = requireValue(options.wikiNote, 'retire-spec requires --wiki <note path>');

  const activeMatches = loadSpecs(root).filter((item) => item.id === specId);
  if (activeMatches.length > 1) throw new Error(`Duplicate spec ID: ${specId}`);
  if (activeMatches.length === 0) {
    const alreadyRetired = loadRetiredSpecs(root).some((item) => item.id === specId);
    throw new Error(alreadyRetired ? `${specId} is already retired` : `Unknown spec ID: ${specId}`);
  }
  const spec = activeMatches[0];
  if (spec.status !== 'complete') {
    throw new Error(`${specId} is ${spec.status}, not complete; only a completed Spec may be retired`);
  }
  const report = assembleSpecReport(root, specId);
  if (report.gaps.length > 0) {
    throw new Error(`${specId} is not ready to retire: ${report.gaps.join('; ')}`);
  }

  const folder = SPEC_LIFECYCLE_FOLDERS[0];
  const { specsPrefix } = resolveSpecsRoot(root);
  const specBasename = path.basename(path.dirname(spec.filePath));
  const historicalRoute = `${specsPrefix}/${folder}/${specBasename}/SPEC.md`;

  const wikiRoot = lanePath(root, 'wiki');
  const wikiNoteAbsolute = path.resolve(root, wikiNoteGiven);
  if (!wikiNoteAbsolute.startsWith(wikiRoot + path.sep)) {
    throw new Error(`--wiki ${wikiNoteGiven} must name a note under the Wiki lane; a Spec cannot retire without a durable owner there`);
  }
  const wikiNoteRelative = path.relative(root, wikiNoteAbsolute).split(path.sep).join('/');
  if (!fs.existsSync(wikiNoteAbsolute) || !fs.statSync(wikiNoteAbsolute).isFile()) {
    throw new Error(`retire-spec found no Wiki note at ${wikiNoteRelative}; ${specId}'s surviving claims name no durable owner`);
  }
  const wikiNoteContent = fs.readFileSync(wikiNoteAbsolute, 'utf8');
  const wikiFrontmatter = parseFrontmatter(wikiNoteContent).data;
  if (!wikiFrontmatter) {
    throw new Error(`${wikiNoteRelative} has no frontmatter; it cannot be ${specId}'s durable owner`);
  }
  if (!['design-concept', 'guidebook'].includes(wikiFrontmatter.type)) {
    throw new Error(`${wikiNoteRelative} must declare type design-concept or guidebook to retire ${specId}, found ${wikiFrontmatter.type ?? 'none'}`);
  }
  if (!['canonical', 'curated'].includes(wikiFrontmatter.knowledge_role)) {
    throw new Error(`${wikiNoteRelative} must declare knowledge_role canonical or curated to retire ${specId}, found ${wikiFrontmatter.knowledge_role ?? 'none'}`);
  }
  const sourcePaths = Array.isArray(wikiFrontmatter.source_paths) ? wikiFrontmatter.source_paths : [];
  if (!sourcePaths.includes(historicalRoute)) {
    throw new Error(`${wikiNoteRelative} source_paths must name ${specId}'s historical route ${historicalRoute}; found ${sourcePaths.join(', ') || 'none'}`);
  }
  const wikiFindings = validateWiki(root, { contentOverrides: new Map([[wikiNoteAbsolute, wikiNoteContent]]) })
    .filter((item) => item.note === wikiNoteRelative && ['copied-task-state', 'invalid-note', 'secret-like-content'].includes(item.code));
  if (wikiFindings.length > 0) {
    throw new Error(`${wikiNoteRelative} fails Wiki validation, so it cannot be ${specId}'s durable owner: ${wikiFindings.map((item) => `${item.code}: ${item.message}`).join('; ')}`);
  }

  // S-00J TK-005 has not landed at this room's pre anchor (no
  // `recordOwnerApproval` export exists in spec-report.mjs); the handoff's
  // named fallback for that case is to gate on `complete` only and record
  // which case applied, rather than silently inventing an approval check.
  const ownerApproval = {
    required: false,
    note: 'spec-report.mjs exports no recordOwnerApproval at this pre anchor (S-00J TK-005 has not landed here); retirement gates on complete only'
  };

  // Branch names must be read from the Spec's still-active records: their
  // files stop existing at this path the moment the directory moves.
  const branchNames = [...new Set((spec.records ?? []).flatMap((task) => {
    let rows;
    try { rows = readReceiptFromFile(task.filePath); } catch { rows = []; }
    return rows.map((row) => row.branch).filter((branch) => branch && branch !== 'none');
  }))];

  const moveResult = moveSpecDirectory(root, specId, folder);

  const integrationBranch = declaredGit(root)?.integrationBranch ?? null;
  const branches = cleanupContainedBranches(root, branchNames, integrationBranch);

  const movedSpec = findSpec(root, specId);
  const referencesRewrittenCount = Object.values(moveResult.referencesRewritten).reduce((a, b) => a + b, 0);
  const branchesCleanedCell = branches.cleaned.length > 0 ? branches.cleaned.join(', ') : 'none';
  const date = today();
  const row = `| ${escapeCell(date)} | spec | Spec retired to ${escapeCell(`${moveResult.to}/SPEC.md`)} | ${escapeCell(wikiNoteRelative)} | ${escapeCell(branchesCleanedCell)} | ${escapeCell(String(referencesRewrittenCount))} |`;
  const updatedContent = appendEvidence(movedSpec.content, row);
  atomicWrite(movedSpec.filePath, updatedContent);

  render(root);
  if (fs.existsSync(collectionPath(root, 'adr'))) writeRegister(root);
  spawnSync('git', ['-C', root, 'add', '-A']);

  return {
    specId,
    route: `${moveResult.to}/SPEC.md`,
    wikiNote: wikiNoteRelative,
    referencesRewritten: moveResult.referencesRewritten,
    referencesRewrittenCount,
    historicalReferencesLeft: moveResult.historicalReferencesLeft,
    branches,
    ownerApproval,
    evidenceRow: row
  };
}

// Best-effort branch cleanup for the Tasks a retiring Spec is carrying:
// proves containment in the declared integration branch before deleting a
// local branch (`git branch -d`, never `-D`), removes a registered worktree
// for that branch first (a branch cannot be deleted while a worktree still
// holds it checked out), and only ever lists a remote branch for the
// closeout recipe rather than deleting it. A branch with neither a local nor
// a remote ref left is reported as already cleaned up (the ordinary case
// once `AGENTS.md` Branch Completion has already run for it) rather than
// treated as a problem. Never throws: a branch this cannot safely delete is
// named in `skipped` with its reason, and the retirement itself is not
// blocked by branch cleanup, since Git branch hygiene is not what
// "surviving current claims are transformed into durable owners" gates on.
function cleanupContainedBranches(root, branches, integrationBranch) {
  const cleaned = [];
  const remote = [];
  const worktreesRemoved = [];
  const skipped = [];
  for (const branch of branches) {
    const hasLocal = spawnSync('git', ['-C', root, 'show-ref', '--verify', '--quiet', `refs/heads/${branch}`]).status === 0;
    const hasRemote = spawnSync('git', ['-C', root, 'show-ref', '--verify', '--quiet', `refs/remotes/origin/${branch}`]).status === 0;
    if (!hasLocal && !hasRemote) {
      skipped.push({ branch, reason: 'no local or remote ref found; already cleaned up' });
      continue;
    }
    if (hasLocal) {
      const contained = integrationBranch !== null
        && spawnSync('git', ['-C', root, 'merge-base', '--is-ancestor', branch, integrationBranch]).status === 0;
      if (!contained) {
        skipped.push({ branch, reason: integrationBranch ? `not proven contained in ${integrationBranch}` : 'no declared integration branch to prove containment against' });
      } else {
        const worktreeListing = spawnSync('git', ['-C', root, 'worktree', 'list', '--porcelain'], { encoding: 'utf8' });
        const entry = parseWorktreeEntries(worktreeListing.stdout ?? '').find((item) => item.branch === `refs/heads/${branch}`);
        if (entry) {
          const removal = spawnSync('git', ['-C', root, 'worktree', 'remove', entry.worktree]);
          if (removal.status === 0) worktreesRemoved.push(entry.worktree);
          else skipped.push({ branch, reason: `worktree ${entry.worktree} could not be removed: ${(removal.stderr || removal.stdout || '').trim()}` });
        }
        const deletion = spawnSync('git', ['-C', root, 'branch', '-d', branch], { encoding: 'utf8' });
        if (deletion.status === 0) cleaned.push(branch);
        else skipped.push({ branch, reason: (deletion.stderr || deletion.stdout || 'git branch -d failed').trim() });
      }
    }
    if (hasRemote) remote.push(branch);
  }
  return { cleaned, remote, worktreesRemoved, skipped };
}

// `git worktree list --porcelain` as an array of `{ worktree, branch }`
// entries (`branch` absent for a detached worktree), parsed rather than
// shelled through `grep`/`awk` so a path containing a space is not split.
function parseWorktreeEntries(porcelain) {
  const entries = [];
  let current = null;
  for (const line of porcelain.split('\n')) {
    if (line.startsWith('worktree ')) {
      current = { worktree: line.slice('worktree '.length) };
      entries.push(current);
    } else if (line.startsWith('branch ') && current) {
      current.branch = line.slice('branch '.length);
    }
  }
  return entries;
}

// The `canonicalized_in` targets a frontmatter block declares, normalized to
// an array exactly as `validateAdrs` normalizes them (a bare scalar becomes a
// one-element array; an absent key becomes `[]`), so this scanner and that
// validator agree on what counts as a canonicalization target.
function canonicalizedInTargets(content) {
  const data = parseFrontmatter(content).data;
  if (!data) return [];
  const value = data.canonicalized_in;
  return Array.isArray(value) ? value : (value ? [value] : []);
}

// REGISTER.md and HISTORY.md (`adr.mjs#renderRegister`) render each ADR's
// canonicalized_in owners as bare, comma-separated table text in the last
// cell of a data row - `AGENTS.md, workbench/specs/.../SPEC.md` - never as a
// Markdown link, so `localLinks` cannot see them at all. A data row is
// recognised the same way `renderRegister` writes one: its first cell opens
// with a Markdown link (`| [0001](...)`), which the header and separator
// rows never do.
function registerPathCells(content) {
  const paths = [];
  for (const line of content.split('\n')) {
    if (!/^\|\s*\[/.test(line)) continue;
    const cells = parseMarkdownTableRow(line);
    const last = cells[cells.length - 1];
    if (!last || last === 'none') continue;
    for (const item of last.split(',').map((entry) => entry.trim()).filter(Boolean)) paths.push(item);
  }
  return paths;
}

// S-00I TK-003: the complete reference and link scan, exported so TK-005
// (Spec/Task retirement) and TK-006 (the discard gate) reuse it rather than
// each writing their own. Read-only: it walks every live Markdown surface a
// Spec or ADR move can touch (the same set `collectSpecReferenceFiles`
// collects) and reports a local link, a `canonicalized_in` frontmatter
// target (corrective review finding 2 - a root-relative fact, not a body
// link, so it needs its own check), or - for REGISTER.md/HISTORY.md alone -
// a dead path in their own bare-text Canonicalized-in column (corrective
// review finding 1, second round: TK-006's discard gate must not certify a
// room whose register still points at a dead path just because that path
// never appeared inside a Markdown link). Each check skips a file's own
// Append-Only Evidence And Execution Log - a Spec's frozen history is
// expected to keep naming a pre-move path, and that is not a stale
// reference for this scan to report. A finding names the file and the
// unresolved target text; nothing here writes anything.
export function scanReferences(rootDir) {
  const root = path.resolve(rootDir);
  const adrCollection = collectionPath(root, 'adr');
  const findings = [];
  for (const file of collectSpecReferenceFiles(root)) {
    const original = fs.readFileSync(file, 'utf8');
    const { prefix, suffix } = splitEvidenceSection(original);
    const relative = path.relative(root, file).split(path.sep).join('/');
    for (const section of [prefix, suffix]) {
      for (const link of localLinks(section)) {
        const target = path.resolve(path.dirname(file), link);
        if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) {
          findings.push({ file: relative, target: link });
        }
      }
    }
    for (const owner of canonicalizedInTargets(prefix)) {
      const target = path.resolve(root, owner);
      if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) {
        findings.push({ file: relative, target: owner });
      }
    }
    if (path.dirname(file) === adrCollection && ['REGISTER.md', 'HISTORY.md'].includes(path.basename(file))) {
      for (const owner of registerPathCells(original)) {
        const target = path.resolve(root, owner);
        if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) {
          findings.push({ file: relative, target: owner });
        }
      }
    }
  }
  return findings;
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
    tasks: slicesOf(spec).map(publicSlice),
    // S-00I TK-004: retired Tasks under a separate key, never in `tasks` -
    // `[]` for a Spec that has never retired one, exactly as `loadSpecs`
    // never returns a retired Spec into the active roster's array shape.
    retiredTasks: (spec.retiredRecords ?? []).map(publicRetiredTask)
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

// Exported so spec-report.mjs's `recordReviewVerdict` (S-00J TK-002) appends
// a review-verdict row through this exact same seam `closeTask` and
// `completeSpec` already use, rather than a second append implementation
// that could drift from it.
export function appendEvidence(content, row) {
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

// Exported for the same reason as `appendEvidence` above: `recordReviewVerdict`
// in spec-report.mjs writes its Spec file through this one temp-file-plus-
// rename discipline rather than a second write path.
export function atomicWrite(filePath, content) {
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
  else if (command === 'report') result = assembleSpecReport(root, id, { candidate: options.candidate });
  else if (command === 'verdict') result = recordReviewVerdict(root, id, { candidate: options.candidate, result: options.result, findings: options.findings, reviewer: options.reviewer, digest: options.digest });
  else if (command === 'gate') {
    result = gate(root, { spec: options.spec, task: options.task, candidate: options.candidate });
    if (result.refused) process.exitCode = 1;
  }
  else if (command === 'move-spec') result = moveSpecDirectory(root, id, options.to);
  else if (command === 'move-task') result = moveTaskRecord(root, id, options.task, options.to);
  else if (command === 'retire-spec') result = retireSpec(root, id, { wikiNote: options.wiki });
  else if (command === 'render') result = render(root);
  else if (command === 'doctor') {
    result = doctor(root, options);
    if (blocksSelection(result)) process.exitCode = 1;
  } else {
    throw new Error('Usage: spec-workbench.mjs next|next-id|show|claim|close|receipt|complete|convert-tasks|report|verdict|gate|move-spec|move-task|retire-spec|render|doctor [S-###] [options]');
  }
  if (options.json) console.log(JSON.stringify(result, null, 2));
  else if (command === 'show') console.log(result.body);
  else if (command === 'doctor') console.log(formatDoctorReport(result));
  else if (command === 'report') console.log(formatSpecReport(result));
  else console.log(result === null ? 'No eligible work.' : JSON.stringify(result, null, 2));
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  });
}
