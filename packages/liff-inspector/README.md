# LIFF Inspector

LIFF Inspector is a LIFF Plugin that enable you to debug your liff app with Chrome DevTools.

## Server

First, start a local proxy server `http(s)://{your_private_ip}:9222/`

```sh
# serve https://
$ npx @line/liff-inspector --https
$ npx @line/liff-inspector --key=path/to/key.pem --cert=/path/to/cert.pem
# serve http://
$ npx @line/liff-inspector
```

## LIFF App (client)

```sh
$ npm install @line/liff-inspector
```

```ts
import liff from '@line/liff';
import LIFFInspectorPlugin from '@line/liff-inspector';

liff.use(new LIFFInspectorPlugin()); // default origin: wss://localhost:9222/
liff.use(new LIFFInspectorPlugin({ origin: 'wss://your-ws-server.com/' }));

liff
  .init({
    liffId: 'liff-xxxx',
  })
  .then(() => {
    // LIFF Inspector has been enabled
    // open: devtools://devtools/bundled/inspector.html?wss=localhost:9222/?hi_id=liff-xxx
  });
```

After `liff.init()`, you can open Chrome DevTools UI.

devtools://devtools/bundled/inspector.html?wss=localhost:9222/?hi_id={**your_LIFF_id**}
