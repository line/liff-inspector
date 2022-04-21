import { getBackendUrl } from './index';

describe('getBackendUrl', () => {
  it('should return websocket backend URL', () => {
    expect(getBackendUrl('liff-xxx', 'wss://example.com')).toBe(
      'wss://example.com/?hi_id=liff-xxx'
    );
    expect(getBackendUrl('liff-xxx', 'wss://example.com/')).toBe(
      'wss://example.com/?hi_id=liff-xxx'
    );
  });
});
