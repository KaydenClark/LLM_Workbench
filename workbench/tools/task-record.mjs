// S-00H TK-001: a Task is a standalone artifact (ADR-000H). This module reads
// one `TASK.md` and its blocking relationships. It does not discover, select,
// claim, close or render Task records — that is TK-002 — so nothing here is
// wired into `spec-workbench.mjs`'s existing embedded-table commands.

const TASK_STATUSES = new Set(['ready', 'in-progress', 'blocked', 'done', 'deferred']);

// Parses a `TASK.md` record. `filePath` is used only for error messages, so a
// candidate can be validated before it is written to disk.
export function parseTaskRecord(content, filePath) {
  const fields = {};
  for (const match of content.matchAll(/^\*\*([^*]+):\*\*\s*(.+)$/gm)) fields[match[1].trim()] = match[2].trim();

  const id = fields['Task ID'];
  if (!id || !/^TK-[0-9A-Za-z]+$/.test(id)) throw new Error(`${filePath} has an invalid or missing Task ID`);

  const specId = fields.Spec;
  if (!specId || !/^S-[0-9A-Za-z]{3,}$/.test(specId)) throw new Error(`${id} has an invalid or missing Spec`);

  const titleMatch = content.match(new RegExp(`^# ${escapeRegExp(id)} - (.+)$`, 'm'));
  if (!titleMatch) throw new Error(`${id} has no matching title`);

  const status = fields.Status;
  if (!status || !TASK_STATUSES.has(status)) throw new Error(`${id} has an invalid or missing status`);

  const blockersField = fields.Blockers;
  if (!blockersField) throw new Error(`${id} is missing Blockers`);
  const blockers = parseBlockers(blockersField);

  const destination = parseDestination(content, id);

  return {
    id,
    specId,
    slice: titleMatch[1].trim(),
    status,
    blockers,
    destination,
    filePath
  };
}

// "none" is the explicit absence of a blocker, matching the embedded ticket
// table's convention; anything else is a comma-separated list of Task or Spec
// ids, since either kind of record can block a Task (ADR-000H, S-00H Outcome).
function parseBlockers(value) {
  if (value === 'none') return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

// A Task's Destination names either the Spec acceptance lines it satisfies, or
// - for a corrective Task after Spec retirement (S-00I) - the reconciled Wiki
// capability claim it repairs instead. Only the field to hold that second case
// is required now; nothing yet acts on it (S-00H Design Limits, "Shape").
function parseDestination(content, id) {
  const body = section(content, 'Destination');
  if (!body) throw new Error(`${id} has no Destination section`);
  const specMatch = body.match(/^-\s*Spec acceptance:\s*(.+)$/m);
  if (specMatch) return { type: 'spec-acceptance', value: specMatch[1].trim() };
  const wikiMatch = body.match(/^-\s*Wiki claim:\s*(.+)$/m);
  if (wikiMatch) return { type: 'wiki-claim', value: wikiMatch[1].trim() };
  throw new Error(`${id} has an unrecognised Destination; expected "Spec acceptance:" or "Wiki claim:"`);
}

function section(content, heading) {
  const marker = `## ${heading}`;
  const start = content.indexOf(marker);
  if (start < 0) return '';
  const bodyStart = start + marker.length;
  const end = content.indexOf('\n## ', bodyStart);
  return content.slice(bodyStart, end < 0 ? content.length : end).trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
