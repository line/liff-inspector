import { isObject } from './utils';

describe('isObject', () => {
  it('should return false if value is not object', () => {
    expect(isObject('aa')).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(BigInt(1))).toBe(false);
  });

  it('should return true if value is object', () => {
    expect(isObject(Symbol('a'))).toBe(true); // OK?
    expect(
      isObject(() => {
        return 1;
      })
    ).toBe(true);
    expect(isObject({})).toBe(true);
  });
});
