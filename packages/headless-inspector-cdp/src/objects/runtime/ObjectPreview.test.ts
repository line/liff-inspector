import { ObjectPreview } from './ObjectPreview';

describe('ObjectPreview', () => {
  it('should have appropriate properties', () => {
    expect(JSON.stringify(new ObjectPreview(['aa'], false))).toBe(
      '{"overflow":false,"properties":[{"name":"0","type":"string","value":"aa"}],"type":"object","subtype":"array","description":"Array(1)"}'
    );
    expect(JSON.stringify(new ObjectPreview([{}], true))).toBe(
      '{"overflow":true,"properties":[{"name":"0","type":"object","value":"Object"}],"type":"object","subtype":"array","description":"Array(1)"}'
    );
    expect(JSON.stringify(new ObjectPreview({}, false))).toBe(
      '{"overflow":false,"properties":[],"type":"object","description":"Object"}'
    );
    expect(JSON.stringify(new ObjectPreview({ a: true }, false))).toBe(
      '{"overflow":false,"properties":[{"name":"a","type":"boolean","value":"true"}],"type":"object","description":"Object"}'
    );
    expect(
      JSON.stringify(
        new ObjectPreview({ a: true, b: { c: 11, d: new Map() } }, false)
      )
    ).toBe(
      '{"overflow":false,"properties":[{"name":"a","type":"boolean","value":"true"},{"name":"b","type":"object","value":"Object"}],"type":"object","description":"Object"}'
    );
  });

  it('should throw an error if a primitive value is given', () => {
    expect(() => new ObjectPreview(1, true)).toThrowError(
      'ObjectPreview accepts object type only. given 1'
    );
    expect(() => new ObjectPreview('a', true)).toThrowError(
      'ObjectPreview accepts object type only. given a'
    );
  });
});
