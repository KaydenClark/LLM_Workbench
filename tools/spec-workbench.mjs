#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SPEC_STATUSES = new Set(['planned', 'active', 'blocked', 'needs-review', 'complete', 'superseded']);
const TICKET_STATUSES = new Set(['ready', 'in-progress', 'blocked', 'done', 'deferred']);
const CATALOG_START = '<!-- spec-catalog:start -->';
const CATALOG_END = '<!-- spec-catalog:end -->';
const HOT_START = '<!-- hot-specs:start -->';
const HOT_END = '<!-- hot-specs:end -->';

export function nextWork(rootDir) {
  const specs = loadSpecs(rootDir);
  const completed = new Set(specs.filter((spec) => ['complete', 'superseded'].includes(spec.status)).map((spec) => spec.id));
  const candidates = [];
  for (const spec of specs) {
    if (spec.status !== 'active') continue;
    const satisfied = new Set([...completed, ...spec.tickets.filter((ticket) => ticket.status === 'done').map((ticket) => ticket.id)]);
    for (const ticket of spec.tickets) {
      const resumable = ticket.status === 'in-progress';
      const eligible = ticket.status === 'ready' && blockersSatisfied(ticket.blockers, satisfied);
      if (!resumable && !eligible) continue;
      candidates.push({
        specId: spec.id,
        title: spec.title,
        ticketId: ticket.id,
        slice: ticket.slice,
        status: ticket.status,
        rank: resumable ? -1 : 0,
        priority: spec.priority,
        owner: spec.owner,
        path: spec.relativePath,
        nextGate: spec.nextGate
      });
    }
  }
  candidates.sort((a, b) => a.rank - b.rank || a.priority - b.priority || a.specId.localeCompare(b.specId) || a.ticketId.localeCompare(b.ticketId));
  if (candidates.length === 0) return null;
  const { rank: _rank, ...result } = candidates[0];
  return result;
}

export function showSpec(rootDir, id) {
  const spec = findSpec(rootDir, id);
  return { ...publicSpec(spec), body: spec.content };
}

export function claimWork(rootDir, id, options) {
  requireValue(options?.agent, '--agent is required');
  const date = validDate(options?.date ?? today());
  const specs = loadSpecs(rootDir);
  const matches = specs.filter((item) => item.id === id);
  if (matches.length !== 1) throw new Error(matches.length ? `Duplicate spec ID: ${id}` : `Unknown spec ID: ${id}`);
  const spec = matches[0];
  if (spec.status !== 'active') throw new Error(`${id} is ${spec.status}, not active`);
  const satisfied = new Set([
    ...specs.filter((item) => ['complete', 'superseded'].includes(item.status)).map((item) => item.id),
    ...spec.tickets.filter((item) => item.status === 'done').map((item) => item.id)
  ]);
  const ticket = spec.tickets.find((item) => item.status === 'ready' && blockersSatisfied(item.blockers, satisfied));
  if (!ticket) throw new Error(`${id} has no eligible ready ticket to claim`);
  const content = updateTicket(spec.content, ticket.id, (cells) => {
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
  const ticket = spec.tickets.find((item) => item.status === 'in-progress')
    ?? spec.tickets.find((item) => item.status === 'ready');
  if (!ticket) throw new Error(`${id} has no open ticket to close`);
  let content = updateTicket(spec.content, ticket.id, (cells) => {
    cells[2] = 'done';
    cells[4] = proof;
    return cells;
  });
  const remaining = parseSpec(content, spec.filePath, spec.root).tickets.find((item) => item.status !== 'done');
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
  if (spec.tickets.some((ticket) => ticket.status !== 'done')) throw new Error(`${id} has an unfinished slice`);
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
  atomicWrite(blueprintPath, replaceRegion(blueprint, CATALOG_START, CATALOG_END, renderCatalog(specs)));
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
    return [{ code: 'malformed-spec', message: error.message }];
  }
  const byId = new Map();
  for (const spec of specs) {
    const seen = byId.get(spec.id) ?? [];
    seen.push(spec.relativePath);
    byId.set(spec.id, seen);
    if (!SPEC_STATUSES.has(spec.status)) issues.push(issue('invalid-state', `${spec.id} has invalid status ${spec.status}`));
    if (!spec.relativePath.startsWith(`specs/${spec.id}-`)) issues.push(issue('unstable-path', `${spec.id} path must start specs/${spec.id}-`));
    for (const ticket of spec.tickets) {
      if (!TICKET_STATUSES.has(ticket.status)) issues.push(issue('invalid-state', `${spec.id}/${ticket.id} has invalid status ${ticket.status}`));
      if (ticket.status === 'done' && (!ticket.proof || /^pending$/i.test(ticket.proof))) issues.push(issue('missing-evidence', `${spec.id}/${ticket.id} is done without proof`));
    }
    if (['complete', 'superseded'].includes(spec.status) && spec.tickets.some((ticket) => ticket.status !== 'done')) {
      issues.push(issue('contradictory-state', `${spec.id} is ${spec.status} with unfinished tickets`));
    }
    const updated = Date.parse(`${spec.updated}T00:00:00Z`);
    const now = Date.parse(`${options.today ?? today()}T00:00:00Z`);
    if (spec.tickets.some((ticket) => ticket.status === 'in-progress') && Number.isFinite(updated) && now - updated > 86_400_000) {
      issues.push(issue('stale-claim', `${spec.id} has an in-progress ticket last updated ${spec.updated}`));
    }
    for (const link of localLinks(spec.content)) {
      const target = path.resolve(path.dirname(spec.filePath), link);
      if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) issues.push(issue('broken-link', `${spec.id} links to missing ${link}`));
    }
  }
  for (const [id, paths] of byId) {
    if (paths.length > 1) issues.push(issue('duplicate-id', `${id} appears in ${paths.join(', ')}`));
  }
  checkRender(root, 'BLUEPRINT.md', CATALOG_START, CATALOG_END, renderCatalog(specs), issues);
  checkRender(root, 'TASKBOARD.md', HOT_START, HOT_END, renderHotBoard(specs), issues);
  return issues;
}

