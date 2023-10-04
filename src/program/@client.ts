import WebSocket from 'ws';

import type {ClientConfig} from './@config';
import {
  PING_PONG_INTERVAL,
  PING_PONG_TIMEOUT,
  PORT_DEFAULT,
  RECONNECT_INTERVAL,
} from './@constants';
import type {ClientMessage, ServerMessage} from './@data';
import {requestMouseMove} from './@mouse';

export function setupClient({
  type,
  name,
  host,
  port = PORT_DEFAULT,
}: ClientConfig): void {
  let activated = false;

  const url = `ws://${host}:${port}`;

  let heartbeatTimer: NodeJS.Timeout | undefined;

  const socket = new WebSocket(url)
    .on('open', () => {
      console.info('connected:', url);
      socket.ping();
    })
    .on('pong', () => {
      setTimeout(() => {
        clearTimeout(heartbeatTimer);

        socket.ping();

        heartbeatTimer = setTimeout(() => {
          console.info('server timed out:', url);
          socket.terminate();
        }, PING_PONG_TIMEOUT);
      }, PING_PONG_INTERVAL);
    })
    .on('message', buffer => handle(JSON.parse(buffer.toString())))
    .on('close', () =>
      setTimeout(
        () =>
          setupClient({
            type,
            name,
            host,
            port,
          }),
        RECONNECT_INTERVAL,
      ),
    )
    .on('error', error => {
      if ('code' in error) {
        console.error(`connection error (${error.code}):`, url);
      } else {
        console.error(error);
      }
    });

  requestMouseMove(() => {
    if (activated) {
      return;
    }

    send({
      type: 'activate',
      name,
    });
  });

  function handle(message: ServerMessage): void {
    switch (message.type) {
      case 'activate':
        activated = message.name === name;
        break;
    }
  }

  function send(message: ClientMessage): void {
    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(JSON.stringify(message));
  }
}
