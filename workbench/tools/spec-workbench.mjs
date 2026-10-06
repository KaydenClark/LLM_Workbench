#!/usr/bin/env node
import { inspectSkills } from './skill-inspection.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { insideWorkTree, managedRuntimeDrift, permissionScopeDrift, permissionScopeMessage, provenanceFindings, readAtRef, readRepositoryState, resolveBranchRefs, seededDocumentFindings, validateManifest } from './workbench-layout.mjs';
import { isMainModule } from './workbench-paths.mjs';
import { escapeMarkdownTableCell, parseMarkdownTableRow } from './markdown-table.mjs';
import { parseSpecPacket } from './spec-packet.mjs';
import { blocksSelection, describe, finding } from './diagnostics.mjs';
import { checkHostFloor, formatHostFloor } from './host-floor.mjs';
import { capabilitySession } from './optional-capabilities.mjs';
import { coordinationContext, publicCoordination, publishClaim } from './claim-coordination.mjs';
import { assertSafeReadPath, assertSafeWritePath, writeSafeFile, collectionPath, collectionRelative, declaredGit, declaredTracker, lanePath, liveRecordPath, markdownLinkTargets, readManifest } from './workbench-paths.mjs';
// S-003Z TK-008D: the LANDMARK.md artifact reader, the record one size above a
// Spec (ADR-000U). Doctor folds its findings in beside the ADR and DDR
// collections, and `next-id --prefix LMK` folds its identities with the
// Tracker's JSON landmark records and every remote tip.
import { LANDMARK_LIFECYCLE_FOLDERS, LANDMARK_PREFIX, findLandmark, landmarkFindings, landmarkSpecHomes, loadLandmarks, loadReadableLandmarks, loadRetiredLandmarks, publicLandmark } from './landmark-artifact.mjs';
import { parseFrontmatter, planReferenceRewrite, splitEvidenceSection, validateAdrs, writeDecisionRegisters } from './adr.mjs';
import { validateWiki } from './wiki.mjs';
import { ARTIFACT_ID_MIN_WIDTH, allocateArtifactId, compareVisibleIds, visibleIdKey, visibleIdParts } from './visible-ids.mjs';
import { TASK_LIFECYCLE_FOLDERS, TASK_STATUSES, formatTaskRecord, listRetiredTaskRecords, listTaskRecords, parseFormerId, parseTaskRecord, readTaskRecord, taskStatus, unmetBlockers, updateTaskFields } from './task-record.mjs';
import { appendReceiptRow, appendReceiptRowToContent, readGitFacts, readReceipt, readReceiptFromFile } from './task-receipt.mjs';
import { buildTaskboard, taskboardTaskEntry, taskboardSpecLane, compareTaskboardEntries } from './taskboard.mjs';
import { NEW_SPEC_ROUTE, assembleSpecReport, computeSpecDigest, formatSpecReport, isAncestorOfBranch, recordOwnerApproval, recordReviewVerdict } from './spec-report.mjs';

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

// S-00V TK-00K: `options.capabilities` (the CLI's `--capabilities a,b`) and
// `options.capabilityProbes` (tests) say which optional capabilities this
// session establishes (optional-capabilities.mjs). A Task needing one the
// session cannot establish is never selected; it is named instead under
// `capabilityBlocked`, attached to the candidate, or - when nothing else is
// eligible - returned as `{ specId: null, taskId: null, capabilityBlocked }`
// so the capability stays visible. A room with no capability-blocked Task
// gets exactly the candidate or `null` it always got.
export function nextWork(rootDir, options = {}) {
  return nextSelection(rootDir, options).result;
}

// S-00V TK-01L (ADR-000O): `next` fetches origin and skips a Task claimed on
// any remote tip (claim-coordination.mjs). A coordinated result carries
// `coordination` naming the base, whether the fetch succeeded and each Task it
// skipped; an uncoordinated room returns exactly what it always returned, and
// `coordination` here says why so the CLI can report local selection.
// `options.fetch === false` overlays the last fetched refs without fetching.
export function nextSelection(rootDir, options = {}) {
  refuseBlockedRuntime(rootDir);
  const root = path.resolve(rootDir);
  if (discardedReferences(root).length) return { result: null, coordination: null };
  const context = coordinationContext(root, { specsPrefix: resolveSpecsRoot(root).specsPrefix, landmarksPrefix: collectionRelative(root, 'landmarks'), local: options.local === true, fetch: options.fetch !== false });
  const session = capabilitySession(root, options);
  if (options.review === true) {
    const { review, excluded, remoteClaimed } = selectReviewWork([...loadSpecs(root), ...loadRetiredSpecs(root)], { session, remoteClaims: context.claims });
    const coordination = publicCoordination(context, remoteClaimed);
    const result = { review, excluded };
    if (context.mode === 'remote') result.coordination = coordination;
    return { result, coordination };
  }
  const { candidate, capabilityBlocked, remoteClaimed } = selectWork([...loadSpecs(rootDir), ...loadRetiredSpecs(rootDir), ...loadLandmarkParents(rootDir)], { session, remoteClaims: context.claims });
  let result = candidate;
  if (capabilityBlocked.length > 0) result = result ? { ...result, capabilityBlocked } : { specId: null, taskId: null, capabilityBlocked };
  const coordination = publicCoordination(context, remoteClaimed);
  if (result && context.mode === 'remote') result = { ...result, coordination };
  return { result, coordination };
}

// S-004F TK-005S (DDR-000M): the standalone corrective Task S-00I TK-006
// created after its owning Spec was discarded, anchored to a Wiki claim, is
// retired: the Wiki holds knowledge and evidence, never the destination, and a
// later gap against delivered work becomes a new Spec. No command creates,
// selects, claims or closes one. A record an earlier release wrote lives at
// `<specs lane>/corrective/tasks/<id>/TASK.md`; this reader keeps naming it so
// its identifier stays occupied and no new identifier collides with it.
// Returns `[]` for a room that has never held one.
export function loadCorrectiveTasks(rootDir) {
  const root = path.resolve(rootDir);
  const { specsRoot } = resolveSpecsRoot(root);
  return listTaskRecords(path.join(specsRoot, 'corrective'), root);
}

// The one refusal every retired Wiki-claim corrective path throws, naming the
// route the owner chose. `claim` and `close` take a Spec ID; a Task ID is only
// ever recognized here to say why a standalone corrective record is not worked.
function refuseStandaloneCorrective(root, verb, selector) {
  const record = loadCorrectiveTasks(root).find((item) => visibleIdKey(item.id) === visibleIdKey(selector) || (item.formerId && visibleIdKey(item.formerId) === visibleIdKey(selector)));
  if (!record) throw new Error(`${verb} takes a Spec ID; ${selector} is not one, and no standalone corrective Task ${selector} exists`);
  throw new Error(`${verb} refused: ${record.id} is a standalone corrective Task anchored to a Wiki claim, and that route is retired: ${NEW_SPEC_ROUTE}. Carry its gap as a new Spec; this record is neither selected, claimed nor closed.`);
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

function selectCandidate(specs, options = {}) {
  return selectWork(specs, options).candidate;
}

// To-do selection plus capability-blocked Tasks it passed over (S-00V TK-00K).
// With a `session`, a Task recorded as capability-blocked stays blocked while
// the session still lacks a recorded capability, and a To-do Task
// needing a capability the session cannot establish is skipped; each is
// reported with `recorded` saying whether its record already carries the
// block. Without a session nothing capability-related is reported.
// S-00V TK-01L: with `remoteClaims` (a Map of `SPEC/TK` to the remote tips
// holding a claim), a To-do Task claimed on another tip is taken:
// it is skipped and reported under `remoteClaimed`.
function selectWork(specs, { specId, session = null, remoteClaims = null } = {}) {
  const completed = satisfiedBlockers(specs);
  const candidates = [];
  const capabilityBlocked = [];
  const remoteClaimed = [];
  for (const spec of specs) {
    if (!executable(spec) || (specId && spec.id !== specId)) continue;
    const satisfied = satisfiedIds(spec, completed);
    for (const slice of executionSlices(spec)) {
      const entry = taskboardEntryForSlice(spec, slice, satisfied, session);
      const status = entry.status;
      if (session && status === 'blocked' && slice.missingCapabilities.length > 0) {
        const missing = session.missing(slice.missingCapabilities);
        if (missing.names.length > 0) capabilityBlocked.push({ ...parentKey(spec), taskId: slice.id, missing: missing.names, recorded: true, reason: missing.reason });
        continue;
      }
      if (!entry.eligible) continue;
      const claimedOn = remoteClaims?.get(`${spec.id}/${slice.id}`);
      if (claimedOn) {
        remoteClaimed.push({ ...parentKey(spec), taskId: slice.id, refs: [...claimedOn].sort() });
        continue;
      }
      if (session && slice.capabilities.length > 0) {
        const missing = session.missing(slice.capabilities);
        if (missing.names.length > 0) {
          capabilityBlocked.push({ ...parentKey(spec), taskId: slice.id, missing: missing.names, recorded: false, reason: missing.reason });
          continue;
        }
      }
      candidates.push({
        ...parentKey(spec),
        title: spec.title,
        taskId: slice.id,
        slice: slice.slice,
        status,
        cardTitle: entry.title,
        priority: entry.priority,
        owner: spec.owner,
        path: spec.relativePath,
        nextGate: spec.nextGate
      });
    }
  }
  candidates.sort((a, b) => compareTaskboardEntries({ ...a, id: a.taskId, title: a.cardTitle }, { ...b, id: b.taskId, title: b.cardTitle }));
  capabilityBlocked.sort((a, b) => compareVisibleIds(parentIdOf(a), parentIdOf(b)) || compareVisibleIds(a.taskId, b.taskId));
  remoteClaimed.sort((a, b) => compareVisibleIds(parentIdOf(a), parentIdOf(b)) || compareVisibleIds(a.taskId, b.taskId));
  if (candidates.length === 0) return { candidate: null, capabilityBlocked, remoteClaimed };
  const { cardTitle: _cardTitle, ...result } = candidates[0];
  return { candidate: result, capabilityBlocked, remoteClaimed };
}

// Review is a read-only offering, not a claim or a verdict. Source-qualified
// identities keep numeric Task labels local even when flat preview must refuse.
function selectReviewWork(specs, { session, remoteClaims }) {
  const completed = satisfiedBlockers(specs);
  const review = [], excluded = [], remoteClaimed = [];
  for (const spec of specs) {
    if (spec.lifecycleFolder || !['active', 'needs-review'].includes(spec.status)) continue;
    const satisfied = satisfiedIds(spec, completed);
    const slices = slicesOf(spec);
    const entries = slices.map(slice => taskboardEntryForSlice(spec, slice, satisfied, session));
    let childExcluded = false;
    for (const [index, slice] of slices.entries()) {
      const entry = entries[index];
      if (entry.lane !== 'needsReview') continue;
      const card = { specId: spec.id, taskId: slice.id, title: entry.title, priority: entry.priority,
        path: slice.record?.relativePath ?? spec.relativePath, status: entry.status,
        requiredQA: ['assembled-spec-review'] };
      let exclusion = null;
      if (!entry.reviewEligible) exclusion = { reason: 'dependencies', dependencies: slice.blockerIds };
      const claimedOn = remoteClaims?.get(`${spec.id}/${slice.id}`);
      if (!exclusion && claimedOn) {
        const refs = [...claimedOn].sort();
        exclusion = { reason: 'claimed', refs };
        remoteClaimed.push({ specId: spec.id, taskId: slice.id, refs });
      }
      if (!exclusion && slice.capabilities.length > 0) {
        const missing = session.missing(slice.capabilities);
        if (missing.names.length) exclusion = { reason: 'capabilities', missing: missing.names, detail: missing.reason };
      }
      if (exclusion) { excluded.push({ ...card, ...exclusion }); childExcluded = true; }
      else review.push(card);
    }
    // Include retained done table rows and retired Tasks in the same child gate
    // used by preview, without offering those historical records themselves.
    const historical = spec.recordBacked ? spec.rows : [];
    const historicalEntries = [...historical, ...(spec.retiredRecords ?? [])].map(task =>
      taskboardTaskEntry(spec, { ...task, specId: spec.id }, { dependenciesMet: true }));
    const lane = taskboardSpecLane(spec, [...entries, ...historicalEntries]);
    if (spec.status !== 'needs-review') continue;
    const card = { specId: spec.id, taskId: null, title: spec.title, priority: spec.priority,
      path: spec.relativePath, status: spec.status, requiredQA: ['assembled-spec-review', 'owner-human-qa'] };
    if (lane !== 'needsReview' || childExcluded) excluded.push({ ...card, reason: 'children' });
    else if (!blockersSatisfied(spec.blockers, satisfied)) excluded.push({ ...card, reason: 'dependencies', dependencies: splitBlockers(spec.blockers) });
    else review.push(card);
  }
  const compare = (a, b) => compareTaskboardEntries({ ...a, id: a.taskId ?? a.specId }, { ...b, id: b.taskId ?? b.specId });
  review.sort(compare); excluded.sort(compare);
  remoteClaimed.sort((a,b) => compareVisibleIds(a.specId,b.specId) || compareVisibleIds(a.taskId,b.taskId));
  return { review, excluded, remoteClaimed };
}

// S-00I TK-005: `findSpec` reaches a retired Spec only once the active
// roster has no claim on its id, but a reader who lands on it that way
// still needs to see, at a glance, that this is the historical route rather
// than ordinary current work - `spec.lifecycleFolder` is set only by
// `loadRetiredSpecs`, never by `loadSpecs`, so it is exactly the fact this
// checks. The banner is prepended to `body` (never written back to the
// file, never affecting `publicSpec`'s own `path` field, which already
// names the same route structurally) so `console.log(result.body)` - the
// CLI's own `show` output - carries it as the first line printed.
export function showSpec(rootDir, id) {
  // S-003Z TK-008G: `show LMK-###` shows a landmark with its direct Tasks.
  if (isLandmarkId(id)) return showLandmark(rootDir, id);
  const spec = findSpec(rootDir, id);
  const body = spec.lifecycleFolder
    ? `Retired: ${spec.relativePath} (historical route; out of ordinary discovery, reachable only by this explicit lookup)\n\n${spec.content}`
    : spec.content;
  return { ...publicSpec(spec), body };
}

export function nextIdentity(rootDir, specId, options = {}) {
  refuseBlockedRuntime(rootDir);
  const specs = loadSpecs(rootDir);
  const prefix = options.prefix;
  if (!['S', 'TK', LANDMARK_PREFIX].includes(prefix)) throw new Error(`--prefix must be S, TK or ${LANDMARK_PREFIX}`);
  // S-003Z TK-008G: a Task may sit directly under a landmark, so a Task
  // proposal names either its Spec or its landmark as the parent.
  let landmarkId = null;
  if (prefix === 'TK' && isLandmarkId(specId)) {
    landmarkId = findLandmarkParent(rootDir, specId).id;
    specId = null;
  } else {
    if (prefix === 'TK') specId = resolveSpecId(rootDir, specId);
    if (prefix === 'TK' && !specs.some(spec => spec.id === specId)) throw new Error('Task identity proposals require an existing assigned spec or landmark ID');
  }
  if (prefix === 'S' && specId) throw new Error('A spec identity proposal takes no existing spec ID');
  if (prefix === LANDMARK_PREFIX && specId) throw new Error('A landmark identity proposal takes no existing spec ID');
  const occupied = occupiedIdentities(rootDir, prefix);
  // The shared artifact policy is letter-bearing, so new durable labels do not
  // reuse removed historical decimal IDs; numeric tasks also retain their old
  // spec-qualified interpretation.
  const id = allocateArtifactId(prefix, occupied);
  return { status: 'proposed', id, reserved: false, ...(specId ? { specId } : {}), ...(landmarkId ? { landmarkId } : {}) };
}

// Identity is retained outside ordinary selection: retirement and discard do
// not make a label reusable. Read declared lanes at each remote tip as well.
// A remote tip's matched lines outgrow Node's default 1 MiB spawnSync buffer as
// a room's evidence grows; the same 64 MiB bound claim-coordination and
// workbench-layout use keeps the read whole, and a spawn error is named.
const REF_READ_MAX_BUFFER = 64 * 1024 * 1024;
export function occupiedIdentities(rootDir, prefix) {
  const root = path.resolve(rootDir);
  const occupied = prefix === LANDMARK_PREFIX ? landmarkIdentities(root) : specAndTaskIdentities(root, prefix);
  occupied.push(...discardedLabels(root, prefix));
  const refs = spawnSync('git', ['-C', root, 'for-each-ref', '--format=%(refname)', 'refs/remotes'], { encoding: 'utf8' });
  if (refs.status === 0) for (const ref of refs.stdout.trim().split('\n').filter(Boolean)) {
    const manifestResult = spawnSync('git', ['-C', root, 'show', `${ref}:workbench/manifest.json`], { encoding: 'utf8', maxBuffer: REF_READ_MAX_BUFFER });
    if (manifestResult.error) throw new Error(`Cannot reserve IDs from ${ref}: ${manifestResult.error.message}`);
    let lane = resolveSpecsRoot(root).specsPrefix;
    let landmarksLane = collectionRelative(root, 'landmarks');
    let trackerLane = declaredTracker(root)?.collections.landmarks ?? null;
    if (manifestResult.status === 0) {
      let manifest;
      try { manifest = JSON.parse(manifestResult.stdout); }
      catch { throw new Error(`Cannot reserve IDs from malformed manifest at ${ref}`); }
      lane = manifest.lanes?.specs ?? lane;
      landmarksLane = manifest.collections?.landmarks ?? landmarksLane;
      trackerLane = manifest.landmarkTracker?.collections?.landmarks ?? trackerLane;
    }
    // S-003Z TK-008D: a landmark identity is reserved by a `**Landmark ID:**`
    // line in the landmarks collection at that tip (active roster and every
    // lifecycle folder alike) and by the Tracker's JSON records there, whose
    // `"id"` field names the same prefix; a pathspec absent at the tip matches
    // nothing and is not an error.
    const scan = prefix === LANDMARK_PREFIX
      ? { pattern: '^\\*\\*Landmark ID:\\*\\*|"id":', paths: [landmarksLane, ...(trackerLane ? [trackerLane] : [])] }
      : { pattern: '^\\*\\*(Spec ID|Task ID):\\*\\*|^\\|.*(S-|TK-)', paths: [lane, landmarksLane, ...(manifestResult.status === 0 ? [] : ['specs'])] };
    const result = spawnSync('git', ['-C', root, 'grep', '-h', '-E', scan.pattern, ref, '--', ...scan.paths], { encoding: 'utf8', maxBuffer: REF_READ_MAX_BUFFER });
    if (result.error || ![0, 1].includes(result.status)) throw new Error(`Cannot reserve IDs from ${ref}: ${result.error?.message ?? result.stderr.trim()}`);
    occupied.push(...(result.stdout.match(new RegExp(`\\b${prefix}-[0-9A-Za-z]{3,}\\b`, 'g')) ?? []));
  }
  return [...new Set(occupied)];
}

// The Spec and Task identities a room holds in its records: every Spec at both
// homes, every slice row and Task record, retired Tasks and corrective Tasks.
// S-003Z TK-008G: a landmark's direct Tasks, active and retired, hold their
// identities too.
function specAndTaskIdentities(root, prefix) {
  const specs = [...loadSpecs(root), ...loadRetiredSpecs(root)];
  return prefix === 'S' ? specs.map(spec => spec.id)
    : [...[...specs, ...loadLandmarkParents(root)].flatMap(spec => [...spec.rows, ...spec.records, ...(spec.retiredRecords ?? [])].map(item => item.id)), ...loadCorrectiveTasks(root).map(task => task.id)];
}

// S-003Z TK-008D: the landmark identities a room holds: every `LANDMARK.md`
// artifact at the active roster and in each lifecycle folder, plus the
// Tracker's JSON landmark records, which keep their identities until the
// migration Spec folds them into the artifacts. A malformed artifact refuses
// the proposal, as a malformed Spec refuses a Spec or Task proposal.
function landmarkIdentities(root) {
  const ids = [...loadLandmarks(root), ...loadRetiredLandmarks(root)].map(landmark => landmark.id);
  const tracker = declaredTracker(root);
  if (tracker) {
    const records = path.join(root, tracker.collections.landmarks);
    if (fs.existsSync(records)) {
      for (const name of fs.readdirSync(records)) if (name.endsWith('.json')) ids.push(path.basename(name, '.json'));
    }
  }
  return ids;
}

// Labels the discard register (`DISCARDS.md`) still holds: a discarded record's
// identity stays reserved even though its record is gone.
function discardedLabels(root, prefix) {
  const register = path.join(resolveSpecsRoot(root).specsRoot, 'DISCARDS.md');
  if (!fs.existsSync(register)) return [];
  const labels = [];
  for (const line of fs.readFileSync(register, 'utf8').split('\n')) {
    if (!/^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line)) continue;
    const label = parseMarkdownTableRow(line)[2] ?? '';
    labels.push(...(label.match(new RegExp(`${prefix}-[0-9A-Za-z]{3,}`, 'g')) ?? []));
  }
  return labels;
}

// S-00V TK-01L (ADR-000O): a coordinated room commits the claim on its task
// branch and pushes it (claim-coordination.mjs `publishClaim`): on the
// integration branch, the default branch or a detached HEAD the task branch is
// cut from the fetched integration base; on any other branch the claim is
// committed and pushed where it stands. A room with no remote, no declared or
// fetched integration base, or an explicit `--local` claims in the working
// tree exactly as before. Either way the result's `coordination` says which.
export function claimWork(rootDir, id, options) {
  refuseBlockedRuntime(rootDir);
  requireValue(options?.agent, '--agent is required');
  const root = path.resolve(rootDir);
  if (discardedReferences(root).length) throw new Error('discarded-reference: selection is blocked until current references are reconciled');
  const { specsPrefix } = resolveSpecsRoot(root);
  const landmarksPrefix = collectionRelative(root, 'landmarks');
  const context = coordinationContext(root, { specsPrefix, landmarksPrefix, local: options?.local === true, requireFetch: true });
  if (context.mode !== 'remote') return { ...claimInTree(rootDir, id, options, null).result, coordination: publicCoordination(context) };
  return publishClaim(root, context, {
    agent: options.agent,
    branch: options.branch,
    specsPrefix,
    landmarksPrefix,
    apply: (remoteClaims) => claimInTree(rootDir, id, options, remoteClaims),
    project: () => render(root)
  });
}

// The ordinary claim in the working tree: select, route, and write the Task
// record and Spec header. Returns the shown Spec plus the claimed ids.
// S-003Z TK-008G: `claim LMK-###` claims a Task directly under that landmark
// through the same selection, refusing an unassigned or non-active landmark;
// `specId` in the returned ids is then the landmark, the claim's parent.
function claimInTree(rootDir, id, options, remoteClaims) {
  // S-004F TK-005S: a Task ID names no Spec; the standalone corrective route is retired.
  if (/^TK-/.test(id)) refuseStandaloneCorrective(path.resolve(rootDir), 'claim', id);
  const landmark = isLandmarkId(id);
  id = landmark ? resolveLandmarkId(rootDir, id) : resolveSpecId(rootDir, id);
  const date = validDate(options?.date ?? today());
  const specs = [...loadSpecs(rootDir), ...loadRetiredSpecs(rootDir), ...loadLandmarkParents(rootDir)];
  const matches = specs.filter((item) => item.id === id);
  const kind = landmark ? 'landmark' : 'spec';
  if (matches.length !== 1) throw new Error(matches.length ? `Duplicate ${kind} ID: ${id}` : `Unknown ${kind} ID: ${id}`);
  const spec = matches[0];
  if (landmark) {
    const refusal = landmarkRefusal(spec);
    if (refusal) throw new Error(`claim refused: ${refusal}`);
  } else if (spec.status !== 'active' && spec.lifecycleFolder !== 'retired') throw new Error(`${id} is ${spec.status}, not active`);
  const session = capabilitySession(path.resolve(rootDir), options);
  const { candidate, capabilityBlocked, remoteClaimed } = selectWork(specs, { specId: id, session, remoteClaims });
  const slices = executionSlices(spec);
  // S-00V TK-00K: a ready Task needing an optional capability this session
  // cannot establish is routed to blocked on its own record, naming the
  // capability, rather than skipped silently; the claim then takes the next
  // Task the session can do, or refuses naming what it routed.
  const routed = [];
  for (const entry of capabilityBlocked) {
    if (entry.recorded) continue;
    const slice = slices.find((item) => item.id === entry.taskId);
    writeTaskStatus(slice.record, { Status: 'blocked', 'Missing capabilities': entry.missing.join(', ') });
    routed.push({ taskId: entry.taskId, missing: entry.missing });
  }
  const withRouting = (result) => ({ result: routed.length > 0 ? { ...result, capabilityRouted: routed } : result, specId: id, taskId: task.id, remoteClaimed });
  const task = slices.find((item) => item.id === candidate?.taskId);
  if (!task) {
    if (routed.length > 0) {
      throw new Error(`${id} has no eligible ready task to claim; routed to blocked for missing optional capabilities: ${routed.map((item) => `${item.taskId} (${item.missing.join(', ')})`).join(', ')}`);
    }
    // `blocked-slice` names the one shape doctor also reports: a slice that
    // declares itself ready while its blockers are unmet. A slice that
    // declares itself blocked is ordinary sequencing on both sources, so it
    // gets the generic refusal rather than the name of a finding nobody
    // raised. A table row's refusal is unchanged, since a ready row reaching
    // here always has an unmet blocker.
    const satisfied = satisfiedIds(spec, satisfiedBlockers(specs));
    const blocked = slices.find((item) => item.declared === 'ready' && !blockersSatisfied(item.blockers, satisfied));
    if (blocked) throw new Error(`${id}/${blocked.id} is blocked by ${blocked.blockers} (blocked-slice); claim refuses a slice whose declared dependency is unmet`);
    if (remoteClaimed.length > 0) throw new Error(`${id} has no eligible ready task to claim; claimed on a remote tip: ${remoteClaimed.map((item) => `${item.taskId} (${item.refs.join(', ')})`).join(', ')}`);
    throw new Error(`${id} has no eligible ready task to claim`);
  }
  // A record-backed Spec's state lives on the record; only the Spec header's
  // owner and event fields move. The record is written first so a failure
  // while updating the header cannot leave the Spec announcing a claim that
  // the record never took.
  // A capability block this session now satisfies is cleared as it is claimed.
  if (task.source === 'record') writeTaskStatus(task.record, task.missingCapabilities.length > 0 ? { Status: 'in-progress', 'Missing capabilities': 'none' } : { Status: 'in-progress' });
  if (spec.lifecycleFolder === 'retired') return withRouting(showSpec(rootDir, id));
  const content = task.source === 'record'
    ? spec.content
    : updateTaskRow(spec.content, task.id, (cells) => {
      cells[2] = 'in-progress';
      return cells;
    });
  // A landmark's Owner is the Director holding its lane, not the Task's
  // claimant, so a landmark-direct claim records the claimant in the event.
  const updated = updateFields(content, {
    ...(landmark ? {} : { Owner: options.agent }),
    Updated: date,
    'Latest event': `${task.id} claimed by ${options.agent}.`,
    'Next gate': `Close ${task.id} with verification and documentation proof.`
  });
  atomicWrite(spec.filePath, updated);
  return withRouting(showSpec(rootDir, id));
}

