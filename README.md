# LIFF Inspector

The universal DevTools for LIFF (WebView) browser

## Remote debug LIFF browser

See [liff-inspector/README.md](./packages/liff-inspector/README.md)

#### DEMO

1. run liff inspector server locally

```sh
# Strongly recommend to enable ssl because of mixed content blocking
$  npx @line/liff-inspector@latest --cert=./path/to/cert --key=./path/to/key

# https://liff.line-beta.me can't connect to http servers
$  npx @line/liff-inspector@latest
```

2. Open debug target: https://liff.line-beta.me/1651840193-lMEVYKE7
3. Open DevTools: `devtools://devtools/bundled/inspector.html?wss=localhost:9222/?hi_id=1651840193-lMEVYKE7`
4. Click `liff.init` button

## Remote debug WebView

See [headless-inspector/README.md](./packages/headless-inspector/README.md)

#### DEMO

1. run headless inspector sever locally

```sh
$  npx @line/headless-inspector@latest
```

2. Open debug target: https://headless-inspector-example.website.line-apps-dev.com/headless-inspector/index.html
3. Open DevTools: `devtools://devtools/bundled/inspector.html?ws=localhost:9222/?hi_id={**hi_id**}` (This URL is logged by your local server. Please see the shell output)

## Contribution

See [CONTRIBUTING.md](./CONTRIBUTING.md)
