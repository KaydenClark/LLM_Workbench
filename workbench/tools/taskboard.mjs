import { compareVisibleIds, visibleIdKey, visibleIdParts } from './visible-ids.mjs';

export const TASKBOARD_LANES = Object.freeze(['backlog', 'toDo', 'inProgress', 'blocked', 'needsReview', 'complete']);
const SPEC_STATES = new Set(['planned', 'active', 'blocked', 'needs-review', 'complete', 'superseded']);
const TASK_LANES = Object.freeze({ ready: 'toDo', 'in-progress': 'inProgress', blocked: 'blocked', 'needs-review': 'needsReview', done: 'complete', deferred: 'backlog' });
// S-003Z TK-008G: a landmark (ADR-000U) projects as a card one size above a
// Spec, with its direct Tasks as its children. Its closed status set maps onto
// the Spec states the lane calculation already reads: `reached` is a landmark's
// completion. The caller marks a landmark source with `kind: 'landmark'`.
const LANDMARK_STATES = Object.freeze({ planned: 'planned', active: 'active', reached: 'complete' });
const CARD_PREFIXES = Object.freeze(['S', 'TK', 'LMK']);

// The identity of the parent a Task names: its Spec, or the landmark a
// landmark-direct Task sits under.
function parentOf(task) {
  return task.specId ?? task.landmarkId;
}

function parentStatus(parent) {
  return parent.kind === 'landmark' ? LANDMARK_STATES[parent.status] : parent.status;
}

// Source-qualified calculation shared by preview and execution consumers.
// Dependencies and capability facts come from existing source resolvers; the
// calculation never reads output, allocates identities or writes lifecycle state.
export function taskboardTaskEntry(spec, task, { resolvedStatus = task.status, dependenciesMet = true } = {}) {
  const lane = TASK_LANES[task.status === 'ready' ? 'ready' : resolvedStatus];
  if (!lane) throw taskboardSourceError(`${task.id} has invalid status ${task.status}`);
  const fields = sourceFields(task.content, false);
  const declaredParent = fields['Spec ID'] ?? fields['Landmark ID'] ?? parentOf(task);
  if (declaredParent !== undefined && declaredParent !== null && visibleIdKey(declaredParent) !== visibleIdKey(spec.id)) {
    throw taskboardSourceError(`${task.id} names ${declaredParent}, expected parent ${spec.id}`);
  }
  const priority = fields.Priority === undefined ? spec.priority : Number(fields.Priority);
  if (!(priority === null && spec.status === 'planned') && (!Number.isInteger(priority) || priority < 0)) throw taskboardSourceError(`${task.id} has invalid priority`);
  return {
    key: `${visibleIdKey(spec.id)}/${visibleIdKey(task.id)}`,
    specId: spec.id, id: task.id, title: task.slice, priority,
    lane, status: resolvedStatus, dependenciesMet,
    eligible: lane === 'toDo' && resolvedStatus === 'ready' && dependenciesMet,
    reviewEligible: lane === 'needsReview' && dependenciesMet
  };
}

// Only expected malformed source carries this code; consumers must not treat
// an unrelated calculation exception as a source diagnostic.
function taskboardSourceError(message) {
  const error = new Error(`taskboard-source: ${message}`);
  error.code = 'taskboard-source';
  return error;
}

export function compareTaskboardEntries(a, b) {
  return (a.priority ?? Infinity) - (b.priority ?? Infinity) || compareText(a.title, b.title)
    || compareVisibleIds(a.id, b.id) || compareVisibleIds(a.specId ?? a.id, b.specId ?? b.id);
}

