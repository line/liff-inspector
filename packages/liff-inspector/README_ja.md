<div align="center">
  <h1>LIFF Inspector 🔬</h1>
  <strong>The universal DevTools for LIFF (WebView) browser</strong>
</div>
<br>

LIFF Inspector は LIFF(LNE Frontend Framework)専用の公式 DevTools です。LIFF Inspector は ChromeDevTools Protocol に準拠し、最新の ChromeDevTools と連携しています。

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

📱 デバッグが無効化された LIFF Browser、WebView をデバッグできます

🌍 リモートデバッグ機能

🔬 ChromeDevTools の `Elements`,`Console`,`NetWork` タブをサポート

## Getting Started

LIFF Inspector は２つのコンポーネントから構成されています。

- LIFF Inspector Server
- LIFF Inspector Plugin

LIFF Inspector Server は LIFF アプリと ChromeDevTools の通信を中継するサーバーです。
LIFF Inspector Plugin は [LIFF Plugin](https://developers.line.biz/en/docs/liff/liff-plugin/) です。 LIFF Plugin は LIFF SDK v2.19.0 以降から利用可能です。

### 1. LIFF Inspector Server を起動する

```sh
$ npx @line/liff-inspector
Debugger listening on ws://{IP Address}:9222
```

### 2. LIFF Inspector Plugin を LIFF アプリにインストールする

```sh
$ npm install @line/liff-inspector
```

```ts
import liff from '@line/liff';
import LIFFInspectorPlugin from '@line/liff-inspector';

liff.use(new LIFFInspectorPlugin());
```

### 3. LIFF App と LIFF Inspector Server を接続する

LIFF Inspector Plugin は、実際の `liff.init` が動作する前に、LIFF Inspector Server に接続を試みます。
そして接続が成功し、 `liff.init` が完了すると、LIFF Inspector を使ったデバッグが可能となります。

```ts
liff.init({ liffId: 'liff-xxxx' }).then(() => {
  // LIFF Inspector has been enabled
});
```

## 重要: LIFF Inspector Server は SSL/TLS で暗号化される必要があります

LIFF Inspector Server はデフォルト設定ではローカルサーバー `ws://localhost:9222` を立ち上げます。そしてデバッグ対象の LIFF アプリは HTTPS (`https://liff.line.me/xxx-yyy`) でホストされています。
これは LIFF Inspector Plugin が `https://` から `ws://` へ接続を試みることを意味し、[mixed content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content) となりこの接続はブロックされてしまいます。

Mixed content の問題を解消するために、LIFF Inspector Server は HTTPS (`wss://`) でホストされる必要があります。これを達成するために、以下の２つの方法をおすすめします。

### HTTPS で LIFF Inspector Server を起動する

1. [ngrok](https://ngrok.com/) を使い LIFF Inspector Server を外部公開する
   1. ngrok を実行
      ```sh
      $ ngrok http 9222
      ```
   2. 発行された `xxx-xx-xx-xx.ngrok.io` 形式の URL をコピーする
      ```sh
      $ node -e "const res=$(curl -s -sS http://127.0.0.1:4040/api/tunnels); const url=new URL(res.tunnels[0].public_url); console.log('wss://'+url.host);"
      wss://xxxx-xxx-xxx.ngrok   # Copy this url
      ```
2. [mkcert](https://github.com/FiloSottile/mkcert) を使い LIFF Inspector Sever を HTTPS 化する
   - [How to use HTTPS for local development - web.dev](https://web.dev/how-to-use-local-https/) を参照してください。

### HTTPS 化された URL を LIFF Inspector Plugin に設定する

LIFF Inspector Server が HTTPS 化された後、その URL を LIFF Inspector Plugin に設定する必要があります。

1. コールバック URL の URL サーチクエリに `?li.origin=` を追加する

   [LINE Developers Console](https://developers.line.biz/console) から以下のようにコールバック URL の末尾に`?li.origin=`を追加し、LIFF Inspector Server の URL を設定します

   ![image](https://user-images.githubusercontent.com/22386678/164425138-43c5bdcb-01b9-4107-9b8a-cc86cb65015f.png)

2. LIFF Inspector Plugin の `origin` 設定を使う

   ```ts
   // Default origin: ws://localhost:9222
   liff.use(new LIFFInspectorPlugin({ origin: 'wss://xxx-xx-xx-xx.ngrok.io' }));
   ```

### 優先順位

LIFF Inspector Plugin `li.origin`クエリ (1)、 `origin` 設定 (2)の優先順位で URL を使用します。

(疑似コード)

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
