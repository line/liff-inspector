#!/usr/bin/env node

import {
  getPrivateIp,
  parseArgv,
  runServer,
} from '@line/headless-inspector/dist/server';

const run = () => {
  const privateIp = getPrivateIp();
  const { ssl } = parseArgv(process.argv);
  const isSsl = !!ssl && !!ssl.cert && !!ssl.key;
  const protocol = isSsl ? 'wss' : 'ws';

  const port = 9222;
  const devInfo = {
    description: 'liff-inspector',
    devtoolsFrontendUrl: `http://${privateIp}:${port}`,
    id: process.pid,
    title: process.title || 'liff inspector',
    type: 'page',
    url: '',
    webSocketDebuggerUrl: `ws://${privateIp}:${port}/liff-inspector`,
  };

  const debugUrl = `${protocol}://${privateIp ?? 'localhost'}:${port}`;

  runServer(
    {
      port,
      devInfo,
      ssl,
    },
    () => {
      console.log('\x1b[36m%s\x1b[0m', `Debugger listening on ${debugUrl}`);
      console.log(`

Add the debug URL to search query of your endpoint URL.
(ex. https://your-liff-app.com?li.origin=${debugUrl})
LINE Developers: https://developers.line.biz/console

For help, see: https://github.com/line/liff-inspector#readme

`);
    }
  );
};

run();
