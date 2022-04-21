import { Inspector } from '@line/headless-inspector-core/src';

export class HeadlessInspectorClient {
  private ws?: WebSocket;
  private connected = false;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private inspector: Inspector<Record<any, any>, Record<any, any>>
  ) {
    this.inspector.onAll(this.onAllDebugEvents);
  }

  private onWsClose = (e: CloseEvent) => {
    this.connected = false;
  };
  private onWsError = (e: Event) => {
    this.connected = false;
  };
  private onWsOpen = () => {
    this.connected = true;
    this.inspector.enable();
    this.ws?.addEventListener('message', this.onMessageFromDevTools);
  };

  private onAllDebugEvents = (eventName: unknown, data: unknown) => {
    const event = {
      method: eventName,
      params: data,
    };
    this.send(event);
  };

  private onMessageFromDevTools = (msg: MessageEvent<string>): void => {
    const message = JSON.parse(msg.data);
    const result = this.inspector.send(message.method, message.params);
    const response = {
      id: message.id,
      method: message.method,
      result,
    };
    this.send(response);
  };

  private send(message: unknown) {
    const json = JSON.stringify(message);
    this.ws?.send(json);
  }

  enable(wsUrl: string) {
    if (this.connected) {
      console.log('Headless Inspector has already been enabled.');
      return;
    }
    this.ws = new WebSocket(wsUrl);
    this.ws.onclose = this.onWsClose;
    this.ws.onopen = this.onWsOpen;
    this.ws.onerror = this.onWsError;
  }
  disable() {
    this.inspector.disable();
  }
}
