/* eslint-disable no-class-assign */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { evemitter } from '../../evemitter';
import { DebugEventMap } from '../../types';
import { createXHRHandler } from './xhr';

class XHR {
  readyState = 0;
  getAllResponseHeaders() {
    return 'k1: v1\nk2: v2';
  }

  open(...args: Parameters<XMLHttpRequest['open']>) {}

  onreadystatechange() {}

  send(...args: Parameters<XMLHttpRequest['send']>) {
    const timer = setInterval(() => {
      if (this.readyState === 4) {
        clearInterval(timer);
        this.readyState = 0;
        return;
      }
      this.readyState++;
      this.onreadystatechange();
    }, 100);
  }
}
describe('createXHRHandler', () => {
  it('should emit networkRequestHasBeenMade and networkRequestHasSucceeded events', async () => {
    const emitter = evemitter<DebugEventMap>();
    emitter.on(
      'networkRequestHasBeenMade',
      ({ timestamp, requestId, request }) => {
        expect(request.method).toBe('GET');
        expect(request.url).toBe('https://hoge.example');
        expect(timestamp).toBeDefined();
        expect(requestId).toBeDefined();
      }
    );
    emitter.on(
      'networkRequestHasSucceeded',
      ({ timestamp, requestId, response }) => {
        expect(response.headers).toStrictEqual({ k1: 'v1', k2: 'v2' });
        expect(timestamp).toBeDefined();
        expect(requestId).toBeDefined();
      }
    );

    const h = createXHRHandler(emitter);
    XHR.prototype.open = new Proxy(XHR.prototype.open, h.open);
    XHR.prototype.send = new Proxy(XHR.prototype.send, h.send);
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    XHR = new Proxy(XHR, h.construct as any);
    const client = new XHR();
    client.open('GET', 'https://hoge.example', true);
    client.send();
    await new Promise<void>((resolve) => {
      setInterval(() => {
        if (client.readyState === 4) {
          resolve();
        }
      }, 100);
    });
  });
});