export function closeTask(rootDir, id, options) {
  const root = path.resolve(rootDir);
  // S-004F TK-005S: a Task ID names no Spec; the standalone corrective route is retired.
  if (/^TK-/.test(id)) refuseStandaloneCorrective(root, 'close', id);
  // S-003Z TK-008G: `close LMK-###` closes the claimed Task directly under
  // that landmark and appends its row to the landmark's own evidence log.
  const landmark = isLandmarkId(id);
  id = landmark ? resolveLandmarkId(root, id) : resolveSpecId(root, id);
  const proof = requireValue(options?.proof, '--proof is required');
  const docs = requireValue(options?.docs, '--docs is required');
  const remainingGap = requireValue(options?.remainingGap, '--remaining-gap is required');
  const date = validDate(options?.date ?? today());
  const spec = landmark ? findLandmarkParent(root, id) : findSpec(root, id);
  assertCloseTaskDirectories(root, spec);
  const slices = executionSlices(spec);
  // A published close takes precedence over normal selection, including when
  // another Task is claimed. Recovery uses its original checksummed Receipt,
  // never the retry's replacement proof, and never reopens a done record.
  // Retirement changes location, not a published operation's identity. Read
  // all native records here, including retired and nonselectable history;
  // ordinary selection continues to use only the existing execution slices.
  const pending = [...(spec.records ?? []), ...(spec.retiredRecords ?? [])]
    .filter((record) => /^\*\*Close pending:\*\*/m.test(record.content))
    .map((record) => ({ id: record.id, record }));
  if (pending.length > 1) throw new Error(`${id} has multiple pending closes; reconcile them before closing another Task`);
  if (pending.length === 1) return finishRecordClose(root, spec, pending[0], slices);

  // S-00M TK-003: `close` names no Task, so it closes only a claimed one;
  // falling through to the first ready Task closed work nobody claimed.
  const task = slices.find((item) => item.declared === 'in-progress');
  if (!task && slices.some((item) => item.declared === 'ready')) throw new Error(`${id} has no in-progress task to close; claim one first`);
  if (!task) throw new Error(`${id} has no open task to close`);
  // S-00V TK-00K: a missing optional capability never lets a Task report
  // success. A closing session that cannot establish every capability the
  // Task names routes it to blocked, naming them, and refuses before any
  // Receipt, Proof or evidence row is written.
  if (task.source === 'record' && task.capabilities.length > 0) {
    const missing = capabilitySession(root, options).missing(task.capabilities);
    if (missing.names.length > 0) {
      writeTaskStatus(task.record, { Status: 'blocked', 'Missing capabilities': missing.names.join(', ') });
      throw new Error(`close refused: ${id}/${task.id} needs optional capability ${missing.names.join(', ')}, which this session cannot establish (${missing.reason}); routed to blocked`);
    }
  }
  const recordedGap = gitStateAtClose(root, remainingGap, options?.gitStateReason);
  // Receipt, done status and pending evidence publish in one atomic Task
  // write. The following Spec write may fail or the process may exit; the
  // durable marker pins retry to this Task until evidence and cleanup land.
  if (task.source === 'record') {
    assertSafeWritePath(root, task.record.filePath);
    assertSafeWritePath(root, spec.filePath);
    const facts = readGitFacts(root);
    const receipted = appendReceiptRowToContent(task.record.content, {
      ...facts, testsRun: proof, docsTouched: docs, remainingGap: recordedGap
    }, task.record.filePath);
    const receipt = readReceipt(receipted, task.record.filePath).at(-1);
    const row = `| ${[date, task.id, closeEvent(spec.content, task.id), receipt.testsRun, receipt.docsTouched, receipt.remainingGap].map(escapeCell).join(' | ')} |`;
    // Validate the evidence destination before publishing the Task.
    appendEvidence(spec.content, row);
    const published = updateTaskFields(receipted, {
      Status: 'done', Proof: receipt.testsRun,
      'Close pending': JSON.stringify({ version: 1, row, receiptChecksum: receipt.checksum })
    });
    const record = parseTaskRecord(published, task.record.filePath, task.record.root);
    writeSafeFile(root, task.record.filePath, published);
    return finishRecordClose(root, spec, { ...task, declared: 'done', record }, slices);
  }
  let content = spec.content;
  content = updateTaskRow(spec.content, task.id, (cells) => {
    cells[2] = 'done';
    cells[4] = proof;
    return cells;
  });
  const remaining = slices.find((item) => item.id !== task.id && item.declared !== 'done');
  if (spec.lifecycleFolder !== 'retired') content = updateFields(content, {
    Updated: date,
    'Latest event': `${task.id} closed with proof.`,
    'Next gate': remaining ? `Complete ${remaining.id}.` : 'Confirm acceptance criteria and completion result.'
  });
  content = appendEvidence(content, `| ${escapeCell(date)} | ${escapeCell(task.id)} | Task closed | ${escapeCell(proof)} | ${escapeCell(docs)} | ${escapeCell(recordedGap)} |`);
  atomicWrite(spec.filePath, content);
  return showSpec(rootDir, id);
}

// S-004F TK-005R (DDR-000Y): a Task a check found missed continues, so it can
// close more than once. The first close keeps the event `Task closed`; each
// later close is `Task closed (run N)`, N counting the close rows this Task
// already has in the Spec's append-only log, so a second close on the same
// day carries its own identity instead of conflicting with the first.
const CLOSE_EVENT_PATTERN = /^Task closed(?: \(run \d+\))?$/;
function closeEvent(specContent, taskId) {
  const prior = evidenceRows(specContent).map(splitRow).filter((cells) => cells[1] === taskId && CLOSE_EVENT_PATTERN.test(cells[2])).length;
  return prior === 0 ? 'Task closed' : `Task closed (run ${prior + 1})`;
}

// S-00I TK-004L: native inventory skips symlink directory entries. A close
// must refuse an unsafe ownership shape before selecting another claim, since
// a skipped directory can hold the only durable pending operation. Keep this
// preflight local to close; other lifecycle readers and operations are unchanged.
function assertCloseTaskDirectories(root, spec) {
  const tasksDir = path.join(path.dirname(spec.filePath), 'tasks');
  const inspect = (directory, lifecycleRoot = false) => {
    try { assertSafeReadPath(root, directory); }
    catch (error) { throw new Error(`unsafe close Task directory: ${directory}: ${error.message}`); }
    let info;
    try { info = fs.lstatSync(directory); }
    catch (error) { if (error.code === 'ENOENT') return; throw error; }
    if (!info.isDirectory()) throw new Error(`unsafe close Task directory: ${directory} must be an ordinary directory`);
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const child = path.join(directory, entry.name);
      if (entry.isSymbolicLink() || (!entry.isDirectory()
          && (!entry.isFile() || /^TK-[0-9A-Za-z]+$/.test(entry.name) || TASK_LIFECYCLE_FOLDERS.includes(entry.name)))) {
        throw new Error(`unsafe close Task directory: ${child} must be an ordinary directory`);
      }
      if (entry.isDirectory()) {
        assertSafeReadPath(root, child);
        if (!lifecycleRoot && TASK_LIFECYCLE_FOLDERS.includes(entry.name)) inspect(child, true);
      }
    }
  };
  inspect(tasksDir);
}

// Only record-backed Spec close uses this protocol. The pending marker is
// temporary delivery state, not a new Task status or independent proof store.
// Existing Receipt rows are checked and retained byte-for-byte. A mismatch is
// visible and refuses before any write, rather than choosing other work.
function finishRecordClose(root, spec, task, slices) {
  assertSafeReadPath(root, task.record.filePath);
  assertSafeWritePath(root, task.record.filePath);
  assertSafeWritePath(root, spec.filePath);
  const record = readTaskRecord(task.record.filePath, task.record.root);
  const match = record.content.match(/^\*\*Close pending:\*\* (.+)$/m);
  let pending;
  try { pending = JSON.parse(match?.[1]); } catch { throw new Error(`${task.id} has invalid pending close evidence`); }
  if (!pending || pending.version !== 1 || typeof pending.row !== 'string' || pending.row.includes('\n')) {
    throw new Error(`${task.id} has invalid pending close evidence`);
  }
  const receipt = readReceipt(record.content, record.filePath).at(-1);
  const cells = splitRow(pending.row);
  if (cells.length !== 6 || !receipt || record.status !== 'done' || record.proof !== receipt.testsRun
      || pending.receiptChecksum !== receipt.checksum || cells[1] !== task.id || !CLOSE_EVENT_PATTERN.test(cells[2])
      || cells[3] !== receipt.testsRun || cells[4] !== receipt.docsTouched || cells[5] !== receipt.remainingGap) {
    throw new Error(`${task.id} pending close does not match its done Task and Receipt`);
  }
  const date = validDate(cells[0]);
  // Inspect only the owning log. A conflicting row with the same identity is
  // never overwritten; successful Spec publication followed by failed cleanup
  // is idempotent, even across separate CLI processes.
  const sameIdentity = evidenceRows(spec.content).filter((row) => {
    const existing = splitRow(row);
    return existing[0] === date && existing[1] === task.id && existing[2] === cells[2];
  });
  if (sameIdentity.length > 1 || (sameIdentity.length === 1 && sameIdentity[0] !== pending.row)) {
    throw new Error(`${task.id} pending close conflicts with existing Spec evidence`);
  }
  let content = spec.content;
  if (sameIdentity.length === 0) {
    const remaining = slices.find((item) => item.id !== task.id && item.declared !== 'done');
    if (spec.lifecycleFolder !== 'retired') content = updateFields(content, {
      Updated: date,
      'Latest event': `${task.id} closed with proof.`,
      'Next gate': closedNextGate(spec, remaining)
    });
    content = appendEvidence(content, pending.row);
    writeSafeFile(root, spec.filePath, content);
  }
  const cleared = record.content.replace(/^\*\*Close pending:\*\* .+\r?\n?/m, '');
  parseTaskRecord(cleared, record.filePath, record.root);
  writeSafeFile(root, record.filePath, cleared);
  return showSpec(root, spec.id);
}

// S-00M TK-003 (ADR-000J): a completion claim the repository contradicts is
// refused before anything is written. Dirty means anything
// `git status --porcelain` shows - exactly what the Receipt's Dirty column
// counts. Unpushed means no remote-tracking ref contains HEAD. With
// `--git-state-reason` the close proceeds and returns the remaining gap with
// the observed state and the reason appended, which `closeTask` writes into
// the Receipt row (inside its checksum chain) and the Spec evidence row, so
// the waiver stays readable rather than being consumed by the check. A
// reason on a clean, pushed tree is refused rather than dropped. An unknown
// state (no Git, not a repository) refuses nothing; a reason given there is
// still recorded, beside the unknown state.
function gitStateAtClose(root, remainingGap, reasonOption) {
  const reason = reasonOption === undefined ? null : requireValue(reasonOption, '--git-state-reason must not be empty');
  if (reason?.includes('\n')) throw new Error('--git-state-reason must be one line');
  const record = (summary) => `${remainingGap} Git state at close: ${summary}; recorded reason: ${reason}`;
  const state = readRepositoryState(root);
  if (!state.known) return reason ? record(`unknown (${state.reason})`) : remainingGap;
  const files = [...state.dirty, ...state.untracked.controls, ...state.untracked.adr, ...state.untracked.specs, ...state.untrackedOther].sort();
  const findings = [];
  if (files.length > 0) {
    const shown = files.length > 10 ? `${files.slice(0, 10).join(', ')}, and ${files.length - 10} more` : files.join(', ');
    findings.push(`dirty-tree (${files.length} ${files.length === 1 ? 'file' : 'files'}: ${shown})`);
  }
  if (!state.pushed) {
    const where = state.remotes.length === 0 ? 'no remote'
      : state.upstream && !state.upstream.gone ? `ahead ${state.upstream.ahead} behind ${state.upstream.behind} of ${state.upstream.name}`
        : state.upstream ? `upstream ${state.upstream.name} is gone`
          : state.head.detached ? 'detached HEAD, no upstream' : 'no upstream';
    findings.push(`unpushed (${where})`);
  }
  if (findings.length === 0) {
    if (reason) throw new Error('--git-state-reason given but the tree is clean and pushed; nothing to record');
    return remainingGap;
  }
  if (reason) return record(findings.join(' and '));
  throw new Error(`close refused: ${findings.join(' and ')}; commit and push, or rerun with --git-state-reason "<why>" to record the state and reason`);
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
  let taskId = requireValue(options?.task, '--task is required');
  const testsRun = requireValue(options?.tests, '--tests is required');
  const docsTouched = requireValue(options?.docs, '--docs is required');
  const remainingGap = requireValue(options?.remainingGap, '--remaining-gap is required');
  // S-003Z TK-008G: `receipt LMK-### --task TK-###` appends to a Task
  // directly under that landmark.
  const landmark = isLandmarkId(id);
  id = landmark ? resolveLandmarkId(root, id) : resolveSpecId(root, id);
  const spec = landmark ? findLandmarkParent(root, id) : findSpec(root, id);
  taskId = resolveTaskId(spec, taskId);
  const task = slicesOf(spec).find((item) => item.id === taskId);
  if (!task || task.source !== 'record') {
    throw new Error(`${id}/${taskId} has no Task record; the receipt verb appends only to a standalone record`);
  }
  if (task.declared !== 'in-progress') {
    throw new Error(`${id}/${taskId} is ${task.declared}, not in-progress; the receipt verb appends only to an in-progress Task`);
  }
  const row = appendReceiptRow(task.record.filePath, { repoRoot: root, testsRun, docsTouched, remainingGap });
  return { ...parentKey(spec), taskId, row };
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
//
// `activate` (S-01L TK-02D) is the explicit opt-in for a request that
// activates a planned Spec and cuts its Tasks in the same step: Tasks are cut
// at activation, and activation has no other command. It changes only the
// `**Status:**` field, and only after every record has parsed, so a refusal
// still writes nothing. On an already-active Spec it is a no-op; it never
// reopens a completed, retired or other non-planned Spec.
export function convertSpecSlices(rootDir, id, options = {}) {
  const root = path.resolve(rootDir);
  id = resolveSpecId(root, id);
  const spec = findSpec(root, id);
  const activating = options.activate === true && spec.status === 'planned';
  if (spec.status !== 'active' && !activating) {
    const route = spec.status === 'planned'
      ? `; when the same request activates it, run convert-tasks ${id} --activate`
      : '';
    throw new Error(`${id} is ${spec.status}, not active; only an active Spec is converted and a completed Spec's historical table is never rewritten${route}`);
  }
  if (activating) {
    // Updating the first field must not leave a later parsed Status authoritative.
    const statusFields = [...spec.content.matchAll(/^\*\*([^*]+):\*\*\s*(.+)$/gm)]
      .filter(match => match[1].trim() === 'Status');
    if (statusFields.length !== 1) throw new Error(`${id} has ambiguous Status fields; activation writes nothing`);
    const prospective = parseSpecPacket(updateFields(spec.content, { Status: 'active' }), spec.filePath, root, { recordBacked: spec.recordBacked });
    if (prospective.status !== 'active') throw new Error(`${id} prospective activation is not active; activation writes nothing`);
  }
  const specDir = path.dirname(spec.filePath);
  const tasksDir = path.join(specDir, 'tasks');
  // S-01L TK-002P: a planned record-backed Spec - to-spec's shape, a `tasks/`
  // directory and no unfinished table row (`loadSpecs` already refuses a
  // record-backed Spec that still holds one) - has no row to convert. to-tasks
  // writes its first records; `--activate` is then only the activation gate.
  // Every live record was parsed by `loadSpecs` (an unparseable one refuses
  // before this point, naming the Task), and `slicesOf` refuses a row/record
  // collision, so this checks that at least one record exists and changes
  // nothing but Status.
  if (activating && spec.recordBacked) {
    const tasks = slicesOf(spec).map((slice) => slice.id);
    if (tasks.length === 0) {
      throw new Error(`${id} has no Task record under ${path.relative(root, tasksDir).split(path.sep).join('/')} to activate; write its first TASK.md record(s) with to-tasks, then run convert-tasks ${id} --activate`);
    }
    atomicWrite(spec.filePath, updateFields(spec.content, { Status: 'active' }));
    return {
      specId: id,
      activated: true,
      converted: [],
      retained: spec.rows.filter((row) => row.status === 'done').map((row) => row.id),
      tasks
    };
  }
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
  const specContent = activating ? updateFields(spec.content, { Status: 'active' }) : spec.content;
  atomicWrite(spec.filePath, removeSliceRows(specContent, convertedIds));
  return {
    specId: id,
    activated: activating,
    converted,
    retained: spec.rows.filter((row) => row.status === 'done').map((row) => row.id)
  };
}

export function completeSpec(rootDir, id, options = {}) {
  const date = validDate(options.date ?? today());
  id = resolveSpecId(rootDir, id);
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
  const report = assembleSpecReport(rootDir, id);
  // S-00J TK-01R: an unresolved durable Task decision (the report's
  // `decisionGaps`, also part of its `gaps` that `gate` consumes) refuses
  // closure before any review or approval check, so otherwise valid review
  // and owner-approval rows can never bypass it. Only this gap class is
  // adopted here; complete's other checks stay as they were.
  if (report.decisionGaps.length > 0) {
    throw new Error(`${id} cannot complete: open Task decision gaps: ${report.decisionGaps.join('; ')}`);
  }
  // S-00J TK-004: complete refuses without a passed review verdict bound to
  // the Spec's current content digest (spec-report.mjs), naming exactly
  // what is missing. Shared with `gate` through reviewGapReason so the two
  // can never disagree about what "reviewed" means for the same Spec.
  // S-00J TK-005: the owner Human QA gap is checked next, through the same
  // report object, so a Spec with a passed verdict but no recorded owner
  // approval still refuses - the review-verdict message always composes
  // first (`??` short-circuits on the first non-null reason), matching the
  // handoff's "checked after the review-verdict gate" ordering.
  const gapReason = reviewGapReason(report) ?? approvalGapReason(report);
  if (gapReason) throw new Error(`${id} cannot complete: ${gapReason}`);
  // S-00J TK-01S (closure-capture contract T2/T3): reviewed integration
  // delivery and owner approval are not final closure. The approved content
  // must also be verified on the declared default branch, checked last and
  // before any write, so every refusal leaves the Spec unchanged.
  const delivery = approvedDeliveryProof(path.resolve(rootDir), spec, report);
  let content = updateFields(spec.content, {
    Status: 'complete',
    Updated: date,
    'Latest event': 'Spec completed and removed from the hot board.',
    'Next gate': 'none'
  });
  const deliveryProof = `approved delivery verified: ${delivery.remoteRef} at ${delivery.observedSha} contains approved candidate ${delivery.candidate} [${delivery.digest12}]`;
  content = appendEvidence(content, `| ${escapeCell(date)} | spec | Spec completed | ${escapeCell(`Acceptance gates satisfied; ${deliveryProof}`)} | Documentation impact recorded above | none |`);
  atomicWrite(spec.filePath, content);
  return showSpec(rootDir, id);
}

// S-00J TK-01S: verify that the owner-approved content is delivered on the
// declared default branch. Reuses `resolveDefaultBranchRemoteRef` (the
// manifest's `git.defaultBranch`, checked against its `origin/<branch>`
// remote-tracking ref), `git merge-base --is-ancestor` and
// `computeSpecDigest`. It reads local refs only and never fetches: the
// procedure refreshes the remote-tracking ref first, and this check proves
// only the pinned local observation. The ref is resolved once to its SHA so
// the ancestry and content checks read the same commit. It refuses an absent
// declaration or ref, an approved candidate the ref does not contain, and
// committed content there that is unreadable or substantively differs from
// the approved digest (containment followed by a reversal). The approved
// digest is `report.specDigest`, which `report.latestOwnerApproval` already
// matched; administrative fields stay excluded by the digest itself.
function approvedDeliveryProof(root, spec, report) {
  const id = spec.id;
  const approval = report.latestOwnerApproval;
  const digest12 = report.specDigest.slice(0, 12);
  const { defaultBranch, remoteRef } = resolveDefaultBranchRemoteRef(root);
  if (!defaultBranch) {
    throw new Error(`${id} cannot complete: the manifest declares no git.defaultBranch, so approved delivery on the default branch cannot be verified`);
  }
  if (!remoteRef) {
    throw new Error(`${id} cannot complete: no origin/${defaultBranch} remote-tracking ref exists to verify approved delivery; after the owner promotes integration to ${defaultBranch}, refresh it (git fetch origin ${defaultBranch}) and retry`);
  }
  const observed = spawnSync('git', ['-C', root, 'rev-parse', '--verify', '--quiet', `${remoteRef}^{commit}`], { encoding: 'utf8' });
  const observedSha = observed.status === 0 ? observed.stdout.trim() : '';
  if (!observedSha) throw new Error(`${id} cannot complete: ${remoteRef} does not resolve to a commit`);
  if (spawnSync('git', ['-C', root, 'merge-base', '--is-ancestor', approval.candidate, observedSha]).status !== 0) {
    throw new Error(`${id} cannot complete: approved candidate ${approval.candidate} is not contained in ${remoteRef} at ${observedSha}; the owner promotes integration to ${defaultBranch}, then refresh ${remoteRef} and retry`);
  }
  let deliveredDigest;
  try {
    deliveredDigest = computeSpecDigest(root, spec, observedSha);
  } catch (error) {
    throw new Error(`${id} cannot complete: approved content is unreadable on ${remoteRef} at ${observedSha}: ${error.message}`);
  }
  if (deliveredDigest !== report.specDigest) {
    throw new Error(`${id} cannot complete: ${remoteRef} at ${observedSha} contains approved candidate ${approval.candidate}, but its committed ${id} content [${deliveredDigest.slice(0, 12)}] differs from the approved content [${digest12}]; a later change on ${defaultBranch} altered or reversed it`);
  }
  return { defaultBranch, remoteRef, observedSha, candidate: approval.candidate, digest12 };
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

// S-00J TK-005: the owner Human QA counterpart to `reviewGapReason` above,
// checked after it so the two messages compose rather than race - a Spec
// missing both a verdict and an approval always names the verdict gap first.
// Mirrors the same three-way distinction: no owner-qa row at all, every
// recorded owner-qa row is for earlier content (the Spec changed since the
// owner looked at it), or the latest owner-qa entry for the current content
// is a finding rather than an approval. `report.latestOwnerApproval` is
// already resolved against `report.specDigest` by spec-report.mjs.
function approvalGapReason(report) {
  if (report.ownerApproval.length === 0) {
    return `no owner Human QA approval is recorded for ${report.id}`;
  }
  if (!report.latestOwnerApproval) {
    return `${report.id}'s recorded owner Human QA entries are all for earlier content - the current digest ${report.specDigest.slice(0, 12)} matches none of them, so the owner must approve again`;
  }
  if (report.latestOwnerApproval.result !== 'approve') {
    return `${report.id}'s latest owner Human QA for the current content is a finding, recorded ${report.latestOwnerApproval.date} by ${report.latestOwnerApproval.owner}`;
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
  if (options.landmark !== undefined) {
    if (options.spec !== undefined) throw new Error('gate names either --spec or --landmark, not both');
    return landmarkTaskGate(root, options);
  }
  const specId = resolveSpecId(root, requireValue(options.spec, 'gate requires --spec S-###'));
  const taskId = options.task ? resolveTaskId(findSpec(root, specId), options.task) : null;
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
      latestOwnerApproval: report.latestOwnerApproval,
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
  } else if (!report.candidate.matchesContent) {
    reason = `Candidate ${candidate} does not contain the reviewed committed content for ${specId}: ${report.candidate.contentError ?? `candidate digest ${report.candidate.contentDigest?.slice(0, 12)} differs from current digest ${report.specDigest.slice(0, 12)}`}.`;
  } else {
    // Integration precedes owner Human QA. Closure retains its approval gate.
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
    latestOwnerApproval: report.latestOwnerApproval,
    refused: reason !== null,
    reason
  };
}

export function render(rootDir, options = {}) {
  const root = path.resolve(rootDir);
  if (options.format === 'json') return renderJsonPreview(root);
  if (options.format !== undefined && options.format !== 'markdown') throw new Error(`Unsupported render format: ${options.format}; use json for the opt-in preview or markdown for the existing projection`);
  const specs = loadSpecs(root);
  const retired = loadRetiredSpecs(root);
  const landmarks = loadLandmarkParents(root);
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
    const relativeCatalog = laneCatalog(root, specs, retired);
    writeSafeFile(root, catalogPath, `# Spec Catalog\n\nDerived from stable specs; includes completed history.\n\n${CATALOG_START}\n${relativeCatalog}\n${CATALOG_END}\n`);
  }
  atomicWrite(taskboardPath, replaceRegion(taskboard, HOT_START, HOT_END, renderHotBoard(specs, retired, landmarks)));
  return { specs: specs.length, active: specs.filter((spec) => isHot(spec)).length, retired: retired.length };
}

function renderJsonPreview(root) {
  const output = path.join(root, 'TASKBOARD.preview.json');
  assertSafeWritePath(root, output);
  assertSafeReadPath(root, path.join(root, 'workbench', 'manifest.json'));
  // Refuse linked sources before loaders can skip a symlinked directory or
  // read through it. Traverse only the existing Spec/Task ownership shapes.
  const inspectFile = file => {
    assertSafeReadPath(root, file);
    if (fs.existsSync(file) && !fs.statSync(file).isFile()) throw new Error(`taskboard-source: ${file} must be an ordinary file`);
  };
  const inspectTasks = directory => {
    assertSafeReadPath(root, directory);
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const child = path.join(directory, entry.name);
      assertSafeReadPath(root, child);
      if (entry.isDirectory()) {
        if (TASK_LIFECYCLE_FOLDERS.includes(entry.name)) inspectTasks(child);
        else inspectFile(path.join(child, 'TASK.md'));
      }
    }
  };
  const inspectSpecs = directory => {
    assertSafeReadPath(root, directory);
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const child = path.join(directory, entry.name);
      assertSafeReadPath(root, child);
      if (!entry.isDirectory()) continue;
      if (SPEC_LIFECYCLE_FOLDERS.includes(entry.name)) inspectSpecs(child);
      else {
        const file = path.join(child, 'SPEC.md');
        inspectFile(file);
        if (fs.existsSync(file)) inspectTasks(path.join(child, 'tasks'));
      }
    }
  };
  // S-003Z TK-008E: every Spec home, the Blueprint-level lane and each
  // landmark's `specs/`.
  for (const home of specHomes(root)) inspectSpecs(home.specsRoot);
  // S-003Z TK-008G: a landmark's folder and its direct Tasks get the same
  // ordinary-file refusal before the loaders read them.
  const inspectLandmarks = directory => {
    assertSafeReadPath(root, directory);
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const child = path.join(directory, entry.name);
      assertSafeReadPath(root, child);
      if (!entry.isDirectory()) continue;
      if (LANDMARK_LIFECYCLE_FOLDERS.includes(entry.name)) inspectLandmarks(child);
      else {
        const file = path.join(child, 'LANDMARK.md');
        inspectFile(file);
        if (fs.existsSync(file)) inspectTasks(path.join(child, 'tasks'));
      }
    }
  };
  inspectLandmarks(collectionPath(root, 'landmarks'));
  const specs = [...loadSpecs(root), ...loadRetiredSpecs(root), ...loadLandmarkParents(root)];
  const completed = satisfiedBlockers(specs);
  const board = buildTaskboard(specs, { resolveTask(spec, task) {
    const slice = {
      ...task, declared: task.status, source: task.content ? 'record' : 'table', record: task,
      blockers: Array.isArray(task.blockers) ? task.blockers.join(', ') || 'none' : task.blockers,
      blockerIds: Array.isArray(task.blockers) ? task.blockers : splitBlockers(task.blockers),
      capabilities: task.capabilities ?? [], missingCapabilities: task.missingCapabilities ?? []
    };
    const entry = taskboardEntryForSlice(spec, slice, satisfiedIds(spec, completed));
    return { resolvedStatus: entry.status, dependenciesMet: entry.dependenciesMet };
  } });
  for (const lane of Object.values(board.lanes)) for (const card of Object.values(lane)) for (const source of card.sourceLinks) {
    const file = path.join(root, source);
    inspectFile(file);
    if (!fs.existsSync(file)) throw new Error(`taskboard-source: missing source link ${source}`);
  }
  writeSafeFile(root, output, JSON.stringify(board, null, 2)+'\n');
  return { format: 'json-preview', path: 'TASKBOARD.preview.json', schemaVersion: board.schemaVersion, cards: Object.values(board.lanes).reduce((count, lane) => count + Object.keys(lane).length, 0) };
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
  // S-003Z TK-008G: a landmark whose artifact or direct Task record cannot be
  // read is reported by name as `malformed-landmark` (landmarkFindings, through
  // collectionFindings below, reads the same files); the rest of the room is
  // still checked against the landmarks that could be read.
  const landmarks = readableLandmarkParents(root);
  issues.push(...packetFindings(specs, options, retired, root, landmarks));
  issues.push(...uncapturedCompleteFindings(root, specs.filter((spec) => !spec.sliceConflict)));
  const blueprint = fs.existsSync(path.join(root, 'BLUEPRINT.md')) ? fs.readFileSync(path.join(root, 'BLUEPRINT.md'), 'utf8') : '';
  if (blueprint.includes(CATALOG_START) || blueprint.includes(CATALOG_END)) checkRender(root, 'BLUEPRINT.md', CATALOG_START, CATALOG_END, renderCatalog(specs, retired), issues);
  else checkRender(root, path.relative(root, path.join(resolveSpecsRoot(root).specsRoot, 'CATALOG.md')), CATALOG_START, CATALOG_END, laneCatalog(root, specs, retired), issues);
  checkRender(root, 'TASKBOARD.md', HOT_START, HOT_END, renderHotBoard(specs, retired, landmarks), issues);
  issues.push(...collectionFindings(root));
  issues.push(...skillFindings(root));
  issues.push(...gitFindings(root, specs, issues));
  return issues;
}

