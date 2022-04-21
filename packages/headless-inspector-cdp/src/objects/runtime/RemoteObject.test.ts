import { RemoteObject } from './RemoteObject';

describe('RemoteObject', () => {
  it('should have appropriate properties', () => {
    expect(JSON.stringify(new RemoteObject('str'))).toBe(
      '{"type":"string","value":"str"}'
    );
    expect(JSON.stringify(new RemoteObject(11))).toBe(
      '{"type":"number","value":11,"description":"11"}'
    );
    expect(JSON.stringify(new RemoteObject(true))).toBe(
      '{"type":"boolean","value":true}'
    );
    expect(JSON.stringify(new RemoteObject(undefined))).toBe(
      '{"type":"undefined"}'
    );
    expect(JSON.stringify(new RemoteObject(BigInt(1)))).toBe(
      '{"type":"bigint","value":"1","description":"1"}'
    );
    expect(JSON.stringify(new RemoteObject(Symbol('AAA'), 'id'))).toBe(
      '{"type":"symbol","value":"Symbol(AAA)","objectId":"id"}'
    );
    expect(
      JSON.stringify(
        new RemoteObject(() => {
          return 1;
        }, 'id')
      )
    ).toBe(
      '{"type":"function","description":"() => {\\n            return 1;\\n        }","objectId":"id","className":"Function"}'
    );
    expect(JSON.stringify(new RemoteObject(null, 'id'))).toBe(
      '{"type":"object","subtype":"null","value":null}'
    );
    expect(JSON.stringify(new RemoteObject({ a: 'true' }, 'id'))).toBe(
      '{"type":"object","objectId":"id","className":"Object","description":"Object","preview":{"overflow":false,"properties":[{"name":"a","type":"string","value":"true"}],"type":"object","description":"Object"}}'
    );
    expect(JSON.stringify(new RemoteObject([null, {}, 1], 'id'))).toBe(
      '{"type":"object","objectId":"id","className":"Array","description":"Array(3)","subtype":"array","preview":{"overflow":true,"properties":[{"name":"0","type":"object","value":"null"},{"name":"1","type":"object","value":"Object"},{"name":"2","type":"number","value":"1"}],"type":"object","subtype":"array","description":"Array(3)"}}'
    );
  });

  it('should throw an error if object id is missing', () => {
    expect(() => new RemoteObject(Symbol('AAA'))).toThrowError(
      'Symbol(AAA) should have objectId in RemoteObject'
    );
  });
});
