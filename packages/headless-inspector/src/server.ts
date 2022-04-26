import express, { Express } from 'express';
import http from 'http';
import https from 'https';
import ws from 'ws';
import path from 'path';
import os from 'os';
import { SocketMap } from './SocketMap';
import yargs from 'yargs/yargs';
import fs from 'fs';
import util from 'util';
const debuglog = util.debuglog('debug');
const log = console.log;

type Options = {
  port: number;
  devInfo?: unknown;
  ssl?: {
    cert?: string | Buffer;
    key?: string | Buffer;
  };
};

export const getPrivateIp = () => {
  const ifaces = os.networkInterfaces();
  const ipAddress = Object.values(ifaces)
    .flat()
    .find(
      (iface) => !!iface && iface.family === 'IPv4' && iface.internal === false
    )?.address;
  return ipAddress;
};

export const parseArgv = (processArgv: string[]) => {
  const argv = yargs(processArgv.slice(2)).options({
    key: { type: 'string' },
    cert: { type: 'string' },
    https: { type: 'boolean' },
  }).argv;

  let ssl:
    | {
        key: string | Buffer;
        cert: string | Buffer;
      }
    | undefined =
    argv.key && argv.cert
      ? {
          key: fs.readFileSync(path.resolve(process.cwd(), argv.key)),
          cert: fs.readFileSync(path.resolve(process.cwd(), argv.cert)),
        }
      : undefined;

  if (argv.https && !ssl) {
    debuglog('generate SSL certificates');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const selfsigned = require('selfsigned');
    const attrs = [{ name: 'commonName', value: 'localhost' }];
    const pems = selfsigned.generate(attrs, {
      days: 365,
      algorithm: 'sha256',
      keySize: 2048,
      extensions: [
        {
          name: 'basicConstraints',
          cA: true,
        },
        {
          name: 'keyUsage',
          keyCertSign: true,
          digitalSignature: true,
          nonRepudiation: true,
          keyEncipherment: true,
          dataEncipherment: true,
        },
        {
          name: 'extKeyUsage',
          serverAuth: true,
          clientAuth: true,
          codeSigning: true,
          timeStamping: true,
        },
      ],
    });
    // TODO: save as cache
    const cert = `${pems.private}${pems.cert}`;
    ssl = {
      key: cert,
      cert: cert,
    };
  }
  return {
    ssl,
  };
};

export const runServer = (
  { port, devInfo = [], ssl }: Options,
  onListen?: () => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serveDevInfo = (req: any, res: any) => {
    res.json([devInfo]);
  };
  const server = createServer(
    createApp((app) => {
      app.use('/', express.static(path.resolve(__dirname, '../dist/umd')));
      app.get('/json', serveDevInfo);
      app.get('/json/list', serveDevInfo);
    }),
    ssl
  );

  server.on('error', (e) => {
    debuglog('error', e);
  });
  server.listen(port, () => {
    if (onListen) onListen();
  });

  const wsServer = new ws.Server({ server });
  wsServer.on('error', (msg) => {
    debuglog('error', msg);
  });
  wsServer.on('close', () => {
    debuglog('close wsServer');
  });
  wsServer.on('connection', (socket, req) => {
    onConnection(socket, req, !!ssl);
  });
};

const createApp = (callback: (app: Express) => void) => {
  const app = express();
  callback(app);
  return app;
};

const createServer = (
  app: Express,
  ssl?: {
    cert?: string | Buffer;
    key?: string | Buffer;
  }
) => {
  const server = ssl
    ? https.createServer({ key: ssl.key, cert: ssl.cert }, app)
    : http.createServer(app);
  return server;
};

const socketMap = new SocketMap<ws>();
const onConnection = (socket: ws, req: http.IncomingMessage, ssl: boolean) => {
  const type = /^(chrome|devtools):\/\//.test(req.headers.origin ?? '')
    ? 'devtool'
    : 'client';
  if (!req.url) {
    debuglog('req.url not found');
    return;
  }
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const hiId = requestUrl.searchParams.get('hi_id');
  if (!hiId) {
    throw new Error('headless inspector id is missing');
  }
  log(`connection from ${type}, id: ${hiId}`);
  if (type === 'client') {
    const protocol = ssl ? 'wss' : 'ws';
    const url = `devtools://devtools/bundled/inspector.html?${protocol}=${req.headers.host}/?hi_id=${hiId}`;
    console.log('DevTools URL: \x1b[36m%s\x1b[0m', `${url}`);
  }

  socketMap.set(hiId, socket, type);

  const timer = setInterval(() => {
    socket.ping();
  }, 10000);

  socket.on('error', (e) => {
    debuglog('error', e);
    socketMap.remove(hiId, socket, type);
  });

  socket.on('close', (e) => {
    debuglog('close', e);
    clearInterval(timer);
    socketMap.remove(hiId, socket, type);
  });

  socket.on('message', (msg) => {
    const target = type === 'client' ? 'devtool' : 'client';
    socketMap.get(hiId)?.[target].forEach((s) => {
      if (s !== socket) {
        s.send(msg.toString());
      }
    });
  });
};
