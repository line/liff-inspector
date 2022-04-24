<div align="center">
  <h1>LIFF Inspector 🔬</h1>
  <strong>The universal DevTools for LIFF (WebView) browser</strong>
</div>
<br>

LIFF Inspector is the official DevTools for LIFF(LNE Frontend Framework) that is integrated with the latest ChromeDevTools and built on top of the ChromeDevTools Protocol.

| LIFF browser                                                                                                    | ChromeDevTools                                                                                                  |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| ![image](https://user-images.githubusercontent.com/22386678/164411108-526320d6-75f3-42a7-93a1-737c3deb23ff.png) | ![image](https://user-images.githubusercontent.com/22386678/164409862-ed739dec-fe6a-4ecc-98af-fc433c5ba5d1.png) |

<br>

---

<br>

[日本語版](./README_ja.md)

## TOC

- [Features](#features)
- [Getting Started](#getting-started)
- [Example](#example)
- [Roadmap](#roadmap)
- [Contribution](#contribution)

## Features

📱 Enable debugging LIFF Browser and WebView with debugging options disabled

🌍 Remote debug

🔬 Support `Elements`, `Console` and `NetWork` tabs of ChromeDevTools

## Getting Started

LIFF Inspector consists of two components:

- LIFF Inspector Server
- LIFF Inspector Plugin

LIFF Inspector Server is a server program that mediates communication between LIFF app and ChromeDevTools.
LIFF Inspector Plugin is a [LIFF Plugin](https://developers.line.biz/en/docs/liff/liff-plugin/). LIFF Plugin is available in LIFF SDK v2.19.0 or later.

### 1. Start LIFF Inspector Server

```sh
$ npx @line/liff-inspector
Debugger listening on ws://{IP Address}:9222
```

### 2. Install LIFF Inspector Plugin to your LIFF App

```sh
$ npm install @line/liff-inspector
```

```ts
import liff from '@line/liff';
import LIFFInspectorPlugin from '@line/liff-inspector';

liff.use(new LIFFInspectorPlugin());
```

### 3. Connect LIFF App and LIFF Inspector Server

Before the actual `liff.init` process, LIFF Inspector Plugin will try to connect LIFF Inspector Server.
Debugging with LIFF Inspector is available immediately after `liff.init` call.

```ts
liff.init({ liffId: 'liff-xxxx' }).then(() => {
  // LIFF Inspector has been enabled
});
```

## Important: LIFF Inspector Server need to be served over SSL/TLS

By default, LIFF Inspector Server starts a local server on `ws://localhost:9222`, and your LIFF App is served over HTTPS (`https://liff.line.me/xxx-yyy`). LIFF Inspector Plugin will try to connect to `ws://localhost:9222` from `https://liff.line.me/xxx-yyy` but this will fail due to [mixed content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content).

To eliminate mixed content, you need to serve LIFF Inspector Server over HTTPS (`wss://`). We have two recommended ways:

### Serve local server over HTTPS

1. Using [ngrok](https://ngrok.com/) to make LIFF Inspector Server public
   1. Run ngrok
      ```sh
      $ ngrok http 9222
      ```
   2. Copy the published URL
      ```sh
      $ node -e "const res=$(curl -s -sS http://127.0.0.1:4040/api/tunnels); const url=new URL(res.tunnels[0].public_url); console.log('wss://'+url.host);"
      wss://xxxx-xxx-xxx.ngrok   # Copy this url
      ```
2. Running LIFF Inspector Server with HTTPS using mkcert
   - See the detail explanation: [How to use HTTPS for local development - web.dev](https://web.dev/how-to-use-local-https/)

### Set HTTPS URL to LIFF Inspector Plugin

Once LIFF Inspector Server runs over HTTPS, you need to specify its origin to LIFF Inspector Plugin.

1. Use URL Search Parameter: `?li.origin=`

   Add `?li.origin=` query to the Endpoint URL of your LIFF App in [LINE Developers Console](https://developers.line.biz/console).

   ![image](https://user-images.githubusercontent.com/22386678/164425138-43c5bdcb-01b9-4107-9b8a-cc86cb65015f.png)

2. Use `origin` config of LIFF Inspector Plugin

   ```ts
   // Default origin: ws://localhost:9222
   liff.use(new LIFFInspectorPlugin({ origin: 'wss://xxx-xx-xx-xx.ngrok.io' }));
   ```

### Priority

LIFF Inspector Plugin attempts to connect to given origin in the order `li.origin` (1), `origin` config (2).

(Pseudo code)

```ts
const originFromURL = new URLSearchParams(search).get('li.origin');
const originFromConfig = config.origin;
const defaultOrigin = 'ws://localhost:9222';
connect(originFromURL ?? originFromConfig ?? defaultOrigin);
```

## Example

See https://github.com/cola119/liff-inspector-example

## Roadmap

**Contributions Welcome!**

### Elements Tab

- [x] To display Elements
- [x] To display overlays
- [ ] To remove/add/edit Elements
- [ ] To display styles

### Console Tab

- To display console logs
  - [x] `console.log`
  - [x] `console.warn`
  - [x] `console.error`
  - [x] `console.info`
  - [ ] others
- [ ] To execute local scripts

### Network Tab

- To display simple network logs
  - Fetch/XHR
    - [x] `fetch()`
    - [x] `XMLHttpRequest`
    - [ ] `sendBeacon()`
    - [ ] others
  - Others(JS/CSS/Img/Media/Font...)
    - Technically difficult to intercept them...

### Application Tab

- [ ] LocalStorage
- [ ] SessionStorage
- [ ] Cookies
- [ ] others

## Contribution

See [CONTRIBUTING.md](../../CONTRIBUTING.md)
