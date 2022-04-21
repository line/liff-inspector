import { InspectorEventEmitter } from '../../types';
import { randomId } from './util';

export const createFetchApiHandler = (
  emitter: InspectorEventEmitter
): ProxyHandler<Window['fetch']> => {
  return {
    apply: async (
      target,
      thisArg,
      argumentsList: Parameters<Window['fetch']>
    ) => {
      const requestId = randomId();
      const start = Date.now();

      const input = argumentsList[0];
      const init = argumentsList[1];
      const url = typeof input === 'string' ? input : input.url;
      const method = typeof input === 'string' ? init?.method : input.method;
      // TODO: create headers
      // const _reqHeaders =
      //   typeof input === 'string' ? init?.headers : input.headers;
      const reqHeaders = {};
      emitter.emit('networkRequestHasBeenMade', {
        type: 'fetch',
        requestId,
        timestamp: start,
        request: {
          method: method ?? 'GET',
          headers: reqHeaders,
          url,
        },
      });
      const originalResponse = await (Reflect.apply(
        target,
        thisArg,
        argumentsList
      ) as ReturnType<Window['fetch']>);
      const response = originalResponse.clone();
      const end = Date.now();
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      const text = await response.text();
      emitter.emit('networkRequestHasSucceeded', {
        type: 'fetch',
        requestId,
        timestamp: end,
        response: {
          url,
          status: response.statusText,
          statusCode: response.status,
          headers,
          rawData: response,
          text,
        },
      });
      return originalResponse;
    },
  };
};
