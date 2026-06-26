import assert from 'node:assert/strict';
import { applyDiscount } from '../mathx/discount.mjs';

assert.equal(applyDiscount(100, 0), 100);
assert.equal(applyDiscount(100, 25), 75);
assert.equal(applyDiscount(100, 100), 0);
assert.equal(applyDiscount(100, 150), 0);
assert.equal(applyDiscount(100, -25), 100);

