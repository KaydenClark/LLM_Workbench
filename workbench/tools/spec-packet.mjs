import path from 'node:path';
import { parseMarkdownTableRow } from './markdown-table.mjs';

// The recorded baseline states an owning spec may carry in an optional
// `**Baseline:**` field. `green` and `red` are what a baseline run produces;
// `unavailable` records that no baseline could be taken at all, for a reason the
// requested change did not cause and cannot repair. The unavailable reason set
// is closed and enumerated here, never free text, and a red baseline is never
// relabelled through it: red stops until the owner explicitly expands the task.
export const BASELINE_STATES = Object.freeze(['green', 'red', 'unavailable']);
export const BASELINE_UNAVAILABLE_REASONS = Object.freeze([
  'host-restricted',
  'product-broken-as-found',
  'owner-declined-on-boundary'
]);
const RED_STOP = 'the baseline is red; it stops until the owner explicitly expands the task to fix it';

export function parseBaselineRecord(value, specId) {
  const match = /^([a-z-]+)(?:\s*\(([^)]*)\))?(?:\s*-\s*(.*))?$/.exec(value.trim());
  if (!match) throw new Error(`${specId} has an unreadable Baseline record: ${value}`);
  const [, state, qualifierRaw, detailRaw] = match;
  const qualifier = (qualifierRaw ?? '').trim();
  const detail = (detailRaw ?? '').trim();
  if (!BASELINE_STATES.includes(state)) {
    throw new Error(`${specId} has an unrecognised baseline state "${state}"; the closed set is ${BASELINE_STATES.join(', ')}`);
  }
  if (state === 'unavailable') {
    if (!BASELINE_UNAVAILABLE_REASONS.includes(qualifier)) {
      throw new Error(`${specId} records an unavailable baseline with the reason "${qualifier}"; the closed baseline reason vocabulary is ${BASELINE_UNAVAILABLE_REASONS.join(', ')}`);
    }
    if (!detail) {
      throw new Error(`${specId} records an unavailable baseline with no evidence; state the evidence for ${qualifier} and that the requested change is not implicated`);
    }
    return { state, reason: qualifier, evidence: detail, proceeds: true, stop: null };
  }
  if (state === 'red') {
    if (qualifier && qualifier !== 'owner-expanded') {
      throw new Error(`${specId} qualifies a red baseline with "${qualifier}"; only owner-expanded is recognised`);
    }
    const proceeds = qualifier === 'owner-expanded';
    return { state, reason: proceeds ? 'owner-expanded' : null, evidence: detail, proceeds, stop: proceeds ? null : RED_STOP };
  }
  if (qualifier) throw new Error(`${specId} qualifies a green baseline with "${qualifier}"; a green baseline takes no reason`);
  return { state, reason: null, evidence: detail, proceeds: true, stop: null };
}

export function parseSpecPacket(content, filePath, root) {
  const fields = {};
  for (const match of content.matchAll(/^\*\*([^*]+):\*\*\s*(.+)$/gm)) fields[match[1].trim()] = match[2].trim();
  const id = fields['Spec ID'];
  if (!id || !/^S-[0-9A-Za-z]{3,}$/.test(id)) throw new Error(`${path.relative(root, filePath)} has an invalid or missing Spec ID`);
  const titleMatch = content.match(new RegExp(`^# ${id} - (.+)$`, 'm'));
  if (!titleMatch) throw new Error(`${id} has no matching title`);
  const required = ['Status', 'Priority', 'Owner', 'Updated', 'Catalog description', 'Blockers', 'Latest event', 'Next gate'];
  for (const name of required) if (!fields[name]) throw new Error(`${id} is missing ${name}`);
  const baseline = fields.Baseline ? parseBaselineRecord(fields.Baseline, id) : null;
  const tickets = parseTickets(section(content, 'Vertical Implementation Slices'), id);
  return {
    root,
    filePath,
    relativePath: path.relative(root, filePath).split(path.sep).join('/'),
    content,
    id,
    title: titleMatch[1].trim(),
    status: fields.Status,
    priority: Number(fields.Priority),
    owner: fields.Owner,
    updated: fields.Updated,
    description: fields['Catalog description'],
    blockers: fields.Blockers,
    latestEvent: fields['Latest event'],
    nextGate: fields['Next gate'],
    baseline,
    tickets
  };
}

function parseTickets(value, specId) {
  const tickets = [];
  for (const line of value.split('\n')) {
    if (!/^\|\s*TK-/.test(line)) continue;
    const cells = parseMarkdownTableRow(line);
    if (cells.length !== 5) throw new Error(`${specId} has a malformed ticket row`);
    if (!/^TK-[0-9A-Za-z]+$/.test(cells[0])) throw new Error(`${specId} has an invalid ticket ID: ${cells[0]}`);
    tickets.push({ id: cells[0], slice: cells[1], status: cells[2], blockers: cells[3], proof: cells[4] });
  }
  if (tickets.length === 0) throw new Error(`${specId} has no implementation slices`);
  return tickets;
}

function section(content, heading) {
  const marker = `## ${heading}`;
  const start = content.indexOf(marker);
  if (start < 0) return '';
  const bodyStart = start + marker.length;
  const end = content.indexOf('\n## ', bodyStart);
  return content.slice(bodyStart, end < 0 ? content.length : end).trim();
}