// First S-01X slice: a pure projection of existing parsed owners. No clock,
// output reads, allocation, selection, review verdict or lifecycle mutation.
export function buildTaskboard(specs, { resolveTask = () => ({}) } = {}) {
  const entries = [];
  const identities = new Map();
  function add(id, lane, card, source) {
    const key = visibleIdKey(id);
    if (!key || !CARD_PREFIXES.includes(visibleIdParts(id).prefix)) throw new Error(`taskboard-source: invalid WBID ${id} at ${source}`);
    const previous = identities.get(key);
    if (previous) throw new Error(`taskboard-collision: ${previous.id} at ${previous.source} and ${id} at ${source} share a flat card identity; source numeric Task labels retain their Spec scope`);
    identities.set(key, { id, source });
    entries.push({ id, lane, card });
  }
  for (const spec of specs) {
    const landmark = spec.kind === 'landmark';
    if (!SPEC_STATES.has(parentStatus(spec))) throw new Error(`taskboard-source: ${spec.id} has invalid status ${spec.status}`);
    if (!(spec.priority === null && spec.status === 'planned') && (!Number.isFinite(spec.priority) || spec.priority < 0)) throw new Error(`taskboard-source: ${spec.id} has invalid priority`);
    const children = [
      ...spec.rows.map(row => ({ ...row, specId: spec.id, relativePath: spec.relativePath })),
      ...spec.records,
      ...(spec.retiredRecords ?? [])
    ];
    const childEntries = children.map(child => taskboardTaskEntry(spec, child, resolveTask(spec, child)));
    for (const [index, child] of children.entries()) {
      if (visibleIdKey(parentOf(child)) !== visibleIdKey(spec.id)) throw new Error(`taskboard-source: ${child.relativePath} names ${parentOf(child)}, expected parent ${spec.id}`);
      const entry = childEntries[index], lane = entry.lane;
      const retired = Boolean(spec.lifecycleFolder || child.lifecycleFolder);
      const card = makeCard({
        title: child.slice, priority: entry.priority, content: child.content,
        dependencies: child.blockers, sourceLinks: [child.relativePath, spec.relativePath],
        progress: null, nextAction: taskAction({ ...child, status: entry.status }, retired),
        cleanupState: lane === 'complete' ? (retired ? 'readyToDelete' : 'readyToCapture') : null
      });
      // SCR-1/SCR-7 refine Task review to waiting for assembled Spec review;
      // this never creates a separate destination-level Task approval.
      card.requiredQA = lane === 'needsReview' ? [landmark ? 'landmark-review' : 'assembled-spec-review'] : [];
      if (landmark) card.landmarkId = child.landmarkId;
      else card.specId = child.specId;
      add(child.id, lane, card, child.relativePath);
    }
    const lane = taskboardSpecLane(spec, childEntries);
    const card = makeCard({
      title: spec.title, priority: spec.priority, content: spec.content,
      assignee: spec.owner, dependencies: spec.blockers, sourceLinks: [spec.relativePath],
      progress: { complete: children.filter(child => child.status === 'done').length, total: children.length },
      nextAction: spec.nextGate,
      cleanupState: lane === 'complete' ? (spec.lifecycleFolder ? 'readyToDelete' : 'readyToCapture') : null
    });
    // Destination-level QA obligations remain visible during delivery. These
    // labels are requirements only; verdict and owner-approval evidence stays
    // in the existing report/gate readers, never inferred from a board lane.
    card.requiredQA = ['complete', 'superseded'].includes(parentStatus(spec)) && lane === 'complete'
      ? [] : [landmark ? 'landmark-review' : 'assembled-spec-review', 'owner-human-qa'];
    add(spec.id, lane, card, spec.relativePath);
  }
  const board = { schemaVersion: 1, lanes: Object.fromEntries(TASKBOARD_LANES.map(lane => [lane, {}])) };
  entries.sort((a, b) => compareTaskboardEntries({ ...a.card, id: a.id }, { ...b.card, id: b.id }));
  for (const { id, lane, card } of entries) board.lanes[lane][id] = card;
  validateTaskboard(board);
  return board;
}

