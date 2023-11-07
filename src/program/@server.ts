import type {WebSocket} from 'ws';
import {WebSocketServer} from 'ws';

import type {ServerConfig} from './@config.js';
import {
  ACTIVATE_DEBOUNCE,
  LISTEN_HOST_DEFAULT,
  PING_PONG_INTERVAL,
  PING_PONG_TIMEOUT,
  PORT_DEFAULT,
} from './@constants.js';
import type {ClientMessage, ServerMessage} from './@data.js';
import {requestMouseMove} from './@mouse.js';

export function setupServer({
  name,
  host = LISTEN_HOST_DEFAULT,
  port = PORT_DEFAULT,
  action,
}: ServerConfig): void {
  let active: string | undefined;
  let activatedAt = 0;

  const server = new WebSocketServer({host, port}).on(
    'connection',
    (socket, request) => {
      console.info('client connected:', request.socket.remoteAddress);

      socket.ping();

      let heartbeatTimer: NodeJS.Timeout | undefined;

      socket
        .on('pong', () => {
          setTimeout(() => {
            clearTimeout(heartbeatTimer);

            socket.ping();

            heartbeatTimer = setTimeout(() => {
              console.info('client timed out:', request.socket.remoteAddress);
              socket.terminate();
            }, PING_PONG_TIMEOUT);
          }, PING_PONG_INTERVAL);
        })
        .on('message', buffer => handle(JSON.parse(buffer.toString())));

      if (active !== undefined) {
        send(socket, {
          type: 'activate',
          name: active,
        });
      }
    },
  );

  if (name !== undefined) {
    requestMouseMove(() => {
      if (name === active) {
        return;
      }

      handle({
        type: 'activate',
        name,
      });
    });
  }

  function handle(message: ClientMessage): void {
    switch (message.type) {
      case 'activate': {
        const now = Date.now();

        const {name} = message;

        if (now - activatedAt < ACTIVATE_DEBOUNCE) {
          break;
        }

        broadcast({
          type: 'activate',
          name,
        });

        if (name === active) {
          break;
        }

        active = name;
        activatedAt = now;

        console.info('activated:', active);

        void Promise.resolve(action(active)).catch(console.error);

        break;
      }
    }
  }

  function broadcast(message: ServerMessage): void {
    for (const client of server.clients) {
      send(client, message);
    }
  }

  function send(socket: WebSocket, message: ServerMessage): void {
    socket.send(JSON.stringify(message));
  }
}
