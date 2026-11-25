// 练习夹具：故意保留零数量计费错误，供调查、调试和审查。
// 契约：单价为非负整数分；数量为非负整数，省略时为 1。
export function totalCents(unitCents, quantity) {
  if (!Number.isSafeInteger(unitCents) || unitCents < 0) {
    throw new RangeError('单价必须是非负整数分');
  }
  if (quantity !== undefined && (!Number.isSafeInteger(quantity) || quantity < 0)) {
    throw new RangeError('数量必须是非负整数');
  }
  const count = quantity || 1;
  const total = unitCents * count;
  if (!Number.isSafeInteger(total)) throw new RangeError('总价超出安全整数范围');
  return total;
}