// The CLI doctor seam. Plain doctor is `doctor()` above and never probes the
// host. `--host` is the session-start invocation (S-00V TK-00H): it adds the
// host floor report and its `host-floor-unmet` findings, so a missing floor
// item fails this invocation only. Its JSON is `{ floor, findings }`; plain
// doctor's JSON stays the bare finding array. `options.probes` injects the
// host probes for tests.
export function doctorCommand(rootDir, options = {}) {
  const root = path.resolve(rootDir);
  const floor = options.host ? checkHostFloor(root, { probes: options.probes }) : null;
  const findings = [...doctor(root, options), ...(floor?.findings ?? [])];
  const report = formatDoctorReport(findings);
  return {
    findings,
    floor,
    exitCode: blocksSelection(findings) ? 1 : 0,
    json: floor ? { floor: floor.items, findings } : findings,
    text: floor ? `${formatHostFloor(floor.items)}\n${report}` : report
  };
}

// Validate proposed spec bytes without touching files or inspecting the host.
export function validateSpecCandidate(root, filePath, content) {
  const specs = loadSpecs(root, { allowDuplicates: true, contentOverrides: new Map([[path.resolve(filePath), content]]) });
  return packetFindings(specs, {}, [], null, readableLandmarkParents(root));
}

function packetFindings(specs, options = {}, retiredSpecs = [], root = null, landmarks = []) {
  const issues = [];
  issues.push(...identityFindings(specs, retiredSpecs, landmarks));
  // S-00I TK-006: doctor's safety net for a discard that bypassed the gate
  // (a raw `git rm`) or a reference added back afterward. `root` is only
  // available from `doctor`, exactly like the wiki-owner check below, never
  // from `validateSpecCandidate`'s bytes-only check.
  if (root) {
    for (const item of discardedReferences(root)) {
      issues.push(finding('discarded-reference', `${item.file} references ${item.target}, a path this room's own DISCARDS.md register says was discarded`, { file: item.file, target: item.target }));
    }
  }
  // S-00I TK-003: a retired Spec is outside ordinary selection, so it gets
  // only the two checks that matter once a record is out of the active
  // roster - its id cannot be reused (folded into identityFindings above,
  // which already saw both arrays) and its own path must be stable for the
  // folder it actually lives in - plus the one retirement-specific fact
  // nothing else surfaces: a retired Spec whose own header still disagrees
  // that it is complete. None of the active-roster checks below (slice
  // status, stale-claim, broken-link) apply to completed history. Anchored
  // corrective Tasks alone retain their execution dependency checks.
  for (const spec of retiredSpecs) {
    if (!spec.sliceConflict) {
      const completed = satisfiedBlockers([...specs, ...retiredSpecs, ...landmarks]);
      const satisfied = satisfiedIds(spec, completed);
      const head = executionSlices(spec).find(slice => ['in-progress', 'ready'].includes(slice.declared));
      if (head?.declared === 'ready' && !blockersSatisfied(head.blockers, satisfied)) {
        issues.push(finding('blocked-slice', `${spec.id}/${head.id} waits on ${head.blockers}`, { specId: spec.id, taskId: head.id }));
      }
    }
    if (!spec.relativePath.startsWith(`${spec.specsPrefix}/${spec.lifecycleFolder}/${spec.id}-`)) {
      issues.push(finding('unstable-path', `${spec.id} path must start ${spec.specsPrefix}/${spec.lifecycleFolder}/${spec.id}-`, { specId: spec.id }));
    }
    if (spec.status !== 'complete') {
      issues.push(finding('retired-not-complete', `${spec.id} is retired in ${spec.lifecycleFolder}/ but its Status is ${spec.status}, not complete`, { specId: spec.id }));
    }
    // S-00I TK-005: retirement's whole precondition is that a durable Wiki
    // owner existed at the time of the move; nothing stops that note going
    // stale or disappearing afterward, so this is the one check that
    // notices. `root` is only available from `doctor` (never from
    // `validateSpecCandidate`'s bytes-only check, which never sees a
    // retired Spec anyway since it validates one Spec's own candidate
    // content), so this is skipped rather than thrown when it is absent.
    if (root) {
      const wikiOwnerStatus = retiredSpecWikiOwnerStatus(root, spec.relativePath);
      if (wikiOwnerStatus === null) {
        issues.push(finding('retired-wiki-owner-stale', `${spec.id} is retired but no Wiki note names its historical route ${spec.relativePath} in source_paths`, { specId: spec.id }));
      } else if (wikiOwnerStatus !== 'active') {
        issues.push(finding('retired-wiki-owner-stale', `${spec.id}'s Wiki durable owner is status ${wikiOwnerStatus}, not active`, { specId: spec.id }));
      }
    }
  }
  // S-00I TK-004: the Task analogue of the retired-Spec check above, run over
  // every Spec (active roster and retired alike, since a Spec can retire its
  // own Tasks individually before or independently of its own retirement).
  // `retiredRecords` is never read by `slicesOf`, so this is the one place a
  // retired Task's own disagreeing Status becomes visible.
  for (const spec of [...specs, ...retiredSpecs, ...landmarks]) {
    for (const task of spec.retiredRecords ?? []) {
      if (taskStatus(task) !== 'done') {
        issues.push(finding('retired-task-not-done', `${spec.id}/${task.id} is retired in tasks/${task.lifecycleFolder}/ but its Status is ${taskStatus(task)}, not done`, { ...parentKey(spec), taskId: task.id }));
      }
    }
  }
  const completed = satisfiedBlockers([...specs, ...retiredSpecs, ...landmarks]);
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
    issues.push(...sliceFindings(spec, slices, satisfied));
    if (['complete', 'superseded'].includes(spec.status) && slices.some((slice) => slice.declared !== 'done')) {
      issues.push(finding('contradictory-state', `${spec.id} is ${spec.status} with unfinished tasks`, { specId: spec.id }));
    }
    issues.push(...staleClaimFindings(spec, slices, options));
    for (const link of localLinks(spec.content)) {
      const target = path.resolve(path.dirname(spec.filePath), link);
      if (!target.startsWith(spec.root + path.sep) || !fs.existsSync(target)) issues.push(finding('broken-link', `${spec.id} links to missing ${link}`, { specId: spec.id }));
    }
    issues.push(...liveRecordCitations(spec));
  }
  issues.push(...landmarkTaskFindings(landmarks, completed, options));
  return issues;
}

// The per-slice checks every parent's Task records get, a Spec's or a
// landmark's (S-003Z TK-008G): status vocabulary, proof on a done Task, blocker
// grammar, a declared block with nothing to clear, a corrupt Receipt, a
// malformed source, and an authored To-do waiting on an unmet dependency.
function sliceFindings(spec, slices, satisfied) {
  const issues = [];
  const owner = parentKey(spec);
  for (const slice of slices) {
    if (!TASK_STATUSES.includes(slice.declared)) issues.push(finding('invalid-state', `${spec.id}/${slice.id} has invalid status ${slice.declared}`, { ...owner, taskId: slice.id }));
    if (slice.declared === 'done' && (!slice.proof || /^pending$/i.test(slice.proof))) issues.push(finding('missing-evidence', `${spec.id}/${slice.id} is done without proof`, { ...owner, taskId: slice.id }));
    // S-00J TK-01T: an unknown qualifier already fails closed (it never
    // enters the satisfied set); naming it here is what keeps that from
    // being a silent wait. A done slice's blockers no longer gate anything.
    if (slice.declared !== 'done') {
      for (const token of slice.blockerIds.filter((item) => blockerKind(item) === 'unknown-qualifier')) {
        issues.push(finding('unknown-blocker-qualifier', `${spec.id}/${slice.id} names blocker ${token}, whose qualifier is not known blocker grammar (a plain S-###, TK-### or LMK-###, S-###:delivered, or owner:<decision>); it stays unmet until corrected`, { ...owner, taskId: slice.id, blocker: token }));
      }
    }
    // S-00J TK-02J: the resolver keeps such a record blocked instead of
    // handing it out; naming it keeps that from being a silent wait.
    if (slice.source === 'record' && slice.declared === 'blocked' && !namesResolvableBlocker(slice)) {
      issues.push(finding('blocked-without-blocker', `${spec.id}/${slice.id} is declared blocked but names no resolvable blocker (Blockers: ${slice.blockers}); it stays blocked until a real blocker is recorded or its Status is corrected`, { ...owner, taskId: slice.id }));
    }
    // A malformed Receipt or an altered earlier row fails closed on read
    // (task-receipt.mjs's own checksum chain); reported here by name so
    // doctor keeps reporting every other spec, slice and scope instead of
    // the raw exception this used to throw straight through the board.
    if (slice.source === 'record') {
      try {
        readReceiptFromFile(slice.record.filePath);
      } catch (error) {
        issues.push(finding('receipt-corrupt', `${spec.id}/${slice.id} Receipt: ${error.message}`, { ...owner, taskId: slice.id }));
      }
    }
  }
  // Every authored To-do with unmet dependencies stays visible and unoffered.
  // Existing registered selected-slice findings name each wait; declared
  // blocked sequencing remains separate and never becomes a new global gate.
  for (const slice of slices) {
    let entry;
    try { entry = taskboardEntryForSlice(spec, slice, satisfied); }
    catch (error) {
      if (error.code !== 'taskboard-source') throw error;
      if (TASK_STATUSES.includes(slice.declared)) issues.push(finding('invalid-state', error.message, { ...owner, taskId: slice.id }));
      continue;
    }
    if (spec.status === 'active' && entry.lane === 'toDo' && !entry.dependenciesMet) {
      issues.push(finding('blocked-slice', `${spec.id}/${slice.id} waits on ${slice.blockers}`, { ...owner, taskId: slice.id }));
    }
  }
  return issues;
}

function staleClaimFindings(spec, slices, options) {
  const updated = Date.parse(`${spec.updated}T00:00:00Z`);
  const now = Date.parse(`${options.today ?? today()}T00:00:00Z`);
  if (slices.some((slice) => slice.declared === 'in-progress') && Number.isFinite(updated) && now - updated > 86_400_000) {
    return [finding('stale-claim', `${spec.id} has an in-progress task last updated ${spec.updated}`, parentKey(spec))];
  }
  return [];
}

// S-003Z TK-008G: a landmark's direct Tasks get the slice checks a Spec's get,
// plus a reached landmark that still holds an unfinished direct Task. The
// landmark artifact itself is checked by landmarkFindings (collectionFindings).
function landmarkTaskFindings(landmarks, completed, options) {
  const issues = [];
  for (const parent of landmarks) {
    const slices = slicesOf(parent);
    if (!parent.lifecycleFolder) {
      issues.push(...sliceFindings(parent, slices, satisfiedIds(parent, completed)));
      issues.push(...staleClaimFindings(parent, slices, options));
    }
    if (parent.status === 'reached' && slices.some((slice) => slice.declared !== 'done')) {
      issues.push(finding('contradictory-state', `${parent.id} is reached with unfinished direct Tasks`, { landmarkId: parent.id }));
    }
  }
  return issues;
}

// S-00V TK-00J: a notepad or handoff may be committed temporarily so a
// continuation travels with the branch, but committing one is transport,
// never evidence. A Spec or active Task record that links a live record -
// committed or not - is citing working context that will be promoted and
// removed, so it is reported with the ADR validator's registered code rather
// than left to surface later as a `broken-link` once the record is gone.
function liveRecordCitations(spec) {
  const sources = [{ filePath: spec.filePath, content: spec.content }];
  for (const record of spec.records ?? []) {
    if (record.filePath && fs.existsSync(record.filePath)) sources.push({ filePath: record.filePath, content: fs.readFileSync(record.filePath, 'utf8') });
  }
  const issues = [];
  const seen = new Set();
  for (const source of sources) {
    for (const link of markdownLinkTargets(source.content)) {
      const target = liveRecordPath(spec.root, path.resolve(path.dirname(source.filePath), link));
      if (!target || seen.has(target)) continue;
      seen.add(target);
      issues.push(finding('untracked-provenance', `${spec.id} cites live record ${target}; a notepad or handoff is working context even when committed, so cite the durable owner it was promoted into`, { specId: spec.id, target }));
    }
  }
  return issues;
}

// Inspection reads the room's skills lane and discovery adapters; it never
// reads the provider home and never writes (S-00V: skills ship in the room).
function skillFindings(root) {
  return inspectSkills(readManifest(root), root);
}

function gitFindings(root, specs, sourceFindings = []) {
  const manifest = readManifest(root);
  if (!manifest || manifest.schemaVersion !== 2) return [];
  return [...integrationBranchFindings(root, specs, sourceFindings), ...repositoryStateFindings(root)];
}

// S-00M TK-002: what TK-001's reader sees and no other finding observes. Both
// codes are registered `attention`/`none`, so they change neither doctor's
// exit code nor next's selection. An unknown state (no Git, not a repository,
// unresolvable lanes) reports nothing here: `integration-branch-missing`
// already names the not-a-repository case, and guessing Git state is worse
// than stating none.
const UNTRACKED_NAMED = 10;
function repositoryStateFindings(root) {
  const state = readRepositoryState(root);
  if (!state.known) return [];
  const findings = [];
  if (state.head.detached) {
    findings.push(finding('detached-head', 'HEAD is detached; this is an inspection state, not a blocker, but switch to a branch before committing work you intend to deliver'));
  }
  const files = [...state.untracked.controls, ...state.untracked.adr, ...state.untracked.specs];
  if (files.length > 0) {
    const named = files.slice(0, UNTRACKED_NAMED).join(', ');
    const more = files.length > UNTRACKED_NAMED ? ` and ${files.length - UNTRACKED_NAMED} more` : '';
    findings.push(finding('untracked-controls', `${files.length} untracked file(s) under the root controls, the ADR collection or the spec lane: ${named}${more}; commit or remove them before claiming the work done`, { files }));
  }
  return findings;
}

