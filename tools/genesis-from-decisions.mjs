#!/usr/bin/env node
// Derive one new Workbench room from a clean Template identity, a valid
// project-evidence grilling note, active ADRs, and caller-authored filled
// controls. The command proves byte lineage and structure; it does not certify
// that the caller's prose is a correct semantic derivation.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { listAdrs, validateAdrs } from '../workbench/tools/adr.mjs';
import { controls, versionStamp } from '../workbench/tools/workbench-layout.mjs';
import { checkStructure, resolveNote } from '../workbench/tools/notepads.mjs';
import { scanPrivacy } from '../workbench/tools/privacy.mjs';
import { templatePlaceholders } from '../workbench/tools/template-placeholders.mjs';
import { assertSafeReadPath, collectionRelative, isMainModule } from '../workbench/tools/workbench-paths.mjs';
import { sourceIdentity } from './workbench-tools.mjs';

export const PLAN_SCHEMA_VERSION = 'genesis-plan-1';
export const DERIVATION_SCHEMA_VERSION = 'genesis-derivation-1';

const releaseRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHA256 = /^[a-f0-9]{64}$/;
const SHA1 = /^[a-f0-9]{40}$/;
const ID = /^[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*$/;
const SPEC_ID = /^S-[0-9A-Za-z]{3,}$/;
const TICKET_ID = /^TK-[0-9A-Za-z]{3,}$/;
const VERSION = /^v\d+\.\d+\.\d+$/;
const MAX_JSON_BYTES = 1024 * 1024;
const MAX_SOURCE_BYTES = 1024 * 1024;
const MAX_TEXT = 8000;
const SEMANTIC_BOUNDARY = 'Fact and uncertainty labels are caller assertions; the tool verified only source identity and bytes.';

function blocked(code, message, details = {}) {
  return { status: 'blocked', error: { code, message, ...details } };
}

function fail(code, message, details = {}) {
  const error = new Error(message);
  error.code = code;
  Object.assign(error, details);
  throw error;
}

function ordinaryFile(file, label) {
  let entry;
  try { entry = fs.lstatSync(file); } catch (error) {
    if (error.code === 'ENOENT') fail('missing-input', `${label} does not exist`);
    throw error;
  }
  if (!entry.isFile() || entry.isSymbolicLink() || entry.nlink > 1) fail('unsafe-path', `${label} must be an ordinary, unshared file`);
  return entry;
}

function ordinaryDirectory(directory, label) {
  let entry;
  try { entry = fs.lstatSync(directory); } catch (error) {
    if (error.code === 'ENOENT') fail('missing-input', `${label} does not exist`);
    throw error;
  }
  if (!entry.isDirectory() || entry.isSymbolicLink()) fail('unsafe-path', `${label} must be an ordinary directory`);
  return entry;
}

function object(value, label, code = 'invalid-plan') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(code, `${label} must be an object`);
  return value;
}

function exactKeys(value, allowed, required, label, code = 'invalid-plan') {
  object(value, label, code);
  const extras = Object.keys(value).filter((key) => !allowed.includes(key));
  const missing = required.filter((key) => !Object.hasOwn(value, key));
  if (extras.length) fail(code, `${label} has unsupported fields: ${extras.join(', ')}`);
  if (missing.length) fail(code, `${label} is missing fields: ${missing.join(', ')}`);
}

function text(value, label, code = 'invalid-plan') {
  if (typeof value !== 'string' || !value.trim() || value !== value.trim() || value.length > MAX_TEXT || value.includes('\u0000')) {
    fail(code, `${label} must be trimmed nonempty text of at most ${MAX_TEXT} characters`);
  }
  return value;
}

function oneLine(value, label, code = 'invalid-plan') {
  const result = text(value, label, code);
  if (/\r|\n/.test(result)) fail(code, `${label} must fit on one line`);
  return result;
}

function privacy(value, label) {
  const hits = scanPrivacy(value);
  if (hits.length) fail('privacy-boundary', `${label} contains privacy-sensitive material`, { hits: [...new Set(hits.map((hit) => hit.label))] });
}

