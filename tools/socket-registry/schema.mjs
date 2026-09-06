// Foundry socket contract registry — schema (S-014 TK-002).
//
// Declares the machine-readable SHAPE of a socket contract record and the
// recall (K-001) request/response schemas that records point at via
// `contractSurface.schemaPointer`. The validator in ../socket-contract.mjs
// consumes these constants; the JSON artifact in ./registry.json is the data.
//
// This schema travels with the Sockets family (the Forge). It is the successor
// concept to the instance-side id-registry.mjs binding check: id-registry.mjs
// validates the *binding table* (instance data), this validates the *contract*.

export const SCHEMA_VERSION = '1.0';

// A socket ID is a K-### key (S-008 typed-ID namespace, `K-` = socket).
export const SOCKET_ID_PATTERN = /^K-\d{3}$/;

// Freshness vocabulary a recall response must draw from (mirrors the CIC
// freshness contract: fresh | stale | offline, plus unknown before first read).
export const FRESHNESS_STATES = ['fresh', 'stale', 'offline', 'unknown'];

// The required top-level keys of a socket contract record. `moduleAgnostic`
// must be present and true — a record that names an implementation is invalid.
export const RECORD_REQUIRED_KEYS = [
  'socket',
  'capability',
  'contractSurface',
  'contract',
  'moduleAgnostic'
];

export const CONTRACT_SURFACE_REQUIRED_KEYS = ['protocol', 'entrypoint', 'schemaPointer'];

// Keys an instance binding row must never leak into a traveling contract record.
// Binding data (which module fills the socket, its config/creds) is instance
// data and lives in the Project Source Registry, not here.
export const RECORD_FORBIDDEN_KEYS = ['boundEntity', 'boundModule', 'module', 'implementation', 'binding'];

// The recall (K-001) request/response schema referenced by schemaPointer
// `tools/socket-registry/schema.mjs#recall`.
export const recall = {
  request: { required: ['query'], optional: ['id'] },
  response: { required: ['value', 'source', 'freshness'] }
};

// Structural check of one contract record. Returns a list of error strings.
export function validateRecordShape(id, record) {
  const errors = [];
  if (!SOCKET_ID_PATTERN.test(id)) {
    errors.push(`${id}: socket id must match K-### (S-008 typed-ID namespace)`);
  }
  if (record === null || typeof record !== 'object' || Array.isArray(record)) {
    errors.push(`${id}: record must be an object`);
    return errors;
  }
  for (const key of RECORD_REQUIRED_KEYS) {
    if (!(key in record)) errors.push(`${id}: missing required key '${key}'`);
  }
  for (const key of RECORD_FORBIDDEN_KEYS) {
    if (key in record) {
      errors.push(`${id}: forbidden key '${key}' — binding/implementation data is instance data, not a traveling contract`);
    }
  }
  if ('moduleAgnostic' in record && record.moduleAgnostic !== true) {
    errors.push(`${id}: moduleAgnostic must be true — the contract declares no implementation`);
  }
  const surface = record.contractSurface;
  if (surface && typeof surface === 'object' && !Array.isArray(surface)) {
    for (const key of CONTRACT_SURFACE_REQUIRED_KEYS) {
      if (!surface[key]) errors.push(`${id}: contractSurface missing '${key}'`);
    }
  } else if ('contractSurface' in record) {
    errors.push(`${id}: contractSurface must be an object`);
  }
  const contract = record.contract;
  if (!contract || typeof contract !== 'object' || Array.isArray(contract)) {
    if ('contract' in record) errors.push(`${id}: contract must be an object`);
  } else {
    if (!contract.response || !Array.isArray(contract.response.required) || !contract.response.required.length) {
      errors.push(`${id}: contract.response.required must list at least one field`);
    }
    if (!Array.isArray(contract.invariants) || !contract.invariants.length) {
      errors.push(`${id}: contract.invariants must state at least one invariant`);
    }
  }
  return errors;
}
