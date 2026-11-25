import test from 'node:test';
import assert from 'node:assert/strict';
import { totalCents } from '../src/cart.mjs';

test('省略数量时为一件', () => {
  assert.equal(totalCents(250), 250);
});
test('正常数量按整数分计费', () => {
  assert.equal(totalCents(250, 3), 750);
});
test('零数量总价为零', () => {
  assert.equal(totalCents(250, 0), 0);
});
test('拒绝非法数量、非法单价和溢出', () => {
  for (const quantity of [-1, 1.5, null, NaN]) {
    assert.throws(() => totalCents(250, quantity), RangeError);
  }
  assert.throws(() => totalCents(-1, 1), RangeError);
  assert.throws(() => totalCents(Number.MAX_SAFE_INTEGER, 2), RangeError);
});
