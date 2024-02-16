import WebSocket from 'ws';

import type {ClientConfig} from './@config.js';
import {
  PING_PONG_INTERVAL,
  PING_PONG_TIMEOUT,
  PORT_DEFAULT,
  RECONNECT_INTERVAL,
} from './@constants.js';
import type {ClientMessage, ServerMessage} from './@data.js';
import {requestMouseMove} from './@mouse.js';

export function setupClient({
  name,
  host,
  port = PORT_DEFAULT,
}: ClientConfig): void {
  let activeWS: WebSocket | undefined;

  let activated = false;

  const url = `ws://${host}:${port}`;

  connect();

  requestMouseMove(() => {
    if (activated) {
      return;
    }

    send({
      type: 'activate',
      name,
    });
  });

  function connect(): void {
    let heartbeatTimer: NodeJS.Timeout | undefined;

    const ws = new WebSocket(url)
      .on('open', () => {
        activeWS = ws;

        console.info('connected:', url);

        ws.ping();
      })
      .on('pong', () => {
        setTimeout(() => {
          clearTimeout(heartbeatTimer);

          ws.ping();

          heartbeatTimer = setTimeout(() => {
            console.info('server timed out:', url);
            ws.terminate();
          }, PING_PONG_TIMEOUT);
        }, PING_PONG_INTERVAL);
      })
      .on('message', buffer => {
        const message = JSON.parse(buffer.toString()) as ServerMessage;

        switch (message.type) {
          case 'activate':
            activated = message.name === name;
            break;
        }
      })
      .on('close', () => {
        console.info('disconnected.');

        activeWS = undefined;

        setTimeout(() => connect(), RECONNECT_INTERVAL);
      })
      .on('error', error => {
        if ('code' in error) {
          console.error(`connection error (${error.code}):`, url);
        } else {
          console.error(error);
        }
      });
  }

  function send(message: ClientMessage): void {
    if (!activeWS || activeWS.readyState !== WebSocket.OPEN) {
      return;
    }

    activeWS.send(JSON.stringify(message));
  }
}