// The declared integration branch is the review gate's merge target. Its
// absence is an error every doctor run shows and none blocks: a room can
// create the branch in one command, and selection must not wait on it.
function integrationBranchFindings(root, specs, sourceFindings = []) {
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
  // Expected malformed active source is already a registered diagnostic from
  // packetFindings. Informational integration selection cannot resolve through
  // that source, so skip only its known conflict/invalid-state conditions.
  // Non-active records are outside this selector and never suppress its lookup;
  // unexpected calculation exceptions still propagate instead of disappearing.
  const diagnosticSpecs = specs.filter((item) => {
    const hasActiveSliceConflict = item.status === 'active' && item.sliceConflict;
    const hasActiveInvalidState = item.status === 'active'
      && sourceFindings.some((issue) => issue.code === 'invalid-state' && issue.specId === item.id);
    return !hasActiveSliceConflict && !hasActiveInvalidState;
  });
  const selected = selectCandidate(diagnosticSpecs);
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
  // S-003X TK-004X: the DDR collection carries its findings beside the ADR's.
  try {
    if (fs.existsSync(collectionPath(root, 'ddr'))) findings.push(...validateAdrs(root, { kind: 'ddr' }));
  } catch (error) {
    findings.push(finding('invalid-ddr', `DDR validation failed: ${error.message}`));
  }
  // S-003Z TK-008D: the landmarks collection carries its artifact findings
  // here: each malformed LANDMARK.md by name, a folder off the
  // `<collection>/LMK-###-` shape, and a duplicated landmark identity. A room
  // with no landmarks folder has nothing to report.
  try {
    if (fs.existsSync(collectionPath(root, 'landmarks'))) findings.push(...landmarkFindings(root));
  } catch (error) {
    findings.push(finding('malformed-landmark', `landmark validation failed: ${error.message}`));
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
//
// S-003Z TK-008E: the active roster is the top level of every Spec home
// (`specHomes`): the Blueprint-level lane, then each landmark folder's
// `specs/`. Each Spec names the home it sits in (`specsPrefix`) and its
// parent landmark (`landmarkId`, `null` at the Blueprint level).
export function loadSpecs(rootDir, options = {}) {
  const root = path.resolve(rootDir);
  const located = [];
  for (const home of specHomes(root)) {
    if (!fs.existsSync(home.specsRoot)) continue;
    const paths = [];
    for (const entry of fs.readdirSync(home.specsRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const filePath = path.join(home.specsRoot, entry.name, 'SPEC.md');
      if (fs.existsSync(filePath)) paths.push(filePath);
    }
    located.push(...paths.sort().map((filePath) => ({ filePath, home })));
  }
  const specs = located.map(({ filePath, home }) => {
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
    const spec = { ...parseSpecPacket(content, filePath, root, { recordBacked }), specsPrefix: home.specsPrefix, landmarkId: home.landmarkId, records, retiredRecords, recordBacked };
    spec.formerId = specFormerId(content, spec.id);
    assertOneSliceTruth(spec);
    return spec;
  });
  if (!options.allowDuplicates) {
    const collision = identityFindings(specs)[0];
    if (collision) throw new Error(collision.message);
  }
  return specs;
}

// S-01W TK-002O: a Spec's `**Former ID:**` header field, read through the
// same rule a Task record uses (`parseFormerId` in task-record.mjs). The Spec
// packet parser keeps the last of a repeated field, so a repeat is refused
// here rather than silently choosing one former spelling.
function specFormerId(content, id) {
  const values = [...content.matchAll(/^\*\*Former ID:\*\*\s*(.+)$/gm)].map((match) => match[1]);
  if (values.length > 1) throw new Error(`${id} has a duplicated field "Former ID"; a record carries at most one former spelling`);
  return parseFormerId(values[0], id);
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
  const specs = [];
  // S-003Z TK-008E: each Spec home's own lifecycle folders, so a nested Spec
  // retires into `<landmark>/specs/retired/` and is read back from there.
  for (const home of specHomes(root)) for (const folder of SPEC_LIFECYCLE_FOLDERS) {
    const folderRoot = path.join(home.specsRoot, folder);
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
      const spec = { ...parseSpecPacket(content, filePath, root, { recordBacked }), specsPrefix: home.specsPrefix, landmarkId: home.landmarkId, records, retiredRecords, recordBacked, lifecycleFolder: folder };
      spec.formerId = specFormerId(content, spec.id);
      assertOneSliceTruth(spec);
      specs.push(spec);
    }
  }
  return specs;
}

// ---- S-003Z TK-008G: Tasks directly under a landmark ----
// A landmark (ADR-000U) may hold direct Tasks at `<landmark>/tasks/TK-###/
// TASK.md`, each naming it in `**Landmark ID:**` (task-record.mjs). The
// lifecycle commands read the landmark as the parent those Tasks sit under,
// through the slice, selection, claim, close, receipt, render and move code a
// record-backed Spec uses: a landmark parent is the parsed landmark
// (landmark-artifact.mjs) shaped like a loaded Spec - `kind: 'landmark'`, no
// slice table, its direct Task records active and retired - so one path
// serves both parents and a Spec's behavior is unchanged. A Spec nested in a
// landmark's `specs/` folder is an ordinary Spec read through `specHomes`
// (TK-008E), never a landmark parent.
export function isLandmarkId(value) {
  return typeof value === 'string' && /^LMK-/i.test(value);
}

function landmarkParent(root, landmark) {
  const dir = path.dirname(landmark.filePath);
  return {
    ...landmark,
    kind: 'landmark',
    blockers: landmark.blockers.length > 0 ? landmark.blockers.join(', ') : 'none',
    rows: [],
    records: listTaskRecords(dir, root),
    retiredRecords: listRetiredTaskRecords(dir, root),
    recordBacked: true
  };
}

// Every landmark at both homes as a parent. A malformed landmark or direct
// Task record refuses the load, as a malformed Spec refuses `loadSpecs`.
export function loadLandmarkParents(rootDir) {
  const root = path.resolve(rootDir);
  return [...loadLandmarks(root), ...loadRetiredLandmarks(root)].map((landmark) => landmarkParent(root, landmark));
}

// Doctor's reading: every landmark parent that can be read. An unreadable
// artifact or direct Task record is skipped here because doctor names it as
// `malformed-landmark` through landmarkFindings, which reads the same files.
function readableLandmarkParents(rootDir) {
  const root = path.resolve(rootDir);
  const parents = [];
  for (const landmark of loadReadableLandmarks(root)) {
    try { parents.push(landmarkParent(root, landmark)); } catch { /* named by landmarkFindings */ }
  }
  return parents;
}

function resolveLandmarkId(rootDir, selector) {
  const root = path.resolve(rootDir);
  return resolveStoredId('landmark', selector, [...loadLandmarks(root), ...loadRetiredLandmarks(root)].map((landmark) => ({ id: landmark.id, where: landmark.relativePath })));
}

// The active roster first, then the lifecycle folders, as `findSpec` does.
function findLandmarkParent(rootDir, selector) {
  const id = resolveLandmarkId(rootDir, selector);
  const parents = loadLandmarkParents(rootDir).filter((parent) => parent.id === id);
  const active = parents.filter((parent) => !parent.lifecycleFolder);
  const found = active.length > 0 ? active : parents;
  if (found.length > 1) throw new Error(`Duplicate landmark ID: ${id}`);
  if (found.length === 1) return found[0];
  throw new Error(`Unknown landmark ID: ${id}`);
}

// No Task runs under a landmark that is retired, not `active`, or held by no
// one: the Spec's decision, since the Contract's Instruction Authority names
// only an assigned delegate. `null` when its Tasks may run.
function landmarkRefusal(parent) {
  if (parent.lifecycleFolder) return `${parent.id} is retired in ${parent.lifecycleFolder}/; no Task runs under a retired landmark`;
  if (parent.status !== 'active') return `${parent.id} is ${parent.status}, not active`;
  if (parent.owner === 'unassigned') return `${parent.id} is unassigned (Owner: unassigned); no Task runs under an unassigned landmark`;
  return null;
}

// Whether `next` and `claim` may select a Task under this parent: an active
// Spec, a retired Spec's anchored corrective Tasks, or an assigned active
// landmark.
function executable(parent) {
  if (parent.kind === 'landmark') return landmarkRefusal(parent) === null;
  return parent.status === 'active' || parent.lifecycleFolder === 'retired';
}

// The key a result names a Task's parent by: `specId`, or `landmarkId` for a
// landmark-direct Task.
function parentKey(parent) {
  return parent.kind === 'landmark' ? { landmarkId: parent.id } : { specId: parent.id };
}

function parentIdOf(item) {
  return item.specId ?? item.landmarkId;
}

function closedNextGate(parent, remaining) {
  if (remaining) return `Complete ${remaining.id}.`;
  return parent.kind === 'landmark' ? 'Confirm the reached checks and the reached result.' : 'Confirm acceptance criteria and completion result.';
}

function showLandmark(rootDir, selector) {
  const parent = findLandmarkParent(rootDir, selector);
  const body = parent.lifecycleFolder
    ? `Retired: ${parent.relativePath} (historical route; out of ordinary discovery, reachable only by this explicit lookup)\n\n${parent.content}`
    : parent.content;
  return {
    ...publicLandmark({ ...parent, blockers: splitBlockers(parent.blockers) }),
    tasks: slicesOf(parent).map(publicSlice),
    retiredTasks: parent.retiredRecords.map(publicRetiredTask),
    body
  };
}

// The Task-PR form of `gate` for a landmark-direct Task (`gate --task TK-###
// --landmark LMK-###`): reported under the same exemption a Spec's Task PR
// is, never refused for the landmark being unfinished, but refused by name
// when the landmark holds no such Task or is already reached or retired. The
// whole-landmark review gate is a later slice and is not this command.
function landmarkTaskGate(root, options) {
  const parent = findLandmarkParent(root, requireValue(options.landmark, 'gate --landmark requires LMK-###'));
  if (!options.task) throw new Error('gate --landmark requires --task TK-###; it reports a landmark-direct Task PR');
  const taskId = resolveTaskId(parent, options.task);
  let reason = null;
  if (![...parent.records, ...parent.retiredRecords].some((task) => task.id === taskId)) {
    reason = `No Task record named ${taskId} exists under ${parent.id}; a Task PR must name a Task that actually belongs to the landmark it presents.`;
  } else if (parent.lifecycleFolder || parent.status === 'reached') {
    reason = `${parent.id} is already ${parent.lifecycleFolder ? `retired in ${parent.lifecycleFolder}/` : 'reached'}; a Task PR is reported only while its landmark is still open.`;
  }
  return {
    mode: 'task-pr',
    taskId,
    landmarkId: parent.id,
    integrationBranch: declaredGit(root)?.integrationBranch ?? null,
    exemption: TASK_PR_EXEMPTION,
    landmarkStatus: parent.status,
    refused: reason !== null,
    reason
  };
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
      capabilities: [],
      missingCapabilities: [],
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
    capabilities: task.capabilities,
    missingCapabilities: task.missingCapabilities,
    source: 'record',
    record: task
  }));
}

