<div align="center">
  <h1>LIFF Inspector ð¬</h1>
  <strong>The universal DevTools for LIFF (WebView) browser</strong>
</div>
<br>

LIFF Inspector ã¯ LIFF(LNE Frontend Framework)å°ç¨ã®å¬å¼ DevTools ã§ããLIFF Inspector ã¯ ChromeDevTools Protocol ã«æºæ ããææ°ã® ChromeDevTools ã¨é£æºãã¦ãã¾ãã

| LIFF browser                                                                                                    | ChromeDevTools                                                                                                  |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| ![image](https://user-images.githubusercontent.com/22386678/164411108-526320d6-75f3-42a7-93a1-737c3deb23ff.png) | ![image](https://user-images.githubusercontent.com/22386678/164409862-ed739dec-fe6a-4ecc-98af-fc433c5ba5d1.png) |

<br>

---

<br>

[English doc](./README.md)

## TOC

- [Features](#features)
- [Getting Started](#getting-started)
- [Example](#example)
- [Roadmap](#roadmap)
- [Contribution](#contribution)

## Features

ð± ãããã°ãç¡å¹åããã LIFF BrowserãWebView ããããã°ã§ãã¾ã

ð ãªã¢ã¼ããããã°æ©è½

ð¬ ChromeDevTools ã® `Elements`,`Console`,`NetWork` ã¿ãããµãã¼ã

## Getting Started

LIFF Inspector ã¯ï¼ã¤ã®ã³ã³ãã¼ãã³ãããæ§æããã¦ãã¾ãã

- LIFF Inspector Server
- LIFF Inspector Plugin

LIFF Inspector Server ã¯ LIFF ã¢ããªã¨ ChromeDevTools ã®éä¿¡ãä¸­ç¶ãããµã¼ãã¼ã§ãã
LIFF Inspector Plugin ã¯ [LIFF Plugin](https://developers.line.biz/en/docs/liff/liff-plugin/) ã§ãã LIFF Plugin ã¯ LIFF SDK v2.19.0 ä»¥éããå©ç¨å¯è½ã§ãã

### 1. LIFF Inspector Server ãèµ·åãã

```sh
$ npx @line/liff-inspector
Debugger listening on ws://{IP Address}:9222
```

### 2. LIFF Inspector Plugin ã LIFF ã¢ããªã«ã¤ã³ã¹ãã¼ã«ãã

```sh
$ npm install @line/liff-inspector
```

```ts
import liff from '@line/liff';
import LIFFInspectorPlugin from '@line/liff-inspector';

liff.use(new LIFFInspectorPlugin());
```

### 3. LIFF App ã¨ LIFF Inspector Server ãæ¥ç¶ãã

LIFF Inspector Plugin ã¯ãå®éã® `liff.init` ãåä½ããåã«ãLIFF Inspector Server ã«æ¥ç¶ãè©¦ã¿ã¾ãã
ããã¦æ¥ç¶ãæåãã `liff.init` ãå®äºããã¨ãLIFF Inspector ãä½¿ã£ããããã°ãå¯è½ã¨ãªãã¾ãã

```ts
liff.init({ liffId: 'liff-xxxx' }).then(() => {
  // LIFF Inspector has been enabled
});
```

### 4. ChromeDevTools ãéã

`liff.init`å®äºå¾ãLIFF Inspector Server ã¯ devtools ã® URL ãã³ã³ã½ã¼ã«ã«è¡¨ç¤ºãã¾ãã

```diff
$ npx @line/liff-inspector
Debugger listening on ws://{IP Address}:9222

+ connection from client, id: xxx
+ DevTools URL: devtools://devtools/bundled/inspector.html?wss=8a6f-113-35-87-12.ngrok.io/?hi_id=xxx
```

`devtools://devtools/` ã§å§ã¾ã URL ã Google Chrome ã§éãããããã°ãéå§ãã¦ãã ããã

## éè¦: LIFF Inspector Server ã¯ SSL/TLS ã§æå·åãããå¿è¦ãããã¾ã

LIFF Inspector Server ã¯ããã©ã«ãè¨­å®ã§ã¯ã­ã¼ã«ã«ãµã¼ãã¼ `ws://localhost:9222` ãç«ã¡ä¸ãã¾ããããã¦ãããã°å¯¾è±¡ã® LIFF ã¢ããªã¯ HTTPS (`https://liff.line.me/xxx-yyy`) ã§ãã¹ãããã¦ãã¾ãã
ããã¯ LIFF Inspector Plugin ã `https://` ãã `ws://` ã¸æ¥ç¶ãè©¦ã¿ããã¨ãæå³ãã[mixed content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content) ã¨ãªããã®æ¥ç¶ã¯ãã­ãã¯ããã¦ãã¾ãã¾ãã

Mixed content ã®åé¡ãè§£æ¶ããããã«ãLIFF Inspector Server ã¯ HTTPS (`wss://`) ã§ãã¹ããããå¿è¦ãããã¾ãããããéæããããã«ãä»¥ä¸ã®ï¼ã¤ã®æ¹æ³ããããããã¾ãã

### HTTPS ã§ LIFF Inspector Server ãèµ·åãã (1 ã¾ãã¯ 2 ã®æ¹æ³)

1. [ngrok](https://ngrok.com/) ãä½¿ã LIFF Inspector Server ãå¤é¨å¬éãã
   1. ngrok ãå®è¡
      ```sh
      $ ngrok http 9222
      ```
   2. çºè¡ããã `xxx-xx-xx-xx.ngrok.io` å½¢å¼ã® URL ãã³ãã¼ãã
      ```sh
      $ node -e "const res=$(curl -s -sS http://127.0.0.1:4040/api/tunnels); const url=new URL(res.tunnels[0].public_url); console.log('wss://'+url.host);"
      wss://xxxx-xxx-xxx.ngrok   # Copy this url
      ```

Or

2. [mkcert](https://github.com/FiloSottile/mkcert) ãä½¿ã LIFF Inspector Sever ã HTTPS åãã
   - [How to use HTTPS for local development - web.dev](https://web.dev/how-to-use-local-https/) ãåç§ãã¦ãã ããã

### HTTPS åããã URL ã LIFF Inspector Plugin ã«è¨­å®ãã (1 ã¾ãã¯ 2 ã®æ¹æ³)

LIFF Inspector Server ã HTTPS åãããå¾ããã® URL ã LIFF Inspector Plugin ã«è¨­å®ããå¿è¦ãããã¾ãã

1. ã³ã¼ã«ããã¯ URL ã® URL ãµã¼ãã¯ã¨ãªã« `?li.origin=` ãè¿½å ãã

   [LINE Developers Console](https://developers.line.biz/console) ããä»¥ä¸ã®ããã«ã³ã¼ã«ããã¯ URL ã®æ«å°¾ã«`?li.origin=`ãè¿½å ããLIFF Inspector Server ã® URL ãè¨­å®ãã¾ã

   ![image](https://user-images.githubusercontent.com/22386678/164425138-43c5bdcb-01b9-4107-9b8a-cc86cb65015f.png)

Or

2. LIFF Inspector Plugin ã® `origin` è¨­å®ãä½¿ã

   ```ts
   // Default origin: ws://localhost:9222
   liff.use(new LIFFInspectorPlugin({ origin: 'wss://xxx-xx-xx-xx.ngrok.io' }));
   ```

### åªåé ä½

LIFF Inspector Plugin `li.origin`ã¯ã¨ãª (1)ã `origin` è¨­å® (2)ã®åªåé ä½ã§ URL ãä½¿ç¨ãã¾ãã

(çä¼¼ã³ã¼ã)

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

See [CONTRIBUTING.md](./CONTRIBUTING.md)
