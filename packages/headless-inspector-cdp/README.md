# headless-inspector-cdp

```ts
import HeadlessInspectorCdp from '@line/headless-inspector-cdp';

const inspector = new HeadlessInspectorCdp();
inspector.on('Runtime.consoleAPICalled', (params) => {
  // params.args: ["hoge"]
  // params.type: "log"
});
inspector.enable();

console.log('hoge');
```
