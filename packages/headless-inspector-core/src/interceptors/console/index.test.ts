import { evemitter } from '../../evemitter';
import { DebugEventMap } from '../../types';
import { consoleHandlerFactory } from '.';

describe('consoleHandlerFactory', () => {
  it('should intercept conosle api and emit consoleAPIHasBeenCalled event', () => {
    const emitter = evemitter<DebugEventMap>();
    const createHandler = consoleHandlerFactory(emitter);
    const log = new Proxy(console.log, createHandler('log'));
    emitter.on(
      'consoleAPIHasBeenCalled',
      ({ argumentsList, type, timestamp }) => {
        expect(type).toBe('log');
        expect(argumentsList).toStrictEqual(['for test', 1, 2, true]);
        expect(timestamp).toBeDefined();
      }
    );
    log('for test', 1, 2, true);
  });
});
