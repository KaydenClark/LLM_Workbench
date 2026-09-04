import path from 'node:path';
import { parseMarkdownTableRow } from './markdown-table.mjs';

export function parseSpecPacket(content, filePath, root) {
  const fields = {};
  for (const match of content.matchAll(/^\*\*([^*]+):\*\*\s*(.+)$/gm)) fields[match[1].trim()] = match[2].trim();
  const id = fields['Spec ID'];
  if (!id || !/^S-\d{3}$/.test(id)) throw new Error(`${path.relative(root, filePath)} has an invalid or missing Spec ID`);
  const titleMatch = content.match(new RegExp(`^# ${id} - (.+)$`, 'm'));
  if (!titleMatch) throw new Error(`${id} has no matching title`);
  const required = ['Status', 'Priority', 'Owner', 'Updated', 'Catalog description', 'Blockers', 'Latest event', 'Next gate'];
  for (const name of required) if (!fields[name]) throw new Error(`${id} is missing ${name}`);
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
    tickets
  };
}

function parseTickets(value, specId) {
  const tickets = [];
  for (const line of value.split('\n')) {
    if (!/^\|\s*TK-\d+\s*\|/.test(line)) continue;
    const cells = parseMarkdownTableRow(line);
    if (cells.length !== 5) throw new Error(`${specId} has a malformed ticket row`);
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
