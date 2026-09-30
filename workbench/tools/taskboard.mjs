import { compareVisibleIds, visibleIdKey, visibleIdParts } from './visible-ids.mjs';

export const TASKBOARD_LANES = Object.freeze(['backlog', 'toDo', 'inProgress', 'blocked', 'needsReview', 'complete']);
const SPEC_STATES = new Set(['planned', 'active', 'blocked', 'needs-review', 'complete', 'superseded']);
const TASK_LANES = Object.freeze({ ready: 'toDo', 'in-progress': 'inProgress', blocked: 'blocked', done: 'complete', deferred: 'backlog' });

// First S-01X slice: a pure projection of existing parsed owners. No clock,
// output reads, allocation, selection, review verdict or lifecycle mutation.
export function buildTaskboard(specs) {
  const entries = [];
  const identities = new Map();
  function add(id, lane, card, source) {
    const key = visibleIdKey(id);
    if (!key || !['S', 'TK'].includes(visibleIdParts(id).prefix)) throw new Error(`taskboard-source: invalid WBID ${id} at ${source}`);
    const previous = identities.get(key);
    if (previous) throw new Error(`taskboard-collision: ${previous.id} at ${previous.source} and ${id} at ${source} share a flat card identity; source numeric Task labels retain their Spec scope`);
    identities.set(key, { id, source });
    entries.push({ id, lane, card });
  }
  for (const spec of specs) {
    if (!SPEC_STATES.has(spec.status)) throw new Error(`taskboard-source: ${spec.id} has invalid status ${spec.status}`);
    if (!Number.isFinite(spec.priority) || spec.priority < 0) throw new Error(`taskboard-source: ${spec.id} has invalid priority`);
    const children = [
      ...spec.rows.map(row => ({ ...row, specId: spec.id, relativePath: spec.relativePath })),
      ...spec.records,
      ...(spec.retiredRecords ?? [])
    ];
    for (const child of children) {
      if (visibleIdKey(child.specId) !== visibleIdKey(spec.id)) throw new Error(`taskboard-source: ${child.relativePath} names ${child.specId}, expected parent ${spec.id}`);
      const lane = TASK_LANES[child.status];
      if (!lane) throw new Error(`taskboard-source: ${child.id} has invalid status ${child.status}`);
      const retired = Boolean(spec.lifecycleFolder || child.lifecycleFolder);
      const card = makeCard({
        title: child.slice, priority: spec.priority, content: child.content,
        dependencies: child.blockers, sourceLinks: [child.relativePath, spec.relativePath],
        progress: null, nextAction: taskAction(child, retired),
        cleanupState: lane === 'complete' ? (retired ? 'readyToDelete' : 'readyToCapture') : null
      });
      card.specId = child.specId;
      add(child.id, lane, card, child.relativePath);
    }
    const lane = specLane(spec, children);
    const card = makeCard({
      title: spec.title, priority: spec.priority, content: spec.content,
      assignee: spec.owner, dependencies: spec.blockers, sourceLinks: [spec.relativePath],
      progress: { complete: children.filter(child => child.status === 'done').length, total: children.length },
      nextAction: spec.nextGate,
      cleanupState: lane === 'complete' ? (spec.lifecycleFolder ? 'readyToDelete' : 'readyToCapture') : null
    });
    add(spec.id, lane, card, spec.relativePath);
  }
  const board = { schemaVersion: 1, lanes: Object.fromEntries(TASKBOARD_LANES.map(lane => [lane, {}])) };
  entries.sort((a, b) => a.card.priority - b.card.priority || compareText(a.card.title, b.card.title) || compareVisibleIds(a.id, b.id));
  for (const { id, lane, card } of entries) board.lanes[lane][id] = card;
  validateTaskboard(board);
  return board;
}

function specLane(spec, children) {
  if (spec.status === 'planned') return 'backlog';
  if (spec.status === 'blocked') return 'blocked';
  const allDone = children.every(child => child.status === 'done');
  if (allDone && ['complete', 'superseded'].includes(spec.status)) return 'complete';
  if (allDone && spec.status === 'needs-review') return 'needsReview';
  if (children.some(child => child.status === 'in-progress')) return 'inProgress';
  if (children.some(child => child.status === 'ready') || children.length === 0) return 'toDo';
  if (children.some(child => child.status === 'blocked')) return 'blocked';
  // Completing children never manufactures an assembled-review readiness claim.
  return 'inProgress';
}

function makeCard({ title, priority, content, assignee, dependencies, sourceLinks, progress, nextAction, cleanupState }) {
  const fields = headerFields(content);
  if (typeof title !== 'string' || !title.trim()) throw new Error('taskboard-source: a card needs its readable source title');
  const sourcePriority = fields.Priority === undefined ? priority : Number(fields.Priority);
  if (!Number.isInteger(sourcePriority) || sourcePriority < 0) throw new Error(`taskboard-source: ${title} has invalid priority`);
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

function headerFields(content = '') {
  const header = content.split(/^## /m)[0];
  const fields = {};
  for (const match of header.matchAll(/^\*\*([^*]+):\*\*\s*(.+)$/gm)) {
    if (Object.hasOwn(fields, match[1])) throw new Error(`taskboard-source: duplicated header field ${match[1]}`);
    fields[match[1]] = match[2].trim();
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
