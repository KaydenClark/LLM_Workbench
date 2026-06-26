import assert from 'node:assert/strict';
import { applyDiscount } from '../mathx/discount.mjs';

assert.equal(applyDiscount(100, 25), 75);

