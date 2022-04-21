import { LiffPlugin, LiffPluginContext } from '@line/liff';
import { HeadlessInspectorClient } from '@line/headless-inspector/dist/client';
import HeadlessInspectorCdp from '@line/headless-inspector-cdp';

export type LIFFInspectorPluginOption = {
  origin?: string;
};

const defaultOrigin = 'wss://localhost:9222/';

export const getBackendUrl = (liffId: string, origin: string) => {
  const url = `${
    origin.endsWith('/') ? origin.slice(0, -1) : origin
  }/?hi_id=${liffId}`;
  return url;
};

export const getOriginFromUrl = (search: string) => {
  return new URLSearchParams(search).get('li.origin');
};

export class LIFFInspectorPlugin implements LiffPlugin<void> {
  name = 'inspector';
  private client: HeadlessInspectorClient;

  constructor(private option?: LIFFInspectorPluginOption) {
    this.client = new HeadlessInspectorClient(new HeadlessInspectorCdp());
  }

  private connect(url: string) {
    this.client.enable(url);
  }

  install({ liff }: LiffPluginContext) {
    liff.init = new Proxy(liff.init, {
      apply: (target, thisArg, argArray) => {
        const origin =
          getOriginFromUrl(window.location.search) ??
          this.option?.origin ??
          defaultOrigin;
        const config = argArray[0] as { liffId: string };
        const backendUrl = getBackendUrl(config.liffId, origin);
        try {
          this.connect(backendUrl);
        } catch (e) {
          console.error(
            "[LIFF Inspector] LIFF inspector couldn't start correctly.",
            e
          );
        }
        return Reflect.apply(target, thisArg, argArray);
      },
    });
    return;
  }
}

export default LIFFInspectorPlugin;
