import { InspectorEventEmitter, NetworkRequest } from '../../types';
import { randomId } from './util';

const pendingRequests: Map<string, NetworkRequest> = new Map();

const hiRequestId = Symbol('__hiRequestId');
type ExtendedXMLHttpRequest = XMLHttpRequest & {
  [hiRequestId]: string | undefined;
};

export const createXHRHandler = (
  emitter: InspectorEventEmitter
): {
  construct: ProxyHandler<XMLHttpRequest>;
  open: ProxyHandler<XMLHttpRequest['open']>;
  send: ProxyHandler<XMLHttpRequest['send']>;
} => {
  const construct: ProxyHandler<XMLHttpRequest> = {
    construct: (target, argArray, newTarget) => {
      const requestId = randomId();
      newTarget.prototype[hiRequestId] = requestId;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Reflect.construct(target as any, argArray, newTarget);
    },
  };

  const open: ProxyHandler<XMLHttpRequest['open']> = {
    apply: (
      target,
      thisArg: ExtendedXMLHttpRequest,
      argumentsList: Parameters<XMLHttpRequest['open']>
    ) => {
      const requestId = thisArg[hiRequestId];
      if (!requestId) return Reflect.apply(target, thisArg, argumentsList);
      const [method, urlObj] = argumentsList;
      const url = urlObj.toString();
      // TODO: create headers
      const reqHeaders = {};
      pendingRequests.set(requestId, { method, url, headers: reqHeaders });
      Reflect.apply(target, thisArg, argumentsList);
    },
  };

  const send: ProxyHandler<XMLHttpRequest['send']> = {
    apply: (
      target,
      thisArg: ExtendedXMLHttpRequest,
      argumentsList: Parameters<XMLHttpRequest['send']>
    ) => {
      const requestId = thisArg[hiRequestId];
      if (!requestId) return Reflect.apply(target, thisArg, argumentsList);
      const timestamp = Date.now();
      const request = pendingRequests.get(requestId);
      if (!request) return Reflect.apply(target, thisArg, argumentsList);
      emitter.emit('networkRequestHasBeenMade', {
        type: 'xhr',
        timestamp,
        requestId,
        request,
      });

      const onReadyStateChange = () => {
        switch (thisArg.readyState) {
          case XMLHttpRequest.DONE: {
            const end = Date.now();
            const headerString = thisArg.getAllResponseHeaders();
            const headers = headerString.split('\n').reduce((prev, cur) => {
              const [key, value] = cur.split(': ');
              return { ...prev, [key]: value };
            }, {});
            emitter.emit('networkRequestHasSucceeded', {
              type: 'xhr',
              timestamp: end,
              requestId,
              response: {
                url: request.url,
                statusCode: thisArg.status,
                status: thisArg.statusText,
                headers,
                rawData: thisArg.response,
                text: thisArg.response,
              },
            });
            break;
          }
          default:
            break;
        }
      };

      thisArg.onreadystatechange = thisArg.onreadystatechange
        ? new Proxy(thisArg.onreadystatechange, {
            apply: (target, thisArg, argumentsList) => {
              onReadyStateChange();
              return Reflect.apply(target, thisArg, argumentsList);
            },
          })
        : onReadyStateChange;

      return Reflect.apply(target, thisArg, argumentsList);
    },
  };

  return { construct, open, send };
};