function loadSpecs(rootDir, options = {}) {
  const root = path.resolve(rootDir);
  const specsRoot = path.join(root, 'specs');
  if (!fs.existsSync(specsRoot)) return [];
  const paths = [];
  for (const entry of fs.readdirSync(specsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const filePath = path.join(specsRoot, entry.name, 'SPEC.md');
    if (fs.existsSync(filePath)) paths.push(filePath);
  }
  const specs = paths.sort().map((filePath) => parseSpec(fs.readFileSync(filePath, 'utf8'), filePath, root));
  if (!options.allowDuplicates) {
    const ids = new Set();
    for (const spec of specs) {
      if (ids.has(spec.id)) throw new Error(`Duplicate spec ID: ${spec.id}`);
      ids.add(spec.id);
    }
  }
  return specs;
}

function parseSpec(content, filePath, root) {
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
    const cells = splitRow(line);
    if (cells.length !== 5) throw new Error(`${specId} has a malformed ticket row`);
    tickets.push({ id: cells[0], slice: cells[1], status: cells[2], blockers: cells[3], proof: cells[4] });
  }
  if (tickets.length === 0) throw new Error(`${specId} has no implementation slices`);
  return tickets;
}

function renderCatalog(specs) {
  const lines = [
    '| Spec | Description | Status |',
    '|---|---|---|'
  ];
  for (const spec of specs.sort((a, b) => a.id.localeCompare(b.id))) {
    lines.push(`| [${spec.id} - ${escapeCell(spec.title)}](${spec.relativePath}) | ${escapeCell(spec.description)} | ${escapeCell(spec.status)} |`);
  }
  if (specs.length === 0) lines.push('| none | No specs recorded yet. | n/a |');
  return lines.join('\n');
}

function renderHotBoard(specs) {
  const hot = specs.filter((spec) => isHot(spec)).sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
  const lines = [
    '| Spec | Current slice | Owner | Blocker | Latest meaningful event | Next gate |',
    '|---|---|---|---|---|---|'
  ];
  if (hot.length === 0) {
    lines.push('| none | No active slice | unassigned | none | All completed specs are cold. | Activate a planned spec explicitly. |');
    return lines.join('\n');
  }
  for (const spec of hot) {
    const ticket = spec.tickets.find((item) => item.status === 'in-progress')
      ?? spec.tickets.find((item) => item.status === 'ready')
      ?? spec.tickets.find((item) => item.status === 'blocked');
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
    tickets: spec.tickets
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
  return line.trim().slice(1, -1).split('|').map((cell) => cell.trim().replaceAll('\\|', '|'));
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
    issues.push(issue('broken-render-target', `${relative} is missing`));
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    const actual = regionBody(content, startMarker, endMarker);
    if (actual !== expected) issues.push(issue('render-drift', `${relative} generated region is stale`));
  } catch (error) {
    issues.push(issue('broken-render-target', `${relative}: ${error.message}`));
  }
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

function issue(code, message) {
  return { code, message };
}

function escapeCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function today() {
  return new Date().toISOString().slice(0, 10);
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
  else if (command === 'show') result = showSpec(root, id);
  else if (command === 'claim') result = claimWork(root, id, options);
  else if (command === 'close') result = closeTicket(root, id, options);
  else if (command === 'complete') result = completeSpec(root, id, options);
  else if (command === 'render') result = render(root);
  else if (command === 'doctor') {
    result = doctor(root, options);
    if (result.length > 0) process.exitCode = 1;
  } else {
    throw new Error('Usage: spec-workbench.mjs next|show|claim|close|complete|render|doctor [S-###] [options]');
  }
  if (options.json) console.log(JSON.stringify(result, null, 2));
  else if (command === 'show') console.log(result.body);
  else if (command === 'doctor') console.log(result.length ? result.map((item) => `${item.code}: ${item.message}`).join('\n') : 'ok - spec workbench doctor passed');
  else console.log(result === null ? 'No eligible work.' : JSON.stringify(result, null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((error) => {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  });
}
