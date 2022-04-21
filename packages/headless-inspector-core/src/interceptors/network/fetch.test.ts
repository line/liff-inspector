import { evemitter } from '../../evemitter';
import { DebugEventMap } from '../../types';
import { createFetchApiHandler } from './fetch';

const mockResponse = {
  statusText: 'statusText',
  status: 200,
  text: () => Promise.resolve('texttext'),
  headers: new Headers({ h1: 'v1', h2: 'v2' }),
} as Response;

const mockFetch: Window['fetch'] = () => {
  const response = {
    ...mockResponse,
    clone: () => {
      return mockResponse;
    },
  } as Response;
  return Promise.resolve<Response>(response);
};

describe('createFetchApiHandler', () => {
  it('should intercept fetch api and emit networkRequestHasBeenMade and networkRequestHasSucceeded event', async () => {
    const emitter = evemitter<DebugEventMap>();
    const fetch = new Proxy(mockFetch, createFetchApiHandler(emitter));
    emitter.on(
      'networkRequestHasBeenMade',
      ({ requestId, timestamp, request }) => {
        expect(request.method).toBe('GET');
        expect(request.url).toBe('http://hoge.example');
        expect(requestId).toBeDefined();
        expect(timestamp).toBeDefined();
      }
    );
    emitter.on(
      'networkRequestHasSucceeded',
      ({ response, requestId, timestamp }) => {
        expect(response.status).toBe('statusText');
        expect(response.statusCode).toBe(200);
        expect(response.headers).toStrictEqual({ h1: 'v1', h2: 'v2' });
        expect(response.text).toStrictEqual('texttext');
        expect(response.rawData).toStrictEqual(mockResponse);
        expect(requestId).toBeDefined();
        expect(timestamp).toBeDefined();
      }
    );
    await fetch('http://hoge.example');
  });
});
