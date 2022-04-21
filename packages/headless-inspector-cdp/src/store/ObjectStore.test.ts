import { objectStore } from './ObjectStore';

describe('ObjectStore', () => {
  it('should store the given object with the object id', () => {
    const obj1 = {};
    objectStore.storeObject(obj1);
    const obj1Id = objectStore.getObjectIdOf(obj1);
    expect(obj1Id).toBeDefined();
    expect(objectStore.getObjectOf(obj1Id as string)).toBe(obj1);
  });

  it('should store the nested object with the object id', () => {
    const child = {};
    const parent = { a: child };
    objectStore.storeObject(parent);
    const parentId = objectStore.getObjectIdOf(parent);
    expect(parentId).toBeDefined();
    expect(objectStore.getObjectOf(parentId as string)).toBe(parent);
    const childId = objectStore.getObjectIdOf(child);
    expect(childId).toBeDefined();
    expect(objectStore.getObjectOf(childId as string)).toBe(child);
  });

  it('should ignore if non-object value is given', () => {
    const value = 1;
    objectStore.storeObject(value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parentId = objectStore.getObjectIdOf(value as any);
    expect(parentId).toBe(undefined);
  });
});