export function taskboardSpecLane(spec, children) {
  if (!(spec.priority === null && spec.status === 'planned') && (!Number.isInteger(spec.priority) || spec.priority < 0)) {
    throw taskboardSourceError(`${spec.id} has invalid priority`);
  }
  const status = parentStatus(spec);
  if (status === 'planned') return 'backlog';
  if (status === 'blocked') return 'blocked';
  const allDone = children.every(child => child.lane === 'complete');
  if (allDone && ['complete', 'superseded'].includes(status)) return 'complete';
  const allReviewReady = children.every(child => ['needsReview', 'complete'].includes(child.lane));
  if (allReviewReady && status === 'needs-review') return 'needsReview';
  if (children.some(child => child.lane === 'inProgress')) return 'inProgress';
  if (children.some(child => child.lane === 'toDo') || children.length === 0) return 'toDo';
  if (children.some(child => child.lane === 'blocked')) return 'blocked';
  // Completing children never manufactures an assembled-review readiness claim.
  return 'inProgress';
}

function makeCard({ title, priority, content, assignee, dependencies, sourceLinks, progress, nextAction, cleanupState }) {
  const fields = sourceFields(content);
  if (typeof title !== 'string' || !title.trim()) throw new Error('taskboard-source: a card needs its readable source title');
  const sourcePriority = fields.Priority === undefined ? priority : Number(fields.Priority);
  if (sourcePriority !== null && (!Number.isInteger(sourcePriority) || sourcePriority < 0)) throw new Error(`taskboard-source: ${title} has invalid priority`);
  const startDate = dateField(fields['Start date'], title);
  const dueDate = dateField(fields['Due date'], title);
  if (startDate && dueDate && dueDate < startDate) throw new Error(`taskboard-source: ${title} has a due date before its start date`);
  return {
    title, assignee: known(fields.Assignee ?? assignee), approver: known(fields.Approver),
    dependencies: Array.isArray(dependencies) ? [...dependencies] : dependencyText(dependencies),
    priority: sourcePriority, sourceLinks: [...new Set(sourceLinks)], progress,
    nextAction: known(fields['Next action'] ?? nextAction), startDate, dueDate, cleanupState
  };
}

// Every field name a source parser reads from a Spec, Task or landmark
// record, plus the card fields read below. The parsers are whole-document and
// (for Specs and landmarks) last-wins, so a repeat of any of these anywhere in
// the document could change a derived card; the preview refuses it.
// tools/test-taskboard-json.mjs scans the parsers so this set cannot drift.
export const TASKBOARD_SOURCE_FIELDS = Object.freeze(new Set([
  'Spec ID', 'Landmark ID', 'Task ID', 'Former ID',
  'Status', 'Priority', 'Owner', 'Updated', 'Catalog description', 'Blockers',
  'Latest event', 'Next gate', 'Baseline',
  'Slice', 'Destination', 'Capabilities', 'Missing capabilities', 'Proof',
  'Planned verification', 'Claimed by', 'Close pending',
  'Assignee', 'Approver', 'Next action', 'Start date', 'Due date'
]));

// A Spec's slice descriptions: each `###` subsection of its
// `## Vertical Implementation Slices` section (the section parseSpecPacket
// reads its slice rows from), running until the next heading of level three
// or above. Real Specs head them `### TK-...`, with a legacy scoped label
// before the Task ID, `### First slice - ...` or a dated completion note.
const SLICES_HEADING = /^##[ \t]+Vertical Implementation Slices[ \t]*\r?$/;
const SECTION_HEADING = /^#{1,2}[ \t]/;
const SUBSECTION_HEADING = /^###[ \t]/;

// The slice subsection (its starting offset) or null for document scope, for
// every line start in the content.
function sliceScopes(content) {
  const scopes = [];
  let offset = 0, inSlices = false, scope = null;
  for (const line of content.split('\n')) {
    if (SECTION_HEADING.test(line)) {
      inSlices = SLICES_HEADING.test(line);
      scope = null;
    } else if (SUBSECTION_HEADING.test(line)) {
      scope = inSlices ? offset : null;
    }
    scopes.push({ offset, scope });
    offset += line.length + 1;
  }
  return scopes;
}

