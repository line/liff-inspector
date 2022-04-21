import { evemitter } from './evemitter';

describe('evemitter', () => {
  it('should dispatch the handler related to the given key', () => {
    const emitter = evemitter();
    emitter.on('key', (value) => {
      expect(value).toBe(true);
    });
    emitter.emit('key', true);
    emitter.emit('key2', false);
  });

  it('should dispatch the latests handler related to the given key', () => {
    const emitter = evemitter();
    emitter.on('key', (value) => {
      expect(value).toBe(true);
    });
    emitter.emit('key', true);
    emitter.on('key', (value) => {
      expect(value).toBe(false);
    });
    emitter.emit('key', false);
  });

  it('should prevent an infinit emittion', () => {
    const emitter = evemitter();
    let count = 0;
    emitter.on('key', (v) => {
      emitter.emit('key', 1);
      count++;
      emitter.emit('key', 2);
      emitter.emit('key', 3);
      expect(v).toBe(0);
      expect(count).toBe(1);
    });
    emitter.emit('key', 0);
  });

  it('should emit all events to onAll handler', () => {
    const emitter = evemitter();
    emitter.onAll((key, value) => {
      if (key === 'key1') {
        expect(key).toBe('key1');
        expect(value).toBe(1);
      } else if (key === 'key2') {
        expect(key).toBe('key2');
        expect(value).toBe(2);
      } else {
        throw new Error('unknown event');
      }
    });
    emitter.emit('key1', 1);
    emitter.emit('key1', 1);
    emitter.emit('key2', 2);
  });
});
