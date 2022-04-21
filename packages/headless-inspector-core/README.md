# headless-inspector-core

The core implementation of Headless Inspector. The `inspector` object emits various debug events, but there is no DevTool FrontEnd.

## Debug Events

| Debug target | Event name                   | Timing                                  |
| ------------ | ---------------------------- | --------------------------------------- |
| Console      | `consoleAPIHasBeenCalled`    | When console API was called             |
| Network      | `networkRequestHasBeenMade`  | when page is about to send HTTP request |
| Network      | `networkRequestHasSucceeded` | When HTTP response is available         |
| DOM          | TBD                          | TBD                                     |

```ts
import HeadlessInspector from '@line/headless-inspector-core';

const inspector = new HeadlessInspector();
inspector.on(
  'consoleAPIHasBeenCalled',
  ({ argumentsList, type, timestamp }) => {
    // argumentsList: ["hoge"]
    // type: "log"
  }
);
inspector.enable();

console.log('hoge');
```