function sha256Bytes(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex'); }

function normalizeRelative(value, label) {
  if (typeof value !== 'string' || !value || path.isAbsolute(value) || value.includes('\\') || value !== path.posix.normalize(value) || value.split('/').some((part) => !part || part === '.' || part === '..' || part.startsWith('.'))) {
    fail('unsafe-path', `${label} must be a normalized visible project-relative path`);
  }
  return value;
}

function containedFile(root, relative, label) {
  const normalized = normalizeRelative(relative, label);
  const file = path.resolve(root, normalized);
  try { assertSafeReadPath(root, file); } catch { fail('unsafe-path', `${label} must stay in its declared root without symbolic links`); }
  ordinaryFile(file, label);
  return { file, relative: normalized };
}

function consumeFile(snapshot, root, relative, label, { json = false, textOnly = true, maxBytes = MAX_SOURCE_BYTES } = {}) {
  const resolved = containedFile(root, relative, label);
  const stat = ordinaryFile(resolved.file, label);
  if (stat.size > maxBytes) fail('input-too-large', `${label} exceeds ${maxBytes} bytes`);
  const bytes = fs.readFileSync(resolved.file);
  if (textOnly) {
    let decoded;
    try { decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
    catch { fail('invalid-input', `${label} must be UTF-8 text`); }
    if (decoded.includes('\u0000')) fail('invalid-input', `${label} must be text`);
    privacy(decoded, label);
  }
  const sha256 = sha256Bytes(bytes);
  snapshot.set(resolved.file, sha256);
  if (!json) return { ...resolved, bytes, sha256 };
  let value;
  try { value = JSON.parse(bytes.toString('utf8')); } catch { fail('invalid-json', `${label} is not valid JSON`); }
  return { ...resolved, bytes, sha256, value };
}

function git(root, args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

function safeRepository(value, label) {
  const repository = oneLine(value, label, 'invalid-source');
  const https = /^https:\/\/[^\s/@]+\/[^\s]+$/i.test(repository) && !repository.includes('@');
  const sshUrl = /^ssh:\/\/git@[^\s/@:]+(?::\d+)?\/[^\s]+$/.test(repository);
  const sshScp = /^git@[^\s/:@]+:[^\s]+$/.test(repository);
  const ssh = sshUrl || sshScp;
  if (!https && !ssh) fail('invalid-source', `${label} must be a credential-free HTTPS or Git SSH repository URL`);
  const privacyInput = sshUrl
    ? repository.replace(/^ssh:\/\/git@/, 'ssh://git-transport-at-')
    : sshScp
      ? repository.replace(/^git@/, 'git-transport-at-')
      : repository;
  privacy(privacyInput, label);
  return repository;
}

function projectIdentity(root, label, { manifest = false, clean = false } = {}) {
  const resolved = path.resolve(root);
  ordinaryDirectory(resolved, label);
  const top = git(resolved, ['rev-parse', '--show-toplevel']);
  const commit = git(resolved, ['rev-parse', '--verify', 'HEAD']);
  const repository = git(resolved, ['remote', 'get-url', 'origin']);
  if (!top || fs.realpathSync(top) !== fs.realpathSync(resolved) || !SHA1.test(commit ?? '') || !repository) {
    fail('invalid-source', `${label} must be the root of a Git checkout with an origin and concrete HEAD`);
  }
  if (clean && git(resolved, ['status', '--porcelain', '--untracked-files=all'])) fail('source-dirty', `${label} must be clean`);
  const safe = safeRepository(repository, `${label} origin`);
  let parsed = null;
  const manifestFile = path.join(resolved, 'workbench', 'manifest.json');
  if (manifest) {
    try { assertSafeReadPath(resolved, manifestFile); } catch { fail('unsafe-path', `${label} manifest must stay in the project`); }
    ordinaryFile(manifestFile, `${label} manifest`);
    try { parsed = JSON.parse(fs.readFileSync(manifestFile, 'utf8')); } catch { fail('invalid-source', `${label} manifest is not valid JSON`); }
    if (parsed?.schemaVersion !== 2 || !VERSION.test(parsed.workbenchVersion ?? '') || !/^WB-[0-9A-Za-z]{22}$/.test(parsed.workbenchId ?? '')) {
      fail('invalid-source', `${label} must carry a schema 2 Workbench manifest with release and identity`);
    }
  }
  return { root: resolved, commit, repository: safe, release: parsed?.workbenchVersion ?? null, workbenchId: parsed?.workbenchId ?? null, manifest: parsed };
}

function releaseIdentity() {
  try {
    return sourceIdentity({
      root: releaseRoot,
      managedPaths: ['workbench/tools', 'templates', 'tools/workbench-tools.mjs', 'tools/genesis-from-decisions.mjs']
    });
  } catch (error) {
    fail('invalid-source-identity', error.message);
  }
}

function validateDraft(content, name, version) {
  privacy(content, `control draft ${name}`);
  if (!content.trim() || templatePlaceholders.some((placeholder) => content.includes(placeholder))) fail('unfilled-control', `${name} contains a template placeholder`);
  if (name === 'CLAUDE.md') {
    if (content.trim() !== '@AGENTS.md') fail('unfilled-control', 'CLAUDE.md must be exactly @AGENTS.md');
    return;
  }
  if (!/^#\s+\S/m.test(content) || !/^##\s+\S/m.test(content) || (name !== 'BLUEPRINT.md' && versionStamp(content) !== version)) fail('unfilled-control', `${name} is not a filled ${version} control`);
  if (name === 'TASKBOARD.md' && (!content.includes('<!-- hot-specs:start -->') || !content.includes('<!-- hot-specs:end -->'))) fail('unfilled-control', 'TASKBOARD.md must retain its generated region');
  if (name === 'BLUEPRINT.md' && /<!-- spec-catalog:(?:start|end) -->/.test(content)) fail('unfilled-control', 'BLUEPRINT.md must remain a destination narrative without a generated catalog');
}

function supportedTemplateRelease(templateVersion, releaseVersion) {
  const parse = (value) => value.slice(1).split('.').map(Number);
  const template = parse(templateVersion);
  const release = parse(releaseVersion);
  if (template[0] !== 3 || release[0] !== 3) return false;
  for (let index = 0; index < 3; index += 1) {
    if (template[index] < release[index]) return true;
    if (template[index] > release[index]) return false;
  }
  return true;
}

function validatePlan(plan, source, release, snapshot) {
  exactKeys(plan, ['schema_version', 'project', 'controls', 'memory', 'selected_questions', 'active_adr_ids', 'capabilities'], ['schema_version', 'project', 'controls', 'memory', 'selected_questions', 'active_adr_ids', 'capabilities'], 'plan');
  if (plan.schema_version !== PLAN_SCHEMA_VERSION) fail('invalid-plan', `plan.schema_version must be ${PLAN_SCHEMA_VERSION}`);
  exactKeys(plan.project, ['name', 'founding_prompt'], ['name', 'founding_prompt'], 'plan.project');
  const project = { name: oneLine(plan.project.name, 'plan.project.name'), founding_prompt: text(plan.project.founding_prompt, 'plan.project.founding_prompt') };
  exactKeys(plan.controls, controls, controls, 'plan.controls');
  const drafts = {};
  for (const name of controls) {
    const label = `plan.controls.${name}`;
    exactKeys(plan.controls[name], ['file', 'sha256'], ['file', 'sha256'], label);
    const read = consumeFile(snapshot, source.root, plan.controls[name].file, `control draft ${name}`);
    if (!SHA256.test(plan.controls[name].sha256) || plan.controls[name].sha256 !== read.sha256) fail('source-changed', `control draft ${name} does not match its declared SHA-256`);
    const content = read.bytes.toString('utf8');
    validateDraft(content, name, release.release);
    drafts[name] = { file: read.relative, sha256: read.sha256, bytes: read.bytes };
  }
  exactKeys(plan.memory, ['file', 'sha256'], ['file', 'sha256'], 'plan.memory');
  const memory = consumeFile(snapshot, source.root, plan.memory.file, 'MEMORY draft');
  if (!SHA256.test(plan.memory.sha256) || plan.memory.sha256 !== memory.sha256) fail('source-changed', 'MEMORY draft does not match its declared SHA-256');
  validateDraft(memory.bytes.toString('utf8'), 'MEMORY.md', release.release);
  if (!Array.isArray(plan.selected_questions) || !plan.selected_questions.length) fail('invalid-plan', 'selected_questions must contain at least one question ID');
  const selectedQuestions = plan.selected_questions.map((id) => oneLine(id, 'selected question ID'));
  if (selectedQuestions.some((id) => !ID.test(id)) || new Set(selectedQuestions).size !== selectedQuestions.length) fail('invalid-plan', 'selected_questions must contain unique stable IDs');
  if (!Array.isArray(plan.active_adr_ids)) fail('invalid-plan', 'active_adr_ids must be an array');
  const activeAdrIds = plan.active_adr_ids.map((id) => oneLine(id, 'active ADR ID'));
  if (new Set(activeAdrIds).size !== activeAdrIds.length) fail('invalid-plan', 'active_adr_ids must be unique');
  if (!Array.isArray(plan.capabilities) || plan.capabilities.length !== 1) fail('invalid-plan', 'this Genesis seam derives exactly one first capability');
  const cap = plan.capabilities[0];
  exactKeys(cap, ['id', 'title', 'derived_from', 'outcome', 'acceptance', 'ticket'], ['id', 'title', 'derived_from', 'outcome', 'acceptance', 'ticket'], 'capability');
  if (!SPEC_ID.test(oneLine(cap.id, 'capability.id'))) fail('invalid-plan', 'capability.id must be a stable S- identifier');
  const title = oneLine(cap.title, 'capability.title');
  const outcome = text(cap.outcome, 'capability.outcome');
  if (!Array.isArray(cap.derived_from) || !cap.derived_from.length || cap.derived_from.some((id) => !selectedQuestions.includes(id)) || new Set(cap.derived_from).size !== cap.derived_from.length) fail('invalid-plan', 'capability.derived_from must name unique selected questions only');
  if (selectedQuestions.some((id) => !cap.derived_from.includes(id))) fail('invalid-plan', 'every selected question must contribute to the first capability');
  if (!Array.isArray(cap.acceptance) || !cap.acceptance.length || cap.acceptance.some((item) => typeof item !== 'string' || !item.trim())) fail('invalid-plan', 'capability.acceptance must contain at least one criterion');
  const acceptance = cap.acceptance.map((item, index) => text(item, `capability.acceptance[${index}]`));
  exactKeys(cap.ticket, ['id', 'slice'], ['id', 'slice'], 'capability.ticket');
  if (!TICKET_ID.test(oneLine(cap.ticket.id, 'capability.ticket.id'))) fail('invalid-plan', 'capability.ticket.id must be a stable TK- identifier');
  const ticket = { id: cap.ticket.id, slice: oneLine(cap.ticket.slice, 'capability.ticket.slice') };
  return { project, drafts, memory: { file: memory.relative, sha256: memory.sha256, bytes: memory.bytes }, selectedQuestions, activeAdrIds, capability: { id: cap.id, title, outcome, derived_from: [...cap.derived_from], acceptance, ticket } };
}

function validateIntake(source, value, snapshot) {
  let resolved;
  try { resolved = resolveNote(source.root, value); } catch { fail('unsafe-path', 'intake must name a live notepad inside the source project'); }
  const expected = `${collectionRelative(source.root, 'notepads')}/grilling/`;
  if (!resolved.relative.startsWith(expected)) fail('invalid-note', 'intake must be a grilling note in the manifest-declared notepads collection');
  const relative = resolved.relative;
  const read = consumeFile(snapshot, source.root, relative, 'intake note', { json: true, maxBytes: MAX_JSON_BYTES });
  const note = read.value;
  const structure = checkStructure(note);
  if (structure.missing.length || structure.invalid.length || note.schema_version !== 'notepad-1' || note.type !== 'grilling') fail('invalid-note', 'intake must be a valid current grilling notepad', structure);
  exactKeys(note.current.evidence, ['schema_version', 'project', 'items', 'semantic_boundary'], ['schema_version', 'project', 'items', 'semantic_boundary'], 'intake.current.evidence', 'invalid-note');
  const evidence = note.current.evidence;
  if (evidence.schema_version !== 'project-evidence-1' || evidence.semantic_boundary !== SEMANTIC_BOUNDARY) fail('invalid-note', 'intake does not carry the project-evidence-1 boundary');
  exactKeys(evidence.project, ['name'], ['name'], 'intake evidence project', 'invalid-note');
  const projectName = oneLine(evidence.project.name, 'intake evidence project name', 'invalid-note');
  if (!Array.isArray(evidence.items) || !evidence.items.length) fail('invalid-note', 'intake evidence must contain at least one item');
  const items = new Map();
  for (const [index, item] of evidence.items.entries()) {
    exactKeys(item, ['id', 'kind', 'statement', 'source'], ['id', 'kind', 'statement', 'source'], `evidence[${index}]`, 'invalid-note');
    const id = oneLine(item.id, `evidence[${index}].id`, 'invalid-note');
    if (!ID.test(id) || items.has(id)) fail('invalid-note', `evidence id ${id} is invalid or duplicated`);
    if (!['fact', 'uncertainty'].includes(item.kind)) fail('invalid-note', `evidence ${id} kind is invalid`);
    const statement = text(item.statement, `evidence ${id} statement`, 'invalid-note');
    exactKeys(item.source, ['file', 'sha256', 'line_start', 'line_end'], ['file', 'sha256'], `evidence ${id} source`, 'invalid-note');
    const sourceFile = consumeFile(snapshot, source.root, item.source.file, `evidence source ${id}`);
    if (!SHA256.test(item.source.sha256) || item.source.sha256 !== sourceFile.sha256) fail('source-changed', `evidence source ${id} changed after intake`);
    const hasStart = Object.hasOwn(item.source, 'line_start');
    const hasEnd = Object.hasOwn(item.source, 'line_end');
    if (hasStart !== hasEnd) fail('invalid-note', `evidence ${id} line range is incomplete`);
    if (hasStart) {
      const lines = sourceFile.bytes.toString('utf8').split(/\r?\n/).length;
      if (!Number.isSafeInteger(item.source.line_start) || !Number.isSafeInteger(item.source.line_end) || item.source.line_start < 1 || item.source.line_end < item.source.line_start || item.source.line_end > lines) fail('invalid-note', `evidence ${id} line range is invalid`);
    }
    items.set(id, { id, kind: item.kind, statement, source: { file: sourceFile.relative, sha256: sourceFile.sha256, ...(hasStart ? { line_start: item.source.line_start, line_end: item.source.line_end } : {}) }, bytes: sourceFile.bytes });
  }
  if (!Array.isArray(note.current.questions) || !note.current.questions.length) fail('invalid-note', 'intake must contain questions');
  const questions = new Map();
  for (const [index, question] of note.current.questions.entries()) {
    exactKeys(question, ['id', 'status', 'question', 'recommendation', 'evidence', 'decision_entry'], ['id', 'status', 'question', 'recommendation', 'evidence'], `question[${index}]`, 'invalid-note');
    const id = oneLine(question.id, `question[${index}].id`, 'invalid-note');
    if (!ID.test(id) || questions.has(id) || !['open', 'tentative', 'locked'].includes(question.status)) fail('invalid-note', `question ${id} has invalid identity or status`);
    if (!Array.isArray(question.evidence) || !question.evidence.length || question.evidence.some((evidenceId) => !items.has(evidenceId)) || new Set(question.evidence).size !== question.evidence.length) fail('invalid-note', `question ${id} has invalid evidence references`);
    questions.set(id, { id, status: question.status, question: text(question.question, `question ${id} text`, 'invalid-note'), recommendation: text(question.recommendation, `question ${id} recommendation`, 'invalid-note'), evidence: [...question.evidence], ...(question.decision_entry ? { decision_entry: oneLine(question.decision_entry, `question ${id} decision_entry`, 'invalid-note') } : {}) });
  }
  return { note, noteId: note.id, revision: note.revision, sourceFile: read.relative, sha256: read.sha256, projectName, items, questions };
}

function selectedDecisions(intake, selectedIds) {
  const entries = intake.note.entries;
  return selectedIds.map((id) => {
    const question = intake.questions.get(id);
    if (!question) fail('question-missing', `selected question ${id} is absent from intake`);
    if (question.status !== 'locked') fail('question-not-locked', `selected question ${id} is ${question.status}`);
    const decisions = entries.filter((entry) => entry.kind === 'decision' && entry.question_id === id);
    const current = decisions.filter((decision) => !entries.some((entry) => entry.corrects === decision.id));
    if (!current.length) {
      if (decisions.length) fail('decision-corrected', `selected question ${id} has only a corrected decision; record the current owner decision explicitly`);
      fail('decision-missing', `selected question ${id} has no matching decision entry`);
    }
    if (current.length !== 1) fail('decision-ambiguous', `selected question ${id} has multiple current decision entries`);
    const decision = current[0];
    if (question.decision_entry && question.decision_entry !== decision.id) fail('decision-mismatch', `selected question ${id} points to a different decision entry`);
    return { ...question, decision: { entry_id: decision.id, content: text(decision.content, `decision ${decision.id}`, 'invalid-note'), ...(decision.interpretation ? { interpretation: text(decision.interpretation, `decision ${decision.id} interpretation`, 'invalid-note') } : {}) } };
  });
}

function selectedAdrs(source, wanted, snapshot) {
  if (!wanted.length) return [];
  const findings = validateAdrs(source.root).filter((finding) => finding.severity === 'error');
  if (findings.length) fail('adr-invalid', 'source ADR collection does not validate', { findings });
  const records = listAdrs(source.root);
  return wanted.map((wantedId) => {
    const record = records.find((item) => item.name === wantedId || item.number === wantedId || `ADR-${item.number}` === wantedId);
    if (!record) fail('adr-missing', `selected ADR ${wantedId} is absent`);
    if (record.data?.status !== 'accepted') fail('adr-not-active', `selected ADR ${wantedId} is not accepted and active`);
    const relative = record.relativePath;
    const read = consumeFile(snapshot, source.root, relative, `active ADR ${wantedId}`);
    return { id: `ADR-${record.number}`, name: record.name, title: record.title ?? record.name, source_file: relative, sha256: read.sha256, bytes: read.bytes };
  });
}

function readTemplateControls(template, snapshot) {
  return Object.fromEntries(controls.map((name) => {
    const read = consumeFile(snapshot, template.root, name, `Template control ${name}`);
    return [name, { file: read.relative, sha256: read.sha256, bytes: read.bytes }];
  }));
}

function cell(value) { return String(value).replaceAll('|', '\\|').replace(/\r?\n/g, ' '); }
function quote(value) { return String(value).split(/\r?\n/).map((line) => `> ${line}`).join('\n'); }
function slug(value) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'capability'; }

function specText(data, receiptPath) {
  const { plan, decisions, adrs, evidence, version, date } = data;
  const cap = plan.capability;
  const decisionText = decisions.map((question) => [
    `### ${question.id} — ${question.decision.entry_id}`,
    '',
    quote(question.decision.content),
    ...(question.decision.interpretation ? ['', 'Recorded interpretation:', '', quote(question.decision.interpretation)] : [])
  ].join('\n')).join('\n\n');
  const evidenceRows = evidence.map((item) => `| ${cell(item.id)} | ${cell(item.kind)} | [preserved bytes](../../docs/intake/evidence/${item.preserved_name}) | ${item.source.sha256} |`).join('\n');
  const adrRows = adrs.length ? adrs.map((adr) => `- [${adr.id}](../../docs/adr/${adr.name}) — ${adr.title}; source SHA-256 ${adr.sha256}`).join('\n') : '- none selected';
  const open = [...data.intake.questions.values()].filter((question) => question.status !== 'locked' || !plan.selectedQuestions.includes(question.id));
  const openRows = open.length ? open.map((question) => `| ${cell(question.id)} | ${cell(question.status)} | ${cell(question.question)} | Excluded from derivation |`).join('\n') : '| none | none | none | No excluded question material |';
  return `# ${cap.id} - ${cap.title}\n\n> Generated from LLM Workbench ${version}.\n\n**Spec ID:** ${cap.id}\n**Status:** active\n**Priority:** 2\n**Owner:** unassigned\n**Stance:** Builder\n**Updated:** ${date}\n**Catalog description:** ${cap.outcome}\n**Blockers:** none\n**Latest event:** Genesis derived this scoped capability from locked recorded decisions.\n**Next gate:** Claim ${cap.ticket.id}.\n\n## Outcome\n\n${cap.outcome}\n\n## Founding Prompt\n\nPreserved verbatim from the caller-authored plan:\n\n${quote(plan.project.founding_prompt)}\n\n## Derived From Locked Decisions\n\nThe recorded decision wording and interpretation are preserved below. The generator validated their source links and status; semantic derivation remains a reviewer judgment.\n\n${decisionText}\n\n## Source Evidence\n\nThe complete derivation receipt is [${receiptPath}](../../docs/intake/DERIVATION.json). The source repository and commit are a local checkout observation; remote availability was not established.\n\n| Evidence | Kind | Preserved source | SHA-256 |\n|---|---|---|---|\n${evidenceRows}\n\n## Active ADRs\n\n${adrRows}\n\n## Open Or Unselected Material\n\n| Question | Status | Prompt | Disposition |\n|---|---|---|---|\n${openRows}\n\n## Vertical Implementation Slices\n\n| Ticket | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n| ${cap.ticket.id} | ${cell(cap.ticket.slice)} | ready | none | pending |\n\n## Acceptance Criteria\n\n${cap.acceptance.map((item) => `- [ ] ${item}`).join('\n')}\n\n## Testing Seams\n\n- The capability's public behavior and named acceptance checks.\n\n## Verification Procedure\n\nRun the ticket's named checks, then render and doctor the room.\n\n## Documentation Impact\n\nUpdate the named capability owners when the ticket lands.\n\n## Append-Only Evidence And Execution Log\n\n| Date | Ticket | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n| ${date} | genesis | Derived from ${plan.selectedQuestions.join(', ')} and source-linked evidence | Generated-room layout, render and doctor passed before publication | Spec and derivation receipt created | Remote recovery omitted: this derivation creates local main and integration branches only; semantic review and implementation remain |\n\n## Completion Result\n\nPending.\n\n## Supersession\n\n- Supersedes: none.\n- Superseded by: none.\n`;
}

function runJson(script, args, cwd, label) {
  const result = spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    let cause = 'failed';
    try {
      const code = JSON.parse(result.stdout)?.error?.code;
      if (/^[a-z0-9-]+$/.test(code ?? '')) cause = code;
    } catch {}
    fail('generated-validation', `${label} failed (${cause})`, { check: label });
  }
  try { return JSON.parse(result.stdout); } catch { return { status: 'passed', output: result.stdout.trim() }; }
}

function runGit(root, args, label) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) fail('generated-validation', `${label} failed`, { check: label, output: `${result.stdout}${result.stderr}`.slice(0, 4000) });
  return result.stdout.trim();
}

