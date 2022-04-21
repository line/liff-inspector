import { SocketMap } from './SocketMap';

describe('SocketMap', () => {
  it('should not have any data at first', () => {
    const socketMap = new SocketMap();
    expect(socketMap.get('/')).toBe(undefined);
  });

  it('should set data according to key and type', () => {
    const socketMap = new SocketMap<number>();
    const key1 = '/';
    const key2 = '/hoge';
    socketMap.set(key1, 1, 'client');
    expect(socketMap.get(key1)?.client).toStrictEqual(new Set([1]));
    expect(socketMap.get(key1)?.devtool).toStrictEqual(new Set());
    expect(socketMap.get(key2)).toStrictEqual(undefined);
    socketMap.set(key1, 1, 'devtool');
    expect(socketMap.get(key1)?.client).toStrictEqual(new Set([1]));
    expect(socketMap.get(key1)?.devtool).toStrictEqual(new Set([1]));
    expect(socketMap.get(key2)).toStrictEqual(undefined);
    socketMap.set(key2, 1, 'client');
    expect(socketMap.get(key1)?.client).toStrictEqual(new Set([1]));
    expect(socketMap.get(key1)?.devtool).toStrictEqual(new Set([1]));
    expect(socketMap.get(key2)?.client).toStrictEqual(new Set([1]));
    expect(socketMap.get(key2)?.devtool).toStrictEqual(new Set());
    socketMap.set(key2, 1, 'devtool');
    expect(socketMap.get(key1)?.client).toStrictEqual(new Set([1]));
    expect(socketMap.get(key1)?.devtool).toStrictEqual(new Set([1]));
    expect(socketMap.get(key2)?.client).toStrictEqual(new Set([1]));
    expect(socketMap.get(key2)?.devtool).toStrictEqual(new Set([1]));
  });

  it('should remove data according to key and type', () => {
    const socketMap = new SocketMap<number>();
    const key = '/';
    socketMap.set(key, 1, 'client');
    expect(socketMap.get(key)?.client).toStrictEqual(new Set([1]));
    expect(socketMap.get(key)?.devtool).toStrictEqual(new Set());
    socketMap.set(key, 2, 'client');
    expect(socketMap.get(key)?.client).toStrictEqual(new Set([1, 2]));
    expect(socketMap.get(key)?.devtool).toStrictEqual(new Set());
    socketMap.remove(key, 1, 'client');
    expect(socketMap.get(key)?.client).toStrictEqual(new Set([2]));
    expect(socketMap.get(key)?.devtool).toStrictEqual(new Set());
    socketMap.remove(key, 2, 'client');
    expect(socketMap.get(key)?.client).toStrictEqual(new Set());
    expect(socketMap.get(key)?.devtool).toStrictEqual(new Set());
  });

  it('should delete data according to key', () => {
    const socketMap = new SocketMap<number>();
    const key = '/';
    socketMap.set(key, 1, 'client');
    expect(socketMap.get(key)?.client).toStrictEqual(new Set([1]));
    expect(socketMap.get(key)?.devtool).toStrictEqual(new Set());
    socketMap.delete(key);
    expect(socketMap.get(key)).toStrictEqual(undefined);
  });
});
