import { ObjectLike } from './store/ObjectStore';

export const isObject = (value: unknown): value is ObjectLike => {
  if (typeof value === 'string') return false;
  if (typeof value === 'number') return false;
  if (typeof value === 'boolean') return false;
  if (typeof value === 'undefined') return false;
  if (typeof value === 'bigint') return false;
  if (typeof value === 'symbol') return true;
  if (typeof value === 'function') return true;
  if (typeof value === 'object') {
    if (value === null) return false;
    return true;
  }
  throw new Error(`Unknown type: ${value} ${typeof value}`);
};

export const randomNumId = (): number => Math.random() * Math.pow(10, 10);
export const randomStrId = (): string => `${randomNumId()}`;