function fillTemplate(file, values) {
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of Object.entries(values)) content = content.replaceAll(from, to);
  return content;
}

function materialize(stage, data) {
  const { release, template, templateControls, source, plan, intake, decisions, adrs, snapshot } = data;
  runGit(stage, ['init', '-b', 'main'], 'initialize generated Git repository');
  runGit(stage, ['config', 'user.name', 'LLM Workbench Genesis'], 'configure generated Git author');
  runGit(stage, ['config', 'user.email', 'workbench-genesis@invalid.example'], 'configure generated Git email');
  const layout = path.join(releaseRoot, 'workbench', 'tools', 'workbench-layout.mjs');
  const installer = path.join(releaseRoot, 'tools', 'workbench-tools.mjs');
  const initialized = runJson(layout, ['init', '--project', stage, '--provenance', 'genesis', '--version', release.release, '--source-commit', release.commit, '--source-repository', release.repository, '--name', plan.project.name, '--default-branch', 'main', '--integration-branch', 'integration'], stage, 'Workbench layout initialization');
  runJson(installer, ['install', '--project', stage], stage, 'managed runtime installation');
  for (const name of controls) fs.writeFileSync(path.join(stage, name), plan.drafts[name].bytes, { mode: 0o644 });
  fs.writeFileSync(path.join(stage, 'workbench', 'wiki', 'MEMORY.md'), plan.memory.bytes, { mode: 0o644 });
  const date = new Date().toISOString().slice(0, 10);
  const feedbackTemplate = path.join(releaseRoot, 'templates', 'WORKBENCH_FEEDBACK.md');
  fs.writeFileSync(path.join(stage, 'workbench', 'feedback', 'WORKBENCH_FEEDBACK.md'), fillTemplate(feedbackTemplate, { '[PROJECT_NAME]': plan.project.name, '[HARNESS_VERSION]': release.release.slice(1), '[YYYY-MM-DD]': date }));

  const evidenceDir = path.join(stage, 'workbench', 'docs', 'intake', 'evidence');
  const templateControlsDir = path.join(stage, 'workbench', 'docs', 'intake', 'template-controls');
  const adrDir = path.join(stage, 'workbench', 'docs', 'adr');
  fs.mkdirSync(evidenceDir, { recursive: true });
  fs.mkdirSync(templateControlsDir, { recursive: true });
  fs.mkdirSync(adrDir, { recursive: true });
  for (const name of controls) fs.writeFileSync(path.join(templateControlsDir, name), templateControls[name].bytes, { mode: 0o644 });
  const selectedEvidenceIds = new Set(decisions.flatMap((question) => question.evidence));
  const evidence = [...intake.items.values()].filter((item) => selectedEvidenceIds.has(item.id)).map((item, index) => {
    const safeName = path.basename(item.source.file).replace(/[^A-Za-z0-9._-]/g, '-');
    const preserved_name = `${String(index + 1).padStart(2, '0')}-${item.source.sha256.slice(0, 12)}-${safeName}`;
    fs.writeFileSync(path.join(evidenceDir, preserved_name), item.bytes, { mode: 0o644 });
    return { id: item.id, kind: item.kind, statement: item.statement, source: item.source, preserved_name, preserved_file: `workbench/docs/intake/evidence/${preserved_name}` };
  });
  for (const adr of adrs) fs.writeFileSync(path.join(adrDir, adr.name), adr.bytes, { mode: 0o644 });
  const stagedAdrErrors = validateAdrs(stage).filter((finding) => finding.severity === 'error');
  if (stagedAdrErrors.length) fail('adr-invalid', 'selected ADRs are not valid in the generated room');

  const questions = [...intake.questions.values()].map((question) => {
    const selected = decisions.find((item) => item.id === question.id);
    return { ...question, selected: Boolean(selected), ...(selected ? { decision: selected.decision } : {}) };
  });
  const derivation = {
    schema_version: DERIVATION_SCHEMA_VERSION,
    semantic_boundary: 'This receipt proves copied bytes and declared lineage; it does not certify semantic derivation or create owner authority.',
    template: { repository: template.repository, release: template.release, commit: template.commit, workbench_id: template.workbenchId },
    source_project: { repository: source.repository, commit: source.commit, observation: 'local checkout identity only; remote availability was not established' },
    plan: { source_file: plan.source.file, sha256: plan.source.sha256 },
    intake: { id: intake.noteId, revision: intake.revision, source_file: intake.sourceFile, sha256: intake.sha256, evidence_schema: 'project-evidence-1' },
    controls: Object.fromEntries(controls.map((name) => [name, {
      template: {
        source_file: templateControls[name].file,
        sha256: templateControls[name].sha256,
        preserved_file: `workbench/docs/intake/template-controls/${name}`
      },
      draft: { source_file: plan.drafts[name].file, sha256: plan.drafts[name].sha256 },
      disposition: 'replaced by caller-authored project control'
    }])),
    memory: { source_file: plan.memory.file, sha256: plan.memory.sha256 },
    evidence: evidence.map(({ preserved_name, ...item }) => item),
    questions,
    active_adrs: adrs.map((adr) => ({ id: adr.id, source_file: adr.source_file, sha256: adr.sha256, preserved_file: `workbench/docs/adr/${adr.name}` })),
    capability: { id: plan.capability.id, derived_from: plan.capability.derived_from }
  };
  const receiptFile = path.join(stage, 'workbench', 'docs', 'intake', 'DERIVATION.json');
  fs.writeFileSync(receiptFile, `${JSON.stringify(derivation, null, 2)}\n`, { mode: 0o644 });

  const manifestFile = path.join(stage, 'workbench', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  manifest.name = plan.project.name;
  manifest.provenance = {
    ...manifest.provenance,
    template: { repository: template.repository, release: template.release, commit: template.commit, workbenchId: template.workbenchId },
    derivedFrom: {
      receipt: { file: 'workbench/docs/intake/DERIVATION.json', sha256: sha256Bytes(fs.readFileSync(receiptFile)) },
      sourceProject: { repository: source.repository, commit: source.commit, observation: 'local-checkout-only' },
      intake: { id: intake.noteId, revision: intake.revision, evidenceSchema: 'project-evidence-1' },
      questions: decisions.map((question) => ({ id: question.id, decisionEntry: question.decision.entry_id, evidence: question.evidence })),
      activeAdrs: adrs.map((adr) => ({ id: adr.id, sha256: adr.sha256 }))
    }
  };
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);

  const specDir = path.join(stage, 'workbench', 'specs', `${plan.capability.id}-${slug(plan.capability.title)}`);
  fs.mkdirSync(specDir, { recursive: true });
  fs.writeFileSync(path.join(specDir, 'SPEC.md'), specText({ plan, intake, decisions, adrs, evidence, version: release.release, date }, 'DERIVATION.json'));

  const adrTool = path.join(stage, 'workbench', 'tools', 'adr.mjs');
  const specTool = path.join(stage, 'workbench', 'tools', 'spec-workbench.mjs');
  runJson(adrTool, ['register'], stage, 'ADR register rendering');
  runJson(specTool, ['render'], stage, 'spec projection rendering');
  runGit(stage, ['add', '-A'], 'stage generated room');
  runGit(stage, ['commit', '-m', `Initialize ${plan.project.name} Workbench`], 'commit generated room');
  runGit(stage, ['branch', 'integration'], 'create generated integration branch');
  const readiness = runJson(layout, ['validate', '--project', stage, '--genesis'], stage, 'Genesis readiness validation');
  const doctor = runJson(specTool, ['doctor', '--json'], stage, 'generated room doctor');
  if (runGit(stage, ['status', '--porcelain'], 'verify generated worktree') !== '') fail('generated-validation', 'generated room is dirty after validation');

  // Re-read every mutable input after the staged build. Hashes, rather than a
  // source checkout cleanliness claim, also cover explicitly unversioned C
  // evidence and ignored live notes.
  for (const [file, expected] of snapshot) {
    ordinaryFile(file, 'consumed input');
    if (sha256Bytes(fs.readFileSync(file)) !== expected) fail('source-changed', 'a consumed input changed during derivation');
  }
  const templateEnd = projectIdentity(template.root, 'Template', { manifest: true, clean: true });
  const sourceEnd = projectIdentity(source.root, 'source project', { manifest: true });
  const releaseEnd = releaseIdentity();
  if (templateEnd.commit !== template.commit || sourceEnd.commit !== source.commit || sourceEnd.repository !== source.repository || releaseEnd.commit !== release.commit) fail('source-changed', 'Template, source project, or Workbench release changed during derivation');
  return { workbenchId: initialized.manifest.workbenchId, readiness, doctor };
}

