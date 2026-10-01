#!/usr/bin/env node
// Type-level routing only. Neither loading a map nor validating its shape
// establishes that a routed capability is installed or authorizes its use.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertSafeReadPath, isMainModule } from './workbench-paths.mjs';
const schema = JSON.parse(fs.readFileSync(new URL('./ownership-map.schema.json', import.meta.url), 'utf8'));
// Numeric and letter-bearing identities are rejected within values, including
// filenames and fragments. Bracketed type placeholders are intentionally not IDs.
const instance = /(?:S|TK|ADR|DQC|LM|N|WB)-[0-9A-Za-z]+/;
function check(value, rule, at) {
  if (rule.const !== undefined && value !== rule.const) throw new Error(`${at}: unexpected version`);
  if (rule.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${at}: expected object`);
    for (const key of Object.keys(value)) if (!Object.hasOwn(rule.properties, key)) throw new Error(`${at}: unknown field ${key}`);
    for (const key of rule.required) if (!Object.hasOwn(value, key)) throw new Error(`${at}: missing ${key}`);
    for (const [key, item] of Object.entries(value)) check(item, rule.properties[key], `${at}.${key}`);
  } else if (rule.type === 'array') {
    if (!Array.isArray(value) || value.length < rule.minItems || (rule.maxItems !== undefined && value.length > rule.maxItems)) throw new Error(`${at}: invalid item count`);
    value.forEach((item, index) => check(item, rule.items, `${at}[${index}]`));
  } else if (rule.type === 'string') {
    if (typeof value !== 'string' || !value.trim() || value !== value.trim() || /[\x00-\x1f]/.test(value)) throw new Error(`${at}: expected nonempty string`);
    if (rule.enum && !rule.enum.includes(value)) throw new Error(`${at}: unexpected value`);
    if (instance.test(value)) throw new Error(`${at}: instance identifier forbidden`);
    if (at.endsWith('.path') && (/^(?:\/|[A-Za-z]:|[a-z]+:\/\/)/i.test(value) || value.includes('\\') || value.split(/[\/#]/).includes('..'))) throw new Error(`${at}: unsafe route`);
  }
}
export function validateOwnership(map) {
  check(map, schema, 'ownership');
  for (const [items, field] of [[map.rows, 'key'], [map.relations, 'name']]) {
    if (new Set(items.map(item => item[field])).size !== items.length) throw new Error(`ownership: duplicate ${field}`);
  }
  for (const row of map.rows) {
    const keys = schema.properties.rows.items.properties;
    if (keys.key.enum.indexOf(row.key) !== keys.responsibility.enum.indexOf(row.responsibility)) throw new Error(`ownership: responsibility/key mismatch for ${row.key}`);
    if (!row.routes.some(route => route.role === 'primary')) throw new Error(`ownership: missing primary route for ${row.key}`);
    const unique = new Set(row.routes.map(route => JSON.stringify(route)));
    if (unique.size !== row.routes.length) throw new Error(`ownership: duplicate route for ${row.key}`);
  }
  return map;
}
export function readOwnership(root) {
  const file = path.join(path.resolve(root), 'OWNERSHIP.json');
  assertSafeReadPath(root, file);
  if (!fs.existsSync(file)) throw new Error('Ownership map missing: OWNERSHIP.json');
  let map;
  try { map = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) { throw new Error(`Ownership map invalid JSON: ${error.message}`); }
  return validateOwnership(map);
}
if (isMainModule(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args[0] !== 'validate' || args.length > 2) throw new Error('Usage: ownership-map.mjs validate [PROJECT]');
    const map = readOwnership(path.resolve(args[1] ?? '.'));
    console.log(JSON.stringify({ valid: true, responsibilities: map.rows.length, relations: map.relations.length }));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
