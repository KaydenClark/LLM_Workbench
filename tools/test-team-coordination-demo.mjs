#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { runTeamCoordinationDemo } from './team-coordination-demo.mjs';

const result = runTeamCoordinationDemo();
assert.deepEqual(result.acceptedLanes.map((lane) => lane.touches), [
  ['lanes/alpha.txt'],
  ['lanes/bravo.txt']
], 'two independent write lanes must be accepted');
assert.equal(result.handoffs.length, 2, 'each role lane must return named proof');
assert.equal(result.overlap.status, 'rejected', 'an overlapping lane must be rejected rather than raced');
assert.match(result.overlap.reason, /overlaps/i);
assert.equal(result.primaryWriter.consolidations, 1, 'only the primary writer may consolidate the fixture once');
assert.equal(fs.existsSync(result.fixture), false, 'the fixture must be removed after the disposable demo');

console.log('ok - bounded two-lane demo accepts disjoint lanes, rejects overlap, and consolidates once');
