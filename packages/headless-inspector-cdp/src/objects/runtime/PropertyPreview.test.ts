import { PropertyPreview } from './PropertyPreview';

describe('PropertyPreview', () => {
  it('should have appropriate properties', () => {
    expect(JSON.stringify(new PropertyPreview('name', 'str'))).toBe(
      '{"name":"name","type":"string","value":"str"}'
    );
    expect(JSON.stringify(new PropertyPreview('name', 1111))).toBe(
      '{"name":"name","type":"number","value":"1111"}'
    );
    expect(JSON.stringify(new PropertyPreview('name', true))).toBe(
      '{"name":"name","type":"boolean","value":"true"}'
    );
    expect(JSON.stringify(new PropertyPreview('name', undefined))).toBe(
      '{"name":"name","type":"undefined","value":"undefined"}'
    );
    expect(JSON.stringify(new PropertyPreview('name', BigInt(1)))).toBe(
      '{"name":"name","type":"bigint","value":"1"}'
    );
    expect(JSON.stringify(new PropertyPreview('name', Symbol('aav')))).toBe(
      '{"name":"name","type":"symbol","value":"Symbol(aav)"}'
    );
    expect(
      JSON.stringify(
        new PropertyPreview('name', () => {
          return 1;
        })
      )
    ).toBe(
      '{"name":"name","type":"function","value":"() => {\\n            return 1;\\n        }"}'
    );
    expect(
      JSON.stringify(
        new PropertyPreview('name', function () {
          const a = 1;
          return a;
        })
      )
    ).toBe(
      '{"name":"name","type":"function","value":"function () {\\n            const a = 1;\\n            return a;\\n        }"}'
    );
    expect(JSON.stringify(new PropertyPreview('name', null))).toBe(
      '{"name":"name","type":"object","value":"null"}'
    );
    expect(
      JSON.stringify(new PropertyPreview('name', [null, 1, 'str', Symbol('a')]))
    ).toBe(
      '{"name":"name","type":"object","value":"Array(4)","subtype":"array"}'
    );
    expect(JSON.stringify(new PropertyPreview('name', { a: '11' }))).toBe(
      '{"name":"name","type":"object","value":"Object"}'
    );
  });
});
