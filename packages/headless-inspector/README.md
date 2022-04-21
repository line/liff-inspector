# headless-inspector

<!-- deployできるような仕組み -->

First, start a local proxy server

```sh
# serve https://
$ npx @line/headless-inspector --https
$ npx @line/headless-inspector --key=path/to/key.pem --cert=/path/to/cert.pem
# serve http://
$ npx @line/headless-inspector
```

And then, add the following script tag to the debug target html file.

```html
<script src="//{your private ip address}:9222/headless-inspector.js"></script>
```

Your website automatically connects to the local server and send debug information.
Each connection has an unique `hi_id` id. The local server logs the id and devtools URL when the connection from your website is established.

```
connection from client, id: {__some_hi_id__}
devtools://devtools/bundled/inspector.html?wss=localhost:9222/?hi_id={__some_hi_id__}
```
