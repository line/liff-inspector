class SocketPool<T> {
  devtool: Set<T> = new Set();
  client: Set<T> = new Set();

  add(key: 'devtool' | 'client', data: T) {
    this[key].add(data);
  }
  delete(key: 'devtool' | 'client', data: T) {
    this[key].delete(data);
  }
}

export class SocketMap<T> {
  private map: Map<string, SocketPool<T>> = new Map();

  set(key: string, socket: T, type: 'devtool' | 'client') {
    const pool = this.map.get(key);
    if (pool) {
      pool.add(type, socket);
      return;
    }
    const socketPool = new SocketPool<T>();
    socketPool.add(type, socket);
    this.map.set(key, socketPool);
  }
  get(key: string) {
    return this.map.get(key);
  }
  remove(key: string, socket: T, type: 'devtool' | 'client') {
    const pool = this.map.get(key);
    if (!pool) {
      return;
    }
    pool.delete(type, socket);
  }
  delete(key: string) {
    this.map.delete(key);
  }
}
