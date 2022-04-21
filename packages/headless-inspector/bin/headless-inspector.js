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

  runServer({ port, devInfo, ssl }, () => {
    console.log(
      `### Headless Inspector ###
Please add <script src="//${
        privateIp || '{your IP address}'
      }:9222/headless-inspector.js"></script> to the debug target application.`
    );
  });
};

main();