function scopeAt(scopes, index) {
  let low = 0, high = scopes.length - 1;
  while (low < high) {
    const middle = (low + high + 1) >> 1;
    if (scopes[middle].offset <= index) low = middle;
    else high = middle - 1;
  }
  return scopes[low].scope;
}

function sourceFields(content = '', rejectDuplicates = true) {
  // Match the exact whole-document field extraction used by parseSpecPacket
  // and parseTaskRecord: same regex, key/value trim, and case-sensitive names.
  // Spec parsing currently last-wins; preview publication must instead refuse
  // an ambiguous source before replacing source-derived output:
  // - a parsed field (TASKBOARD_SOURCE_FIELDS) is unique in the whole document;
  // - any other label is unique at document scope, and unique within each
  //   slice subsection, whose narrative labels (such as a per-slice Stance)
  //   belong to that slice and are read by no parser.
  const fields = {};
  const seen = new Map();
  const scopes = rejectDuplicates ? sliceScopes(content) : null;
  for (const match of content.matchAll(/^\*\*([^*]+):\*\*\s*(.+)$/gm)) {
    const key = match[1].trim();
    if (rejectDuplicates) {
      const scope = TASKBOARD_SOURCE_FIELDS.has(key) ? 'document' : scopeAt(scopes, match.index) ?? 'document';
      const keys = seen.get(scope) ?? new Set();
      if (keys.has(key)) throw new Error(`taskboard-source: duplicated source field ${key}`);
      keys.add(key);
      seen.set(scope, keys);
    }
    fields[key] = match[2].trim();
  }
  return fields;
}
function known(value) {
  return typeof value === 'string' && value.trim() && !/^(?:none|unknown|unassigned|pending)\.?$/i.test(value.trim()) ? value.trim() : null;
}
function dependencyText(value) { return known(value) ? value.split(',').map(item => item.trim()).filter(Boolean) : []; }
function dateField(value, title) {
  const date = known(value);
  if (!date) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new Error(`taskboard-source: ${title} has invalid date ${date}`);
  return date;
}
function taskAction(task, retired) {
  if (task.status === 'needs-review') return 'Await independent review of the assembled Spec.';
  if (task.status === 'done') return retired ? 'Ready to delete through the lifecycle gates.' : 'Ready to capture through the lifecycle gates.';
  if (task.status === 'blocked') return 'Resolve the recorded blockers.';
  if (task.status === 'deferred') return 'Reconcile the deferred slice before execution.';
  return task.status === 'in-progress' ? 'Verify the slice and report its proof.' : 'Claim the slice when its dependencies and lane release permit.';
}
function compareText(a, b) { return a === b ? 0 : a < b ? -1 : 1; }

export function validateTaskboard(board) {
  if (board?.schemaVersion !== 1 || JSON.stringify(Object.keys(board.lanes ?? {})) !== JSON.stringify(TASKBOARD_LANES)) throw new Error('taskboard-schema: schema-v1 requires exactly six ordered lanes');
  const seen = new Set();
  for (const lane of TASKBOARD_LANES) {
    for (const [id, card] of Object.entries(board.lanes[lane])) {
      const key = visibleIdKey(id);
      if (!key || seen.has(key)) throw new Error(`taskboard-schema: duplicate or invalid card identity ${id}`);
      seen.add(key);
      if ('kind' in card || !card.title || !Array.isArray(card.sourceLinks) || card.sourceLinks.length === 0 || !Array.isArray(card.dependencies)) throw new Error(`taskboard-schema: invalid continuation card ${id}`);
      for (const source of card.sourceLinks) if (typeof source !== 'string' || /^(?:\/|[A-Za-z]:)|(?:^|\/)\.\.(?:\/|$)|\\/.test(source)) throw new Error(`taskboard-schema: ${id} has an unsafe source link`);
    }
  }
  return board;
}