// Retired Specs retain their completed history. Only the corrective records
// generated against a named review/owner finding re-enter execution; an old
// ordinary Task edited to ready must never reopen historical work.
function executionSlices(spec) {
  const slices = slicesOf(spec);
  if (spec.lifecycleFolder !== 'retired') return slices;
  const rows = evidenceRows(spec.content).map(parseMarkdownTableRow);
  return slices.filter(slice => {
    const task = slice.record;
    if (!task || task.destination.type !== 'spec-acceptance' || task.destination.reference !== `${spec.id} Acceptance Criteria`) return false;
    const marker = /^Answers evidence row (\d+) \((fail verdict|owner QA finding) at (\S+) on (\d{4}-\d{2}-\d{2})\): (.+)$/.exec(task.plannedVerification ?? '');
    if (!marker) return false;
    const cells = rows[Number(marker[1]) - 1];
    if (!cells || cells[0] !== marker[4]) return false;
    const review = marker[2] === 'fail verdict';
    const event = /^(Review verdict: fail|Owner QA: finding) at (\S+) \[[0-9a-f]{12}\] #\d+$/.exec(cells[2]);
    return cells[1] === (review ? 'review' : 'owner-qa') && event?.[1] === (review ? 'Review verdict: fail' : 'Owner QA: finding') && event?.[2] === marker[3];
  });
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

// S-00J TK-01T: the one satisfied set every blocker site - `next`, `claim`,
// `render` and both doctor passes - resolves against, so the four can never
// disagree about an edge. It holds tokens, not only ids, so the existing
// plain membership checks (`blockersSatisfied`, `unmetBlockers`) read the
// new grammar without a second resolver:
//   - `S-###`: that Spec is `complete` or `superseded` (unchanged meaning;
//     the dependent needs final closure, T3).
//   - `S-###:delivered`: that Spec is `complete` or `superseded`, or it has
//     reached reviewed delivery on integration (T0 of S-00J's
//     closure-capture transition contract; `reviewedDelivery` below).
// Any other qualifier is never added, so it fails closed as unmet; doctor
// names it (`unknown-blocker-qualifier`). T0 is evaluated only for a Spec
// a Spec or slice actually names with `:delivered`, so a room that never uses the
// token pays nothing for it. Resolution only reads: working-tree records,
// local Git objects and the local declared integration ref. It never writes,
// fetches or moves a ref; fetching before relying on it is procedure.
function satisfiedBlockers(specs) {
  const satisfied = new Set();
  for (const spec of specs) {
    // S-003Z TK-008G: a reached landmark satisfies `LMK-###`, at either home.
    if (spec.kind === 'landmark') {
      if (spec.status === 'reached') satisfied.add(spec.id);
      continue;
    }
    if (!['complete', 'superseded'].includes(spec.status)) continue;
    satisfied.add(spec.id);
    satisfied.add(`${spec.id}:delivered`);
  }
  const wanted = new Set();
  for (const spec of specs) {
    const tokens = [
      ...splitBlockers(spec.blockers),
      ...spec.rows.filter((row) => row.status !== 'done').flatMap((row) => splitBlockers(row.blockers)),
      ...spec.records.filter((task) => taskStatus(task) !== 'done').flatMap((task) => task.blockers)
    ];
    for (const token of tokens) {
      if (blockerKind(token) === 'delivered' && !satisfied.has(token)) wanted.add(token);
    }
  }
  for (const token of wanted) {
    const id = token.slice(0, token.indexOf(':'));
    const matches = specs.filter((spec) => spec.id === id);
    if (matches.length === 1 && reviewedDelivery(matches[0])) satisfied.add(token);
  }
  return satisfied;
}

// The blocker grammar: `plain` (`S-###` or `TK-###`), `delivered`
// (`S-###:delivered`), `owner` (`owner:<decision>`, S-00J TK-02J: known
// grammar that no resolver ever satisfies; it clears only when removed),
// `unknown-qualifier` (any other `<id>:<qualifier>` the Task-record parser
// admits so doctor can name it), or `other` (legacy slice-table prose, left
// exactly as unmet as it always was).
// S-003Z TK-008G: a plain `LMK-###` names a landmark, satisfied once that
// landmark is reached (`satisfiedBlockers`).
function blockerKind(token) {
  if (/^(?:S|TK|LMK)-[0-9A-Za-z]+$/.test(token)) return 'plain';
  if (/^S-[0-9A-Za-z]+:delivered$/.test(token)) return 'delivered';
  if (/^owner:[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(token)) return 'owner';
  if (/^(?:S|TK|LMK)-[0-9A-Za-z]+:[A-Za-z][0-9A-Za-z-]*$/.test(token)) return 'unknown-qualifier';
  return 'other';
}

// T0, reviewed delivery, read from the existing S-00J readers rather than a
// second parser: every Task done and every acceptance line checked
// (`assembleSpecReport`), the latest verdict bound to the Spec's current
// content digest is a PASS (`latestVerdict`), its candidate is an ancestor of
// the manifest-declared integration branch as resolved by
// `resolveIntegrationContainmentRef` (`origin/<branch>` when it exists, else
// the local branch; S-00J TK-002N), the check owner approval also makes,
// and the Spec/Task content committed at that candidate hashes to the same
// digest (`computeSpecDigest`). A room with no
// declared integration branch has nothing to check containment against, so
// the edge stays unmet. Any read failure is an unmet edge, never a throw
// through `next`, `render` or doctor.
function reviewedDelivery(spec) {
  const containment = resolveIntegrationContainmentRef(spec.root);
  if (!containment.ref) return false;
  try {
    const report = assembleSpecReport(spec.root, spec.id);
    if (report.tasks.some((task) => task.status !== 'done')) return false;
    if (report.acceptance.some((line) => !line.checked)) return false;
    const verdict = report.latestVerdict;
    if (verdict?.result !== 'pass') return false;
    if (!isAncestorOfBranch(spec.root, verdict.candidate, containment.ref)) return false;
    return computeSpecDigest(spec.root, spec, verdict.candidate) === report.specDigest;
  } catch {
    return false;
  }
}

// A table row's status cell is its status, unchanged. A record's `ready` and
// `blocked` are resolved against its live blockers instead: a record whose
// declared blockers are all satisfied is ready without anyone editing a
// status cell, and one whose blockers are unmet is blocked even if its cell
// says ready. This is a derivation of the record's own two authored fields,
// not a second status written anywhere.
//
// S-00V TK-00K: a record blocked for a missing optional capability is not an
// id block, so satisfied id blockers do not turn it ready. It stays blocked
// unless a `session` establishes every recorded missing capability; with no
// session (render, doctor) it is blocked, so the board is a deterministic
// projection of the records.
//
// S-00J TK-02J: a declared `blocked` derives `ready` only when a real
// blocker has cleared - the record names at least one (an id blocker or a
// recorded missing capability) and every id blocker is a satisfied known id
// form. A record declared `blocked` on nothing stays blocked (doctor names
// it, `blocked-without-blocker`); an `owner:<decision>` or unknown token is
// never in the satisfied set, so it stays blocked as an unmet blocker.
function effectiveStatus(slice, satisfied, session = null) {
  if (slice.source !== 'record') return slice.declared;
  if (slice.declared !== 'ready' && slice.declared !== 'blocked') return slice.declared;
  if (slice.declared === 'blocked' && slice.missingCapabilities.length > 0
    && (!session || session.missing(slice.missingCapabilities).names.length > 0)) return 'blocked';
  if (slice.declared === 'blocked' && !namesResolvableBlocker(slice)) return 'blocked';
  return unmetBlockers(slice.record, satisfied).length === 0 ? 'ready' : 'blocked';
}

// Existing blocker/capability resolution supplies facts; one pure lane and
// eligibility calculation serves preview, ordinary selection, claim and doctor.
function taskboardEntryForSlice(spec, slice, satisfied, session = null) {
  return taskboardTaskEntry(spec, { ...slice, status: slice.declared, content: slice.record?.content }, {
    resolvedStatus: effectiveStatus(slice, satisfied, session),
    dependenciesMet: blockersSatisfied(slice.blockers, satisfied)
  });
}

// Whether a record's declared `blocked` rests on something that can clear:
// a recorded missing capability, or at least one blocker in the known
// grammar (`plain`, `delivered` or `owner`). Blockers `none`, or only
// unknown qualifiers, leave nothing that could ever resolve.
function namesResolvableBlocker(slice) {
  if (slice.missingCapabilities.length > 0) return true;
  return slice.blockerIds.some((token) => ['plain', 'delivered', 'owner'].includes(blockerKind(token)));
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
  const result = { id: slice.id, slice: slice.slice, status: slice.declared, blockers: slice.blockers, proof: slice.proof ?? null };
  // S-00V TK-00K: present only on a record that names capabilities, so every
  // other Task's `show` output is unchanged.
  if (slice.capabilities.length > 0) result.capabilities = slice.capabilities;
  if (slice.missingCapabilities.length > 0) result.missingCapabilities = slice.missingCapabilities;
  if (slice.record?.formerId) result.formerId = slice.record.formerId;
  return result;
}

// S-00I TK-004: a retired Task record, shaped like `publicSlice` above but
// read straight off the record (there is no "slice" resolution for it - a
// retired Task is out of `slicesOf` entirely). Kept under its own key on
// `show`'s output, never folded into `tasks`, so a retired Task cannot be
// mistaken for one still on the active roster.
function publicRetiredTask(task) {
  return {
    id: task.id,
    ...(task.formerId ? { formerId: task.formerId } : {}),
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
// S-003Z TK-008G: `landmarks` (landmark parents) join the Task identity
// checks only - a duplicated landmark identity is landmarkFindings' to name -
// so a landmark-direct Task cannot reuse a letter-bearing Task ID any Spec or
// other landmark holds.
function identityFindings(specs, retiredSpecs = [], landmarks = []) {
  const findings = [];
  const specIds = new Map();
  const globalTasks = new Map();
  for (const spec of [...specs, ...retiredSpecs, ...landmarks]) {
    const specKey = visibleIdKey(spec.id);
    const owner = parentKey(spec);
    if (spec.kind === 'landmark') { /* identity checked by landmarkFindings */ }
    else if (specIds.has(specKey)) findings.push(finding('duplicate-id', `Duplicate spec ID: ${spec.id} conflicts with ${specIds.get(specKey)}`, { specId: spec.id }));
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
        if (localTasks.has(key)) findings.push(finding('duplicate-id', `Duplicate task ID: ${spec.id}/${item.id}`, { ...owner, taskId: item.id }));
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
      if (activeIds.has(key)) findings.push(finding('duplicate-id', `Duplicate task ID: ${spec.id}/${task.id} is both active and retired`, { ...owner, taskId: task.id }));
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
      if (globalTasks.has(key)) findings.push(finding('duplicate-id', `Duplicate task ID: ${spec.id}/${id} conflicts with ${globalTasks.get(key)}`, { ...owner, taskId: id }));
      else globalTasks.set(key, `${spec.id}/${id}`);
    }
  }
  return findings;
}

// Exported so other readers resolve the same Blueprint-level specs lane,
// without a second, possibly-drifting copy of this manifest-aware lookup;
// `specHomes` below adds the landmark homes (S-003Z TK-008E).
export function resolveSpecsRoot(root) {
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

// S-003Z TK-008E: every home a Spec can sit in, the one reader the Spec tools
// resolve a Spec through: the Blueprint-level lane (`resolveSpecsRoot`)
// first, then the `specs/` folder of every landmark at both homes of the
// landmarks collection (`landmarkSpecHomes`). Each home names its prefix and
// its parent landmark (`null` for the Blueprint level); the home's own
// lifecycle folders (`retired/`) sit beneath it. A room with no landmarks has
// exactly the one home it always had.
export function specHomes(rootDir) {
  const root = path.resolve(rootDir);
  const { specsRoot, specsPrefix } = resolveSpecsRoot(root);
  return [{ specsRoot, specsPrefix, landmarkId: null, landmarkLifecycleFolder: null }, ...landmarkSpecHomes(root)];
}

// The catalog as `CATALOG.md` prints it: links relative to the Blueprint-level
// lane it lives in, so a nested Spec's link climbs out to its landmark home.
function laneCatalog(root, specs, retired) {
  const { specsPrefix } = resolveSpecsRoot(root);
  let catalog = renderCatalog(specs, retired).replaceAll(`](${specsPrefix}/`, '](');
  for (const spec of [...specs, ...retired]) {
    if (spec.specsPrefix === specsPrefix) continue;
    catalog = catalog.replaceAll(`](${spec.relativePath})`, `](${path.posix.relative(specsPrefix, spec.relativePath)})`);
  }
  return catalog;
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

// S-003Z TK-008G: `landmarks` (the landmark parents, `loadLandmarkParents`)
// add a row for each landmark on the active roster holding an open direct
// Task, so the board shows that Task under its landmark; a landmark with no
// open direct Task adds nothing, so a room without one renders as before.
function renderHotBoard(specs, retired = [], landmarks = []) {
  const all = [...specs, ...retired];
  const hotLandmarks = landmarks.filter((parent) => !parent.lifecycleFolder
    && slicesOf(parent).some((slice) => ['ready', 'blocked', 'in-progress', 'needs-review'].includes(slice.declared)));
  const hot = [...all.filter((spec) => spec.lifecycleFolder === 'retired'
    ? !spec.sliceConflict && executionSlices(spec).some(slice => ['ready', 'blocked', 'in-progress'].includes(slice.declared))
    : isHot(spec)), ...hotLandmarks].sort((a, b) => a.priority - b.priority || compareVisibleIds(a.id, b.id));
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
  const completed = satisfiedBlockers([...all, ...landmarks]);
  for (const spec of hot) {
    // A row/record collision already carries its own `row-record-collision`
    // finding from `packetFindings`; the board falls back to the owner-gate
    // cell here rather than calling `slicesOf` a second time and throwing
    // partway through rendering the rest of the board.
    if (spec.sliceConflict) {
      lines.push(`| [${spec.id}](${spec.relativePath}) | Acceptance / owner gate | ${escapeCell(spec.owner)} | ${escapeCell(spec.blockers)} | ${escapeCell(spec.latestEvent)} | ${escapeCell(spec.nextGate)} |`);
      continue;
    }
    const slices = executionSlices(spec).map((item) => ({ ...item, status: effectiveStatus(item, satisfiedIds(spec, completed)) }));
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
    const baseBlocker = task?.blockers && task.blockers !== 'none' ? task.blockers : spec.blockers;
    // S-00V TK-00K: every capability-blocked Task on the Spec is named in the
    // Blocker cell, beside whichever Task the row shows, so the owner's sitrep
    // finds it. A Spec with none renders exactly as before.
    const capabilityNotes = slices.filter((item) => item.missingCapabilities.length > 0).map((item) => `${item.id} missing capability ${item.missingCapabilities.join(', ')}`);
    const blocker = capabilityNotes.length === 0 ? baseBlocker
      : [...(baseBlocker && baseBlocker !== 'none' ? [baseBlocker] : []), ...capabilityNotes].join('; ');
    const event = spec.lifecycleFolder === 'retired' ? `Corrective work against retired ${spec.id}; historical completion preserved.` : spec.latestEvent;
    const nextGate = spec.lifecycleFolder === 'retired' ? `Close ${task.id} with verification and documentation proof.` : spec.nextGate;
    lines.push(`| [${spec.id}](${spec.relativePath}) | ${escapeCell(slice)} | ${escapeCell(spec.owner)} | ${escapeCell(blocker)} | ${escapeCell(event)} | ${escapeCell(nextGate)} |`);
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

// S-01W TK-002K: a blocker names an identity, so any supported spelling of a
// satisfied ID satisfies it. `completed` keeps its scope (completed Specs plus
// this Spec's own done slices), so numeric Task labels stay Spec-qualified.
function blockersSatisfied(value, completed) {
  if (!value || value === 'none') return true;
  const keys = new Set([...completed].map((id) => visibleIdKey(id) ?? id));
  return value.split(',').map((item) => item.trim()).filter(Boolean).every((id) => keys.has(visibleIdKey(id) ?? id));
}

// S-01W TK-002K: the one selector resolution every public Spec and Task
// operation uses. A selector names a stored record when their collision keys
// match (`visibleIdKey`: suffix case folded, leading zeros removed), so
// `S-00Q`, `S-000Q` and `S-00q` all reach stored `S-00Q`. The caller then
// continues with the stored ID, which is why output, errors and evidence name
// the stored identity and path and nothing is renamed to the selector's
// spelling. Two different stored spellings behind one key - an active and a
// retired record included, which `next-id` still folds as one occupied
// identity and `doctor` reports as `duplicate-id` - refuse by name rather than
// choosing a winner. The same stored ID seen twice is left to the existing
// exact-ID checks (the active-first route below, the row/record collision). A
// selector naming nothing comes back unchanged so each command keeps its own
// unknown-ID refusal.
function resolveStoredId(kind, selector, candidates) {
  if (typeof selector !== 'string') return selector;
  const key = visibleIdKey(selector);
  const stored = new Map();
  for (const item of candidates) {
    if (key ? visibleIdKey(item.id) !== key : item.id !== selector) continue;
    stored.set(item.id, [...(stored.get(item.id) ?? []), item.where].filter(Boolean));
  }
  if (stored.size > 1) {
    const named = [...stored].map(([id, where]) => (where.length ? `${id} (${where.join(', ')})` : id)).join(' and ');
    throw new Error(`Duplicate ${kind} ID: ${selector} matches ${named}; selection refuses rather than choosing one`);
  }
  return stored.size === 1 ? [...stored.keys()][0] : selector;
}

// Spec selectors resolve across the active roster and the retired route, so a
// retired alias can neither shadow nor be shadowed by a live record.
export function resolveSpecId(rootDir, selector) {
  const root = path.resolve(rootDir);
  const specs = [...loadSpecs(root), ...loadRetiredSpecs(root)];
  return resolveStoredId('spec', selector, specs.map((spec) => ({ id: spec.id, where: spec.relativePath })));
}

// Task selectors stay Spec-qualified: a historical numeric label such as
// `TK-001` recurs across Specs, so a Task resolves only among its own Spec's
// rows, records and retired records.
export function resolveTaskId(spec, selector) {
  const tasks = [...spec.rows, ...(spec.records ?? []), ...(spec.retiredRecords ?? [])];
  return resolveStoredId(`task (${spec.id})`, selector, tasks.map((task) => ({ id: task.id, where: task.filePath ? path.relative(task.root ?? '', task.filePath).split(path.sep).join('/') : null })));
}

// The active roster is tried first, unchanged; a retired Spec is reachable
// only once nothing in the active roster claims the id, so a retired id can
// never shadow a live one. `show` is this function's only caller, which is
// how S-00I TK-003 satisfies "show finds a retired Spec by an explicit
// historical route" without changing what `next`, `claim` or `render` see.
export function findSpec(rootDir, selector) {
  const id = resolveSpecId(rootDir, selector);
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
// Wiki, manifest-resolved skills plus legacy `skills/`, `team templates/`),
// plus the ADR collection itself - an
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
  const walk = (dir, match, ordinaryOnly = false) => {
    if (ordinaryOnly) assertSafeReadPath(root, dir);
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) {
        if (ordinaryOnly) assertSafeReadPath(root, path.join(dir, entry.name));
        continue;
      }
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, match, ordinaryOnly);
      else if (entry.isFile() && match(entry.name)) files.push(full);
    }
  };
  walk(lanePath(root, 'wiki'), (name) => name.endsWith('.md'));
  walk(lanePath(root, 'skills'), (name) => name.endsWith('.md'), true);
  // Pre-lane installations may still carry root skills; keep that supported
  // surface too. Deduplication below prevents double counting a shared path.
  walk(path.join(root, 'skills'), (name) => name.endsWith('.md'), true);
  walk(path.join(root, 'team templates'), (name) => name.endsWith('.md'));
  walk(collectionPath(root, 'adr'), (name) => name.endsWith('.md'));
  // S-003X TK-004Y: links inside Destination Decision Records are repaired too.
  walk(collectionPath(root, 'ddr'), (name) => name.endsWith('.md'));
  walk(resolveSpecsRoot(root).specsRoot, (name) => name === 'SPEC.md' || name === 'TASK.md');
  // S-003Z TK-008G: a landmark's own record and its direct Task records are
  // live surfaces too (its Direct Tasks list links each Task record).
  // S-003Z TK-008E: so are the Specs nested in each landmark's `specs/` home
  // and their Task records, which this one walk of the collection reaches.
  walk(collectionPath(root, 'landmarks'), (name) => name === 'LANDMARK.md' || name === 'TASK.md' || name === 'SPEC.md');
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

// Directory links are live navigation too. Keep directory targets separate
// from the files to read/write, and validate linked targets before git mv.
// Only the lifecycle moves use this planner; identity widening has its own
// assigned delivery lane and remains unchanged.
function lifecycleMoveLocations(root, oldDir, newDir, movingFiles, unmoved) {
  const locations = new Map(unmoved.map(file => [file, file]));
  const directoryTargets = new Set();
  for (const file of movingFiles) locations.set(file, path.join(newDir, path.relative(oldDir, file)));
  const movingDirectories = dir => {
    assertSafeReadPath(root, dir);
    locations.set(dir, path.join(newDir, path.relative(oldDir, dir)));
    directoryTargets.add(dir);
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) movingDirectories(path.join(dir, entry.name));
    }
  };
  movingDirectories(oldDir);
  const moving = new Set(movingFiles);
  for (const file of [...movingFiles, ...unmoved]) {
    if (!file.endsWith('.md')) continue;
    const { prefix, suffix } = splitEvidenceSection(fs.readFileSync(file, 'utf8'));
    for (const link of [...localLinks(prefix), ...localLinks(suffix)]) {
      const target = path.resolve(path.dirname(file), link);
      if (target !== root && !target.startsWith(root + path.sep)) continue;
      if (!fs.existsSync(target)) continue;
      // S-003Z TK-008F: a moved record's own outgoing link to an unmoved file
      // that is not itself a reference surface (a tool, a JSON proof, an
      // asset) still needs its relative depth recomputed - a move under a
      // landmark changes that depth by more than one folder - so the target
      // is mapped to itself, exactly as every unmoved reference surface is.
      if (moving.has(file) && fs.statSync(target).isFile()) {
        if (!locations.has(target)) locations.set(target, target);
        continue;
      }
      if (!fs.statSync(target).isDirectory()) continue;
      if (target !== root) assertSafeReadPath(root, target);
      if (!locations.has(target)) locations.set(target, target);
      directoryTargets.add(target);
    }
  }
  return { locations, directoryTargets };
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
function rewriteReferenceFile(root, filePath, oldDir, newDir, locations, totals, options = {}) {
  const finalContent = planReferenceRewrite(root, filePath, fs.readFileSync(filePath, 'utf8'), oldDir, newDir, locations, totals, options);
  if (finalContent !== null) {
    assertSafeWritePath(root, filePath);
    writeSafeFile(root, filePath, finalContent);
  }
}

// Discover deterministic unsafe rewrites before git mv changes any path.
// Only files whose live bytes actually change need write permission: an
// unrelated hard-linked reference surface is not a reason to refuse a move.
function preflightReferenceWrites(root, files, locations, options = {}) {
  for (const file of files) {
    const destination = locations.get(file);
    if (!destination.endsWith('.md')) continue;
    const rewritten = planReferenceRewrite(root, destination, fs.readFileSync(file, 'utf8'),
      path.dirname(file), path.dirname(destination), locations,
      { referencesRewritten: {}, historicalReferencesLeft: {} }, options);
    if (rewritten === null) continue;
    assertSafeWritePath(root, file);
    if (destination !== file) assertSafeWritePath(root, destination);
  }
}

// The pure half of `rewriteReferenceFile` is `planReferenceRewrite` in
// adr.mjs (moved there by S-003X TK-004Y so the decision-record moves share
// it): it computes the rewritten bytes without touching the tree. `widen-id`
// (S-01W TK-002O) plans every rewrite with it before it writes, so a refusal
// can never leave a partial mutation.

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
  specId = resolveSpecId(root, specId);
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
  assertMoveSpecGitTree(root);
  // S-003Z TK-008E: a Spec moves within its own home, so a nested Spec
  // retires into `<landmark>/specs/retired/`.
  const specsPrefix = spec.specsPrefix;
  const specsRoot = path.join(root, specsPrefix);
  const oldSpecDir = path.dirname(spec.filePath);
  if (path.dirname(oldSpecDir) !== specsRoot) {
    throw new Error(`${specId} is not at the top level of ${specsPrefix}; move-spec only moves an active-roster Spec`);
  }
  const newSpecDir = path.join(specsRoot, folder, path.basename(oldSpecDir));
  return { specId, folder, ...relocateSpecDirectory(root, specId, oldSpecDir, newSpecDir) };
}

// The Git preconditions every `move-spec` form shares: a Git working tree, so
// the move is recoverable, and a clean one, so the candidate shows only this
// move.
function assertMoveSpecGitTree(root) {
  const gitStatus = spawnSync('git', ['-C', root, 'status', '--porcelain'], { encoding: 'utf8' });
  if (gitStatus.status !== 0) {
    throw new Error('move-spec requires a Git working tree so the move is recoverable; none was found');
  }
  if (gitStatus.stdout.trim() !== '') {
    throw new Error('move-spec refuses a dirty working tree; commit or stash first so the candidate shows only this move');
  }
}

// S-003Z TK-008F: the link-safe move itself, shared by retirement
// (`moveSpecDirectory`) and a change of parent (`moveSpecToLandmark`) once the
// caller has chosen the destination: one `git mv` of the whole Spec directory
// and the repair of every live reference it would otherwise dangle.
function relocateSpecDirectory(root, specId, oldSpecDir, newSpecDir) {
  if (fs.existsSync(newSpecDir)) throw new Error(`move-spec destination already exists: ${path.relative(root, newSpecDir).split(path.sep).join('/')}`);
  const destinationRoot = path.dirname(newSpecDir);

  // Snapshot every file the move carries before touching the filesystem;
  // `oldSpecDir` will not exist once the directory itself has moved.
  const movingFiles = collectDirectoryFiles(oldSpecDir);
  // Validate all live reference surfaces before any rename or write.
  const unmoved = collectSpecReferenceFiles(root, oldSpecDir);

  // Corrective review finding 1: `locations` must carry every reference
  // target this move can touch, not only the ones that are moving - a moved
  // file's own outgoing link to an unmoved sibling Spec or ADR still needs
  // its relative path recomputed, because the moved file itself now sits one
  // folder deeper. The preflight excludes the moving directory; its files
  // are mapped old-path -> new-path below, not to themselves.
  const { locations, directoryTargets } = lifecycleMoveLocations(root, oldSpecDir, newSpecDir, movingFiles, unmoved);
  const rewriteOptions = { directoryTargets };

  preflightReferenceWrites(root, [...movingFiles, ...unmoved], locations, rewriteOptions);
  fs.mkdirSync(destinationRoot, { recursive: true });
  const moveResult = spawnSync('git', ['-C', root, 'mv', path.relative(root, oldSpecDir), path.relative(root, newSpecDir)], { encoding: 'utf8' });
  if (moveResult.status !== 0) throw new Error(`git mv failed for ${specId}: ${(moveResult.stderr || moveResult.stdout || '').trim()}`);

  const totals = { referencesRewritten: {}, historicalReferencesLeft: {} };
  for (const oldFile of movingFiles) {
    const newFile = locations.get(oldFile);
    if (!newFile.endsWith('.md')) continue;
    rewriteReferenceFile(root, newFile, path.dirname(oldFile), path.dirname(newFile), locations, totals, rewriteOptions);
  }
  for (const file of unmoved) {
    rewriteReferenceFile(root, file, path.dirname(file), path.dirname(file), locations, totals, rewriteOptions);
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
  writeDecisionRegisters(root);

  // Corrective review finding 3: `git mv` already stages the rename; leaving
  // the content rewrites above unstaged would show the candidate as a mix
  // (staged rename, unstaged edits) rather than one reviewable change. Stage
  // everything instead of leaving everything unstaged, because the dirty-tree
  // refusal above already guarantees that anything unstaged at this point is
  // exactly what this move just produced - nothing pre-existing can be swept
  // in by a wide `add`.
  spawnSync('git', ['-C', root, 'add', '-A']);

  return {
    from: path.relative(root, oldSpecDir).split(path.sep).join('/'),
    to: path.relative(root, newSpecDir).split(path.sep).join('/'),
    usesGit: true,
    referencesRewritten: totals.referencesRewritten,
    historicalReferencesLeft: totals.historicalReferencesLeft
  };
}

// S-003Z TK-008F: `move-spec S-### --landmark LMK-###|none` changes a Spec's
// parent through the same link-safe move retirement uses
// (`relocateSpecDirectory`): an active-roster Spec directory, Task records and
// all, moves under `<landmark>/specs/`, between two landmarks, or back to the
// Blueprint-level lane with `none`, and every live reference is rewritten.
// Any status moves - a planned or active Spec gains its landmark - because
// the complete-only rule belongs to retirement alone. Refuses by name: a
// missing landmark value, an unknown Spec or landmark, a retired Spec or
// landmark, a Spec already under that parent, an occupied destination, a
// dirty tree and a room with no Git tree.
export function moveSpecToLandmark(rootDir, specId, landmarkSelector) {
  const root = path.resolve(rootDir);
  if (typeof landmarkSelector !== 'string' || landmarkSelector.trim() === '') {
    throw new Error('move-spec --landmark requires a landmark identity or none');
  }
  specId = resolveSpecId(root, specId);
  const matches = loadSpecs(root).filter((item) => item.id === specId);
  if (matches.length > 1) throw new Error(`Duplicate spec ID: ${specId}`);
  if (matches.length === 0) {
    const alreadyRetired = loadRetiredSpecs(root).some((item) => item.id === specId);
    throw new Error(alreadyRetired ? `${specId} is already retired; move-spec --landmark only moves an active-roster Spec` : `Unknown spec ID: ${specId}`);
  }
  const spec = matches[0];
  let landmark = null;
  let newSpecsRoot;
  if (landmarkSelector === 'none') {
    if (spec.landmarkId === null) throw new Error(`${specId} is already at the Blueprint level (${spec.specsPrefix})`);
    newSpecsRoot = resolveSpecsRoot(root).specsRoot;
  } else {
    landmark = findLandmark(root, landmarkSelector);
    if (landmark.lifecycleFolder !== null) {
      throw new Error(`${landmark.id} is retired (${landmark.relativePath}); a Spec moves only under an active-roster landmark`);
    }
    if (spec.landmarkId !== null && visibleIdKey(spec.landmarkId) === visibleIdKey(landmark.id)) {
      throw new Error(`${specId} is already under ${landmark.id} (${spec.relativePath})`);
    }
    newSpecsRoot = path.join(path.dirname(landmark.filePath), 'specs');
  }
  assertMoveSpecGitTree(root);
  const oldSpecDir = path.dirname(spec.filePath);
  if (path.dirname(oldSpecDir) !== path.join(root, spec.specsPrefix)) {
    throw new Error(`${specId} is not at the top level of ${spec.specsPrefix}; move-spec only moves an active-roster Spec`);
  }
  const newSpecDir = path.join(newSpecsRoot, path.basename(oldSpecDir));
  return {
    specId,
    fromLandmarkId: spec.landmarkId,
    landmarkId: landmark ? landmark.id : null,
    ...relocateSpecDirectory(root, specId, oldSpecDir, newSpecDir)
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
export function moveTaskRecord(rootDir, specId, taskId, folder, options = {}) {
  if (Object.hasOwn(options, 'replacement')) return recoverTaskCollision(rootDir, specId, taskId, folder, options);
  if (options.dryRun) throw new Error('move-task --dry-run requires the collision recovery replacement mode');
  const root = path.resolve(rootDir);
  if (!TASK_LIFECYCLE_FOLDERS.includes(folder)) {
    throw new Error(`move-task refuses folder "${folder}"; the closed set is ${TASK_LIFECYCLE_FOLDERS.join(', ')}`);
  }
  // S-003Z TK-008G: `move-task LMK-### --task TK-###` retires a Task directly
  // under that landmark into `<landmark>/tasks/retired/`.
  const landmark = isLandmarkId(specId);
  specId = landmark ? resolveLandmarkId(root, specId) : resolveSpecId(root, specId);
  const spec = landmark ? findLandmarkParent(root, specId) : findSpec(root, specId);
  taskId = resolveTaskId(spec, taskId);
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
  // Validate all live reference surfaces before any rename or write.
  const unmoved = collectSpecReferenceFiles(root, oldTaskDir);

  const { locations, directoryTargets } = lifecycleMoveLocations(root, oldTaskDir, newTaskDir, movingFiles, unmoved);
  const rewriteOptions = { directoryTargets };

  preflightReferenceWrites(root, [...movingFiles, ...unmoved], locations, rewriteOptions);
  fs.mkdirSync(destinationRoot, { recursive: true });
  const moveResult = spawnSync('git', ['-C', root, 'mv', path.relative(root, oldTaskDir), path.relative(root, newTaskDir)], { encoding: 'utf8' });
  if (moveResult.status !== 0) throw new Error(`git mv failed for ${specId}/${taskId}: ${(moveResult.stderr || moveResult.stdout || '').trim()}`);

  const totals = { referencesRewritten: {}, historicalReferencesLeft: {} };
  for (const oldFile of movingFiles) {
    const newFile = locations.get(oldFile);
    if (!newFile.endsWith('.md')) continue;
    rewriteReferenceFile(root, newFile, path.dirname(oldFile), path.dirname(newFile), locations, totals, rewriteOptions);
  }
  for (const file of unmoved) {
    rewriteReferenceFile(root, file, path.dirname(file), path.dirname(file), locations, totals, rewriteOptions);
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
  writeDecisionRegisters(root);

  // Corrective review finding 3 from TK-003, reused unchanged here: `git mv`
  // already stages the rename; stage the content rewrites above too, so the
  // candidate shows one reviewable move rather than a mix of staged and
  // unstaged changes.
  spawnSync('git', ['-C', root, 'add', '-A']);

  return {
    ...parentKey(spec),
    taskId,
    folder,
    from: path.relative(root, oldTaskDir).split(path.sep).join('/'),
    to: path.relative(root, newTaskDir).split(path.sep).join('/'),
    usesGit: true,
    referencesRewritten: totals.referencesRewritten,
    historicalReferencesLeft: totals.historicalReferencesLeft
  };
}

// S-01W TK-002O: the explicit identity-only touch. `widen-id S-###|TK-###`
// widens one eligible record to the uppercase width-four spelling of its own
// collision key (`widenedIdentity`: `S-00Q` -> `S-000Q`, `TK-00a` ->
// `TK-000A`, numeric `TK-001` -> `TK-0001`), the spelling `allocateArtifactId`
// would give that identity. It renames the record's directory, rewrites its
// ID field and title, records the previous spelling in one `**Former ID:**`
// field directly under the ID field (`parseFormerId` in task-record.mjs), and
// repairs every live link with the lifecycle moves' own reference machinery
// (`collectSpecReferenceFiles`, `planReferenceRewrite`, the old-path ->
// new-path `locations` map, the frozen Append-Only Evidence section left
// byte-identical and its link matches counted as historical). Widening a Spec
// also points its open (not done) Task records' `**Spec ID:**` at the widened
// parent; done and retired records keep their bytes.
//
// It never changes status and never touches a completed, reviewed or retired
// record: a Spec must be planned, active or blocked, a Task must be an
// active-roster record that is not done, under such a Spec. A record already
// at its widened spelling is a no-op (checked before the clean-tree
// precondition, so a repeat run on the staged result stays a no-op). Every
// other refusal - a dirty tree, an occupied destination path, an identity
// alias held by another record or a discarded label, a symlinked, hard-linked
// or unstable record path, a slice-table row, an ambiguous numeric Task label
// without `--spec` - is decided before anything is written, from a complete
// in-memory plan, so a refusal leaves no partial mutation.
//
// Like `move-spec` and `move-task`, the result is staged with `git add -A`
// and never committed: the dirty-tree refusal guarantees the stage holds only
// this change, HEAD remains the recovery point (`git reset --hard HEAD`), and
// the agent commits it as one reviewable candidate. The projections are
// re-rendered so the Taskboard and catalog name the widened ID.
const WIDENABLE_SPEC_STATUSES = Object.freeze(['planned', 'active', 'blocked']);

// A semantic collision is different from widening a spelling: keeping the
// old label as an alias would continue shadowing the earlier record. This
// narrowly selected move preserves the original record at its immutable Git
// route and its Receipt bytes, and stages a new canonical identity only.
function recoverTaskCollision(rootDir, specId, taskId, folder, options) {
  const root = path.resolve(rootDir);
  const fail = message => { throw new Error(`move-task collision recovery: ${message}`); };
  if (folder) fail('replacement cannot be combined with a lifecycle folder');
  if (Object.keys(process.env).some(key => key.startsWith('GIT_') && key !== 'GIT_PAGER')) fail('inherited Git environment must be removed (GIT_PAGER is harmless)');
  const git = (...args) => {
    const result = spawnSync('git', ['--no-lazy-fetch', '--no-optional-locks', '-C', root, ...args], {
      encoding: 'utf8', maxBuffer: REF_READ_MAX_BUFFER,
      env: { ...process.env, GIT_NO_REPLACE_OBJECTS: '1', GIT_TERMINAL_PROMPT: '0' }
    });
    if (result.error || result.status !== 0) fail(`Git ${args[0]} failed (output omitted)`);
    return result.stdout.trimEnd();
  };
  if (!fs.lstatSync(root).isDirectory() || fs.lstatSync(root).isSymbolicLink()
      || fs.realpathSync(git('rev-parse', '--show-toplevel')) !== fs.realpathSync(root)) fail('project root must be the ordinary Git working-tree root');
  for (const name of ['expectedHead', 'sourceRevision', 'collisionRevision']) {
    if (!/^[0-9a-f]{40}$/.test(options[name] ?? '')) fail(`${name} requires an exact lowercase commit revision`);
    if (git('rev-parse', '--verify', `${options[name]}^{commit}`) !== options[name]) fail(`${name} is not an exact commit revision`);
  }
  if (git('rev-parse', 'HEAD') !== options.expectedHead) fail('expected HEAD no longer matches');
  if (git('status', '--porcelain') !== '') fail('requires a clean tree and index');
  if (!/^[0-9a-f]{64}$/.test(options.taskHash ?? '')) fail('Task hash must be an exact SHA256');
  if (!/^TK-[0-9A-Z]{4,}$/.test(options.replacement) || !/[A-Z]/.test(options.replacement.slice(3))
      || visibleIdKey(options.replacement) === visibleIdKey(taskId)) fail('replacement must name a different identity in the current letter-bearing format');
  if (!options.reason?.trim() || /[\r\n]/.test(options.reason)) fail('a single-line Director disposition reason is required');
  const ordinaryTree = directory => {
    assertSafeReadPath(root, directory);
    if (!fs.existsSync(directory)) return;
    if (!fs.lstatSync(directory).isDirectory()) fail('source directory must be ordinary');
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      assertSafeReadPath(root, file);
      if (entry.isDirectory()) ordinaryTree(file);
      else if (!entry.isFile()) fail('source entries must be ordinary files or directories');
    }
  };
  for (const home of specHomes(root)) ordinaryTree(home.specsRoot);
  const owners = [...loadSpecs(root, { allowDuplicates: true }), ...loadRetiredSpecs(root)];
  const selected = owners.filter(owner => visibleIdKey(owner.id) === visibleIdKey(specId));
  if (selected.length !== 1) fail('assigned Spec must resolve uniquely');
  const spec = selected[0];
  specId = spec.id; taskId = resolveTaskId(spec, taskId);
  if (spec.lifecycleFolder || !WIDENABLE_SPEC_STATUSES.includes(spec.status)) fail('owning Spec must be active, planned or blocked');
  const task = spec.records.find(record => record.id === taskId);
  if (!task || task.status !== 'done' || task.formerId) fail('source must be an active-roster done record without a Former ID alias');
  if (/^\*\*Close pending:\*\*/m.test(task.content)) fail('source has pending close evidence; finish close before moving');
  readReceiptFromFile(task.filePath);
  if (!task.proof) fail('source done record must retain its verified Proof');
  const oldDir = path.dirname(task.filePath);
  if (path.dirname(oldDir) !== path.join(path.dirname(spec.filePath), 'tasks') || path.basename(oldDir) !== taskId) fail('source Task is not at its declared canonical path');
  const relative = file => path.relative(root, file).split(path.sep).join('/');
  const oldPath = relative(task.filePath);
  const hash = bytes => createHash('sha256').update(bytes).digest('hex');
  if (hash(fs.readFileSync(task.filePath)) !== options.taskHash) fail('source Task hash changed');
  // Use bytes rather than trimmed `git show` output for immutable equality.
  const blob = (revision, file) => {
    const result = spawnSync('git', ['--no-lazy-fetch', '--no-optional-locks', '-C', root, 'show', `${revision}:${file}`], {
      maxBuffer: REF_READ_MAX_BUFFER, env: { ...process.env, GIT_NO_REPLACE_OBJECTS: '1', GIT_TERMINAL_PROMPT: '0' }
    });
    if (result.error || result.status !== 0) fail('immutable collision evidence is unavailable (output omitted)');
    return result.stdout;
  };
  if (!blob(options.sourceRevision, oldPath).equals(fs.readFileSync(task.filePath))) fail('source Task differs from its immutable source revision');
  git('merge-base', '--is-ancestor', options.sourceRevision, options.expectedHead);
  for (const revision of [options.sourceRevision, options.collisionRevision]) {
    if (!git('for-each-ref', `--contains=${revision}`, '--format=%(refname)', 'refs/remotes')) fail('immutable collision evidence must be contained in an observed remote tip');
    let identity;
    try { identity = JSON.parse(blob(revision, 'workbench/manifest.json')).workbenchId; }
    catch { fail('immutable collision manifest is unreadable'); }
    if (!identity || identity !== readManifest(root).workbenchId) fail('immutable collision evidence belongs to a different room');
  }
  const foreignPath = options.collisionPath;
  if (typeof foreignPath !== 'string' || path.isAbsolute(foreignPath) || foreignPath.split('/').some(part => !part || part === '.' || part === '..')
      || ![resolveSpecsRoot(root).specsPrefix, collectionRelative(root, 'landmarks')].some(prefix => foreignPath.startsWith(`${prefix}/`)) || !foreignPath.endsWith('/TASK.md')) fail('collision evidence requires an ordinary explicit Task path');
  const foreign = parseTaskRecord(blob(options.collisionRevision, foreignPath).toString('utf8'), path.join(root, foreignPath), root);
  const foreignDir = path.posix.dirname(foreignPath);
  const foreignTasks = path.posix.dirname(foreignDir);
  if (path.posix.basename(foreignDir) !== foreign.id || path.posix.basename(foreignTasks) !== 'tasks') fail('collision evidence Task path does not match its record');
  const foreignSpecPath = path.posix.join(path.posix.dirname(foreignTasks), 'SPEC.md');
  const foreignSpec = parseSpecPacket(blob(options.collisionRevision, foreignSpecPath).toString('utf8'), path.join(root, foreignSpecPath), root, { recordBacked: true });
  if (foreignSpec.id !== foreign.specId) fail('collision evidence Spec does not own its Task');
  if (foreign.specId !== options.collisionSpec || visibleIdKey(foreign.specId) === visibleIdKey(specId)
      || visibleIdKey(foreign.id) !== visibleIdKey(taskId)) fail('collision evidence must name the same identity in a different declared Spec');
  // Reference-only reservations may name the replacement. Actual records,
  // former aliases and discard entries at every observed tip may not.
  const key = visibleIdKey(options.replacement);
  const holders = owners.flatMap(owner => [...owner.rows, ...owner.records, ...owner.retiredRecords].map(record => ({ owner, record })))
    .filter(({ record }) => [record.id, record.formerId].some(id => id && visibleIdKey(id) === visibleIdKey(taskId)));
  if (holders.length > 2 || holders.some(({ owner }) => ![spec.id, foreign.specId].includes(owner.id))) fail('collision has additional local holders');
  if (identityFindings(owners).some(issue => visibleIdKey(issue.taskId) !== visibleIdKey(taskId))) fail('unrelated identity collisions must be resolved separately');
  for (const owner of owners) {
    for (const record of [...owner.rows, ...owner.records, ...owner.retiredRecords]) {
      if ([record.id, record.formerId].some(id => id && visibleIdKey(id) === key)) fail('replacement identity is occupied by a record or alias');
    }
  }
  if (discardedLabels(root, 'TK').some(id => visibleIdKey(id) === key)) fail('replacement identity is occupied by a discard');
  for (const orphan of loadCorrectiveTasks(root)) {
    if ([orphan.id, orphan.formerId].some(id => id && visibleIdKey(id) === key)) fail('replacement identity is occupied by a corrective record or alias');
    if (visibleIdKey(orphan.id) === visibleIdKey(taskId)) fail('collision has an additional corrective holder');
  }
  for (const ref of git('for-each-ref', '--format=%(refname)', 'refs/remotes').split('\n').filter(Boolean)) {
    // Pre-manifest tips retain the same legacy lane inventory as next-id.
    // A present but malformed manifest still refuses instead of guessing.
    // S-003Z TK-008E: Specs nested in landmark folders are read there too.
    let lanes = [...new Set([resolveSpecsRoot(root).specsPrefix, 'specs', collectionRelative(root, 'landmarks')])];
    if (git('ls-tree', '--name-only', ref, '--', 'workbench/manifest.json')) {
      let lane;
      try { lane = JSON.parse(blob(ref, 'workbench/manifest.json')).lanes?.specs; }
      catch { fail('cannot inspect an observed remote manifest'); }
      if (typeof lane !== 'string' || path.isAbsolute(lane) || lane.split('/').some(part => !part || part === '.' || part === '..')) fail('observed remote Spec lane is invalid');
      let landmarksLane;
      try { landmarksLane = JSON.parse(blob(ref, 'workbench/manifest.json')).collections?.landmarks ?? collectionRelative(root, 'landmarks'); }
      catch { fail('cannot inspect an observed remote manifest'); }
      if (typeof landmarksLane !== 'string' || path.isAbsolute(landmarksLane) || landmarksLane.split('/').some(part => !part || part === '.' || part === '..')) fail('observed remote landmarks collection is invalid');
      lanes = [lane, landmarksLane];
    }
    const result = spawnSync('git', ['--no-lazy-fetch', '--no-optional-locks', '-C', root, 'grep', '-h', '-E', '^\\*\\*(Task ID|Former ID):\\*\\*', ref, '--', ...lanes], { encoding: 'utf8', maxBuffer: REF_READ_MAX_BUFFER, env: { ...process.env, GIT_NO_REPLACE_OBJECTS: '1' } });
    if (result.error || ![0, 1].includes(result.status)) fail('cannot inspect remote replacement records');
    if ([...result.stdout.matchAll(/\bTK-[0-9A-Za-z]+\b/g)].some(match => visibleIdKey(match[0]) === key)) fail('replacement identity is occupied on an observed remote tip');
    for (const file of git('ls-tree', '-r', '--name-only', ref, '--', ...lanes).split('\n').filter(file => file.endsWith('/SPEC.md'))) {
      const packet = parseSpecPacket(blob(ref, file).toString('utf8'), path.join(root, file), root, { recordBacked: true });
      if (packet.rows.some(row => visibleIdKey(row.id) === key)) fail('replacement identity is occupied by an observed remote slice');
    }
    for (const lane of lanes) {
      const discardPath = `${lane}/DISCARDS.md`;
      if (git('ls-tree', '--name-only', ref, '--', discardPath)
          && [...blob(ref, discardPath).toString('utf8').matchAll(/\bTK-[0-9A-Za-z]+\b/g)].some(match => visibleIdKey(match[0]) === key)) fail('replacement identity is discarded on an observed remote tip');
    }
  }
  const newDir = path.join(path.dirname(oldDir), options.replacement);
  assertSafeReadPath(root, newDir);
  if (fs.existsSync(newDir)) fail('replacement destination is occupied');
  const moving = collectDirectoryFiles(oldDir);
  const unmoved = collectSpecReferenceFiles(root, oldDir);
  for (const file of [...moving, ...unmoved]) assertSafeReadPath(root, file);
  const { locations, directoryTargets } = lifecycleMoveLocations(root, oldDir, newDir, moving, unmoved);
  const totals = { referencesRewritten: {}, historicalReferencesLeft: {} };
  const writes = new Map();
  const provenance = `${specId}/${taskId}@${options.sourceRevision}:${oldPath}; retained ${foreign.specId}/${foreign.id}@${options.collisionRevision}:${foreignPath}`;
  for (const file of [...moving, ...unmoved]) {
    assertSafeReadPath(root, file);
    const destination = locations.get(file);
    if (!destination.endsWith('.md')) continue;
    const original = fs.readFileSync(file, 'utf8');
    let content = planReferenceRewrite(root, destination, original, path.dirname(file), path.dirname(destination), locations, totals, { directoryTargets }) ?? original;
    if (file === task.filePath) {
      content = replaceIdField(content, 'Task ID', taskId, options.replacement)
        .replace(new RegExp(`^# ${escapeRegExp(taskId)} - `, 'm'), `# ${options.replacement} - `)
        .replace(`**Task ID:** ${options.replacement}`, `**Task ID:** ${options.replacement}\n**Collision recovery:** ${provenance}`);
      const parsed = parseTaskRecord(content, destination, root);
      if (parsed.id !== options.replacement || parsed.status !== task.status || parsed.formerId) fail('planned canonical record does not preserve status without an alias');
      const receipt = original.indexOf('## Receipt');
      if (receipt >= 0 && content.slice(content.indexOf('## Receipt')) !== original.slice(receipt)) fail('planned Receipt bytes changed');
    }
    if (file === spec.filePath) {
      const { prefix, evidence, suffix } = splitEvidenceSection(content);
      const replace = text => text.replace(new RegExp(`\\b${escapeRegExp(taskId)}\\b`, 'g'), options.replacement);
      content = replace(prefix) + evidence + replace(suffix);
      content = appendEvidence(content, `| ${today()} | ${escapeCell(specId + '/' + taskId)} | Collision identity recovered to ${options.replacement} | ${escapeCell(provenance)} | ${escapeCell(options.reason)} | Identity repair only; no review or owner approval transferred. |`);
    }
    if (content !== original) { assertSafeWritePath(root, file); assertSafeWritePath(root, destination); writes.set(destination, content); }
  }
  // JSON source references need their owning runtime; never silently leave a
  // current path dangling or rewrite unknown schemas during this operation.
  for (const file of git('ls-files', '--', '*.json').split('\n').filter(Boolean)) {
    assertSafeReadPath(root, path.join(root, file));
    if (fs.readFileSync(path.join(root, file), 'utf8').includes(relative(oldDir))) fail(`unhandled JSON path reference in ${file}; reconcile its owner first`);
  }
  const projections = [path.join(root, 'BLUEPRINT.md'), path.join(root, 'TASKBOARD.md'), path.join(resolveSpecsRoot(root).specsRoot, 'CATALOG.md')];
  for (const collection of ['adr', 'ddr']) {
    if (fs.existsSync(collectionPath(root, collection))) projections.push(...['REGISTER.md', 'HISTORY.md'].map(name => path.join(collectionPath(root, collection), name)));
  }
  const originals = new Map();
  for (const file of new Set([...moving, ...[...writes.keys()].map(file => file.startsWith(newDir + path.sep) ? path.join(oldDir, path.relative(newDir, file)) : file), ...projections])) {
    assertSafeWritePath(root, file);
    originals.set(file, fs.existsSync(file) ? { bytes: fs.readFileSync(file), mode: fs.statSync(file).mode & 0o777 } : null);
  }
  for (const file of moving) {
    if (!git('ls-files', '--error-unmatch', '--', relative(file))) fail('moving files must be tracked');
  }
  const indexPath = path.resolve(root, git('rev-parse', '--git-path', 'index'));
  const indexStat = fs.lstatSync(indexPath);
  if (!indexStat.isFile() || indexStat.isSymbolicLink() || indexStat.nlink > 1) fail('Git index must be an ordinary private file');
  const index = fs.readFileSync(indexPath);
  const result = { status: options.dryRun ? 'planned' : 'recovered', specId, taskId: options.replacement, from: relative(oldDir), to: relative(newDir), sourceTaskHash: options.taskHash, provenance, committed: false, staged: !options.dryRun, ...totals };
  if (options.dryRun) return result;
  // No fetched state or new HEAD is created here. Recheck the whole planned
  // input immediately before mutation; the published commit remains recovery.
  if (git('rev-parse', 'HEAD') !== options.expectedHead || git('status', '--porcelain') !== '' || !fs.readFileSync(indexPath).equals(index)) fail('planned input changed before publication');
  for (const [file, saved] of originals) if (saved && !fs.readFileSync(file).equals(saved.bytes)) fail('planned source bytes changed before publication');
  try {
    git('mv', '--', relative(oldDir), relative(newDir));
    for (const [file, bytes] of writes) writeSafeFile(root, file, bytes);
    writeDecisionRegisters(root);
    render(root);
    git('add', '-A');
  } catch (error) {
    try {
      if (git('rev-parse', 'HEAD') !== options.expectedHead) fail('HEAD changed during recovery; automatic rollback refuses');
      if (fs.existsSync(newDir) && !fs.existsSync(oldDir)) fs.renameSync(newDir, oldDir);
      for (const [file, saved] of originals) {
        if (saved) { writeSafeFile(root, file, saved.bytes); fs.chmodSync(file, saved.mode); }
        else if (fs.existsSync(file)) fs.unlinkSync(file);
      }
      const temporary = `${indexPath}.collision-restore-${process.pid}`;
      try { fs.writeFileSync(temporary, index, { flag: 'wx', mode: indexStat.mode & 0o777 }); fs.renameSync(temporary, indexPath); }
      finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
    } catch (rollback) { fail(`publication failed and rollback failed: ${rollback.message}; retain the tree for recovery at ${options.expectedHead}`); }
    fail(`publication rolled back: ${error.message}`);
  }
  return result;
}

export function widenedIdentity(id) {
  const key = visibleIdKey(id);
  if (!key) throw new Error(`${id} is not a visible identifier`);
  const separator = key.indexOf('-');
  return `${key.slice(0, separator)}-${key.slice(separator + 1).padStart(ARTIFACT_ID_MIN_WIDTH, '0')}`;
}

export function widenId(rootDir, selector, options = {}) {
  const root = path.resolve(rootDir);
  const parts = visibleIdParts(selector);
  if (!parts || !['S', 'TK'].includes(parts.prefix)) throw new Error('Usage: widen-id S-###|TK-### [--spec S-###]');
  if (parts.prefix === 'S') {
    if (options.spec) throw new Error('widen-id S-### takes no --spec');
    return widenSpecIdentity(root, selector);
  }
  return widenTaskIdentity(root, selector, options.spec);
}

function widenSpecIdentity(root, selector) {
  const id = resolveSpecId(root, selector);
  const spec = loadSpecs(root).find((item) => item.id === id);
  if (!spec) {
    if (loadRetiredSpecs(root).some((item) => item.id === id)) throw new Error(`${id} is retired; widen-id never renames a retired record`);
    throw new Error(`Unknown spec ID: ${id}`);
  }
  if (!WIDENABLE_SPEC_STATUSES.includes(spec.status)) {
    throw new Error(`${id} is ${spec.status}; widen-id widens only a ${WIDENABLE_SPEC_STATUSES.join(', ')} Spec and never renames a completed or reviewed record`);
  }
  const widened = widenedIdentity(id);
  if (widened === id) return { status: 'unchanged', kind: 'spec', id, formerId: spec.formerId, path: spec.relativePath };
  if (spec.formerId) throw new Error(`${id} already records Former ID ${spec.formerId}; an identity widens once`);
  requireCleanWidenTree(root);
  refuseDiscardedAlias(root, 'S', id);
  const specsPrefix = spec.specsPrefix;
  const specsRoot = path.join(root, specsPrefix);
  const oldDir = path.dirname(spec.filePath);
  const base = path.basename(oldDir);
  if (path.dirname(oldDir) !== specsRoot || !base.startsWith(`${id}-`)) {
    throw new Error(`${spec.relativePath} is not at ${specsPrefix}/${id}-...; widen-id refuses an unstable record path`);
  }
  const newDir = path.join(specsRoot, `${widened}${base.slice(id.length)}`);
  const edits = new Map([[spec.filePath, (content) => widenRecordHeader(content, 'Spec ID', id, widened)]]);
  for (const task of spec.records) {
    if (taskStatus(task) === 'done' || task.specId === widened || visibleIdKey(task.specId) !== visibleIdKey(id)) continue;
    edits.set(task.filePath, (content) => replaceIdField(content, 'Spec ID', task.specId, widened));
  }
  const newSpecFile = path.join(newDir, 'SPEC.md');
  const planned = applyIdentityWiden(root, oldDir, newDir, edits, (writes) => {
    const content = writes.get(newSpecFile);
    const packet = parseSpecPacket(content, newSpecFile, root, { recordBacked: spec.recordBacked });
    if (packet.id !== widened || specFormerId(content, packet.id) !== id) throw new Error(`widen-id could not write a readable ${widened} record`);
    for (const [file, text] of writes) if (path.basename(file) === 'TASK.md') parseTaskRecord(text, file, root);
  });
  return { status: 'widened', kind: 'spec', id: widened, formerId: id, ...planned };
}

function widenTaskIdentity(root, selector, specSelector) {
  const all = [...loadSpecs(root), ...loadRetiredSpecs(root)];
  const key = visibleIdKey(selector);
  const numeric = /^TK-\d+$/.test(selector);
  let scope = all;
  if (specSelector) {
    const specId = resolveSpecId(root, specSelector);
    scope = all.filter((spec) => spec.id === specId);
    if (scope.length === 0) throw new Error(`Unknown spec ID: ${specId}`);
  }
  const holders = (specs) => specs.flatMap((spec) => [
    ...spec.rows.map((item) => ({ spec, item, source: 'slice-table row' })),
    ...(spec.records ?? []).map((item) => ({ spec, item, source: spec.lifecycleFolder ? 'record under a retired Spec' : 'record' })),
    ...(spec.retiredRecords ?? []).map((item) => ({ spec, item, source: 'retired record' }))
  ]).filter((entry) => visibleIdKey(entry.item.id) === key);
  const describeHolders = (entries) => entries.map((entry) => `${entry.spec.id}/${entry.item.id} (${entry.source})`).join(' and ');
  const matches = holders(scope);
  if (matches.length === 0) throw new Error(`Unknown Task ID: ${specSelector ? `${scope[0].id}/` : ''}${selector}`);
  const owners = [...new Set(matches.map((entry) => entry.spec.id))];
  if (owners.length > 1) {
    if (numeric) throw new Error(`${selector} names Tasks in ${owners.join(' and ')}; numeric Task labels are Spec-scoped, so pass --spec S-###`);
    throw new Error(`widen-id refuses ${selector}: the identity is held by ${describeHolders(matches)}; an occupied alias is never widened over`);
  }
  if (matches.length > 1) throw new Error(`Duplicate task ID: ${selector} matches ${describeHolders(matches)}; widen-id refuses rather than choosing one`);
  const { spec, item: task, source } = matches[0];
  if (spec.lifecycleFolder || source === 'retired record') throw new Error(`${spec.id}/${task.id} is retired; widen-id never renames a retired record`);
  if (source === 'slice-table row') throw new Error(`${spec.id}/${task.id} is a slice-table row, not a Task record; widen-id widens record-backed Tasks only`);
  if (taskStatus(task) === 'done') throw new Error(`${spec.id}/${task.id} is done; widen-id never renames a completed record`);
  if (!WIDENABLE_SPEC_STATUSES.includes(spec.status)) {
    throw new Error(`${spec.id} is ${spec.status}; widen-id widens a Task only under a ${WIDENABLE_SPEC_STATUSES.join(', ')} Spec`);
  }
  const widened = widenedIdentity(task.id);
  if (widened === task.id) return { status: 'unchanged', kind: 'task', id: task.id, specId: spec.id, formerId: task.formerId, path: task.relativePath };
  if (task.formerId) throw new Error(`${spec.id}/${task.id} already records Former ID ${task.formerId}; an identity widens once`);
  requireCleanWidenTree(root);
  if (!numeric) {
    // Letter-bearing Task labels are whole-room identities (ADR-0041), so any
    // other holder anywhere - a record under a retired Spec, a retired record,
    // an orphan corrective Task, a discarded label - occupies the alias.
    const others = [
      ...holders(all).filter((entry) => entry.item !== task),
      ...loadCorrectiveTasks(root).filter((item) => visibleIdKey(item.id) === key).map((item) => ({ spec: { id: item.specId }, item, source: 'corrective record' }))
    ];
    if (others.length > 0) throw new Error(`widen-id refuses ${spec.id}/${task.id}: ${widened} is an occupied alias held by ${describeHolders(others)}`);
    refuseDiscardedAlias(root, 'TK', task.id);
  }
  const tasksDir = path.join(path.dirname(spec.filePath), 'tasks');
  const oldDir = path.dirname(task.filePath);
  if (path.dirname(oldDir) !== tasksDir) throw new Error(`${task.relativePath} is not at the top level of tasks/; widen-id refuses an unstable record path`);
  const newDir = path.join(tasksDir, widened);
  const newTaskFile = path.join(newDir, 'TASK.md');
  const edits = new Map([[task.filePath, (content) => widenRecordHeader(content, 'Task ID', task.id, widened)]]);
  const planned = applyIdentityWiden(root, oldDir, newDir, edits, (writes) => {
    const record = parseTaskRecord(writes.get(newTaskFile), newTaskFile, root);
    if (record.id !== widened || record.formerId !== task.id) throw new Error(`widen-id could not write a readable ${widened} record`);
  });
  return { status: 'widened', kind: 'task', id: widened, formerId: task.id, specId: spec.id, ...planned };
}

function requireCleanWidenTree(root) {
  const gitStatus = spawnSync('git', ['-C', root, 'status', '--porcelain'], { encoding: 'utf8' });
  if (gitStatus.status !== 0) throw new Error('widen-id requires a Git working tree so the change is recoverable; none was found');
  if (gitStatus.stdout.trim() !== '') throw new Error('widen-id refuses a dirty working tree; commit or stash first so the candidate shows only this identity change');
}

function refuseDiscardedAlias(root, prefix, id) {
  const label = discardedLabels(root, prefix).find((item) => visibleIdKey(item) === visibleIdKey(id));
  if (label) throw new Error(`widen-id refuses ${id}: its identity is also the discarded label ${label} in DISCARDS.md, an occupied alias`);
}

// Replaces the record's own ID field with the widened spelling followed by
// the one `**Former ID:**` line, and the matching `# ID - Title` heading.
function widenRecordHeader(content, field, oldId, newId) {
  const idLine = new RegExp(`^\\*\\*${field}:\\*\\*[ \\t]*${escapeRegExp(oldId)}[ \\t]*$`, 'm');
  const title = new RegExp(`^# ${escapeRegExp(oldId)} - `, 'm');
  if (!idLine.test(content) || !title.test(content)) throw new Error(`${oldId} has no ${field} field and matching title for widen-id to rewrite`);
  return content.replace(idLine, () => `**${field}:** ${newId}\n**Former ID:** ${oldId}`).replace(title, () => `# ${newId} - `);
}

function replaceIdField(content, field, from, to) {
  return content.replace(new RegExp(`^\\*\\*${field}:\\*\\*[ \\t]*${escapeRegExp(from)}[ \\t]*$`, 'm'), () => `**${field}:** ${to}`);
}

// Plans every write in memory, validates it, and only then mutates: `git mv`
// of the record directory, the planned writes, the ADR register, the
// projections, and one `git add -A`.
function applyIdentityWiden(root, oldDir, newDir, edits, validate) {
  for (const file of edits.keys()) assertSafeWritePath(root, file);
  refuseOccupiedDestination(root, oldDir, newDir);
  const movingFiles = collectDirectoryFiles(oldDir);
  const unmoved = collectSpecReferenceFiles(root, oldDir);
  const locations = new Map(unmoved.map((file) => [file, file]));
  for (const file of movingFiles) locations.set(file, path.join(newDir, path.relative(oldDir, file)));
  const totals = { referencesRewritten: {}, historicalReferencesLeft: {} };
  const writes = new Map();
  for (const oldFile of movingFiles) {
    const newFile = locations.get(oldFile);
    let content = fs.readFileSync(oldFile, 'utf8');
    let changed = false;
    if (newFile.endsWith('.md')) {
      const rewritten = planReferenceRewrite(root, newFile, content, path.dirname(oldFile), path.dirname(newFile), locations, totals);
      if (rewritten !== null) { content = rewritten; changed = true; }
    }
    if (edits.has(oldFile)) { content = edits.get(oldFile)(content); changed = true; }
    if (changed) { assertSafeWritePath(root, oldFile); writes.set(newFile, content); }
  }
  if ([...edits.keys()].some((file) => !writes.has(locations.get(file)))) throw new Error('widen-id refuses a record that is not an ordinary file inside its own directory');
  for (const file of unmoved) {
    const rewritten = planReferenceRewrite(root, file, fs.readFileSync(file, 'utf8'), path.dirname(file), path.dirname(file), locations, totals);
    if (rewritten !== null) { assertSafeWritePath(root, file); writes.set(file, rewritten); }
  }
  validate(writes);
  const projections = ['BLUEPRINT.md', 'TASKBOARD.md'].every((name) => fs.existsSync(path.join(root, name)));
  try {
    moveRecordDirectory(root, oldDir, newDir);
    for (const [file, content] of writes) writeSafeFile(root, file, content);
    writeDecisionRegisters(root);
    if (projections) render(root);
    spawnSync('git', ['-C', root, 'add', '-A']);
  } catch (error) {
    throw new Error(`widen-id failed after it began writing: ${error.message}; the tree was clean at HEAD before it started, so \`git reset --hard HEAD\` restores it`);
  }
  return {
    from: path.relative(root, oldDir).split(path.sep).join('/'),
    to: path.relative(root, newDir).split(path.sep).join('/'),
    committed: false,
    referencesRewritten: totals.referencesRewritten,
    historicalReferencesLeft: totals.historicalReferencesLeft
  };
}

// An existing destination refuses, except the source itself seen through a
// case-insensitive filesystem (`S-000q-x` -> `S-000Q-x`).
function refuseOccupiedDestination(root, from, to) {
  let target;
  try { target = fs.lstatSync(to); } catch (error) { if (error.code === 'ENOENT') return; throw error; }
  const source = fs.lstatSync(from);
  if (target.ino === source.ino && target.dev === source.dev) return;
  throw new Error(`widen-id destination already exists: ${path.relative(root, to).split(path.sep).join('/')}`);
}

// A case-only rename goes through a temporary name so it also lands on a
// case-insensitive filesystem.
function moveRecordDirectory(root, from, to) {
  const relative = (value) => path.relative(root, value);
  const temporary = `${to}.widen-id-${process.pid}`;
  const steps = from.toLowerCase() === to.toLowerCase() ? [[from, temporary], [temporary, to]] : [[from, to]];
  for (const [source, destination] of steps) {
    const moved = spawnSync('git', ['-C', root, 'mv', relative(source), relative(destination)], { encoding: 'utf8' });
    if (moved.status !== 0) throw new Error(`git mv ${relative(source)} failed: ${(moved.stderr || moved.stdout || '').trim()}`);
  }
}

// Finds a retired Spec's own durable Wiki owner by the one fact that names
// it - a note's `source_paths` entry naming the Spec's historical route,
// exactly the fact `retireSpec` itself required before the move - and
// returns its absolute path, or `null` when no note names the route at all.
// Never assumes there is exactly one match: the first is returned, since
// `wiki.mjs`'s own basename-uniqueness check is what keeps two notes from
// ever legitimately claiming the same route. A room with no Wiki lane at all
// (an older or minimal room) reports `null` rather than throwing, matching
// how the rest of this file treats an absent Wiki. S-00I TK-006 pulled the
// scan itself out of `retiredSpecWikiOwnerStatus` below so the discard gate
// can also get the file's own path - it needs to exclude that one note's own
// "Evidence and Sources" self-citation of the Spec it retired from the
// reference-scan gate, a citation `retireSpec` itself required and is never
// a stray reference to refuse discard over.
function retiredSpecWikiOwnerFile(root, historicalRoute) {
  const wikiRoot = lanePath(root, 'wiki');
  if (!fs.existsSync(wikiRoot)) return null;
  for (const file of collectDirectoryFiles(wikiRoot)) {
    if (!file.endsWith('.md')) continue;
    const data = parseFrontmatter(fs.readFileSync(file, 'utf8')).data;
    const sources = Array.isArray(data?.source_paths) ? data.source_paths : [];
    if (sources.includes(historicalRoute)) return file;
  }
  return null;
}

function retiredSpecWikiOwnerStatus(root, historicalRoute) {
  const file = retiredSpecWikiOwnerFile(root, historicalRoute);
  if (!file) return null;
  const data = parseFrontmatter(fs.readFileSync(file, 'utf8')).data;
  return data?.status ?? null;
}

// S-00I TK-001 to TK-006 retired a Spec into a design-concept or guidebook
// owner; S-00I TK-01U adds the features article a completed Spec is captured
// into at its closure point (S-00J closure-capture contract T4). This is the
// one owner predicate `retireSpec` (T5), `discardRetiredTask` (T6) and doctor's
// `uncaptured-complete` finding share, so the three can never disagree about
// what a captured owner is. It returns the refusal naming the first missing
// condition, or `null` when the note owns the Spec. `featureOnly` narrows the
// admitted types to `feature`, which is what "captured" means for T6 and
// doctor; retirement also admits the legacy owners. It reads and never
// writes: the note must exist, carry frontmatter, declare an admitted type
// (a feature article only inside the features collection), declare
// `knowledge_role` canonical or curated, name the Spec's historical route in
// `source_paths`, pass `validateWiki` with no `copied-task-state`,
// `invalid-note` or `secret-like-content` finding against it, and be linked
// from the Wiki lane's `MEMORY.md` router.
function durableOwnerRefusal(root, specId, historicalRoute, noteAbsolute, { featureOnly = false } = {}) {
  const wikiRoot = lanePath(root, 'wiki');
  const noteRelative = path.relative(root, noteAbsolute).split(path.sep).join('/');
  // Review corrective (High, separate-context review of 10bdf5b): the note
  // and every ancestor must be ordinary paths inside the repository before
  // anything is read. `validateWiki` skips symlinks when it walks, so a
  // linked note would otherwise be read here (statSync follows links) yet
  // never validated, letting an article outside the Wiki lane own a Spec.
  try { assertSafeReadPath(root, noteAbsolute); }
  catch (error) { return `${error.message}; a linked note cannot be ${specId}'s durable owner`; }
  let entry = null;
  try { entry = fs.lstatSync(noteAbsolute); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!entry?.isFile()) {
    return `retire-spec found no Wiki note at ${noteRelative}; ${specId}'s surviving claims name no durable owner`;
  }
  const content = fs.readFileSync(noteAbsolute, 'utf8');
  const frontmatter = parseFrontmatter(content).data;
  if (!frontmatter) return `${noteRelative} has no frontmatter; it cannot be ${specId}'s durable owner`;
  const featuresRelative = collectionRelative(root, 'features');
  const featuresRoot = path.join(root, featuresRelative);
  const admitted = featureOnly ? ['feature'] : ['design-concept', 'guidebook', 'feature'];
  if (!admitted.includes(frontmatter.type)) {
    return featureOnly
      ? `${noteRelative} must declare type feature in ${featuresRelative} to capture ${specId}, found ${frontmatter.type ?? 'none'}`
      : `${noteRelative} must declare type design-concept or guidebook, or type feature in ${featuresRelative}, to retire ${specId}, found ${frontmatter.type ?? 'none'}`;
  }
  if (frontmatter.type === 'feature' && !noteAbsolute.startsWith(featuresRoot + path.sep)) {
    return `${noteRelative} declares type feature, but type feature must live in the features collection ${featuresRelative}; it cannot be ${specId}'s durable owner there`;
  }
  if (!['canonical', 'curated'].includes(frontmatter.knowledge_role)) {
    return `${noteRelative} must declare knowledge_role canonical or curated to retire ${specId}, found ${frontmatter.knowledge_role ?? 'none'}`;
  }
  const sourcePaths = Array.isArray(frontmatter.source_paths) ? frontmatter.source_paths : [];
  if (!sourcePaths.includes(historicalRoute)) {
    return `${noteRelative} source_paths must name ${specId}'s historical route ${historicalRoute}; found ${sourcePaths.join(', ') || 'none'}`;
  }
  const wikiFindings = validateWiki(root, { contentOverrides: new Map([[noteAbsolute, content]]) })
    .filter((item) => item.note === noteRelative && ['copied-task-state', 'invalid-note', 'secret-like-content'].includes(item.code));
  if (wikiFindings.length > 0) {
    return `${noteRelative} fails Wiki validation, so it cannot be ${specId}'s durable owner: ${wikiFindings.map((item) => `${item.code}: ${item.message}`).join('; ')}`;
  }
  // Review corrective (Low, S-00I TK-005): a note can satisfy every property
  // check above and still be unreachable from a cold-start agent's actual
  // entry point. `MEMORY.md` is the one router `SCHEMA.md`/`LEXICON.md` name.
  const memoryPath = path.join(wikiRoot, 'MEMORY.md');
  const memoryContent = fs.existsSync(memoryPath) ? fs.readFileSync(memoryPath, 'utf8') : '';
  const noteRelativeToWikiRoot = path.relative(wikiRoot, noteAbsolute).split(path.sep).join('/');
  if (!memoryContent.includes(noteRelativeToWikiRoot)) {
    return `${noteRelative} is not linked from workbench/wiki/MEMORY.md (no relative link to ${noteRelativeToWikiRoot} found); a durable owner unreachable from the room brain is not routed`;
  }
  return null;
}

// The route a Spec's durable owner names in `source_paths`: its own path once
// retired, otherwise the retired route `retireSpec` will move it to.
function specHistoricalRoute(root, spec) {
  if (spec.lifecycleFolder) return spec.relativePath;
  return `${spec.specsPrefix}/${SPEC_LIFECYCLE_FOLDERS[0]}/${path.basename(path.dirname(spec.filePath))}/SPEC.md`;
}

// S-00I TK-01U: the features article that captures `spec`, or `null`. A note
// in the features collection naming the Spec's historical route is captured
// only when it passes the shared owner predicate with `featureOnly`.
function capturedFeatureArticle(root, spec) {
  const featuresRoot = collectionPath(root, 'features');
  // Review corrective (High, separate-context review of ed8c4f5): the
  // collection root and every candidate must be ordinary paths inside the
  // repository before anything is read. `collectDirectoryFiles` already skips
  // linked entries, but a linked root or a linked ancestor is a location
  // `validateWiki` never walks, so nothing behind one is a capture: the Spec
  // stays visibly uncaptured (doctor) and its Task records keep waiting
  // (discard), which is the same refusal `durableOwnerRefusal` names for a
  // linked note.
  try { assertSafeReadPath(root, featuresRoot); } catch { return null; }
  let rootEntry = null;
  try { rootEntry = fs.lstatSync(featuresRoot); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!rootEntry?.isDirectory()) return null;
  const historicalRoute = specHistoricalRoute(root, spec);
  for (const file of collectDirectoryFiles(featuresRoot).sort()) {
    if (!file.endsWith('.md') || path.basename(file) === 'README.md') continue;
    try { assertSafeReadPath(root, file); } catch { continue; }
    if (!fs.lstatSync(file).isFile()) continue;
    const sources = parseFrontmatter(fs.readFileSync(file, 'utf8')).data?.source_paths;
    if (!Array.isArray(sources) || !sources.includes(historicalRoute)) continue;
    if (durableOwnerRefusal(root, spec.id, historicalRoute, file, { featureOnly: true }) === null) {
      return path.relative(root, file).split(path.sep).join('/');
    }
  }
  return null;
}

// S-00I TK-01U: `completeSpec` (S-00J TK-01S) records the observed main ref
// and SHA in the completion evidence row; that row is what marks a Spec as
// completed under the closure-capture contract. Specs completed before it
// carry no such row and are never reported.
function completedUnderCaptureContract(spec) {
  return evidenceRows(spec.content).some((line) => {
    const cells = parseMarkdownTableRow(line);
    return cells[1] === 'spec' && cells[2] === 'Spec completed' && /approved delivery verified: \S+ at [0-9a-f]{7,40}\b/.test(cells[3] ?? '');
  });
}

// Doctor's T4 visibility: a Spec completed under the contract with no
// captured features article stays `complete` and is reported as attention.
function uncapturedCompleteFindings(root, specs) {
  const findings = [];
  for (const spec of specs) {
    if (spec.status !== 'complete' || !completedUnderCaptureContract(spec)) continue;
    if (capturedFeatureArticle(root, spec)) continue;
    findings.push(finding('uncaptured-complete', `${spec.id} is complete with main-verified closure but has no captured features article in ${collectionRelative(root, 'features')} naming ${specHistoricalRoute(root, spec)}; capture it before retirement or any record discard`, { specId: spec.id }));
  }
  return findings;
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
//     `source_paths`, pass `validateWiki` with no `copied-task-state` or
//     `invalid-note` finding against it - "transform, never copy" is
//     `wiki.mjs`'s own enforcement, checked here rather than duplicated -
//     and be linked from `workbench/wiki/MEMORY.md` (a relative link to the
//     note's own path within the Wiki lane), since an unrouted note is not
//     reachable from the room brain a cold-start agent actually starts at;
//   - `assembleSpecReport`'s own `approvalGapReason` (S-00J TK-005) must
//     find nothing missing: the Spec's latest `owner-qa` row bound to its
//     current content digest must be an approval, reused exactly as
//     `completeSpec`/`gate` already require it, never a second
//     implementation of what "approved" means.
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
//
// Branch cleanup only ever reaches a branch a Task's own Receipt row names.
// A lane branch that never appended a Receipt row at all (an early run, a
// dispatcher-closed branch, or one abandoned mid-flight) is invisible to
// that pass, so `unmergedBranchesNamingSpec` in the receipt separately lists
// every local and remote branch whose name contains the Spec id and is not
// proven contained in the declared integration branch - reported for a
// human closeout to review, never deleted, since this function only ever
// deletes a branch it has proven safe.
export function retireSpec(rootDir, specId, options = {}) {
  const root = path.resolve(rootDir);
  const wikiNoteGiven = requireValue(options.wikiNote, 'retire-spec requires --wiki <note path>');
  specId = resolveSpecId(root, specId);

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
  const specBasename = path.basename(path.dirname(spec.filePath));
  const historicalRoute = `${spec.specsPrefix}/${folder}/${specBasename}/SPEC.md`;

  const wikiRoot = lanePath(root, 'wiki');
  const wikiNoteAbsolute = path.resolve(root, wikiNoteGiven);
  if (!wikiNoteAbsolute.startsWith(wikiRoot + path.sep)) {
    throw new Error(`--wiki ${wikiNoteGiven} must name a note under the Wiki lane; a Spec cannot retire without a durable owner there`);
  }
  const wikiNoteRelative = path.relative(root, wikiNoteAbsolute).split(path.sep).join('/');
  // S-00I TK-01U: the owner checks moved into `durableOwnerRefusal`, shared
  // with Task discard and doctor, and now admit a features article beside the
  // legacy design-concept and guidebook owners. Every refusal is still named
  // before any write.
  const ownerRefusal = durableOwnerRefusal(root, specId, historicalRoute, wikiNoteAbsolute);
  if (ownerRefusal) throw new Error(ownerRefusal);
  const ownerType = parseFrontmatter(fs.readFileSync(wikiNoteAbsolute, 'utf8')).data.type;

  // S-00J TK-005 has since landed `recordOwnerApproval` and its own
  // `approvalGapReason` (the owner Human QA counterpart to
  // `reviewGapReason`, already used by `completeSpec` and `gate`): a
  // completed, otherwise-ready Spec is not enough to retire on its own -
  // reconciliation is trusted only once the owner has actually looked at
  // the current content and approved it. Reused exactly as `completeSpec`
  // already does, never a second implementation of what "approved" means.
  // `approvalGapReason` only names the current content digest for its
  // "stale" case; it is appended here unconditionally so every refusal -
  // no row at all, every row stale, or the latest row a finding - names the
  // digest a caller can check a fresh `report` against.
  const approvalReason = approvalGapReason(report);
  if (approvalReason) {
    throw new Error(`${specId} cannot retire: ${approvalReason} (current digest ${report.specDigest.slice(0, 12)})`);
  }
  const ownerApproval = {
    required: true,
    approvedBy: report.latestOwnerApproval.owner,
    date: report.latestOwnerApproval.date,
    digest: report.specDigest.slice(0, 12)
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
  // Review corrective (Low): branch cleanup above only ever reaches a
  // branch a Task's own Receipt row actually names - a lane branch that
  // never appended one (an early run, a dispatcher-closed branch, or one
  // abandoned mid-flight) is invisible to it. This is a separate, read-only
  // sweep naming every branch, local or remote, whose name contains the
  // Spec id and is not proven contained in the declared integration branch,
  // so a human closeout still has a punch list even when a branch left no
  // Receipt trail. Never deletes anything - only `cleanupContainedBranches`
  // above ever deletes, and only what it proved contained.
  const unmergedBranchesNamingSpec = findUnmergedBranchesNamingSpec(root, specId, integrationBranch);

  const movedSpec = findSpec(root, specId);
  const referencesRewrittenCount = Object.values(moveResult.referencesRewritten).reduce((a, b) => a + b, 0);
  const branchesCleanedCell = branches.cleaned.length > 0 ? branches.cleaned.join(', ') : 'none';
  const date = today();
  const row = `| ${escapeCell(date)} | spec | Spec retired to ${escapeCell(`${moveResult.to}/SPEC.md`)} | ${escapeCell(wikiNoteRelative)} | ${escapeCell(branchesCleanedCell)} | ${escapeCell(String(referencesRewrittenCount))} |`;
  const updatedContent = appendEvidence(movedSpec.content, row);
  atomicWrite(movedSpec.filePath, updatedContent);

  render(root);
  writeDecisionRegisters(root);
  spawnSync('git', ['-C', root, 'add', '-A']);

  return {
    specId,
    route: `${moveResult.to}/SPEC.md`,
    wikiNote: wikiNoteRelative,
    ownerType,
    referencesRewritten: moveResult.referencesRewritten,
    referencesRewrittenCount,
    historicalReferencesLeft: moveResult.historicalReferencesLeft,
    branches,
    unmergedBranchesNamingSpec,
    ownerApproval,
    evidenceRow: row
  };
}

// Every local (`refs/heads/`) and remote-tracking (`refs/remotes/`) branch
// whose short name contains `specId` and is not proven an ancestor of
// `integrationBranch` - a read-only sweep, never a deletion candidate list.
// A `null` `integrationBranch` (no declared git block) reports every
// matching branch, since nothing can be proven contained against no branch
// at all. `refs/remotes/<remote>/HEAD` is a remote's own symbolic pointer,
// never a real branch, and is excluded so it is never reported as one.
function findUnmergedBranchesNamingSpec(root, specId, integrationBranch) {
  const names = new Set();
  for (const prefix of ['refs/heads/', 'refs/remotes/']) {
    const listing = spawnSync('git', ['-C', root, 'for-each-ref', '--format=%(refname:short)', prefix], { encoding: 'utf8' });
    for (const name of (listing.stdout ?? '').split('\n').map((line) => line.trim()).filter(Boolean)) {
      if (name.endsWith('/HEAD') || !name.includes(specId)) continue;
      names.add(name);
    }
  }
  const unmerged = [];
  for (const name of names) {
    const contained = integrationBranch !== null
      && spawnSync('git', ['-C', root, 'merge-base', '--is-ancestor', name, integrationBranch]).status === 0;
    if (!contained) unmerged.push(name);
  }
  return unmerged.sort();
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

// S-00I TK-006: discard is `git rm` of a retired record, gated on the exact
// change that retired it being verified on the declared default branch
// (`main`), a complete reference and link scan finding nothing current
// naming it, and (for a Spec) its Wiki durable owner still being active.
// Never `archive` - the ADR archive is permanent by ADR-000I and this module
// never resolves a Spec or Task through it at all, so there is no path by
// which either discard function below could ever reach one.
//
// "The commit that moved it": `retireSpec`'s own evidence row is written and
// staged *before* the caller's commit exists, so it cannot literally embed
// that commit's own SHA (the row would have to name a hash Git has not
// computed yet). Resolve the most recent path addition, not the first one:
// a removed and re-added route is a different incarnation whose containment
// must be established independently.
// Git's default path history simplifies away merges, including a merge
// restoring a deleted record from a retained side parent. Per-parent history
// makes those additions visible. An ordinary import from a parent that never
// carried the path is not a new incarnation; restoration after a deletion is.
function discardHistory(root, args) {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`Cannot verify discard history: ${result.stderr?.trim() || result.error?.message || 'Git read failed'}`);
  return result.stdout;
}

function discardParents(root, commit) {
  return discardHistory(root, ['rev-list', '--parents', '-n', '1', commit]).trim().split(' ').slice(1);
}

function resolveMovingCommit(root, relativePath) {
  const additions = discardHistory(root, ['log', '--full-history', '--topo-order', '-m', '--no-renames', '--diff-filter=A', '--format=%H', 'HEAD', '--', relativePath]);
  for (const commit of new Set(additions.trim().split('\n').filter(Boolean))) {
    const parents = discardParents(root, commit);
    const missingParents = parents.filter(parent => discardHistory(root, ['ls-tree', '-z', parent, '--', relativePath]) === '');
    // A root commit or a new path absent from every parent introduces it.
    if (missingParents.length === parents.length) return commit;
    for (const parent of missingParents) {
      const deleted = discardHistory(root, ['log', '--full-history', '-m', '--no-renames', '--diff-filter=D', '--format=%H', '-1', parent, '--', relativePath]);
      if (deleted.trim()) return commit;
    }
  }
  return null;
}

// Recover the complete current directory, not just its primary record. Walk
// exact tree-preserving parent edges, rather than trusting simplified log's
// chosen side. A merge creating a new combination is itself a content origin;
// an ordinary non-FF import follows the parent that actually supplied it.
// Every surviving origin must be main-contained before one can be printed.
function recoveryIdentity(root, relativeDir, remoteRef) {
  const treeCache = new Map();
  const tree = commit => {
    if (!treeCache.has(commit)) {
      const entry = discardHistory(root, ['ls-tree', '-z', commit, '--', relativeDir]);
      const match = /^040000 tree ([0-9a-f]+)\t([^\0]+)\0$/.exec(entry);
      treeCache.set(commit, match?.[2] === relativeDir ? match[1] : null);
    }
    return treeCache.get(commit);
  };
  const head = discardHistory(root, ['rev-parse', '--verify', 'HEAD^{commit}']).trim();
  const currentTree = tree(head);
  if (!currentTree) throw new Error('discard recovery commit does not match the complete current directory');
  const pending = [head];
  const seen = new Set();
  const origins = [];
  while (pending.length) {
    const commit = pending.pop();
    if (seen.has(commit)) continue;
    seen.add(commit);
    const matchingParents = discardParents(root, commit).filter(parent => tree(parent) === currentTree);
    if (matchingParents.length) pending.push(...matchingParents);
    else origins.push(commit);
  }
  if (origins.length === 0 || origins.some(commit => spawnSync('git', ['-C', root, 'merge-base', '--is-ancestor', commit, remoteRef]).status !== 0)) {
    throw new Error(`discard current directory content is not verified contained in ${remoteRef}`);
  }
  const commit = origins[0];
  const quotedDir = /^[A-Za-z0-9_./-]+$/.test(relativeDir) ? relativeDir : "'" + relativeDir.replaceAll("'", "'\"'\"'") + "'";
  return { recoveryCommit: commit, recoveryCommand: `git checkout ${commit} -- ${quotedDir}` };
}

function historicalWikiCitation(content, file, directory, root, commit) {
  // Only evidence citations are history. An operational link elsewhere still
  // participates in the complete reference gate and must be reconciled first.
  return content.replace(/(^## Evidence and Sources\s*\n)([\s\S]*?)(?=^## |$(?![\s\S]))/m, (_, heading, body) => heading + body.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (original, label, target) => {
    if (/^(?:https?:|mailto:)/.test(target)) return original;
    const resolved = path.resolve(path.dirname(file), decodeURIComponent(target.split('#')[0]));
    if (resolved !== directory && !resolved.startsWith(directory + path.sep)) return original;
    const route = path.relative(root, resolved).split(path.sep).join('/');
    return `${label} (\`git show ${commit}:${route}\`)`;
  }));
}

function preflightDiscardRender(root, { specId, taskId } = {}) {
  const prospective = specs => specs.filter(spec => taskId || spec.id !== specId).map(spec => spec.id !== specId ? spec : {
    ...spec, retiredRecords: spec.retiredRecords.filter(task => task.id !== taskId)
  });
  const specs = prospective(loadSpecs(root));
  const retired = prospective(loadRetiredSpecs(root));
  const blueprint = fs.readFileSync(path.join(root, 'BLUEPRINT.md'), 'utf8');
  const board = fs.readFileSync(path.join(root, 'TASKBOARD.md'), 'utf8');
  if (blueprint.includes(CATALOG_START) || blueprint.includes(CATALOG_END)) replaceRegion(blueprint, CATALOG_START, CATALOG_END, renderCatalog(specs, retired));
  replaceRegion(board, HOT_START, HOT_END, renderHotBoard(specs, retired, loadLandmarkParents(root)));
}

function stageDiscard(root) {
  const result = spawnSync('git', ['-C', root, 'add', '-A'], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`discard staging failed: ${result.stderr.trim() || 'unknown error'}`);
}

// The declared default branch's remote-tracking ref, or `null` when either
// the manifest declares no `git.defaultBranch` or no `origin/<branch>` ref
// exists to check against - both refused by the caller rather than treated
// as "assume contained", since a local-only branch proves nothing about what
// is actually verified on `main`.
function resolveDefaultBranchRemoteRef(root) {
  const defaultBranch = declaredGit(root)?.defaultBranch ?? null;
  if (!defaultBranch) return { defaultBranch: null, remoteRef: null };
  return { defaultBranch, remoteRef: resolveRemoteTrackingRef(root, defaultBranch) };
}

// `origin/<branch>` when that remote-tracking ref exists locally, else
// `null`. Reads local refs only; never fetches.
function resolveRemoteTrackingRef(root, branch) {
  const remoteRef = `origin/${branch}`;
  return spawnSync('git', ['-C', root, 'show-ref', '--verify', '--quiet', `refs/remotes/${remoteRef}`]).status === 0 ? remoteRef : null;
}

function resolveCommit(root, ref) {
  const result = spawnSync('git', ['-C', root, 'rev-parse', '--verify', '--quiet', `${ref}^{commit}`], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() || null : null;
}

// S-00J TK-002N: the one ref integration containment is checked against -
// the declared integration branch's remote-tracking ref (`origin/<branch>`,
// the same resolution TK-01S's default-branch delivery check uses) when it
// exists, otherwise the local branch. In a shared repository the local
// `integration` branch is held by another checkout and can lag far behind
// `origin/integration`; reading the remote-tracking ref keeps that stale
// local ref from hiding reviewed delivery, and keeps an unpushed local
// branch from counting as delivery. A room with no remote keeps using its
// local branch. Local refs only; nothing is fetched, so a stale fetch is
// named by `sha` (and `localSha`) for the caller to show. `source` is
// `remote-tracking`, `local`, or `undeclared` (no `git.integrationBranch`,
// `ref` null: nothing to check against).
export function resolveIntegrationContainmentRef(root) {
  const branch = declaredGit(root)?.integrationBranch ?? null;
  if (!branch) return { branch: null, ref: null, source: 'undeclared', sha: null, localSha: null };
  const remoteRef = resolveRemoteTrackingRef(root, branch);
  const ref = remoteRef ?? branch;
  return {
    branch,
    ref,
    source: remoteRef ? 'remote-tracking' : 'local',
    sha: resolveCommit(root, ref),
    localSha: resolveCommit(root, `refs/heads/${branch}`)
  };
}

// The tracked, append-only discards register this lane defines: a Spec or
// Task's own record carries no room to hold operational Git recovery facts
// (a Spec's evidence log is about to be deleted along with it; a Task record
// never had one), and the Wiki durable owner a Spec retired into is about
// capability knowledge, not Git bookkeeping - piling recovery facts into
// either would blur what each already means. A dedicated register, read the
// same way `REGISTER.md`/`HISTORY.md` already are, keeps "what got discarded
// and how do I get it back" in one discoverable place. Reuses `appendEvidence`
// unchanged: it only ever looks for the literal Append-Only Evidence heading,
// so this register is exactly as append-only as a Spec's own evidence log
// without a second append implementation.
function ensureDiscardsRegister(root) {
  const registerPath = path.join(resolveSpecsRoot(root).specsRoot, 'DISCARDS.md');
  if (fs.existsSync(registerPath)) return { registerPath, content: fs.readFileSync(registerPath, 'utf8') };
  const content = [
    '# Discards',
    '',
    'Append-only register of every retired record a discard gate approved for',
    '`git rm`: the retiring commit verified contained on the declared default',
    'branch, a complete reference and link scan finding nothing current naming',
    'the record, and (for a Spec) its Wiki durable owner still active. Git',
    "history recovers a discarded record with its own row's recovery command;",
    'archive is never discarded, by ADR-000I, and this register never is either',
    '- a row is appended, never edited.',
    '',
    '## Append-Only Evidence And Execution Log',
    '',
    '| Date | Kind | Record ID | Historical Path | Retiring Commit | Discard Parent Commit | Recovery Command |',
    '|---|---|---|---|---|---|---|',
    ''
  ].join('\n');
  return { registerPath, content };
}

function recordDiscard(root, { kind, id, historicalRoute, movingCommit, parentCommit, recoveryCommand }) {
  const { registerPath, content } = ensureDiscardsRegister(root);
  const row = `| ${escapeCell(today())} | ${escapeCell(kind)} | ${escapeCell(id)} | ${escapeCell(historicalRoute)} | ${escapeCell(movingCommit)} | ${escapeCell(parentCommit)} | ${escapeCell(recoveryCommand)} |`;
  atomicWrite(registerPath, appendEvidence(content, row));
  return path.relative(root, registerPath).split(path.sep).join('/');
}

// Every historical path this room's own DISCARDS.md register says was
// actually discarded, as absolute paths - `[]` when the register does not
// exist yet (a room that has never discarded anything).
function loadDiscardedHistoricalPaths(root) {
  const registerPath = path.join(resolveSpecsRoot(root).specsRoot, 'DISCARDS.md');
  if (!fs.existsSync(registerPath)) return [];
  const paths = [];
  for (const line of fs.readFileSync(registerPath, 'utf8').split('\n')) {
    if (!/^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line)) continue;
    const cells = parseMarkdownTableRow(line);
    if (cells[3]) paths.push(path.resolve(root, cells[3]));
  }
  return paths;
}

// S-00I TK-006: doctor's safety net for a discard that bypassed the gate (a
// raw `git rm`) or a reference added back afterward - deliberately narrower
// than `scanReferences`, and scoped specifically to a target this room's own
// `DISCARDS.md` register says was actually discarded. Reusing the general
// "any dead local link" scan directly would duplicate the existing
// `broken-link` finding for every ordinary broken link in the room (a typo,
// a moved file unrelated to any discard) and - since that finding is
// deliberately `attention`, never blocking - silently upgrade a room's
// existing non-blocking issues to a blocking one this Task never intended to
// touch. A room that has never discarded anything (`loadDiscardedHistoricalPaths`
// returns `[]`) never runs this scan at all.
function discardedReferences(root) {
  const discardedPaths = loadDiscardedHistoricalPaths(root);
  if (discardedPaths.length === 0) return [];
  const isDiscarded = (candidate) => discardedPaths.some((entry) => candidate === entry || candidate.startsWith(entry + path.sep));
  const adrCollection = collectionPath(root, 'adr');
  const findings = [];
  for (const file of collectSpecReferenceFiles(root)) {
    const original = fs.readFileSync(file, 'utf8');
    const { prefix, suffix } = splitEvidenceSection(original);
    const relative = path.relative(root, file).split(path.sep).join('/');
    for (const section of [prefix, suffix]) {
      for (const link of localLinks(section)) {
        const resolved = path.resolve(path.dirname(file), link);
        if (isDiscarded(resolved)) findings.push({ file: relative, target: link });
      }
    }
    for (const owner of canonicalizedInTargets(prefix)) {
      const resolved = path.resolve(root, owner);
      if (isDiscarded(resolved)) findings.push({ file: relative, target: owner });
    }
    if (path.dirname(file) === adrCollection && ['REGISTER.md', 'HISTORY.md'].includes(path.basename(file))) {
      for (const owner of registerPathCells(original)) {
        const resolved = path.resolve(root, owner);
        if (isDiscarded(resolved)) findings.push({ file: relative, target: owner });
      }
    }
  }
  return findings;
}

// S-00I TK-006: discards a retired Spec - `git rm -r` of its whole directory,
// never its Tasks one at a time (they travel with it, exactly as retirement
// carries them together). Every gate below is refused by name before any
// write.
export function discardRetiredSpec(rootDir, specId) {
  const root = path.resolve(rootDir);
  specId = resolveSpecId(root, specId);
  const retired = loadRetiredSpecs(root).filter((item) => item.id === specId);
  if (retired.length > 1) throw new Error(`Duplicate spec ID: ${specId}`);
  if (retired.length === 0) {
    const active = loadSpecs(root).some((item) => item.id === specId);
    throw new Error(active ? `${specId} is on the active roster, not retired; discard only ever removes a retired record` : `Unknown spec ID: ${specId}`);
  }
  const spec = retired[0];
  // Never `archive`: `SPEC_LIFECYCLE_FOLDERS` is `['retired']` alone
  // (ADR-000I reserves `archive` for ADRs), so this can only ever be
  // `retired` today - checked explicitly anyway so a future lifecycle folder
  // added to that set is never silently discardable without its own review.
  if (spec.lifecycleFolder !== 'retired') {
    throw new Error(`${specId} is retired in ${spec.lifecycleFolder}/, not retired/; discard refuses every folder but retired, and never archive`);
  }
  // A retired Spec may still hold an open corrective record an earlier release
  // wrote (no command creates one now). A stale projection is not evidence
  // that those obligations are gone, even after main contains it.
  const unfinished = [
    ...slicesOf(spec).filter(task => task.declared !== 'done').map(task => task.id),
    ...(spec.retiredRecords ?? []).filter(task => taskStatus(task) !== 'done').map(task => task.id)
  ];
  if (unfinished.length) throw new Error(`${specId} cannot discard: unfinished Tasks ${unfinished.join(', ')}`);
  const gitStatus = spawnSync('git', ['-C', root, 'status', '--porcelain'], { encoding: 'utf8' });
  if (gitStatus.status !== 0) throw new Error('discard requires a Git working tree so the removal is recoverable; none was found');
  if (gitStatus.stdout.trim() !== '') throw new Error('discard refuses a dirty working tree; commit or stash first so the candidate shows only this removal');

  const movingCommit = resolveMovingCommit(root, spec.relativePath);
  if (!movingCommit) {
    throw new Error(`${specId} cannot discard: no committed change adds ${spec.relativePath}; the retiring commit must exist in Git history before discard can verify it on main`);
  }
  const { defaultBranch, remoteRef } = resolveDefaultBranchRemoteRef(root);
  if (!defaultBranch) throw new Error(`${specId} cannot discard: the manifest declares no git.defaultBranch to verify containment against`);
  if (!remoteRef) throw new Error(`${specId} cannot discard: no origin/${defaultBranch} remote-tracking ref exists; discard refuses an unverifiable containment check rather than trusting a local branch alone`);
  const contained = spawnSync('git', ['-C', root, 'merge-base', '--is-ancestor', movingCommit, remoteRef]).status === 0;
  if (!contained) throw new Error(`${specId} cannot discard: the retiring commit ${movingCommit} is not verified contained in ${remoteRef}`);

  const specDir = path.dirname(spec.filePath);
  // The owner remains in the complete scan. Only historical evidence links
  // are converted to immutable Git citations in the prospective content.
  const wikiOwnerFile = retiredSpecWikiOwnerFile(root, spec.relativePath);
  const relativeDir = path.relative(root, specDir).split(path.sep).join('/');
  const { recoveryCommit, recoveryCommand } = recoveryIdentity(root, relativeDir, remoteRef);
  const updatedWiki = wikiOwnerFile ? historicalWikiCitation(fs.readFileSync(wikiOwnerFile, 'utf8'), wikiOwnerFile, specDir, root, recoveryCommit) : null;
  const references = referencesToPath(root, specDir, { contentOverrides: new Map(wikiOwnerFile ? [[wikiOwnerFile, updatedWiki]] : []) });
  if (references.length > 0) {
    throw new Error(`${specId} cannot discard: a complete reference scan still finds ${references.length} current reference(s) naming it, starting with ${references[0].file} -> ${references[0].target}`);
  }

  if (!wikiOwnerFile) {
    throw new Error(`${specId} cannot discard: no Wiki note names its historical route ${spec.relativePath} in source_paths`);
  }
  const wikiOwnerStatus = retiredSpecWikiOwnerStatus(root, spec.relativePath);
  if (wikiOwnerStatus !== 'active') {
    throw new Error(`${specId} cannot discard: its Wiki durable owner is status ${wikiOwnerStatus}, not active`);
  }

  const parentCommit = spawnSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  preflightDiscardRender(root, { specId });
  const rmResult = spawnSync('git', ['-C', root, 'rm', '-r', '--quiet', relativeDir]);
  if (rmResult.status !== 0) throw new Error(`git rm failed for ${specId}: ${(rmResult.stderr ?? '').toString().trim() || 'unknown error'}`);

  atomicWrite(wikiOwnerFile, updatedWiki);
  const register = recordDiscard(root, { kind: 'spec', id: specId, historicalRoute: spec.relativePath, movingCommit, parentCommit, recoveryCommand });

  render(root);
  stageDiscard(root);

  return {
    specId,
    historicalRoute: spec.relativePath,
    retiringCommit: movingCommit,
    recoveryCommit,
    discardParentCommit: parentCommit,
    recoveryCommand,
    register
  };
}

// S-00I TK-006: discards one retired Task record. A Task carries no
// evidence-log analogue and `moveTaskRecord` requires no Wiki note at all
// (only its own Proof/Receipt evidence, already satisfied before it could
// retire); the containment, dirty-tree and reference-scan gates are the same
// three that apply to a Spec. S-00I TK-01U adds the one owner gate the
// closure-capture contract puts before T6: the parent Spec must already be
// captured into a features article (`capturedFeatureArticle`, the predicate
// retirement shares). Fixture-only: no room in this repository has ever
// retired a Task into `tasks/retired/`.
export function discardRetiredTask(rootDir, specId, taskId) {
  const root = path.resolve(rootDir);
  specId = resolveSpecId(root, specId);
  const spec = findSpec(root, specId);
  taskId = resolveTaskId(spec, taskId);
  const retiredTask = (spec.retiredRecords ?? []).find((task) => task.id === taskId);
  if (!retiredTask) {
    const active = (spec.records ?? []).some((task) => task.id === taskId);
    throw new Error(active ? `${specId}/${taskId} is on the active roster, not retired; discard only ever removes a retired record` : `Unknown Task ID: ${specId}/${taskId}`);
  }
  if (retiredTask.lifecycleFolder !== 'retired') {
    throw new Error(`${specId}/${taskId} is retired in tasks/${retiredTask.lifecycleFolder}/, not tasks/retired/; discard refuses every folder but retired, and never archive`);
  }
  const gitStatus = spawnSync('git', ['-C', root, 'status', '--porcelain'], { encoding: 'utf8' });
  if (gitStatus.status !== 0) throw new Error('discard requires a Git working tree so the removal is recoverable; none was found');
  if (gitStatus.stdout.trim() !== '') throw new Error('discard refuses a dirty working tree; commit or stash first so the candidate shows only this removal');

  const taskDir = path.dirname(retiredTask.filePath);
  const historicalRoute = path.relative(root, retiredTask.filePath).split(path.sep).join('/');
  const movingCommit = resolveMovingCommit(root, historicalRoute);
  if (!movingCommit) {
    throw new Error(`${specId}/${taskId} cannot discard: no committed change adds ${historicalRoute}; the retiring commit must exist in Git history before discard can verify it on main`);
  }
  const { defaultBranch, remoteRef } = resolveDefaultBranchRemoteRef(root);
  if (!defaultBranch) throw new Error(`${specId}/${taskId} cannot discard: the manifest declares no git.defaultBranch to verify containment against`);
  if (!remoteRef) throw new Error(`${specId}/${taskId} cannot discard: no origin/${defaultBranch} remote-tracking ref exists; discard refuses an unverifiable containment check rather than trusting a local branch alone`);
  const contained = spawnSync('git', ['-C', root, 'merge-base', '--is-ancestor', movingCommit, remoteRef]).status === 0;
  if (!contained) throw new Error(`${specId}/${taskId} cannot discard: the retiring commit ${movingCommit} is not verified contained in ${remoteRef}`);

  const references = referencesToPath(root, taskDir);
  if (references.length > 0) {
    throw new Error(`${specId}/${taskId} cannot discard: a complete reference scan still finds ${references.length} current reference(s) naming it, starting with ${references[0].file} -> ${references[0].target}`);
  }
  // S-00I TK-01U (closure-capture contract T4 before T6): Task records,
  // live or retired and including missed attempts, stay until the parent
  // Spec is captured into a features article. Moving a done Task into
  // `tasks/retired/` stays allowed; only discard waits.
  if (!capturedFeatureArticle(root, spec)) {
    throw new Error(`${specId}/${taskId} cannot discard: its parent Spec ${specId} has no captured features article (a validated type feature note in ${collectionRelative(root, 'features')} naming ${specHistoricalRoute(root, spec)} in source_paths and routed from MEMORY.md); Task records wait for features capture`);
  }

  const parentCommit = spawnSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  const relativeDir = path.relative(root, taskDir).split(path.sep).join('/');
  const { recoveryCommit, recoveryCommand } = recoveryIdentity(root, relativeDir, remoteRef);
  preflightDiscardRender(root, { specId, taskId });
  const keep = path.join(path.dirname(spec.filePath), 'tasks', '.gitkeep');
  const createdKeep = !fs.existsSync(keep);
  if (createdKeep) atomicWrite(keep, '');
  const rmResult = spawnSync('git', ['-C', root, 'rm', '-r', '--quiet', relativeDir]);
  if (rmResult.status !== 0) {
    if (createdKeep) fs.unlinkSync(keep);
    throw new Error(`git rm failed for ${specId}/${taskId}: ${(rmResult.stderr ?? '').toString().trim() || 'unknown error'}`);
  }

  const register = recordDiscard(root, { kind: 'task', id: `${specId}/${taskId}`, historicalRoute, movingCommit, parentCommit, recoveryCommand });

  render(root);
  stageDiscard(root);

  return {
    specId,
    taskId,
    historicalRoute,
    retiringCommit: movingCommit,
    recoveryCommit,
    discardParentCommit: parentCommit,
    recoveryCommand,
    register
  };
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

// S-00I TK-006: the discard gate's own "a complete reference and link scan
// finds nothing current pointing at the record" check. `scanReferences`
// above answers a different question - "does a link resolve to something
// that exists" - which cannot see a live reference to a record discard has
// not removed yet (the target still exists, so nothing there is broken).
// This walks the identical file set with the identical prefix/suffix split
// (the Append-Only Evidence And Execution Log stays excluded exactly as it
// is for `scanReferences`, so a Spec's own frozen history naming an old path
// is never mistaken for a live reference - "append-only rows counted and
// allowed, live references refused" per the discard design), but asks
// whether a resolved target falls *under* `targetPath` rather than whether
// it exists. `excludeDir` on `collectSpecReferenceFiles` drops the record's
// own directory from the referencer set, so a retired record's own body
// (its title, or its own retirement row before the evidence-section split
// even applies) is never read as a reference to itself. `excludeFiles`
// (absolute paths) drops additional known, sanctioned referencers - the
// discard gate's own retired-Spec durable-owner Wiki note, whose "Evidence
// and Sources" citation of the very record it retired is a citation
// `retireSpec` itself required and is never a stray reference to refuse
// discard over.
export function referencesToPath(rootDir, targetPath, options = {}) {
  const root = path.resolve(rootDir);
  const target = path.resolve(root, targetPath);
  const excludeFiles = new Set((options.excludeFiles ?? []).map((file) => path.resolve(root, file)));
  const adrCollection = collectionPath(root, 'adr');
  const findings = [];
  const underTarget = (candidate) => candidate === target || candidate.startsWith(target + path.sep);
  for (const file of collectSpecReferenceFiles(root, target)) {
    if (excludeFiles.has(file)) continue;
    const original = options.contentOverrides?.get(file) ?? fs.readFileSync(file, 'utf8');
    const { prefix, suffix } = splitEvidenceSection(original);
    const relative = path.relative(root, file).split(path.sep).join('/');
    for (const section of [prefix, suffix]) {
      for (const link of localLinks(section)) {
        const resolved = path.resolve(path.dirname(file), link);
        if (underTarget(resolved)) findings.push({ file: relative, target: link });
      }
    }
    for (const owner of canonicalizedInTargets(prefix)) {
      const resolved = path.resolve(root, owner);
      if (underTarget(resolved)) findings.push({ file: relative, target: owner });
    }
    if (path.dirname(file) === adrCollection && ['REGISTER.md', 'HISTORY.md'].includes(path.basename(file))) {
      for (const owner of registerPathCells(original)) {
        const resolved = path.resolve(root, owner);
        if (underTarget(resolved)) findings.push({ file: relative, target: owner });
      }
    }
  }
  return findings;
}

function publicSpec(spec) {
  return {
    id: spec.id,
    // S-01W TK-002O: present only on a record `widen-id` widened.
    ...(spec.formerId ? { formerId: spec.formerId } : {}),
    // S-003Z TK-008E: present only on a Spec nested in a landmark's folder.
    ...(spec.landmarkId ? { landmarkId: spec.landmarkId } : {}),
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
    else if (arg === '--host') options.host = true;
    else if (arg === '--activate') options.activate = true;
    else if (arg === '--local') options.local = true;
    else if (arg === '--review') options.review = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg.startsWith('--')) options[toCamel(arg.slice(2))] = rest[++optionIndex];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return { command, id, options };
}

// S-00V TK-00K: `next` with nothing eligible but capability-blocked Tasks
// still says "No eligible work." and then names each one, so the capability
// is never hidden behind an empty answer.
function formatCapabilityBlockedNext(result) {
  return ['No eligible work.', ...result.capabilityBlocked.map((entry) => `capability-blocked: ${parentIdOf(entry)}/${entry.taskId} needs ${entry.missing.join(', ')} (${entry.recorded ? 'recorded' : 'not yet recorded'}) - ${entry.reason}`)].join('\n');
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

async function main() {
  const { command, id, options } = parseCliArgs(process.argv.slice(2));
  if (options.dryRun && command !== 'move-task') throw new Error('--dry-run is supported only by move-task collision recovery');
  if (options.review && command !== 'next') throw new Error('--review is supported only by next');
  const root = options.path ?? process.cwd();
  let result;
  let doctorRun;
  let coordination = null;
  if (command === 'next') ({ result, coordination } = nextSelection(root, { capabilities: options.capabilities, local: options.local, review: options.review }));
  else if (command === 'next-id') result = nextIdentity(root, id, options);
  else if (command === 'show') result = showSpec(root, id);
  else if (command === 'claim') result = claimWork(root, id, { ...options, capabilityProbes: undefined });
  else if (command === 'close') result = closeTask(root, id, { ...options, capabilityProbes: undefined });
  else if (command === 'receipt') result = receiptTask(root, id, options);
  else if (command === 'complete') result = completeSpec(root, id, options);
  else if (command === 'convert-tasks') result = convertSpecSlices(root, id, { destinations: options.destinations ? JSON.parse(options.destinations) : undefined, activate: options.activate === true });
  else if (command === 'report') result = assembleSpecReport(root, resolveSpecId(root, id), { candidate: options.candidate });
  else if (command === 'verdict') result = recordReviewVerdict(root, resolveSpecId(root, id), { candidate: options.candidate, result: options.result, findings: options.findings, reviewer: options.reviewer, digest: options.digest });
  else if (command === 'approve') {
    // S-00J TK-005: the CLI verb only ever names `approve`; whether it
    // records an approval or a finding is inferred from what the caller
    // actually gave, exactly matching the handoff's own invocation shape
    // (`approve S-### --candidate <sha> --owner "<who>" [--finding "..."]
    // [--destination-change "..."]`, with no separate --result flag shown).
    // An explicit --result still overrides the inference for a caller that
    // wants to say so plainly - recordOwnerApproval itself always requires
    // one of the two literal values.
    const inferredResult = options.result ?? ((options.finding || options.destinationChange) ? 'finding' : 'approve');
    result = recordOwnerApproval(root, resolveSpecId(root, id), {
      candidate: options.candidate,
      owner: options.owner,
      result: inferredResult,
      findings: options.finding,
      destinationChange: options.destinationChange
    });
  }
  else if (command === 'gate') {
    result = gate(root, { spec: options.spec, task: options.task, candidate: options.candidate, landmark: options.landmark });
    if (result.refused) process.exitCode = 1;
  }
  else if (command === 'move-spec') {
    // S-003Z TK-008F: `--landmark LMK-###|none` changes the Spec's parent;
    // `--to FOLDER` retires it. One move does one of the two.
    if ('landmark' in options && options.to !== undefined) throw new Error('move-spec takes --to FOLDER or --landmark LMK-###|none, not both');
    result = 'landmark' in options ? moveSpecToLandmark(root, id, options.landmark) : moveSpecDirectory(root, id, options.to);
  }
  else if (command === 'move-task') result = moveTaskRecord(root, id, options.task, options.to, options);
  else if (command === 'widen-id') result = widenId(root, id, { spec: options.spec });
  else if (command === 'retire-spec') result = retireSpec(root, id, { wikiNote: options.wiki });
  else if (command === 'discard') result = options.task ? discardRetiredTask(root, id, options.task) : discardRetiredSpec(root, id);
  else if (command === 'render') result = render(root, { format: options.format });
  else if (command === 'doctor') {
    doctorRun = doctorCommand(root, options);
    result = doctorRun.json;
    process.exitCode = doctorRun.exitCode;
  } else {
    throw new Error('Usage: spec-workbench.mjs next|next-id|show|claim|close|receipt|complete|convert-tasks|report|verdict|gate|approve|move-spec|move-task|widen-id|retire-spec|discard|render|doctor [S-###] [options] (show|claim|close|receipt|move-task LMK-### for a Task directly under a landmark; move-spec S-### --to retired|--landmark LMK-###|none; gate --task TK-### --spec S-###|--landmark LMK-###; widen-id S-###|TK-### [--spec S-###]; discard S-### [--task TK-###]; doctor [--host]; next|claim|close [--capabilities a,b]; next|claim [--local]; claim [--branch NAME])');
  }
  if (options.json) console.log(JSON.stringify(result, null, 2));
  else if (command === 'show') console.log(result.body);
  else if (command === 'doctor') console.log(doctorRun.text);
  else if (command === 'report') console.log(formatSpecReport(result));
  else if (command === 'next' && result?.taskId === null) console.log(formatCapabilityBlockedNext(result));
  else console.log(result === null ? 'No eligible work.' : JSON.stringify(result, null, 2));
  if (command === 'claim') coordination = result?.coordination ?? null;
  const note = formatCoordinationNote(command, coordination);
  if (note) console.error(note);
}

// S-00V TK-01L: say on stderr, never in the parsed stdout, when selection or a
// claim stayed local, when the fetch failed, and which Tasks remote tips hold.
function formatCoordinationNote(command, coordination) {
  if (!coordination || !['next', 'claim'].includes(command)) return null;
  if (coordination.mode === 'local') {
    return command === 'next'
      ? `${command}: local selection only (${coordination.reason}); claims made by other instances are not visible`
      : `${command}: claim recorded in this working tree only (${coordination.reason}); it is not committed, pushed or visible to other instances`;
  }
  const lines = [];
  if (coordination.fetched === false) lines.push(`${command}: could not fetch from ${coordination.remote} (${coordination.fetchError}); remote claims are read from the last fetched refs`);
  for (const item of coordination.remoteClaimed ?? []) lines.push(`${command}: skipped ${parentIdOf(item)}/${item.taskId}, claimed on ${item.refs.join(', ')}`);
  if (command === 'claim' && coordination.pushed) lines.push(`claim: committed ${coordination.commit.slice(0, 7)} on ${coordination.branch}${coordination.created ? ' (new task branch)' : ''} and pushed to ${coordination.remote}`);
  return lines.length > 0 ? lines.join('\n') : null;
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  });
}
