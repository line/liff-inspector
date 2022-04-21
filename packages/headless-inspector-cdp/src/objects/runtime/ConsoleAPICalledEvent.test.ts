import { ConsoleAPICalledEvent } from './ConsoleAPICalledEvent';

describe('ConsoleAPICalledEvent', () => {
  it('should have appropriate properties and call getObjectId', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getObjectId = jest.fn().mockImplementation(() => 'id');
    const obj = { a: 'v' };
    const params = new ConsoleAPICalledEvent(
      { type: 'log', argumentsList: ['a', 1, obj], timestamp: 100 },
      1,
      getObjectId
    );
    expect(JSON.stringify(params)).toBe(
      '{"args":[{"type":"string","value":"a"},{"type":"number","value":1,"description":"1"},{"type":"object","objectId":"id","className":"Object","description":"Object","preview":{"overflow":false,"properties":[{"name":"a","type":"string","value":"v"}],"type":"object","description":"Object"}}],"type":"log","timestamp":100,"executionContextId":1}'
    );
    expect(getObjectId).toBeCalledWith(obj);
    expect(getObjectId).toBeCalledTimes(1);
  });
});
