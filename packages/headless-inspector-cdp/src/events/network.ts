import { RequestWillBeSentEvent } from '../objects/network/RequestWillBeSentEvent';
import { ResponseReceivedEvent } from '../objects/network/ResponseReceivedEvent';
import { Store } from '../store/Store';
import { CdpConverter } from '../types';

const store = new Store<string, string>();

export const attachNetworkEvents: CdpConverter = (
  inspector,
  eventEmitter,
  setCommandHandler
) => {
  inspector.on(
    'networkRequestHasBeenMade',
    ({ type, request, requestId, timestamp }) => {
      const params = new RequestWillBeSentEvent({
        requestId,
        documentURL: window.location.href, // FIXME: remove the reference to the window object
        request: {
          url: request.url,
          method: request.method,
          headers: request.headers,
        },
        timestamp,
        type: type === 'fetch' ? 'Fetch' : 'XHR',
      });
      eventEmitter.emit('Network.requestWillBeSent', params);
    }
  );

  inspector.on(
    'networkRequestHasSucceeded',
    ({ response, requestId, timestamp, type }) => {
      store.store(requestId, response.text);
      const textLength = response.text.length;
      const responseReceived = new ResponseReceivedEvent({
        requestId,
        loaderId: requestId,
        timestamp,
        type: type === 'fetch' ? 'Fetch' : 'XHR',
        response: {
          url: response.url,
          statusText: response.status,
          status: response.statusCode,
          headers: response.headers,
          length: textLength,
        },
      });
      eventEmitter.emit('Network.responseReceived', responseReceived);
      eventEmitter.emit('Network.dataReceived', {
        requestId,
        dataLength: textLength,
        encodedDataLength: textLength,
        timestamp,
      });
      eventEmitter.emit('Network.loadingFinished', {
        requestId,
        encodedDataLength: textLength,
        timestamp,
      });
    }
  );

  setCommandHandler('Network.getResponseBody', ({ requestId }) => {
    const response = store.getById(requestId);
    if (typeof response === 'undefined') return;
    const isBase64 =
      /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(
        response
      );
    return {
      body: response,
      base64Encoded: isBase64,
    };
  });
};
