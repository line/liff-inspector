import HeadlessInspectorCdp from '@line/headless-inspector-cdp';
import { HeadlessInspectorClient } from './client';

const INSPECTORS = {
  cdp: HeadlessInspectorCdp,
};

const createHiSearchQuery = (id: string) => {
  const search = new URLSearchParams();
  search.set('hi_id', id);
  return `?${search.toString()}`;
};

const getWsServerUrl = (id: string) => {
  const scripts = document.getElementsByTagName('script');
  const script = [...scripts].find((s) =>
    /^.*\/headless-inspector.js$/.test(s.src)
  );
  if (!script) {
    throw new Error('headless-inspector.js is missing');
  }
  const src = new URL(script.src);
  const serverUrl = `${src.protocol === 'http:' ? 'ws' : 'wss'}://${
    src.host
  }/${createHiSearchQuery(id)}`;
  return serverUrl;
};

const randomId = (): string => Math.random().toString(36).substr(2, 9);
const getHiIdFromStorage = () => {
  const id = localStorage.getItem('hi_id');
  return id;
};
const saveHiIdToStorage = (id: string) => {
  localStorage.setItem('hi_id', id);
};

const main = async () => {
  try {
    const hiId = new URLSearchParams(window.location.search).get('hi_id');
    const id = hiId || getHiIdFromStorage() || randomId();
    saveHiIdToStorage(id);
    const serverUrl = getWsServerUrl(id);
    const client = new HeadlessInspectorClient(new INSPECTORS.cdp());
    client.enable(serverUrl);
    const url = new URL(serverUrl);
    console.log('Headless Inspector has been enabled');
    console.log(
      `open: devtools://devtools/bundled/inspector.html?${url.protocol.slice(
        0,
        -1
      )}=${url.host}/${createHiSearchQuery(id)}`
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('[Headless Inspector] error: ', e.message);
  }
};

window.addEventListener('load', () => {
  main();
});
