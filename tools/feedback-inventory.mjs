#!/usr/bin/env node
// S-00S: inventory evidence without equating identical bytes with identical roles.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { assertSafeReadPath, isMainModule, laneRelative } from '../workbench/tools/workbench-paths.mjs';

function revision(root, file) {
  const result = spawnSync('git', ['log', '-1', '--format=%H', '--', file], { cwd: root, encoding: 'utf8' });
  return result.status === 0 && result.stdout.trim() ? result.stdout.trim() : null;
}
function role(file) {
  if (file.endsWith('/first-pass-snapshot.json')) return 'frozen-first-pass-snapshot';
  if (/\/decision-triage-\d{4}-\d{2}-\d{2}\.json$/.test(file)) return 'first-pass-ledger';
  if (file.endsWith('/decision-ledger.json')) return 'second-pass-ledger';
  if (/\/decision-ledger\.(?:csv|md)$/.test(file)) return 'second-pass-derived-view';
  if (/evidence[^/]*\.(?:md|json)$/.test(file)) return 'evidence';
  if (/\/REPORT[^/]*\.md$/.test(file)) return 'report-or-format';
  return 'supporting-representation';
}
export function inspectFeedback(project) {
  const root = path.resolve(project), lane = laneRelative(root, 'feedback');
  const sources = new Map();
  function walk(relative) {
    const file = path.join(root, relative);
    assertSafeReadPath(root, file);
    const stat = fs.lstatSync(file);
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(file).sort()) walk(`${relative}/${name}`);
    } else if (stat.isFile()) sources.set(relative, fs.readFileSync(file));
    else throw new Error(`Unsupported feedback artifact: ${relative}`);
  }
  walk(lane);
  const artifacts = [];
  for (const [artifact, bytes] of sources) {
    const gaps = ['producer not independently established', 'runtime/review consumer use not established', 'correction lineage requires evidence read-back'];
    let recordIds = [], sourceIds = [], recordedRevision = null;
    if (artifact.endsWith('.json')) {
      try {
        const data = JSON.parse(bytes.toString('utf8'));
        const records = Array.isArray(data) ? data : data.records;
        if (Array.isArray(records)) {
          recordIds = records.map(record => record?.id).filter(id => typeof id === 'string');
          sourceIds = [...new Set(records.flatMap(record => Array.isArray(record?.source_ids) ? record.source_ids.filter(id => typeof id === 'string') : []))].sort();
          if (recordIds.length !== records.length) gaps.push('some records lack a string ID');
          if (new Set(recordIds).size !== recordIds.length) gaps.push('duplicate record IDs');
        } else gaps.push('no record array; metadata/supporting representation');
        const value = data.readAt ?? data.read_at;
        if (typeof value === 'string') recordedRevision = value;
      } catch { gaps.push('unreadable JSON; source preserved'); }
    }
    const textualReferences = [];
    for (const [other, content] of sources) {
      if (other === artifact || !/\.(?:md|json|csv)$/.test(other)) continue;
      const text = content.toString('utf8');
      if (text.includes(artifact)) textualReferences.push({ artifact: other, match: 'full-path' });
      else if (text.includes(path.basename(artifact))) textualReferences.push({ artifact: other, match: 'basename-only; identity requires review' });
    }
    if (!textualReferences.length) gaps.push('no textual consumer reference found within feedback lane');
    artifacts.push({ artifact, role: role(artifact), roleBasis: 'representation filename; review evidence before canonical designation', sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length, lastChangedCommit: revision(root, artifact), recordedRevision, recordIds, sourceIds, textualReferences, producer: 'unknown', correctionLineage: 'unverified', removalEligible: false, gaps });
  }
  return { schemaVersion: 1, operation: 'feedback-representation-inventory', scope: lane, artifacts, limitations: ['Textual references are candidate consumers, not proof of actual consumer use; external repositories and private sources were not inspected.', 'Equal bytes preserve distinct roles. Canonical designation, correction lineage, consumer reconciliation and rollback proof remain separate gates.', 'No deletion, movement, source rewrite or cleanup recommendation is authorized by this inventory.'] };
}
if (isMainModule(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length && (args.length !== 2 || args[0] !== '--project' || !args[1] || args[1].startsWith('--'))) throw new Error('Usage: feedback-inventory.mjs [--project PATH]');
    console.log(JSON.stringify(inspectFeedback(args[1] ?? process.cwd()), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
