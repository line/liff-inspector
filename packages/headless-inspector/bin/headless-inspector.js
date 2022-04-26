#!/usr/bin/env node

const { getPrivateIp, runServer, parseArgv } = require('../dist/server');

const main = () => {
  const privateIp = getPrivateIp();
  const port = 9222;
  const devInfo = {
    description: 'headless-inspector',
    devtoolsFrontendUrl: `http://${privateIp}:${port}`,
    id: process.pid,
    title: process.title || 'headless inspector',
    type: 'page',
    url: '',
    webSocketDebuggerUrl: `ws://${privateIp}:${port}/headless-inspector`,
  };

  const { ssl } = parseArgv(process.argv);

  const scriptURL = `//${
    privateIp || '{your IP address}'
  }:9222/headless-inspector.js`;
  runServer({ port, devInfo, ssl }, () => {
    console.log('\x1b[36m%s\x1b[0m', `Debugger listening on ${scriptURL}`);
    console.log(`
For help, see: https://github.com/line/liff-inspector/tree/main/packages/headless-inspector#readme

`);
  });
};

main();
