import { getAttributes } from './Node';

describe('getAttributes', () => {
  it('should be return string array which constains attribute key and value', () => {
    {
      const div = document.createElement('div');
      expect(getAttributes(div)).toStrictEqual([]);
    }
    {
      const div = document.createElement('div');
      div.setAttribute('k1', 'v1');
      expect(getAttributes(div)).toStrictEqual(['k1', 'v1']);
    }
    {
      const div = document.createElement('div');
      div.setAttribute('k1', 'v1');
      div.setAttribute('k2', 'v2');
      expect(getAttributes(div)).toStrictEqual(['k1', 'v1', 'k2', 'v2']);
    }
  });
});
