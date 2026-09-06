#!/usr/bin/env node
// Tests for the Foundry socket contract registry validator (S-014 TK-002).
// Covers the S-014 testing seams: a well-formed K-001 contract record, a
// binding that matches the contract, a binding that violates it, a missing
// contract, and a reach-around connection the conformance check must reject.
import assert from 'node:assert/strict';
import {
  loadRegistry,
  validateRegistry,
  resolveSocket,
  validateBinding,
  checkConnection,
  validateRecallResponse
} from './socket-contract.mjs';

let passed = 0;
function ok(name, fn) {
  fn();
  passed += 1;
  console.log(`  ok - ${name}`);
}

// The shipped artifact is well-formed and resolves K-001 to its contract.
ok('shipped registry validates clean', () => {
  const doc = loadRegistry();
  const { errors, count } = validateRegistry(doc);
  assert.deepEqual(errors, [], 'shipped registry must validate with no errors');
  assert.ok(count >= 1, 'registry must declare at least one socket');
});

ok('validator resolves K-001 to its recall contract', () => {
  const doc = loadRegistry();
  const record = resolveSocket(doc, 'K-001');
  assert.equal(record.socket, 'recall');
  assert.equal(record.contractSurface.entrypoint, 'recall.query');
  assert.equal(record.moduleAgnostic, true);
  // The contract must require provenance + freshness on every recall answer.
  assert.ok(record.contract.response.required.includes('source'));
  assert.ok(record.contract.response.required.includes('freshness'));
});

// The traveling contract must NOT carry the binding (implementation) — that is
// instance data that lives in the Project Source Registry.
ok('contract record carries no binding/implementation data', () => {
  const doc = loadRegistry();
  const record = resolveSocket(doc, 'K-001');
  for (const forbidden of ['boundEntity', 'boundModule', 'module', 'implementation', 'binding']) {
    assert.ok(!(forbidden in record), `contract must not carry '${forbidden}'`);
  }
});

// A schema-violating registry is rejected (missing required key, non-agnostic,
// binding data leaked into the traveling contract).
ok('malformed records are rejected', () => {
  const bad = {
    schemaVersion: '1.0',
    sockets: {
      'K-009': { socket: 'x', capability: 'y', moduleAgnostic: false, boundEntity: 'P-010' }
    }
  };
  const { errors } = validateRegistry(bad);
  assert.ok(errors.some((e) => e.includes("missing required key 'contractSurface'")));
  assert.ok(errors.some((e) => e.includes('moduleAgnostic must be true')));
  assert.ok(errors.some((e) => e.includes("forbidden key 'boundEntity'")));
});

// Missing contract: resolving an unregistered socket must fail loudly.
ok('missing contract throws', () => {
  const doc = loadRegistry();
  assert.throws(() => resolveSocket(doc, 'K-404'), /missing contract/);
  assert.throws(() => resolveSocket(doc, 'nope'), /invalid socket id/);
});

// A binding that MATCHES the contract (through the entrypoint) validates.
ok('conforming binding validates', () => {
  const doc = loadRegistry();
  const { errors } = validateBinding(doc, {
    socketId: 'K-001',
    boundEntity: 'P-010',
    boundName: 'OpenBrain',
    access: 'contract',
    entrypoint: 'recall.query'
  });
  assert.deepEqual(errors, [], 'a contract-conforming binding must validate');
});

// A binding that VIOLATES the contract (reaches around it / wrong entrypoint /
// unenrolled entity) is rejected.
ok('violating binding is rejected', () => {
  const doc = loadRegistry();
  const reachAround = validateBinding(doc, {
    socketId: 'K-001',
    boundEntity: 'P-010',
    access: 'filesystem',
    entrypoint: 'recall.query'
  });
  assert.ok(reachAround.errors.some((e) => e.includes('reach-around')), 'filesystem access must be flagged');

  const wrongEntry = validateBinding(doc, {
    socketId: 'K-001',
    boundEntity: 'P-010',
    access: 'contract',
    entrypoint: 'openbrain.readFile'
  });
  assert.ok(wrongEntry.errors.some((e) => e.includes('does not match the contract entrypoint')));

  const unenrolled = validateBinding(doc, {
    socketId: 'K-001',
    boundEntity: 'OpenBrain',
    access: 'contract',
    entrypoint: 'recall.query'
  });
  assert.ok(unenrolled.errors.some((e) => e.includes('enrolled entity ID')));
});

// The no-reach-around hard gate: a connection through the contract passes; a
// filesystem/database connection into the module is rejected.
ok('reach-around connection is rejected, contract connection passes', () => {
  const doc = loadRegistry();
  const viaContract = checkConnection(doc, {
    socketId: 'K-001',
    access: 'contract',
    entrypoint: 'recall.query'
  });
  assert.deepEqual(viaContract.errors, []);
  assert.equal(viaContract.reachAround, false);

  const viaFiles = checkConnection(doc, {
    socketId: 'K-001',
    access: 'filesystem',
    path: 'Foundry/Modules/OpenBrain/data/index.db'
  });
  assert.equal(viaFiles.reachAround, true);
  assert.ok(viaFiles.errors.some((e) => e.includes('reach-around detected')));
});

// Recall response conformance: provenance + freshness required.
ok('recall response conformance enforces provenance + freshness', () => {
  const doc = loadRegistry();
  const good = validateRecallResponse(doc, {
    value: 'Command Information Center',
    source: 'Wiki/Machine/Project Source Registry.md',
    freshness: { state: 'fresh', asOf: '2026-07-20T00:00:00Z' }
  });
  assert.deepEqual(good.errors, []);

  const noSource = validateRecallResponse(doc, { value: 'x', freshness: 'fresh' });
  assert.ok(noSource.errors.some((e) => e.includes("missing required field 'source'")));

  const badFreshness = validateRecallResponse(doc, { value: 'x', source: 'y', freshness: 'sortof' });
  assert.ok(badFreshness.errors.some((e) => e.includes('freshness')));
});

console.log(`\nsocket-contract: ${passed} checks passed`);
