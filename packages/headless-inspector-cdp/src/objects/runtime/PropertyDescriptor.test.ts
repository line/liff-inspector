import { PropertyDescriptor } from './PropertyDescriptor';

describe('PropertyDescriptor', () => {
  it('should have appropriate properties', () => {
    expect(
      JSON.stringify(
        new PropertyDescriptor('valuestr', undefined, {
          name: 'name',
          enumerable: true,
          configurable: true,
          writable: true,
        })
      )
    ).toBe(
      '{"value":{"type":"string","value":"valuestr"},"name":"name","enumerable":true,"configurable":true,"writable":true}'
    );
  });
});
