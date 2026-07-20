#!/usr/bin/env node
// Foundry socket contract registry — validator (S-014 TK-002).
//
// Successor/extension of the instance-side id-registry.mjs. That tool validates
// the *binding table* (which module fills a socket, instance data). This tool
// validates the traveling *contract*: the machine-readable artifact in
// ./socket-registry/registry.json, resolves a socket to its contract, checks an
// instance binding row against that contract, and enforces the no-reach-around
// hard gate on a connection between two Foundry layers.
//
// Exports pure functions (importable by module legs — OpenBrain TK-003, CIC
// TK-004) plus a CLI. Zero dependencies.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SCHEMA_VERSION,
  SOCKET_ID_PATTERN,
  FRESHNESS_STATES,
  validateRecordShape
} from './socket-registry/schema.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_REGISTRY_PATH = path.join(HERE, 'socket-registry', 'registry.json');

const ENROLLED_ID_PATTERN = /^[PFCKM]-\d{3}$/;

export function loadRegistry(registryPath = DEFAULT_REGISTRY_PATH) {
  const raw = fs.readFileSync(registryPath, 'utf8');
  return JSON.parse(raw);
}

// Validate the whole artifact against the schema. Returns { errors, count }.
export function validateRegistry(doc) {
  const errors = [];
  if (!doc || typeof doc !== 'object') {
    return { errors: ['registry document must be an object'], count: 0 };
  }
  if (doc.schemaVersion !== SCHEMA_VERSION) {
    errors.push(`schemaVersion must be '${SCHEMA_VERSION}', got '${doc.schemaVersion}'`);
  }
  const sockets = doc.sockets;
  if (!sockets || typeof sockets !== 'object' || Array.isArray(sockets)) {
    errors.push('registry must carry a sockets object');
    return { errors, count: 0 };
  }
  const ids = Object.keys(sockets);
  if (!ids.length) errors.push('registry declares no sockets');
  for (const id of ids) {
    errors.push(...validateRecordShape(id, sockets[id]));
  }
  return { errors, count: ids.length };
}

// Resolve a socket id to its contract record, or throw if absent.
export function resolveSocket(doc, socketId) {
  if (!SOCKET_ID_PATTERN.test(socketId)) {
    throw new Error(`invalid socket id '${socketId}': must match K-###`);
  }
  const record = doc?.sockets?.[socketId];
  if (!record) throw new Error(`missing contract: socket '${socketId}' is not in the registry`);
  return record;
}

// Validate an instance binding row against the traveling contract. A binding is
// instance data: { socketId, boundEntity, boundName?, access, entrypoint }.
export function validateBinding(doc, binding) {
  const errors = [];
  if (!binding || typeof binding !== 'object') return { errors: ['binding must be an object'] };
  const { socketId } = binding;
  let record;
  try {
    record = resolveSocket(doc, socketId);
  } catch (err) {
    return { errors: [err.message] };
  }
  const boundEntity = String(binding.boundEntity ?? '');
  const planned = /^planned\b/i.test(boundEntity);
  if (!planned && !ENROLLED_ID_PATTERN.test(boundEntity)) {
    errors.push(`${socketId}: binding must name an enrolled entity ID (P/F/C/K/M-###) or be 'planned'`);
  }
  if (!planned) {
    // A real binding must connect THROUGH the contract, not around it.
    if (binding.access !== 'contract') {
      errors.push(
        `${socketId}: binding access '${binding.access}' is a reach-around — a binding must connect via the socket contract (access: 'contract')`
      );
    }
    const declaredEntrypoint = record.contractSurface?.entrypoint;
    if (binding.entrypoint !== declaredEntrypoint) {
      errors.push(
        `${socketId}: binding entrypoint '${binding.entrypoint}' does not match the contract entrypoint '${declaredEntrypoint}'`
      );
    }
  }
  return { errors };
}