function destinationPath(value, inputs) {
  const requested = path.resolve(text(value, '--destination', 'invalid-invocation'));
  if (fs.existsSync(requested)) fail('destination-exists', 'destination must not already exist');
  const parent = path.dirname(requested);
  ordinaryDirectory(parent, 'destination parent');
  const canonicalParent = fs.realpathSync(parent);
  const destination = path.join(canonicalParent, path.basename(requested));
  if (fs.existsSync(destination)) fail('destination-exists', 'destination must not already exist');
  for (const input of inputs.map((item) => fs.realpathSync(item))) {
    if (destination === input || destination.startsWith(`${input}${path.sep}`)) fail('unsafe-path', 'destination cannot be inside an input checkout');
  }
  return destination;
}

export function deriveFromDecisions(options = {}) {
  let stage = null;
  try {
    for (const key of ['template', 'sourceProject', 'intake', 'plan', 'destination']) if (!options[key]) fail('invalid-invocation', `--${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)} is required`);
    const release = releaseIdentity();
    const template = projectIdentity(options.template, 'Template', { manifest: true, clean: true });
    if (!supportedTemplateRelease(template.release, release.release)) fail('version-mismatch', `Template release ${template.release} is not a supported source for generator release ${release.release}`);
    const source = projectIdentity(options.sourceProject, 'source project', { manifest: true });
    const snapshot = new Map();
    consumeFile(snapshot, source.root, 'workbench/manifest.json', 'source project manifest', { json: true, maxBytes: MAX_JSON_BYTES });
    const templateControls = readTemplateControls(template, snapshot);
    const planRead = consumeFile(snapshot, source.root, options.plan, 'Genesis plan', { json: true, maxBytes: MAX_JSON_BYTES });
    const plan = validatePlan(planRead.value, source, release, snapshot);
    plan.source = { file: planRead.relative, sha256: planRead.sha256 };
    const intake = validateIntake(source, options.intake, snapshot);
    if (plan.project.name !== intake.projectName) fail('project-mismatch', 'plan project name differs from the evidence intake project');
    const decisions = selectedDecisions(intake, plan.selectedQuestions);
    const adrs = selectedAdrs(source, plan.activeAdrIds, snapshot);
    const destination = destinationPath(options.destination, [releaseRoot, template.root, source.root]);
    stage = fs.mkdtempSync(path.join(path.dirname(destination), `.${path.basename(destination)}.genesis-`));
    const validation = materialize(stage, { release, template, templateControls, source, plan, intake, decisions, adrs, snapshot });
    fs.renameSync(stage, destination);
    stage = null;
    return { status: 'derived', destination, capabilities: 1, questions: plan.selectedQuestions, identity: { new: true, workbenchId: validation.workbenchId }, validation: { readiness: validation.readiness.status, doctorFindings: validation.doctor.length } };
  } catch (error) {
    if (stage) fs.rmSync(stage, { recursive: true, force: true });
    return blocked(error.code ?? 'derivation-failed', error.message, error.findings ? { findings: error.findings } : {});
  }
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (command !== 'derive') throw new Error('Usage: genesis-from-decisions.mjs derive --template PATH --source-project PATH --intake NOTE --plan PLAN --destination PATH');
  const allowed = new Set(['template', 'source-project', 'intake', 'plan', 'destination']);
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (!arg.startsWith('--') || !allowed.has(arg.slice(2))) throw new Error('Unknown argument; accepted options are --template, --source-project, --intake, --plan and --destination');
    const value = rest[++index];
    if (value === undefined || Object.hasOwn(options, arg.slice(2))) throw new Error(`${arg} requires one value and may be supplied once`);
    options[arg.slice(2)] = value;
  }
  return { template: options.template, sourceProject: options['source-project'], intake: options.intake, plan: options.plan, destination: options.destination };
}

if (isMainModule(import.meta.url)) {
  let result;
  try { result = deriveFromDecisions(parseArgs(process.argv.slice(2))); }
  catch (error) { result = blocked('invalid-invocation', error.message); }
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (result.status === 'blocked') process.exitCode = 1;
}
