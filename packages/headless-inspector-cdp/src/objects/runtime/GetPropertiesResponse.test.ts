import { GetPropertiesResponse } from './GetPropertiesResponse';

describe('GetPropertiesResponse', () => {
  it('should have appropriate properties', () => {
    const o1 = { key: 111 };
    const o2 = { a: '1', b: o1 };
    const getId = jest.fn().mockImplementation(() => 'id');
    const res = new GetPropertiesResponse(o2, getId);
    expect(JSON.stringify(res)).toBe(
      '{"result":[{"value":{"type":"string","value":"1"},"name":"a","enumerable":true,"configurable":true,"writable":true},{"value":{"type":"object","objectId":"id","className":"Object","description":"Object","preview":{"overflow":false,"properties":[{"name":"key","type":"number","value":"111"}],"type":"object","description":"Object"}},"name":"b","enumerable":true,"configurable":true,"writable":true}]}'
    );
  });
});