// The no-reach-around hard gate. A connection describes how a consuming layer
// reaches a socket: { socketId, access, entrypoint }. Only access 'contract'
// through the declared entrypoint is a valid Foundry-slice connection; any
// filesystem/database/direct access into the module is a boundary violation.
export function checkConnection(doc, connection) {
  const errors = [];
  if (!connection || typeof connection !== 'object') return { errors: ['connection must be an object'], reachAround: true };
  let record;
  try {
    record = resolveSocket(doc, connection.socketId);
  } catch (err) {
    return { errors: [err.message], reachAround: false };
  }
  const access = connection.access;
  const reachAround = access !== 'contract';
  if (reachAround) {
    errors.push(
      `${connection.socketId}: reach-around detected — access '${access}' bypasses the socket contract. ` +
        `A Foundry slice must connect via the contract entrypoint '${record.contractSurface?.entrypoint}', ` +
        `not by reading the module's files or database directly.`
    );
    return { errors, reachAround: true };
  }
  if (connection.entrypoint !== record.contractSurface?.entrypoint) {
    errors.push(
      `${connection.socketId}: connection entrypoint '${connection.entrypoint}' does not match the contract entrypoint '${record.contractSurface?.entrypoint}'`
    );
  }
  return { errors, reachAround: false };
}

// Structural check that a recall response conforms to the K-001 contract
// (provenance + freshness). Reused by OpenBrain (TK-003) and CIC (TK-004).
export function validateRecallResponse(doc, response) {
  const errors = [];
  const record = resolveSocket(doc, 'K-001');
  const required = record.contract?.response?.required ?? [];
  for (const field of required) {
    if (response == null || !(field in response)) errors.push(`recall response missing required field '${field}'`);
  }
  if (response && 'freshness' in response) {
    const state = typeof response.freshness === 'object' ? response.freshness?.state : response.freshness;
    if (!FRESHNESS_STATES.includes(state)) {
      errors.push(`recall response freshness '${state}' must be one of ${FRESHNESS_STATES.join(' | ')}`);
    }
  }
  return { errors };
}

function readFlag(args, name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : undefined;
}

function main(argv) {
  const [cmd, ...args] = argv;
  const registryPath = readFlag(args, '--registry') ?? DEFAULT_REGISTRY_PATH;
  let doc;
  try {
    doc = loadRegistry(registryPath);
  } catch (err) {
    console.error(`error: cannot load registry ${registryPath}: ${err.message}`);
    return 2;
  }

  if (cmd === 'validate') {
    const { errors, count } = validateRegistry(doc);
    for (const e of errors) console.error(`error: ${e}`);
    console.log(`${errors.length ? 'fail' : 'ok'} - socket contract registry: ${count} sockets, ${errors.length} errors`);
    return errors.length ? 1 : 0;
  }
  if (cmd === 'resolve') {
    const id = args.find((a) => SOCKET_ID_PATTERN.test(a));
    try {
      console.log(JSON.stringify(resolveSocket(doc, id), null, 2));
      return 0;
    } catch (err) {
      console.error(`error: ${err.message}`);
      return 1;
    }
  }
  if (cmd === 'check-binding' || cmd === 'check-connection') {
    const jsonArg = args.find((a) => a.trim().startsWith('{'));
    let payload;
    try {
      payload = JSON.parse(jsonArg);
    } catch {
      console.error(`error: ${cmd} requires an inline JSON payload`);
      return 2;
    }
    const { errors } = cmd === 'check-binding' ? validateBinding(doc, payload) : checkConnection(doc, payload);
    for (const e of errors) console.error(`error: ${e}`);
    console.log(`${errors.length ? 'fail' : 'ok'} - ${cmd}: ${errors.length} errors`);
    return errors.length ? 1 : 0;
  }

  console.error('Usage: socket-contract.mjs <validate|resolve K-###|check-binding JSON|check-connection JSON> [--registry PATH]');
  return 2;
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  process.exit(main(process.argv.slice(2)));
}
