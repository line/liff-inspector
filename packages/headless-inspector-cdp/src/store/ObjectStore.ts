import { isObject, randomStrId } from '../utils';
import { Store } from './Store';

export type ObjectLike = Record<string, unknown> | unknown[] | symbol;

class ObjectStore extends Store<string, ObjectLike> {
  storeObject(value: unknown): void {
    if (!isObject(value)) return;
    const objectId = randomStrId();
    this.store(objectId, value);
    Object.values(value).forEach((v) => this.storeObject(v));
  }

  getObjectOf(objectId: string): ObjectLike | undefined {
    return this.getById(objectId);
  }

  getObjectIdOf(object: ObjectLike): string | undefined {
    return this.getByValue(object);
  }
}

export const objectStore = new ObjectStore();
